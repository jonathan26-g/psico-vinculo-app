import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTAMOS FIREBASE Y FIRESTORE
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. VERIFICAR CREDENCIALES EN GOOGLE
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. BUSCAR ROL REAL EN LA BASE DE DATOS
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        console.log("Usuario encontrado:", userData);

        // 3. GUARDAR EN MEMORIA (LocalStorage)
        localStorage.setItem('usuarioRol', userData.rol);
        localStorage.setItem('usuarioNombre', userData.nombre);
        localStorage.setItem('usuarioEmail', userData.email);
        localStorage.setItem('usuarioId', user.uid); // ✅ ID CORRECTO

        // 4. REDIRECCIÓN INTELIGENTE
        switch(userData.rol) {
          case 'alumno': navigate('/dashboard/alumno'); break;
          case 'tutor': navigate('/dashboard/tutor'); break;
          case 'institucion': navigate('/dashboard/institucion'); break;
          default: navigate('/dashboard'); // Pacientes
        }
      } else {
        // Si el usuario está en Auth pero no en la Base de Datos (caso raro)
        setError("Error de integridad: Perfil no encontrado.");
      }

    } catch (error) {
      console.error("Error login:", error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column"> 
      <Row className="flex-grow-1">
        
        {/* COLUMNA IZQUIERDA: MARCO LEGAL (Igual que antes) */}
        <Col md={7} className="bg-primary text-white p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <h1 className="fw-bold display-5 display-md-4">👐 Psico-Vínculo</h1>
            <p className="lead opacity-75 fs-6 fs-md-4">Dispositivo de Formación Profesional y Escucha Activa</p>
          </div>
          <Card className="bg-white text-dark mb-4 border-0 shadow-lg">
            <Card.Body>
              <h5 className="fw-bold text-primary mb-2">📌 Marco Institucional</h5>
              <p className="mb-2 small">Psico-Vínculo se define explícitamente como:</p>
              <ul className="mb-0 small">
                <li><strong>Dispositivo psicoeducativo</strong> de formación.</li>
                <li><strong>Programa de extensión universitaria.</strong></li>
                <li>Espacio de orientación <strong>no clínica.</strong></li>
              </ul>
            </Card.Body>
          </Card>
          <Alert variant="warning" className="text-dark border-0 shadow">
            <h5 className="fw-bold mb-2 h6">⚠️ Límites del Dispositivo</h5>
            <ul className="mb-0 fw-bold mt-2 small" style={{ fontSize: '0.85rem' }}>
              <li>🚫 NO realiza diagnósticos clínicos.</li>
              <li>🚫 NO prescribe tratamientos.</li>
              <li>🚫 NO sustituye profesionales formales.</li>
            </ul>
          </Alert>
        </Col>

        {/* COLUMNA DERECHA: LOGIN REAL */}
        <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <h3 className="fw-bold">Iniciar Sesión</h3>
              <p className="text-muted">Ingresa al portal institucional</p>
            </div>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" placeholder="ejemplo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Ingresar"}
                </Button>
                <Button variant="outline-secondary" type="button" onClick={() => navigate('/register')}>
                  Crear Cuenta Nueva
                </Button>
              </div>
            </Form>
            
            <div className="text-center mt-4">
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Al ingresar, aceptas el <span className="text-primary fw-bold">Código de Ética</span>.
              </small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
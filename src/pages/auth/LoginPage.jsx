import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTAMOS LAS HERRAMIENTAS DE FIREBASE
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/config'; // Asegúrate de que la ruta sea correcta

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar "Cargando..."
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Activamos el spinner o deshabilitamos botón

    try {
      // 2. 🌟 CONEXIÓN CON FIREBASE
      // Esto verifica email y contraseña en la nube de Google
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Login exitoso:", user.email);

      // 3. ASIGNACIÓN DE ROLES (PROVISIONAL)
      // Como todavía no guardamos el rol en la Base de Datos, 
      // usaremos una lógica simple basada en el email para tus pruebas.
      // Más adelante, leeremos esto desde la colección 'users' de Firestore.
      
      let role = 'paciente'; // Por defecto todos son pacientes (como Ana)
      let name = email.split('@')[0]; // Usamos la parte del mail antes del @ como nombre temporal
      
      // Truco para probar otros roles:
      if (email.includes('alumno')) role = 'alumno';
      if (email.includes('tutor')) role = 'tutor';
      if (email.includes('admin')) role = 'institucion';

      // 4. GUARDADO EN MEMORIA (LocalStorage)
      // Esto mantiene la sesión activa en el navegador
      localStorage.setItem('usuarioRol', role);
      localStorage.setItem('usuarioNombre', name);
      localStorage.setItem('usuarioEmail', user.email);
      localStorage.setItem('usuarioId', user.uid); // ID único de Firebase

      // 5. REDIRECCIÓN SEGÚN ROL
      switch(role) {
        case 'alumno': navigate('/dashboard/alumno'); break;
        case 'tutor': navigate('/dashboard/tutor'); break;
        case 'institucion': navigate('/dashboard/institucion'); break;
        default: navigate('/dashboard'); // Pacientes van al dashboard general
      }

    } catch (error) {
      console.error("Error de login:", error.code);
      
      // Traducimos los errores de Firebase a español para el usuario
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setError("El correo o la contraseña son incorrectos.");
      } else if (error.code === 'auth/user-not-found') {
        setError("Este usuario no existe.");
      } else if (error.code === 'auth/too-many-requests') {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column"> 
      <Row className="flex-grow-1">
        
        {/* COLUMNA IZQUIERDA: MARCO LEGAL (Tu diseño original conservado) */}
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
            <p className="mb-0 small" style={{ fontSize: '0.85rem' }}>
              Este espacio tiene fines formativos. Por lo tanto:
            </p>
            <ul className="mb-0 fw-bold mt-2 small" style={{ fontSize: '0.85rem' }}>
              <li>🚫 NO realiza diagnósticos clínicos.</li>
              <li>🚫 NO prescribe tratamientos.</li>
              <li>🚫 NO sustituye profesionales formales.</li>
            </ul>
          </Alert>

          <div className="mt-3 small opacity-75 d-none d-md-block">
            <p className="mb-1" style={{ fontSize: '0.8rem' }}>
              <strong>⚖️ Marco Legal:</strong> Ley 26.657 y normativas universitarias.
            </p>
            <p className="mb-0" style={{ fontSize: '0.8rem' }}>
              <strong>👨‍🏫 Supervisión:</strong> Auditada por profesionales matriculados.
            </p>
          </div>

        </Col>

        {/* COLUMNA DERECHA: LOGIN CON FIREBASE */}
        <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <h3 className="fw-bold">Iniciar Sesión</h3>
              <p className="text-muted">Ingresa al portal institucional</p>
            </div>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="ejemplo@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              {/* Mensaje de Error (Si falla Firebase) */}
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Ingresar"}
                </Button>
                
                {/* Nota: Este botón de registro aún no funciona con Firebase, pero lo dejamos visualmente */}
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
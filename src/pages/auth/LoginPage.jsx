import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Importamos la lista de alumnos simulada
import { EMAILS_ALUMNOS_PERMITIDOS } from '../../data/mockData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- LÓGICA DE DETECCIÓN DE ROLES ---

    // 1. ¿ES ALUMNO? (Busca en la lista de mockData)
    const esAlumno = EMAILS_ALUMNOS_PERMITIDOS.find(u => u.email === email);

    // 2. ¿ES TUTOR? (Busca palabras clave: 'tutor' o 'profesor')
    const esTutor = email.includes('tutor') || email.includes('profesor');

    // 3. ¿ES INSTITUCIÓN? (Busca palabras clave: 'admin', 'rector' o 'universidad')
    // 👇 ESTA ES LA LÍNEA QUE TE FALTABA O ESTABA MUY ESTRICTA
    const esInstitucion = email.includes('admin') || email.includes('rector') || email.includes('universidad');

    // --- REDIRECCIONAMIENTO ---

    if (esAlumno) {
      // CASO A: ALUMNO
      localStorage.setItem('usuarioNombre', esAlumno.nombre);
      localStorage.setItem('usuarioRol', 'alumno');
      navigate('/dashboard');

    } else if (esTutor) {
      // CASO B: TUTOR
      localStorage.setItem('usuarioNombre', "Profesor Supervisor");
      localStorage.setItem('usuarioRol', 'tutor');
      navigate('/dashboard');

    } else if (esInstitucion) {
      // CASO C: INSTITUCIÓN (¡Aquí es donde queremos entrar!)
      localStorage.setItem('usuarioNombre', "Universidad Nacional (UNT)");
      localStorage.setItem('usuarioRol', 'institucion'); // 🔑 CLAVE: Guardamos el rol 'institucion'
      navigate('/dashboard');

    } else {
      // CASO D: PACIENTE (Por defecto)
      // Si no es ninguno de los anteriores, asumimos que es un usuario normal
      const nombreUsuario = email.split('@')[0];
      localStorage.setItem('usuarioNombre', nombreUsuario);
      localStorage.setItem('usuarioRol', 'paciente');
      navigate('/dashboard');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <Card className="shadow p-4 border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Iniciar Sesión</h2>
          <p className="text-muted">Bienvenido de nuevo a Psico-Vínculo</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Ingresa tu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold shadow-sm rounded-pill">
            Ingresar
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿No tienes cuenta? <Link to="/register" className="text-success fw-bold">Regístrate aquí</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default LoginPage;
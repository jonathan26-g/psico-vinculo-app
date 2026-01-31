import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { EMAILS_ALUMNOS_PERMITIDOS } from '../../data/mockData'; // Importamos para verificar si es alumno

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Hook para navegar a otra página automáticamente
  const navigate = useNavigate();

 // ... imports
  // Asegúrate de importar EMAILS_ALUMNOS_PERMITIDOS arriba

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. ¿ES ALUMNO? (Buscamos en la lista Mock)
    const esAlumno = EMAILS_ALUMNOS_PERMITIDOS.find(u => u.email === email);

    // 2. ¿ES TUTOR? (Simulación rápida para probar)
    // En el futuro esto vendrá de una base de datos real
    const esTutor = email.includes('@tutor.unt.edu.ar'); 

    // 3. ¿ES INSTITUCIÓN? (Simulación rápida)
    const esInstitucion = email.includes('@admin.unt.edu.ar');

    if (esAlumno) {
      localStorage.setItem('usuarioNombre', esAlumno.nombre); 
      localStorage.setItem('usuarioRol', 'alumno'); // ROL ALUMNO
      navigate('/dashboard'); 

    } else if (esTutor) {
      localStorage.setItem('usuarioNombre', "Profesor Tutor"); 
      localStorage.setItem('usuarioRol', 'tutor'); // ROL TUTOR
      navigate('/dashboard');

    } else if (esInstitucion) {
      localStorage.setItem('usuarioNombre', "Universidad Nacional (UNT)"); 
      localStorage.setItem('usuarioRol', 'institucion'); // ROL INSTITUCIÓN
      navigate('/dashboard');

    } else {
      // Si no es nada de lo anterior, es PACIENTE
      const nombreUsuario = email.split('@')[0]; 
      localStorage.setItem('usuarioNombre', nombreUsuario);
      localStorage.setItem('usuarioRol', 'paciente'); // ROL PACIENTE
      navigate('/dashboard');
    }
  };
  return (
    <Container className="py-5 mt-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow border-0 p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#2C3E50' }}>Iniciar Sesión</h2>
          <p className="text-muted">Bienvenido de nuevo a Psico-Vínculo</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="******" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#4A8B71', border: 'none' }}>
            Ingresar
          </Button>

          <div className="text-center d-flex flex-column gap-2">
            <Link to="/register" className="text-decoration-none text-muted small">
              ¿No tienes cuenta? <span className="text-success fw-bold">Regístrate aquí</span>
            </Link>
            <Link to="#" className="text-decoration-none text-muted small">
              Olvidé mi contraseña
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
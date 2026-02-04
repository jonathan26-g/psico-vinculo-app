import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// CORRECCIÓN AQUÍ: Importamos la lista correcta de tu archivo
import { EMAILS_ALUMNOS_PERMITIDOS } from '../../data/mockData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- LÓGICA DE SIMULACIÓN DE ROLES ---
    let role = 'paciente';
    let name = email.split('@')[0];

    // 1. REVISAR SI ES ALUMNO (Usando tu lista real)
    const foundStudent = EMAILS_ALUMNOS_PERMITIDOS.find(u => u.email === email);
    
    if (foundStudent) {
      role = 'alumno';
      name = foundStudent.nombre; // Usamos el nombre real de tu lista
    } 
    // 2. REVISAR TUTORES (Simulado por palabra clave o lista si quisieras)
    else if (email.includes('profesor') || email.includes('tutor')) {
      role = 'tutor';
      name = 'Profesor Supervisor';
    } 
    // 3. REVISAR INSTITUCIÓN
    else if (email.includes('admin') || email.includes('rector') || email.includes('universidad')) {
      role = 'institucion';
      name = 'Universidad Nacional (UNT)';
    }

    // Guardar en memoria del navegador
    localStorage.setItem('usuarioRol', role);
    localStorage.setItem('usuarioNombre', name);

    // Redireccionar al Dashboard correspondiente
    switch(role) {
      case 'alumno': navigate('/dashboard/alumno'); break;
      case 'tutor': navigate('/dashboard/tutor'); break;
      case 'institucion': navigate('/dashboard/institucion'); break;
      default: navigate('/dashboard'); // Paciente
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        
        {/* COLUMNA IZQUIERDA: MARCO LEGAL Y ÉTICO */}
        <Col md={7} className="bg-primary text-white p-5 d-flex flex-column justify-content-center overflow-auto">
          
          <div className="mb-4">
            <h1 className="fw-bold display-4">👐 Psico-Vínculo</h1>
            <p className="lead opacity-75">Dispositivo de Formación Profesional y Escucha Activa</p>
          </div>

          {/* DEFINICIÓN DEL DISPOSITIVO */}
          <Card className="bg-white text-dark mb-4 border-0 shadow-lg">
            <Card.Body>
              <h5 className="fw-bold text-primary mb-3">📌 Marco Institucional</h5>
              <p className="mb-2">Psico-Vínculo se define explícitamente como:</p>
              <ul className="mb-0">
                <li><strong>Dispositivo psicoeducativo</strong> de formación.</li>
                <li><strong>Programa de extensión universitaria.</strong></li>
                <li>Espacio de orientación y escucha <strong>no clínica.</strong></li>
              </ul>
            </Card.Body>
          </Card>

          {/* ADVERTENCIA LEGAL */}
          <Alert variant="warning" className="text-dark border-0 shadow">
            <h5 className="fw-bold mb-2">⚠️ Límites del Dispositivo</h5>
            <p className="mb-0 small">
              Este espacio tiene fines formativos y de contención primaria. Por lo tanto:
            </p>
            <ul className="mb-0 fw-bold mt-2">
              <li>🚫 NO realiza diagnósticos clínicos.</li>
              <li>🚫 NO prescribe tratamientos ni medicación.</li>
              <li>🚫 NO sustituye intervenciones profesionales formales.</li>
            </ul>
          </Alert>

          {/* DATOS AL PIE */}
          <div className="mt-3 small opacity-75">
            <p className="mb-1">
              <strong>⚖️ Marco Legal:</strong> Ley Nacional de Salud Mental N.º 26.657 y normativas universitarias.
            </p>
            <p className="mb-1">
              <strong>🎓 Rol del Estudiante:</strong> Alumnos avanzados en práctica supervisada (no autónomos).
            </p>
            <p className="mb-0">
              <strong>👨‍🏫 Supervisión:</strong> Cada intervención es auditada por profesionales matriculados.
            </p>
          </div>

        </Col>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-5">
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
                  autoFocus
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

              {error && <p className="text-danger small">{error}</p>}

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" type="submit">
                  Ingresar
                </Button>
                <Button 
                 variant="outline-secondary" 
                 type="button" 
                 onClick={() => navigate('/register')}
                >
                Crear Cuenta Nueva
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <small className="text-muted">
                Al ingresar, aceptas participar de un espacio de práctica supervisada bajo el 
                <span className="text-primary fw-bold"> Código de Ética Profesional</span>.
              </small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
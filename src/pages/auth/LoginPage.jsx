import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { EMAILS_ALUMNOS_PERMITIDOS } from '../../data/mockData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Lógica de roles (Sin cambios)
    let role = 'paciente';
    let name = email.split('@')[0];

    const foundStudent = EMAILS_ALUMNOS_PERMITIDOS.find(u => u.email === email);
    
    if (foundStudent) {
      role = 'alumno';
      name = foundStudent.nombre;
    } 
    else if (email.includes('profesor') || email.includes('tutor')) {
      role = 'tutor';
      name = 'Profesor Supervisor';
    } 
    else if (email.includes('admin') || email.includes('rector') || email.includes('universidad')) {
      role = 'institucion';
      name = 'Universidad Nacional (UNT)';
    }

    localStorage.setItem('usuarioRol', role);
    localStorage.setItem('usuarioNombre', name);

    switch(role) {
      case 'alumno': navigate('/dashboard/alumno'); break;
      case 'tutor': navigate('/dashboard/tutor'); break;
      case 'institucion': navigate('/dashboard/institucion'); break;
      default: navigate('/dashboard'); 
    }
  };

  return (
    // CAMBIO 1: Usamos 'min-vh-100' para que crezca si hace falta en celular
    // Agregamos 'py-5' para dar aire arriba y abajo en móviles
    <Container fluid className="min-vh-100 d-flex flex-column"> 
      <Row className="flex-grow-1">
        
        {/* COLUMNA IZQUIERDA: MARCO LEGAL */}
        {/* En móvil orden-2 (abajo), en PC orden-1 (izquierda) si quisieras cambiar el orden visual */}
        {/* CAMBIO 2: Padding responsivo. 'p-4' en móvil, 'p-md-5' en PC */}
        <Col md={7} className="bg-primary text-white p-4 p-md-5 d-flex flex-column justify-content-center">
          
          <div className="mb-4">
            {/* Títulos más chicos en celular */}
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
             {/* Ocultamos detalles extra en celular muy pequeño si quieres (d-none d-md-block), 
                 o los dejamos visibles pero con letra chica */}
            <p className="mb-1" style={{ fontSize: '0.8rem' }}>
              <strong>⚖️ Marco Legal:</strong> Ley 26.657 y normativas universitarias.
            </p>
            <p className="mb-0" style={{ fontSize: '0.8rem' }}>
              <strong>👨‍🏫 Supervisión:</strong> Auditada por profesionales matriculados.
            </p>
          </div>

        </Col>

        {/* COLUMNA DERECHA: LOGIN */}
        {/* CAMBIO 3: Fondo blanco o gris claro, padding ajustado */}
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

              {error && <p className="text-danger small">{error}</p>}

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" type="submit">
                  Ingresar
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
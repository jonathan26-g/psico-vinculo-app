import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    // Agregamos bg-light al contenedor principal para que contraste con las tarjetas blancas
    <Container fluid className="min-vh-100 d-flex flex-column justify-content-center bg-light py-5">
      
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">¿Cómo deseas unirte a Psico-Vínculo?</h1>
        <p className="lead text-muted">Selecciona tu perfil para continuar.</p>
      </div>

      <Container>
        <Row className="justify-content-center g-4"> {/* g-4 da espacio entre columnas */}
          
          {/* OPCIÓN 1: PACIENTE (Verde) */}
          <Col md={4} lg={3}>
            <Card 
              className="h-100 border-0 shadow hover-card text-center"
              style={{ borderTop: '5px solid #198754' }} // Borde Verde Grueso
            >
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="display-4 mb-3">💚</div>
                <h3 className="h4 fw-bold mb-3">Busco Ayuda</h3>
                <p className="text-muted small mb-4">
                  Quiero conectarme con un alumno para recibir contención emocional.
                </p>
                <Button 
                  variant="outline-success" 
                  className="w-100 mt-auto rounded-pill"
                  onClick={() => navigate('/register/patient')}
                >
                  Soy Paciente
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* OPCIÓN 2: ESTUDIANTE (Azul) */}
          <Col md={4} lg={3}>
            <Card 
              className="h-100 border-0 shadow hover-card text-center"
              style={{ borderTop: '5px solid #0d6efd' }} // Borde Azul Grueso
            >
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="display-4 mb-3">🎓</div>
                <h3 className="h4 fw-bold mb-3">Soy Estudiante</h3>
                <p className="text-muted small mb-4">
                  Pertenezco a una universidad y quiero realizar mis prácticas.
                </p>
                <Button 
                  variant="outline-primary" 
                  className="w-100 mt-auto rounded-pill"
                  onClick={() => navigate('/register/student')}
                >
                  Soy Alumno
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* OPCIÓN 3: INSTITUCIÓN (Gris Oscuro) */}
          <Col md={4} lg={3}>
            <Card 
              className="h-100 border-0 shadow hover-card text-center"
              style={{ borderTop: '5px solid #212529' }} // Borde Gris Grueso
            >
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="display-4 mb-3">🏛️</div>
                <h3 className="h4 fw-bold mb-3">Institución</h3>
                <p className="text-muted small mb-4">
                  Represento a una Universidad y quiero gestionar convenios.
                </p>
                <Button 
                  variant="outline-dark" 
                  className="w-100 mt-auto rounded-pill"
                  onClick={() => navigate('/register/institution')}
                >
                  Cuenta Institucional
                </Button>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* Botón Volver */}
        <div className="text-center mt-5">
          <Button variant="link" className="text-muted text-decoration-none" onClick={() => navigate('/login')}>
            ← Volver al Inicio de Sesión
          </Button>
        </div>

      </Container>
    </Container>
  );
};

export default RegisterSelection;
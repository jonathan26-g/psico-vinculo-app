import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterSelection = () => {
  return (
    <Container className="py-5 mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">¿Cómo deseas unirte a Psico-Vínculo?</h2>
        <p className="text-muted">Selecciona tu perfil para continuar.</p>
      </div>

      <Row className="justify-content-center g-4">
        {/* OPCIÓN 1: PACIENTE */}
        <Col md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0 text-center p-3 hover-scale">
            <Card.Body>
              <div className="fs-1 mb-3">💚</div>
              <Card.Title className="fw-bold">Busco Ayuda</Card.Title>
              <Card.Text className="small text-muted mb-4">
                Quiero conectarme con un alumno para recibir contención emocional.
              </Card.Text>
              <Link to="/register/patient">
                <Button variant="outline-success" className="w-100 rounded-pill">Soy Usuario</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* OPCIÓN 2: ALUMNO */}
        <Col md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0 text-center p-3 hover-scale">
            <Card.Body>
              <div className="fs-1 mb-3">🎓</div>
              <Card.Title className="fw-bold">Soy Estudiante</Card.Title>
              <Card.Text className="small text-muted mb-4">
                Pertenezco a una universidad y quiero realizar mis prácticas.
              </Card.Text>
              <Link to="/register/student">
                <Button variant="outline-primary" className="w-100 rounded-pill">Soy Alumno</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* OPCIÓN 3: UNIVERSIDAD / SUPERVISOR */}
        <Col md={4} lg={3}>
          <Card className="h-100 shadow-sm border-0 text-center p-3 hover-scale">
            <Card.Body>
              <div className="fs-1 mb-3">🏛️</div>
              <Card.Title className="fw-bold">Institucional</Card.Title>
              <Card.Text className="small text-muted mb-4">
                Soy Supervisor o represento a una Universidad.
              </Card.Text>
              <Link to="/register/institution">
                <Button variant="outline-secondary" className="w-100 rounded-pill">Gestión</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="text-center mt-5">
        <p>¿Ya tienes cuenta? <Link to="/login" className="fw-bold text-success">Iniciar Sesión</Link></p>
      </div>
    </Container>
  );
};

export default RegisterSelection;
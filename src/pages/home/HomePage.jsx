import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// --- ESTA LÍNEA ES LA QUE FALTA ---
import './HomePage.css'; 
// -------
const HomePage = () => {
  return (
    <div className="page-background">
      
      {/* 1. HERO SECTION */}
      <Container className="text-center py-5 mb-4">
        <span className="badge bg-light text-success mb-3 px-3 py-2 rounded-pill border">
          Dispositivo Psicoeducativo
        </span>
        <h1 className="hero-title mb-3">
          Un espacio seguro para <br />
          <span className="text-highlight">ser escuchado</span>
        </h1>
        <p className="text-muted lead mx-auto mb-4" style={{ maxWidth: '700px' }}>
          Conectamos personas que necesitan contención emocional con estudiantes 
          de psicología en formación supervisada. La tecnología al servicio del vínculo humano.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register"><Button className="btn-primary-custom">Comenzar ahora →</Button></Link>
          <Button className="btn-outline-custom">Conocer más</Button>
        </div>
      </Container>

      {/* 2. VALORES (Tarjetas Blancas) */}
      <Container className="py-5">
        <Row className="g-4">
          <Col md={4}>
            <div className="value-card">
              <div className="value-icon">💚</div>
              <h5 className="fw-bold">Escucha Empática</h5>
              <p className="text-muted small">Acompañamiento cálido y respetuoso en un espacio confidencial.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h5 className="fw-bold">Supervisión Profesional</h5>
              <p className="text-muted small">Psicólogos matriculados acompañan cada interacción.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h5 className="fw-bold">Formación Ética</h5>
              <p className="text-muted small">Estudiantes preparados con capacitación rigurosa.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* NUEVA SECCIÓN: POR QUÉ PSICO-VÍNCULO */}
<Container className="py-5 my-5">
  <Row className="align-items-center g-5">
    {/* Lado Izquierdo: Texto */}
    <Col lg={7}>
      <small className="text-uppercase text-success fw-bold">Por qué Psico-Vínculo</small>
      <h2 className="hero-title fs-1 mt-2 mb-4">
        Un puente entre quienes necesitan hablar y quienes aprenden a escuchar
      </h2>
      <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
        En <strong>Tucumán</strong> —como en gran parte del país— la demanda de salud mental supera ampliamente la capacidad de respuesta del sistema tradicional. Al mismo tiempo, miles de estudiantes de Psicología transitan una formación fuertemente teórica, con escasos espacios para entrenar habilidades de escucha activa.
      </p>
      <p className="fw-semibold color-dark-green">
        Psico-Vínculo surge para unir esas dos realidades, con una convicción clara: <span className="text-highlight">La tecnología no debe reemplazar el vínculo humano, debe ser el medio para cuidarlo y multiplicarlo.</span>
      </p>
    </Col>

    {/* Lado Derecho: Tarjeta de Beneficios */}
    <Col lg={5}>
      <div className="benefits-card shadow-lg p-4 p-md-5 border-0 rounded-4 bg-white">
        <h4 className="fw-bold mb-4" style={{ color: '#1F2937' }}>Lo que ofrecemos</h4>
        <ul className="list-unstyled mb-0">
          {[
            "Acceso gratuito y confidencial",
            "Posibilidad de anonimato",
            "Lenguaje empático y cercano",
            "Supervisión profesional permanente",
            "Formación ética de estudiantes",
            "Protocolos claros de derivación"
          ].map((item, index) => (
            <li key={index} className="d-flex align-items-start mb-3">
              <span className="me-3 text-success fs-5">✓</span>
              <span className="text-muted fw-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Col>
  </Row>
</Container>

      {/* 3. ARQUITECTURA DE ROLES (Tarjetas Pastel) */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <small className="text-uppercase text-success fw-bold">Arquitectura de Roles</small>
          <h2 className="fw-bold mt-2">Un sistema que cuida</h2>
        </div>
        
        {/* Usamos row-cols-lg-5 para que entren los 5 en fila en pantallas grandes */}
        <Row className="row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
          <Col>
            <div className="role-card bg-role-user">
              <div className="fs-4 mb-3">♡</div>
              <h6 className="fw-bold">Usuario</h6>
              <p className="small text-muted">Persona que busca acompañamiento.</p>
            </div>
          </Col>
          <Col>
            <div className="role-card bg-role-student">
              <div className="fs-4 mb-3">🎓</div>
              <h6 className="fw-bold">Alumno</h6>
              <p className="small text-muted">Estudiante en práctica.</p>
            </div>
          </Col>
          <Col>
            <div className="role-card bg-role-supervisor">
              <div className="fs-4 mb-3">👤</div>
              <h6 className="fw-bold">Supervisor</h6>
              <p className="small text-muted">Profesional que guía.</p>
            </div>
          </Col>
          <Col>
            <div className="role-card bg-role-university">
              <div className="fs-4 mb-3">🏛️</div>
              <h6 className="fw-bold">Universidad</h6>
              <p className="small text-muted">Coordinación académica.</p>
            </div>
          </Col>
          <Col>
            <div className="role-card bg-role-admin">
              <div className="fs-4 mb-3">⚙️</div>
              <h6 className="fw-bold">Admin</h6>
              <p className="small text-muted">Gestión técnica.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 4. CTA FINAL (Fondo suave) */}
      <div className="py-5 mt-5" style={{ backgroundColor: '#F9FAFB' }}>
        <Container className="text-center">
          <h2 className="fw-bold mb-3">¿Necesitás un espacio para hablar?</h2>
          <p className="text-muted mb-4">No estás solo/a. Psico-Vínculo te ofrece un espacio seguro.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/chat"><Button className="btn-primary-custom">Comenzar ahora →</Button></Link>
            <Button className="bg-white border text-dark px-4 py-2 rounded-3">Ya tengo cuenta</Button>
          </div>
        </Container>
      </div>

    </div>
  );
};

export default HomePage;
import React from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const userName = localStorage.getItem('usuarioNombre') || "Invitado";
  const userRole = localStorage.getItem('usuarioRol') || 'paciente';

  // --- 1. VISTA EXCLUSIVA: UNIVERSIDAD / INSTITUCIÓN 🏛️ ---
  if (userRole === 'institucion') {
    return (
      <Container className="py-5 mt-5">
        <div className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
          <div>
            <h6 className="text-uppercase text-muted fw-bold ls-2">Panel Administrativo</h6>
            <h1 className="fw-bold text-dark mb-0">Universidad Nacional (UNT)</h1>
          </div>
          <div className="text-end d-none d-md-block">
            <small className="text-muted">Última actualización: Hoy, 09:41 AM</small>
          </div>
        </div>

        {/* FILA 1: TARJETAS DE NÚMEROS (KPIs) */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 border-start border-4 border-primary">
              <Card.Body>
                <div className="text-muted small fw-bold text-uppercase">Total Alumnos</div>
                <div className="display-6 fw-bold text-dark my-2">142</div>
                <small className="text-success">↑ 12 nuevos este mes</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 border-start border-4 border-success">
              <Card.Body>
                <div className="text-muted small fw-bold text-uppercase">Casos Activos</div>
                <div className="display-6 fw-bold text-dark my-2">85</div>
                <small className="text-muted">Pacientes en tratamiento</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
             <Card className="shadow-sm border-0 h-100 border-start border-4 border-warning">
              <Card.Body>
                <div className="text-muted small fw-bold text-uppercase">Supervisores</div>
                <div className="display-6 fw-bold text-dark my-2">12</div>
                <small className="text-dark">Monitoreando sesiones</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
             <Card className="shadow-sm border-0 h-100 border-start border-4 border-danger">
              <Card.Body>
                <div className="text-muted small fw-bold text-uppercase">Alertas de Riesgo</div>
                <div className="display-6 fw-bold text-danger my-2">3</div>
                <small className="text-danger fw-bold">Requieren atención</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FILA 2: GRÁFICOS SIMULADOS Y ACCIONES */}
        <Row className="g-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 h-100 p-4">
              <Card.Title className="fw-bold mb-4">Actividad Semestral</Card.Title>
              {/* Simulamos un gráfico de barras con Progress Bars de Bootstrap */}
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Enero</span> <span>45 Sesiones</span>
                  </div>
                  <ProgressBar variant="info" now={45} style={{height: '10px'}} />
                </div>
                <div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Febrero</span> <span>60 Sesiones</span>
                  </div>
                  <ProgressBar variant="info" now={60} style={{height: '10px'}} />
                </div>
                <div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Marzo (Proyección)</span> <span>80 Sesiones</span>
                  </div>
                  <ProgressBar variant="primary" now={80} style={{height: '10px'}} />
                </div>
              </div>
              <div className="mt-4 text-center">
                 <Button variant="outline-primary" size="sm">Descargar Reporte PDF</Button>
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100 p-3 bg-light">
              <Card.Title className="fw-bold mb-3">Accesos Rápidos</Card.Title>
              <div className="d-grid gap-2">
                <Button variant="white" className="text-start shadow-sm border">
                  🎓 Gestionar Alumnos
                </Button>
                <Button variant="white" className="text-start shadow-sm border">
                  👨‍🏫 Gestionar Tutores
                </Button>
                <Button variant="white" className="text-start shadow-sm border">
                  ⚠️ Ver Reportes de Riesgo
                </Button>
                <Link to="/profile">
                  <Button variant="outline-dark" className="w-100 mt-2">
                    Configuración Institucional
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // --- 2. VISTA ESTÁNDAR (Paciente, Alumno, Tutor) ---
  // (Esta es la que ya tenías, solo la metemos en el 'else' implícito)

  const roleContent = {
    paciente: {
      chatTitle: "Sala de Vínculo",
      chatText: "Ingresa al chat para hablar con un estudiante o supervisor asignado.",
      chatBtn: "Entrar al Chat",
      profileBtn: "Ver Mis Datos"
    },
    alumno: {
      chatTitle: "Mis Pacientes",
      chatText: "Gestiona tus casos asignados y revisa las notas de sesión.",
      chatBtn: "Ver Pacientes",
      profileBtn: "Mi Ficha Académica"
    },
    tutor: {
      chatTitle: "Centro de Supervisión",
      chatText: "Audita los chats de los alumnos, revisa intervenciones y califica el desempeño.",
      chatBtn: "Auditar Casos",
      profileBtn: "Perfil Profesional"
    }
  };

  const content = roleContent[userRole] || roleContent.paciente;

  return (
    <Container className="py-5 mt-5">
      <div className="mb-5 border-bottom pb-4">
        <h1 className="fw-bold text-dark">
          Hola, <span className="text-success" style={{textTransform: 'capitalize'}}>{userName}</span> 👋
        </h1>
        <p className="text-muted mb-0">
           ¿Cómo te sientes hoy? Estamos aquí para acompañarte.
        </p>
      </div>

      <h4 className="fw-bold mb-4 text-secondary">Tu Espacio Personal</h4>
      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 hover-scale" style={{ backgroundColor: '#E6F4F1' }}>
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">
                 {userRole === 'tutor' ? '👁️' : '💬'}
              </div>
              <Card.Title className="fw-bold text-success">{content.chatTitle}</Card.Title>
              <Card.Text className="text-muted small">
                {content.chatText}
              </Card.Text>
              <Link to="/chat">
                <Button variant="success" className="mt-auto w-100 fw-bold">
                    {content.chatBtn}
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">👤</div>
              <Card.Title className="fw-bold text-dark">Mi Perfil</Card.Title>
              <Card.Text className="text-muted small">
                Actualiza tus datos personales, contraseña y preferencias.
              </Card.Text>
              <Link to="/profile">
                <Button variant="outline-dark" className="mt-auto w-100">
                  {content.profileBtn}
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">📅</div>
              <Card.Title className="fw-bold text-dark">Historial</Card.Title>
              <Card.Text className="text-muted small">
                Revisa el historial de actividad y fechas importantes.
              </Card.Text>
              <Button variant="outline-secondary" className="mt-auto w-100">
                Ver Historial
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
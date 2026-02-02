import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const userName = localStorage.getItem('usuarioNombre') || "Invitado";
  // Si no hay rol guardado, asumimos que es 'paciente' por defecto
  const userRole = localStorage.getItem('usuarioRol') || 'paciente';

  // 1. DICCIONARIO DE CONTENIDOS POR ROL 📚
  // Aquí definimos qué ve cada tipo de usuario. ¡Es muy fácil de editar!
  // ... dentro de DashboardPage
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
    // 👇 AQUÍ ESTÁ EL CAMBIO IMPORTANTE PARA EL TUTOR
    tutor: {
      chatTitle: "Centro de Supervisión", 
      chatText: "Audita los chats de los alumnos, revisa intervenciones y califica el desempeño.",
      chatBtn: "Auditar Casos", 
      profileBtn: "Perfil Profesional"
    },
    institucion: {
      chatTitle: "Reportes Globales",
      chatText: "Visualiza estadísticas de salud mental y desempeño de la facultad.",
      chatBtn: "Ver Estadísticas",
      profileBtn: "Datos Institucionales"
    }
  };

  // Seleccionamos el contenido actual basado en el rol
  const content = roleContent[userRole] || roleContent.paciente;

  return (
    <Container className="py-5 mt-5">
      
      {/* ENCABEZADO */}
      <div className="mb-5 border-bottom pb-4">
        <h1 className="fw-bold text-dark">
          Hola, <span className="text-success" style={{textTransform: 'capitalize'}}>{userName}</span> 👋
        </h1>
        <p className="text-muted mb-0">
          {userRole === 'institucion' 
            ? "Panel de Administración Institucional." 
            : "¿Cómo te sientes hoy? Estamos aquí para acompañarte."}
        </p>
      </div>

      {/* TARJETAS */}
      <h4 className="fw-bold mb-4 text-secondary">Tu Espacio Personal</h4>
      <Row className="g-4">
        
        {/* TARJETA 1: CHAT / ACCIÓN PRINCIPAL */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 hover-scale" style={{ backgroundColor: '#E6F4F1' }}>
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">
                {userRole === 'institucion' ? '📊' : '💬'}
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

        {/* TARJETA 2: PERFIL */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">
                {userRole === 'institucion' ? '🏛️' : '👤'}
              </div>
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

        {/* TARJETA 3: HISTORIAL */}
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
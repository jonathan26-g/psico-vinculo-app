import React, { useState } from 'react'; // <--- 1. Importamos useState
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap'; // <--- 2. Importamos Modal
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const userName = localStorage.getItem('usuarioNombre') || "Invitado";
  const navigate = useNavigate();

  // Estado para controlar si el Modal se muestra o no
  const [showModal, setShowModal] = useState(false);

  // Función 1: Al hacer clic en "Cerrar Sesión", solo mostramos el cartel
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  // Función 2: Si el usuario dice "SÍ" en el cartel, entonces salimos
  const confirmLogout = () => {
    localStorage.removeItem('usuarioNombre');
    navigate('/');
  };

  // Función para cerrar el cartel si se arrepiente
  const handleClose = () => setShowModal(false);

  return (
    <Container className="py-5 mt-5">
      
      {/* ENCABEZADO */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
        <div>
          {/* Capitalizamos el nombre para que se vea mejor (ej: martin -> Martin) */}
          <h1 className="fw-bold text-dark">
            Hola, <span className="text-success" style={{textTransform: 'capitalize'}}>{userName}</span> 👋
          </h1>
          <p className="text-muted mb-0">¿Cómo te sientes hoy? Estamos aquí para acompañarte.</p>
        </div>
        
        <div>
          {/* Botón que abre el modal */}
          <Button 
            variant="outline-danger" 
            onClick={handleLogoutClick}
            className="rounded-pill px-4"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* TARJETAS (Tu código sigue igual aquí) */}
      <h4 className="fw-bold mb-4 text-secondary">Tu Espacio Personal</h4>
      <Row className="g-4">
        
        {/* TARJETA 1: CHAT */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 hover-scale" style={{ backgroundColor: '#E6F4F1' }}>
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">💬</div>
              <Card.Title className="fw-bold text-success">Sala de Vínculo</Card.Title>
              <Card.Text className="text-muted small">
                Ingresa al chat para hablar con un estudiante o supervisor asignado.
              </Card.Text>
              <Link to="/chat">
                <Button variant="success" className="mt-auto w-100 fw-bold">
                    Entrar al Chat
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* TARJETA 2: PERFIL */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">👤</div>
              <Card.Title className="fw-bold text-dark">Mi Perfil</Card.Title>
              <Card.Text className="text-muted small">
                Actualiza tus datos personales, contraseña y preferencias.
              </Card.Text>
              <Button variant="outline-dark" className="mt-auto w-100">
                Ver Datos
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* TARJETA 3: HISTORIAL */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="fs-1 mb-3">📅</div>
              <Card.Title className="fw-bold text-dark">Mis Sesiones</Card.Title>
              <Card.Text className="text-muted small">
                Revisa el historial de tus conversaciones y fechas importantes.
              </Card.Text>
              <Button variant="outline-secondary" className="mt-auto w-100">
                Ver Historial
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- AQUÍ ESTÁ LA NUEVA VENTANA MODAL --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-dark h5">¿Deseas salir?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-muted">
          Estás a punto de cerrar tu sesión en Psico-Vínculo.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={handleClose} className="rounded-pill px-4">
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmLogout} className="rounded-pill px-4">
            Sí, cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default DashboardPage;
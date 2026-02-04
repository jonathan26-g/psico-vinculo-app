import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavbarC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>👐</span> 
          <span className="fw-bold text-success">Psico-Vínculo</span>
        </Navbar.Brand>

        {/* HAMBURGUESA CELULAR */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* ENLACES IZQUIERDA */}
          <Nav className="me-auto mb-3 mb-lg-0">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link href="#sobre-nosotros">Sobre Nosotros</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>

          {/* BOTONES DERECHA (EL ARREGLO ESTÁ AQUÍ 👇) */}
         {/* Busca el <Nav> de la derecha y reemplaza TODO su contenido por esto: */}

<Nav className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-4">
  
  {/* --- 🖥️ VERSIÓN ESCRITORIO: Texto simple y limpio --- */}
  {/* 'd-none d-lg-block' significa: Oculto en celular, visible en PC */}
  <Nav.Link 
    as={Link} 
    to="/login" 
    className="fw-bold text-dark text-decoration-none d-none d-lg-block"
    style={{ whiteSpace: 'nowrap' }} // Asegura que no se rompa en dos líneas
  >
    Iniciar Sesión
  </Nav.Link>

  {/* --- 📱 VERSIÓN MÓVIL: Botón fácil de tocar --- */}
  {/* 'd-lg-none' significa: Visible en celular, oculto en PC */}
  {/* Usamos 'outline-secondary' para un gris suave en lugar del negro fuerte */}
  <Button 
    variant="outline-secondary" 
    className="w-100 rounded-pill d-lg-none"
    onClick={() => navigate('/login')}
  >
    Iniciar Sesión
  </Button>

  {/* --- BOTÓN REGISTRARSE (Siempre es botón, se adapta) --- */}
  <Button 
    variant="success" 
    className="rounded-pill px-4 w-100 w-lg-auto"
    onClick={() => navigate('/register')}
  >
    Registrarse
  </Button>
  
</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarC;
import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
// 1. IMPORTANTE: Agregamos useLocation aquí
import { Link, NavLink, useLocation } from 'react-router-dom'; 
import './NavbarC.css';

const NavbarC = () => {
  const location = useLocation(); // <--- 2. Sensor de ubicación

  // 3. Preguntamos: ¿Estamos en una zona privada? (Dashboard o Chat)
  const isPrivate = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/chat');

  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top py-3">
      <Container>
        {/* EL LOGO: Si estamos dentro, que nos lleve al Dashboard. Si estamos fuera, al Inicio. */}
        <Navbar.Brand 
          as={Link} 
          to={isPrivate ? "/dashboard" : "/"} 
          className="fw-bold fs-4 text-success"
        >
          <span className="me-2">👐</span> Psico-Vínculo
        </Navbar.Brand>
        
        {/* 4. CONDICIÓN MAGICA: 
            Si NO (!isPrivate) es privado, mostramos el menú. 
            Si ES privado, esto desaparece. */}
        {!isPrivate && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto fw-medium">
                <Nav.Link as={NavLink} to="/" end className="mx-2">Inicio</Nav.Link>
                <Nav.Link as={NavLink} to="/sobre-nosotros" className="mx-2">Sobre Nosotros</Nav.Link>
                <Nav.Link as={NavLink} to="/contacto" className="mx-2">Contacto</Nav.Link>
              </Nav>
              
              <div className="d-flex gap-2 align-items-center">
                 <Button as={Link} to="/login" variant="link" className="text-decoration-none text-dark fw-bold">
                   Iniciar Sesión
                 </Button>
                 <Button as={Link} to="/register" variant="success" className="rounded-pill px-4">
                   Registrarse
                 </Button>
              </div>
            </Navbar.Collapse>
          </>
        )}

      </Container>
    </Navbar>
  );
};

export default NavbarC;
// src/components/Navigation.jsx
import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar expand="lg" className="py-3 bg-white shadow-sm fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: '#4A8B71' }}>
          <span className="me-2">👐</span> Acompañar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-muted fw-medium">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/sobre-nosotros">Sobre Nosotros</Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            <Button as={Link} to="/login" variant="link" className="text-decoration-none text-dark fw-bold">Iniciar Sesión</Button>
            <Button as={Link} to="/register" style={{ backgroundColor: '#4A8B71', borderColor: '#4A8B71', borderRadius: '50px', padding: '8px 20px', color: 'white' }}>Registrarse</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
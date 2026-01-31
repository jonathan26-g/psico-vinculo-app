import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavbarC.css';

const NavbarC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. DEFINIMOS QUÉ ES PÚBLICO (La lista blanca)
  // Estas son las únicas páginas donde se ve el menú completo.
  const publicPaths = [
    '/',                // Home
    '/sobre-nosotros',  // Sobre Nosotros
    '/contacto',        // Contacto
    '/login',           // Login
    '/register',        // Selección de registro
    '/register/student',// Registro Alumno
    '/register/patient',// Registro Paciente
    '/register/institution' // Registro Universidad (Futuro)
  ];

  // 2. LÓGICA INVERSA:
  // Si la ruta actual NO está en la lista de públicas, entonces ES PRIVADA.
  // Esto cubrirá automáticamente: /dashboard, /profile, /chat, /tutor-panel, /admin-unt, etc.
  const isPrivate = !publicPaths.includes(location.pathname);

  const handleLogout = () => {
    const confirm = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (confirm) {
      localStorage.removeItem('usuarioNombre');
      navigate('/');
    }
  };

  const userName = localStorage.getItem('usuarioNombre');

  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top py-3">
      <Container>
        
        {/* LOGO: Si es privado lleva al Dashboard, si es público lleva al Home */}
        <Navbar.Brand 
          as={Link} 
          to={isPrivate ? "/dashboard" : "/"} 
          className="fw-bold fs-4 text-success"
        >
          <span className="me-2">👐</span> Psico-Vínculo
        </Navbar.Brand>
        
        {/* --- OPCIÓN A: MENÚ PÚBLICO (Solo si NO es privado) --- */}
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

        {/* --- OPCIÓN B: MENÚ PRIVADO (Para TODOS: Alumnos, Tutores, Unis, Usuarios) --- */}
        {isPrivate && (
          <div className="ms-auto d-flex align-items-center gap-3">
            {/* Muestra el nombre de quien sea que esté logueado (Martín, UNT, Tutor Juan, etc.) */}
            <span className="text-muted small d-none d-md-block fw-bold text-capitalize">
                {userName}
            </span>
            
            <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleLogout}
                className="rounded-pill px-3"
            >
                Cerrar Sesión
            </Button>
          </div>
        )}

      </Container>
    </Navbar>
  );
};

export default NavbarC;
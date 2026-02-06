import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavbarC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para detectar cambio de ruta
  const [user, setUser] = useState(null);

  // EFECTO: Cada vez que cambiamos de página, revisamos si hay usuario
  useEffect(() => {
    const storedName = localStorage.getItem('usuarioNombre');
    const storedRole = localStorage.getItem('usuarioRol');
    
    if (storedName) {
      setUser({ nombre: storedName, rol: storedRole });
    } else {
      setUser(null);
    }
  }, [location]); // Se ejecuta cada vez que 'location' cambia

  // FUNCIÓN CERRAR SESIÓN
  const handleLogout = () => {
    // 1. Borramos los datos
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol');
    
    // 2. Actualizamos el estado local
    setUser(null);
    
    // 3. Redirigimos al Login
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>👐</span> 
          <span className="fw-bold text-success">Psico-Vínculo</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* ENLACES IZQUIERDA */}
          <Nav className="me-auto mb-3 mb-lg-0">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {/* Solo mostramos Dashboard si está logueado */}
            {user && <Nav.Link as={Link} to="/dashboard">Mi Panel</Nav.Link>}
          </Nav>

          {/* ZONA DERECHA: CAMBIA SEGÚN SI ESTÁS LOGUEADO O NO */}
          <Nav className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3">
            
            {user ? (
              // --- SI HAY USUARIO (MOSTRAR PERFIL) ---
              <>
                <span className="fw-bold text-primary d-none d-lg-block">
                  Hola, {user.nombre} 👋
                </span>
                
                <Button 
                  variant="outline-danger" 
                  className="rounded-pill px-4 w-100 w-lg-auto"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // --- SI NO HAY USUARIO (MOSTRAR LOGIN/REGISTRO) ---
              <>
                {/* Versión PC */}
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="fw-bold text-dark text-decoration-none d-none d-lg-block"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Iniciar Sesión
                </Nav.Link>

                {/* Versión Móvil */}
                <Button 
                  variant="outline-secondary" 
                  className="w-100 rounded-pill d-lg-none"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>

                <Button 
                  variant="success" 
                  className="rounded-pill px-4 w-100 w-lg-auto"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarC;
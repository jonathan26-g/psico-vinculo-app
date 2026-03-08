import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// 🔥 Importamos las herramientas de Auth
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const NavbarC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Volvemos a traer el detector de páginas
  const [user, setUser] = useState(null);

  // Función para buscar el nombre en la memoria
  const checkStoredUser = () => {
    const storedName = localStorage.getItem('usuarioNombre');
    const storedRole = localStorage.getItem('usuarioRol');
    if (storedName) {
      setUser({ nombre: storedName, rol: storedRole });
    }
  };

  // 1. ESCUCHADOR DE FIREBASE (Detecta Login/Logout)
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Le damos 500ms de ventaja para que el registro termine de guardar el nombre en memoria
        setTimeout(checkStoredUser, 500);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. ESCUCHADOR DE RUTAS (Por si cambia de página, forzamos la lectura)
  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      checkStoredUser();
    }
  }, [location]);

  // FUNCIÓN CERRAR SESIÓN
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioRol');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('usuarioEmail');
      
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>👐</span> 
          <span className="fw-bold text-success">Psico-Vínculo</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-3 mb-lg-0">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            
            {/* 👇 ESTE ES EL NUEVO ENLACE AL "SOBRE NOSOTROS" 👇 */}
            <Nav.Link as={Link} to="/sobre-nosotros">Sobre Nosotros</Nav.Link>

            {user && <Nav.Link as={Link} to="/dashboard">Mi Panel</Nav.Link>}
          </Nav>

          <Nav className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3">
            
            {user ? (
              <>
                {/* AHORA SÍ LEERÁ EL NOMBRE CORRECTO */}
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
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="fw-bold text-dark text-decoration-none d-none d-lg-block"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Iniciar Sesión
                </Nav.Link>

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
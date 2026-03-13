import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-5 bg-white border-top mt-auto">
      <Container>
        <Row>
          {/* Columna 1: Marca y Misión */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold" style={{ color: '#4A8B71' }}>👐 ACOMPAÑAR</h5>
            <p className="small text-muted">
              Dispositivo psicoeducativo de contención emocional y formación profesional.
              Conectamos a quienes necesitan hablar con quienes aprenden a escuchar.
            </p>
          </Col>

          {/* Columna 2: Enlaces Rápidos */}
          <Col md={2} className="mb-3">
            <h6 className="fw-bold text-dark">Enlaces</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><Link to="/sobre-nosotros" className="text-decoration-none text-muted">Sobre el Proyecto</Link></li>
              <li className="mb-2"><Link to="/como-funciona" className="text-decoration-none text-muted">Cómo Funciona</Link></li>
              <li className="mb-2"><Link to="/contacto" className="text-decoration-none text-muted">Contacto</Link></li>
            </ul>
          </Col>

          {/* Columna 3: Legal */}
          <Col md={2} className="mb-3">
            <h6 className="fw-bold text-dark">Legal</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><Link to="/privacidad" className="text-decoration-none text-muted">Privacidad</Link></li>
              <li className="mb-2"><Link to="/terminos" className="text-decoration-none text-muted">Términos de Uso</Link></li>
            </ul>
          </Col>
          
          {/* Columna 4: Redes (Placeholder) */}
           <Col md={4} className="mb-3 text-md-end">
             <small className="text-muted d-block mb-2">Síguenos en</small>
             {/* Aquí podrías poner íconos de redes sociales luego */}
             <span className="fw-bold text-muted">@red.acompanar</span>
           </Col>
        </Row>

        {/* Copyright */}
        <div className="text-center pt-4 border-top mt-3">
            <small className="text-muted">
              &copy; {new Date().getFullYear()} ACOMPAÑAR. Todos los derechos reservados.
            </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
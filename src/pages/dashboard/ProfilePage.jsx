import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const userName = localStorage.getItem('usuarioNombre') || "Usuario Invitado";

  return (
    <Container className="py-5 mt-5" style={{ maxWidth: '800px' }}>
      
      <div className="mb-4">
        <Link to="/dashboard" className="text-decoration-none text-muted">
          ← Volver al Panel
        </Link>
      </div>

      <Card className="shadow-sm border-0 overflow-hidden">
        <div className="bg-light p-4 border-bottom text-center">
          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
               style={{width: '80px', height: '80px', fontSize: '2rem'}}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <h3 className="fw-bold text-dark mb-0 text-capitalize">{userName}</h3>
          <p className="text-muted small">Miembro de Psico-Vínculo</p>
        </div>

        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4 text-secondary">Mis Datos Personales</h5>
          
          <Form>
            <Row className="g-3">
              {/* NOMBRE */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Nombre Completo</Form.Label>
                  <Form.Control type="text" value={userName} readOnly className="bg-light" />
                </Form.Group>
              </Col>
              
              {/* EMAIL */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Email</Form.Label>
                  <Form.Control type="email" value="usuario@ejemplo.com" readOnly className="bg-light" />
                </Form.Group>
              </Col>

              {/* --- NUEVO: TELÉFONO (Importante para seguridad/contacto) --- */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Teléfono / WhatsApp</Form.Label>
                  <Form.Control type="tel" placeholder="+54 9 381 ..." />
                  <Form.Text className="text-muted" style={{fontSize: '0.7rem'}}>
                    Solo para recuperación de cuenta o emergencias.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* --- NUEVO: FECHA DE NACIMIENTO (Importante para saber si es mayor) --- */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Fecha de Nacimiento</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>

              {/* BIO */}
              <Col md={12}>
                <Form.Group className="mt-3">
                  <Form.Label className="small text-muted fw-bold">¿Cómo te sientes últimamente?</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Cuéntanos un poco sobre ti..." />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button variant="outline-secondary">Cancelar</Button>
              <Button variant="success">Guardar Cambios</Button>
            </div>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PatientRegister = () => {
  const navigate = useNavigate();
  
  // Estados para los campos
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para los CHECKS LEGALES OBLIGATORIOS 🛡️
  const [legalChecks, setLegalChecks] = useState({
    isNotEmergency: false,   // "No estoy en una emergencia"
    isEducational: false,    // "Entiendo que es educativo/alumnos"
    termsAccepted: false     // "Acepto términos y condiciones"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setLegalChecks({ ...legalChecks, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDACIÓN SIMPLE
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // EL BLINDAJE: Si no marca todas las casillas, no pasa. 🛑
    const { isNotEmergency, isEducational, termsAccepted } = legalChecks;
    if (!isNotEmergency || !isEducational || !termsAccepted) {
      alert("Por seguridad, debes leer y aceptar todas las condiciones del servicio.");
      return;
    }

    // Si todo está bien, simulamos registro
    alert("¡Registro exitoso! Bienvenido a Psico-Vínculo.");
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-success text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Crear Cuenta de Paciente 💚</h3>
              <p className="mb-0 opacity-75 small">Espacio de Escucha y Contención</p>
            </Card.Header>
            
            <Card.Body className="p-4 p-md-5">
              
              {/* ALERTA DE SEGURIDAD (Primer Filtro Visual) */}
              <Alert variant="warning" className="mb-4 text-center">
                <Alert.Heading className="h6 fw-bold">⚠️ Antes de empezar</Alert.Heading>
                <p className="small mb-0">
                  Si estás en una situación de <strong>riesgo de vida o emergencia</strong>, 
                  por favor no uses esta app. Llama al <strong>911</strong> o acude a una guardia.
                </p>
              </Alert>

              <Form onSubmit={handleSubmit}>
                {/* Datos Personales Básicos */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nombre" 
                    placeholder="Tu nombre" 
                    required 
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    placeholder="ejemplo@email.com" 
                    required 
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="Crear contraseña segura" 
                    required 
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Repetir contraseña" 
                    required 
                    onChange={handleChange}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* 🛡️ SECCIÓN DE CONSENTIMIENTO INFORMADO (EL ESCUDO) */}
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold text-muted mb-3 small text-uppercase">Declaración Jurada de Uso</h6>
                  
                  {/* Check 1: No es emergencia */}
                  <Form.Check className="mb-3">
                    <Form.Check.Input 
                      type="checkbox" 
                      name="isNotEmergency" 
                      id="check1" 
                      required
                      onChange={handleCheckChange}
                    />
                    <Form.Check.Label htmlFor="check1" className="small text-muted">
                      Declaro que <strong>NO me encuentro en una situación de emergencia</strong> ni riesgo de vida inminente.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Check 2: Entorno Educativo */}
                  <Form.Check className="mb-3">
                    <Form.Check.Input 
                      type="checkbox" 
                      name="isEducational" 
                      id="check2" 
                      required
                      onChange={handleCheckChange}
                    />
                    <Form.Check.Label htmlFor="check2" className="small text-muted">
                      Entiendo que seré atendido por <strong>estudiantes universitarios supervisados</strong> y que esto NO constituye un tratamiento clínico/psicológico formal.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Check 3: Términos Legales */}
                  <Form.Check>
                    <Form.Check.Input 
                      type="checkbox" 
                      name="termsAccepted" 
                      id="check3" 
                      required
                      onChange={handleCheckChange}
                    />
                    <Form.Check.Label htmlFor="check3" className="small text-muted">
                      Acepto los <a href="#" className="text-success">Términos y Condiciones</a> y la Política de Privacidad.
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                {/* Botón de Registro */}
                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    size="lg" 
                    type="submit"
                    // Deshabilitamos el botón visualmente si no aceptan los checks (Opcional, pero recomendado)
                    disabled={!legalChecks.isNotEmergency || !legalChecks.isEducational || !legalChecks.termsAccepted}
                  >
                    Registrarme y Comenzar
                  </Button>
                  <Button variant="link" className="text-muted" onClick={() => navigate('/login')}>
                    Ya tengo cuenta
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientRegister;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const navigate = useNavigate();
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    universidad: '',
    matriculaEstudiante: '', // Opcional: Número de legajo/libreta
    password: '',
    confirmPassword: ''
  });

  // 🛡️ EL BLINDAJE ÉTICO DEL ALUMNO
  const [ethicalChecks, setEthicalChecks] = useState({
    confidentiality: false,  // Secreto Profesional
    supervision: false,      // Acepta ser auditado
    academicRole: false      // Entiende que es práctica, no trabajo
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setEthicalChecks({ ...ethicalChecks, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // VALIDACIÓN ESTRICTA
    const { confidentiality, supervision, academicRole } = ethicalChecks;
    if (!confidentiality || !supervision || !academicRole) {
      alert("Debes aceptar el Compromiso Ético Universitario para continuar.");
      return;
    }

    // Simulamos envío de solicitud
    alert("¡Solicitud enviada! Tu perfil pasará a validación por tu Universidad.");
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            {/* CABECERA AZUL (Identidad Alumno) */}
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Registro de Estudiante 🎓</h3>
              <p className="mb-0 opacity-75 small">Prácticas Profesionales Supervisadas</p>
            </Card.Header>
            
            <Card.Body className="p-4 p-md-5">
              
              <Alert variant="info" className="mb-4 text-center border-0 bg-light-info">
                <Alert.Heading className="h6 fw-bold text-primary">ℹ️ Proceso de Alta</Alert.Heading>
                <p className="small mb-0 text-muted">
                  Tu cuenta deberá ser <strong>validada por tu Universidad</strong> antes de poder atender pacientes. Regístrate con tu email institucional (.edu).
                </p>
              </Alert>

              <Form onSubmit={handleSubmit}>
                
                {/* Datos Académicos */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre Completo</Form.Label>
                      <Form.Control type="text" name="nombre" placeholder="Como figura en tu DNI" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Universidad</Form.Label>
                      <Form.Select name="universidad" required onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        <option value="unt">Universidad Nacional (UNT)</option>
                        <option value="unsta">UNSTA</option>
                        <option value="utn">UTN</option>
                        <option value="otra">Otra</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Legajo / Libreta</Form.Label>
                      <Form.Control type="text" name="matriculaEstudiante" placeholder="Nº de alumno" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Institucional</Form.Label>
                  <Form.Control type="email" name="email" placeholder="alumno@universidad.edu.ar" required onChange={handleChange} />
                  <Form.Text className="text-muted small">
                    Usaremos este email para verificar tu regularidad.
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type="password" name="password" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar</Form.Label>
                      <Form.Control type="password" name="confirmPassword" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* 🛡️ CONTRATO ÉTICO (El Blindaje del Alumno) */}
                <div className="bg-light p-3 rounded mb-4 border border-primary border-opacity-25">
                  <h6 className="fw-bold text-primary mb-3 small text-uppercase">Compromiso Ético y Legal</h6>
                  
                  {/* Check 1: Secreto Profesional */}
                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="confidentiality" id="ethic1" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic1" className="small text-muted">
                      <strong>Confidencialidad Absoluta:</strong> Me comprometo a mantener el secreto profesional sobre todo lo hablado en las sesiones, bajo pena de sanciones académicas y legales.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Check 2: Supervisión */}
                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="supervision" id="ethic2" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic2" className="small text-muted">
                      <strong>Auditoría Permanente:</strong> Acepto que mis chats serán monitoreados en tiempo real o diferido por Tutores Docentes para fines de evaluación.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Check 3: Límites del Rol */}
                  <Form.Check>
                    <Form.Check.Input type="checkbox" name="academicRole" id="ethic3" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic3" className="small text-muted">
                      Entiendo que mi rol es <strong>formativo (no clínico)</strong> y me abstendré de realizar diagnósticos, prescribir medicación o dar consejos fuera del encuadre.
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit"
                    disabled={!ethicalChecks.confidentiality || !ethicalChecks.supervision || !ethicalChecks.academicRole}
                  >
                    Solicitar Alta Académica
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

export default StudentRegister;
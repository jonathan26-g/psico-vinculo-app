import React from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // 1. Recuperamos quién está conectado
  const role = localStorage.getItem('usuarioRol') || 'paciente';
  const name = localStorage.getItem('usuarioNombre') || 'Usuario';

  // --- CONFIGURACIÓN DE ROLES ---
  // Aquí definimos los colores y textos según el tipo de usuario
  const roleConfig = {
    paciente: { label: 'Paciente / Usuario', color: 'success', icon: '💚' },
    alumno: { label: 'Estudiante en Práctica', color: 'primary', icon: '🎓' },
    tutor: { label: 'Supervisor Profesional', color: 'info', icon: '👨‍🏫' }, // ¡Aquí está el Tutor!
    institucion: { label: 'Cuenta Institucional', color: 'dark', icon: '🏛️' }
  };

  const currentConfig = roleConfig[role] || roleConfig.paciente;

  // --- RENDERIZADO DEL CONTENIDO (El "Cuerpo" del perfil) ---
  const renderFormContent = () => {
    switch (role) {
      // CASO 1: ALUMNO (Matrícula y Carrera)
      case 'alumno':
        return (
          <>
            <h5 className="mb-3 text-primary">Información Académica</h5>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Universidad</Form.Label>
                  <Form.Control type="text" value="Universidad Nacional (UNT)" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Carrera</Form.Label>
                  <Form.Control type="text" value="Licenciatura en Psicología" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nº de Matrícula (Libreta)</Form.Label>
                  <Form.Control type="text" value="45.221-P" className="fw-bold" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Año de Cursado</Form.Label>
                  <Form.Control type="text" value="5to Año (Prácticas Finales)" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      // CASO 2: TUTOR / PROFESOR (Licencia y Especialidad)
      case 'tutor':
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-info text-dark mb-0">Credenciales Profesionales</h5>
              <Badge bg="warning" text="dark">Verificado</Badge>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Título Profesional</Form.Label>
                  <Form.Control type="text" value="Licenciado en Psicología Clínica" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Matrícula Profesional (MP)</Form.Label>
                  <Form.Control type="text" value="MP-9942 (Colegio de Psicólogos)" className="fw-bold border-info" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control type="text" value="Terapia Cognitivo-Conductual" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Institución Asignada</Form.Label>
                  <Form.Control type="text" value="Universidad Nacional (UNT)" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      // CASO 3: INSTITUCIÓN (Sedes y Contacto)
      case 'institucion':
        return (
          <>
            <h5 className="mb-3 text-secondary">Datos de la Organización</h5>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Nombre Oficial</Form.Label>
                  <Form.Control type="text" value="Universidad Nacional de Tucumán" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Sede Central</Form.Label>
                  <Form.Control type="text" value="Ayacucho 491, San Miguel de Tucumán" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email de Contacto (Secretaría)</Form.Label>
                  <Form.Control type="text" value="secretaria.academica@unt.edu.ar" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      // CASO 4: PACIENTE (Historial Básico)
      default:
        return (
          <>
            <h5 className="mb-3 text-success">Ficha Personal</h5>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control type="date" value="1995-05-12" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ocupación</Form.Label>
                  <Form.Control type="text" placeholder="Ej: Empleado de comercio" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Motivo de Consulta (Resumen)</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Describa brevemente..." value="Búsqueda de orientación para manejo de estrés laboral." readOnly />
                </Form.Group>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <Container className="py-5 mt-5">
      {/* Botón Volver */}
      <div className="mb-4">
        <Link to="/dashboard" className="text-decoration-none text-muted">
          ← Volver al Tablero Principal
        </Link>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            {/* CABECERA DE COLOR SEGÚN ROL */}
            <Card.Header className={`bg-${currentConfig.color} text-white py-4 text-center`}>
              <div className="display-1 mb-2">{currentConfig.icon}</div>
              <h2 className="fw-bold mb-0">{name}</h2>
              <Badge bg="light" text="dark" className="mt-2 text-uppercase ls-1">
                {currentConfig.label}
              </Badge>
            </Card.Header>

            <Card.Body className="p-5">
              {/* DATOS COMUNES (Email y Teléfono) */}
              <h5 className="mb-3 text-muted">Datos de Contacto</h5>
              <Row className="g-3 mb-4 border-bottom pb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" value={`${name.toLowerCase().replace(' ', '.')}@email.com`} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Teléfono / Celular</Form.Label>
                    <Form.Control type="tel" value="+54 9 381 123 4567" readOnly />
                  </Form.Group>
                </Col>
              </Row>

              {/* AQUÍ SE INYECTA EL FORMULARIO ESPECÍFICO */}
              {renderFormContent()}

              <div className="mt-5 d-flex gap-3 justify-content-end">
                <Button variant="outline-secondary">Cambiar Contraseña</Button>
                <Button variant={currentConfig.color === 'light' ? 'dark' : currentConfig.color}>
                  Guardar Cambios
                </Button>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
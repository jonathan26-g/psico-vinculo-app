import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const InstitutionRegister = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '', // <--- NUEVO
    institucion: '',
    rol: 'tutor', 
    matricula: '', // <--- NUEVO (Importante para profesionales)
    password: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    if (!formData.email.includes('.edu') && !formData.email.includes('.gob') && !formData.email.includes('.org')) {
      setError('⚠️ Por favor utilice un correo institucional válido (.edu, .gob, .org).');
      return;
    }

    // Validación de Matrícula (Solo si es Tutor)
    if (formData.rol === 'tutor' && formData.matricula.length < 4) {
      setError('⚠️ Es obligatorio ingresar una matrícula profesional válida para tutores.');
      return;
    }

    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <Container className="py-5 mt-5">
        <Card className="text-center p-5 shadow border-0" style={{borderTop: '5px solid #6f42c1'}}>
          <div className="display-1 mb-3">🎓</div>
          <h2 className="text-dark fw-bold">Solicitud Enviada</h2>
          <p className="lead">Gracias por registrarse, {formData.nombre}.</p>
          <p className="text-muted">
            Su solicitud y matrícula (<strong>{formData.matricula || "N/A"}</strong>) están siendo verificadas.<br/>
            Recibirá un correo en <strong>{formData.email}</strong> cuando su cuenta sea habilitada.
          </p>
          <Link to="/login">
            <Button variant="outline-dark" size="lg" className="mt-3">Volver al Inicio</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '700px' }}>
      <Card className="shadow-sm border-0 p-4">
        <div className="text-center mb-4">
          <div className="fs-1 mb-2">🏛️</div>
          <h2 className="fw-bold" style={{ color: '#2C3E50' }}>Registro Profesional / Institucional</h2>
          <p className="text-muted small">Validación requerida para Tutores y Administrativos.</p>
        </div>

        {error && <Alert variant="warning">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Institucional</Form.Label>
                <Form.Control type="email" name="email" placeholder="ejemplo@unt.edu.ar" value={formData.email} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono de Contacto</Form.Label>
                <Form.Control type="tel" name="telefono" placeholder="+54 9 ..." value={formData.telefono} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Institución</Form.Label>
                 <Form.Select name="institucion" value={formData.institucion} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    <option value="unt">Universidad Nacional de Tucumán</option>
                    <option value="uspt">Universidad San Pablo T</option>
                    <option value="utn">UTN Facultad Regional</option>
                    <option value="otra">Otra</option>
                 </Form.Select>
               </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Rol Solicitado</Form.Label>
                 <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
                    <option value="tutor">Profesor Tutor (Requiere Matrícula)</option>
                    <option value="admin">Administrador / Gestión</option>
                 </Form.Select>
               </Form.Group>
            </Col>
          </Row>

          {/* CAMPO CONDICIONAL: Solo mostramos Matrícula si el rol es TUTOR */}
          {formData.rol === 'tutor' && (
            <Form.Group className="mb-3 bg-light p-3 rounded border">
              <Form.Label className="fw-bold text-dark">N° de Matrícula Profesional</Form.Label>
              <Form.Control 
                type="text" 
                name="matricula" 
                placeholder="Ej: M.P. 1234" 
                value={formData.matricula} 
                onChange={handleChange} 
                required 
              />
              <Form.Text className="text-muted small">
                Este dato será contrastado con el Colegio de Psicólogos para habilitar su cuenta.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-4 mt-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" placeholder="******" value={formData.password} onChange={handleChange} required />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3 text-white fw-bold" style={{ backgroundColor: '#6f42c1', border: 'none' }}>
            Enviar Solicitud de Alta
          </Button>

          <div className="text-center border-top pt-3">
            <Link to="/register" className="text-muted small">Volver a selección</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default InstitutionRegister;
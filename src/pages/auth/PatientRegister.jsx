import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Validación simple de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 6) {
      setError('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // 2. Simulación de Registro Exitoso
    // (Aquí luego conectaríamos con el Backend para guardar el usuario)
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <Container className="py-5 mt-5">
        <Card className="text-center p-5 shadow border-success">
          <div className="display-1 mb-3">💚</div>
          <h2 className="text-success fw-bold">¡Bienvenido/a!</h2>
          <p className="lead">Tu cuenta ha sido creada.</p>
          <p className="text-muted">Ya puedes acceder para buscar acompañamiento.</p>
          <Link to="/login">
            <Button variant="success" size="lg" className="mt-3">Ir a Iniciar Sesión</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '500px' }}>
      <Card className="shadow-sm border-0 p-4">
        <div className="text-center mb-4">
          <div className="fs-1 text-success mb-2">💚</div>
          <h2 className="fw-bold" style={{ color: '#2C3E50' }}>Crear Cuenta</h2>
          <p className="text-muted small">Registro para usuarios que buscan escucha.</p>
        </div>

        {error && <Alert variant="warning">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control 
              type="text" 
              name="nombre"
              placeholder="Como te gustaría que te llamen" 
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Personal</Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              placeholder="ejemplo@gmail.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              name="password"
              placeholder="******" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              name="confirmPassword"
              placeholder="******" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3 btn-success text-white fw-bold">
            Registrarme
          </Button>

          <div className="text-center border-top pt-3">
            <small className="text-muted d-block mb-2">
              Al registrarte aceptas nuestros <Link to="/terminos" className="text-success">Términos y Condiciones</Link>
            </small>
            <Link to="/register" className="text-muted small">Volver a selección</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default PatientRegister;
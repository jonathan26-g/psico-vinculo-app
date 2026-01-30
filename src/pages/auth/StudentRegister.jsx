import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// CORRECCIÓN 1: Importamos los nombres EXACTOS que tienes en tu archivo mockData.js
import { UNIVERSIDADES_AUTORIZADAS, EMAILS_ALUMNOS_PERMITIDOS } from '../../data/mockData';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    universidadId: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // CORRECCIÓN 2: Usamos la lista correcta "EMAILS_ALUMNOS_PERMITIDOS"
    const alumnoEncontrado = EMAILS_ALUMNOS_PERMITIDOS.find(
      (alumno) => alumno.email === formData.email
    );

    if (!alumnoEncontrado) {
      setError('❌ Acceso denegado: Este email no ha sido autorizado por ninguna universidad.');
      return;
    }

    // CORRECCIÓN 3: parseInt()
    // Los IDs en tu mockData son números (1, 2), pero el formulario envía texto ("1", "2").
    // Usamos parseInt para convertir el texto a número y poder comparar.
    if (alumnoEncontrado.universidadId !== parseInt(formData.universidadId)) {
      setError('⚠️ Error de Institución: Este email pertenece a otra universidad.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <Container className="py-5 mt-5">
        <Card className="text-center p-5 shadow border-success">
          <div className="display-1 mb-3">🎉</div>
          <h2 className="text-success fw-bold">¡Validación Exitosa!</h2>
          <p className="lead">Tu universidad te ha reconocido.</p>
          <p>Tu cuenta de <strong>Alumno</strong> se ha creado correctamente.</p>
          <Link to="/login">
            <Button variant="success" size="lg">Ir a Iniciar Sesión</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '600px' }}>
      <Card className="shadow-sm border-0 p-4">
        <h2 className="fw-bold text-center mb-4" style={{ color: '#2C3E50' }}>Registro de Alumnos</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3">
            <Form.Label>Selecciona tu Universidad</Form.Label>
            <Form.Select 
              name="universidadId" 
              value={formData.universidadId} 
              onChange={handleChange}
              required
            >
              <option value="">-- Elegir Institución --</option>
              {/* CORRECCIÓN 4: Mapeamos UNIVERSIDADES_AUTORIZADAS */}
              {UNIVERSIDADES_AUTORIZADAS.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Institucional</Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              placeholder="Ej: tu.email@prueba.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <Form.Text className="text-muted">
              Usa el email: <b>tu.email@prueba.com</b> (Seleccionando UNT) para probar.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Crear Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              name="password"
              placeholder="******" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#4A8B71', border: 'none' }}>
            Verificar y Registrarse
          </Button>

          <div className="text-center">
            <Link to="/register" className="text-muted small">Volver atrás</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default StudentRegister;
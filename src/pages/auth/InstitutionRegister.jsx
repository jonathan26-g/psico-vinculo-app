import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// 🔥 IMPORTAMOS FIREBASE
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase/config';

const InstitutionRegister = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    institucion: '',
    rol: 'tutor', 
    matricula: '', 
    password: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('⚠️ La contraseña debe tener al menos 6 caracteres.');
    }
    
    // Validación de Matrícula (Solo si es Tutor)
    if (formData.rol === 'tutor' && formData.matricula.length < 4) {
      return setError('⚠️ Es obligatorio ingresar una matrícula profesional válida para tutores.');
    }

    setLoading(true);

    try {
      // 🔥 1. CREAR USUARIO EN GOOGLE (Auth)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 🔥 2. GUARDAR EN BASE DE DATOS (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        telefono: formData.telefono,
        institucion: formData.institucion,
        rol: formData.rol, // 'tutor' o 'admin'
        matricula: formData.rol === 'tutor' ? formData.matricula : null,
        fechaRegistro: new Date().toISOString(),
      });

      console.log("Tutor registrado exitosamente:", user.email);
      
      // 🔥 3. GUARDAR EN MEMORIA (LocalStorage)
      localStorage.setItem('usuarioRol', formData.rol);
      localStorage.setItem('usuarioNombre', `${formData.nombre} ${formData.apellido}`);
      localStorage.setItem('usuarioEmail', formData.email);
      localStorage.setItem('usuarioId', user.uid); 

      setShowSuccess(true);

    } catch (err) {
      console.error("Error al registrar institución/tutor:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('⚠️ Ese correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError('⚠️ Hubo un error al crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PANTALLA DE ÉXITO REAL (Con botón para ir al Panel)
  if (showSuccess) {
    return (
      <Container className="py-5 mt-5">
        <Card className="text-center p-5 shadow border-0" style={{borderTop: '5px solid #6f42c1'}}>
          <div className="display-1 mb-3">🎓</div>
          <h2 className="text-dark fw-bold">¡Cuenta Creada con Éxito!</h2>
          <p className="lead">Bienvenido/a, {formData.nombre}.</p>
          <p className="text-muted">
            Tu perfil de <strong>{formData.rol === 'tutor' ? 'Tutor Supervisor' : 'Administrador'}</strong> está listo.<br/>
            {formData.rol === 'tutor' && <>Matrícula registrada: <strong>{formData.matricula}</strong><br/></>}
          </p>
          <Button 
            variant="dark" 
            size="lg" 
            className="mt-3" 
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#6f42c1', border: 'none' }}
          >
            Ir a mi Panel de Control
          </Button>
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
                <Form.Control type="email" name="email" placeholder="tutor@universidad.edu.ar" value={formData.email} onChange={handleChange} required />
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
                    <option value="institucion">Administrador Institucional</option>
                 </Form.Select>
               </Form.Group>
            </Col>
          </Row>

          {/* CAMPO CONDICIONAL: Matrícula */}
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
            </Form.Group>
          )}

          <Form.Group className="mb-4 mt-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" placeholder="******" value={formData.password} onChange={handleChange} required />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 mb-3 text-white fw-bold" 
            style={{ backgroundColor: '#6f42c1', border: 'none' }}
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Enviar Solicitud de Alta"}
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
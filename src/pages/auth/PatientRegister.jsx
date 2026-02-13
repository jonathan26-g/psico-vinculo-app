import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

// 1. IMPORTAMOS FIREBASE
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase/config';

const PatientRegister = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // CHECKS LEGALES 🛡️
  const [legalChecks, setLegalChecks] = useState({
    isNotEmergency: false,
    isEducational: false,
    termsAccepted: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setLegalChecks({ ...legalChecks, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    if (formData.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    // EL BLINDAJE 🛑
    const { isNotEmergency, isEducational, termsAccepted } = legalChecks;
    if (!isNotEmergency || !isEducational || !termsAccepted) {
      return setError("Por seguridad, debes leer y aceptar todas las condiciones del servicio.");
    }

    setLoading(true);

    try {
      // 1. CREAR USUARIO EN GOOGLE
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. GUARDAR EN BASE DE DATOS (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: formData.nombre,
        email: formData.email,
        rol: 'paciente',
        fechaRegistro: new Date().toISOString(),
        aceptacionLegales: {
          noEmergencia: true,
          esEducativo: true,
          fecha: new Date().toISOString()
        }
      });

      console.log("Paciente registrado:", user.email);
      alert("¡Cuenta creada con éxito! Bienvenido a Psico-Vínculo.");
      
      // 3. 💾 GUARDAR EN MEMORIA (Corrección aplicada)
      localStorage.setItem('usuarioRol', 'paciente');
      localStorage.setItem('usuarioNombre', formData.nombre);
      localStorage.setItem('usuarioEmail', formData.email);
      
      // 👇👇 ¡ESTA ES LA LÍNEA QUE FALTABA! 👇👇
      localStorage.setItem('usuarioId', user.uid); 

      navigate('/dashboard');

    } catch (error) {
      console.error("Error registro:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado. Intenta iniciar sesión.");
      } else {
        setError("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
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
              <Alert variant="warning" className="mb-4 text-center">
                <Alert.Heading className="h6 fw-bold">⚠️ Antes de empezar</Alert.Heading>
                <p className="small mb-0">
                  Si estás en una situación de <strong>riesgo de vida o emergencia</strong>, 
                  por favor no uses esta app. Llama al <strong>911</strong>.
                </p>
              </Alert>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control type="text" name="nombre" placeholder="Tu nombre" required onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" name="email" placeholder="ejemplo@email.com" required onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" name="password" placeholder="Mínimo 6 caracteres" required onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control type="password" name="confirmPassword" placeholder="Repetir contraseña" required onChange={handleChange} />
                </Form.Group>

                <hr className="my-4" />

                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold text-muted mb-3 small text-uppercase">Declaración Jurada de Uso</h6>
                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="isNotEmergency" onChange={handleCheckChange} />
                    <Form.Check.Label className="small text-muted">Declaro que <strong>NO estoy en emergencia</strong>.</Form.Check.Label>
                  </Form.Check>
                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="isEducational" onChange={handleCheckChange} />
                    <Form.Check.Label className="small text-muted">Entiendo que es un entorno <strong>educativo</strong>.</Form.Check.Label>
                  </Form.Check>
                  <Form.Check>
                    <Form.Check.Input type="checkbox" name="termsAccepted" onChange={handleCheckChange} />
                    <Form.Check.Label className="small text-muted">Acepto Términos y Condiciones.</Form.Check.Label>
                  </Form.Check>
                </div>

                <div className="d-grid gap-2">
                  <Button variant="success" size="lg" type="submit" disabled={loading || !legalChecks.isNotEmergency || !legalChecks.isEducational || !legalChecks.termsAccepted}>
                    {loading ? "Creando cuenta..." : "Registrarme y Comenzar"}
                  </Button>
                  <Link to="/login" className="btn btn-link text-muted">Ya tengo cuenta</Link>
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
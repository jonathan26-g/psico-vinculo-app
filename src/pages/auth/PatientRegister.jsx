import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

// 1. IMPORTAMOS FIREBASE (El Cerebro)
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase/config';

const PatientRegister = () => {
  const navigate = useNavigate();
  
  // Estados para feedback visual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para los campos
  const [formData, setFormData] = useState({
    nombre: '', // Nombre completo
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

  // ESTA ES LA FUNCIÓN QUE CAMBIA (Ahora conecta con Google)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 1. VALIDACIÓN DE CONTRASEÑAS
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // 2. EL BLINDAJE: Si no marca todas las casillas, no pasa. 🛑
    const { isNotEmergency, isEducational, termsAccepted } = legalChecks;
    if (!isNotEmergency || !isEducational || !termsAccepted) {
      setError("Por seguridad, debes leer y aceptar todas las condiciones del servicio.");
      return;
    }

    setLoading(true);

    try {
      // 3. CREAR USUARIO EN GOOGLE AUTH
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 4. GUARDAR DATOS EN BASE DE DATOS (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: formData.nombre,
        email: formData.email,
        rol: 'paciente', // 👈 ETIQUETA IMPORTANTE
        fechaRegistro: new Date().toISOString(),
        aceptacionLegales: { // Guardamos que aceptó los términos (Evidencia legal)
          noEmergencia: true,
          esEducativo: true,
          fecha: new Date().toISOString()
        }
      });

      console.log("Paciente registrado:", user.email);
      alert("¡Cuenta creada con éxito! Bienvenido a Psico-Vínculo.");
      
      // Auto-login (guardamos datos en local) y vamos al dashboard
      localStorage.setItem('usuarioRol', 'paciente');
      localStorage.setItem('usuarioNombre', formData.nombre);
      localStorage.setItem('usuarioEmail', formData.email);
      
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
              
              {/* ALERTA DE SEGURIDAD (Primer Filtro Visual) */}
              <Alert variant="warning" className="mb-4 text-center">
                <Alert.Heading className="h6 fw-bold">⚠️ Antes de empezar</Alert.Heading>
                <p className="small mb-0">
                  Si estás en una situación de <strong>riesgo de vida o emergencia</strong>, 
                  por favor no uses esta app. Llama al <strong>911</strong> o acude a una guardia.
                </p>
              </Alert>

              {/* Mensaje de Error si falla Firebase */}
              {error && <Alert variant="danger">{error}</Alert>}

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
                    placeholder="Crear contraseña segura (min 6)" 
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
                      onChange={handleCheckChange}
                    />
                    <Form.Check.Label htmlFor="check2" className="small text-muted">
                      Entiendo que seré atendido por <strong>estudiantes universitarios supervisados</strong> y que esto NO constituye un tratamiento clínico formal.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Check 3: Términos Legales */}
                  <Form.Check>
                    <Form.Check.Input 
                      type="checkbox" 
                      name="termsAccepted" 
                      id="check3" 
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
                    disabled={loading || !legalChecks.isNotEmergency || !legalChecks.isEducational || !legalChecks.termsAccepted}
                  >
                    {loading ? "Creando cuenta..." : "Registrarme y Comenzar"}
                  </Button>
                  <Link to="/login" className="btn btn-link text-muted">
                    Ya tengo cuenta
                  </Link>
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
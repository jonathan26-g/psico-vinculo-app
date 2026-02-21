import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// 🔥 1. IMPORTAMOS FIREBASE
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../../firebase/config';

const StudentRegister = () => {
  const navigate = useNavigate();
  
  // Estados para carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    universidad: '',
    matriculaEstudiante: '',
    password: '',
    confirmPassword: ''
  });

  // 🛡️ EL BLINDAJE ÉTICO DEL ALUMNO
  const [ethicalChecks, setEthicalChecks] = useState({
    confidentiality: false,
    supervision: false,
    academicRole: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setEthicalChecks({ ...ethicalChecks, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    if (formData.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    const { confidentiality, supervision, academicRole } = ethicalChecks;
    if (!confidentiality || !supervision || !academicRole) {
      return setError("Debes aceptar el Compromiso Ético Universitario para continuar.");
    }

    setLoading(true);

    try {
      // 🔥 2. CREAR USUARIO EN GOOGLE (Auth)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 🔥 3. GUARDAR EN BASE DE DATOS (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: formData.nombre,
        email: formData.email,
        rol: 'alumno', // ¡AQUÍ LE DAMOS EL ROL CLAVE!
        universidad: formData.universidad,
        matriculaEstudiante: formData.matriculaEstudiante,
        fechaRegistro: new Date().toISOString(),
        aceptacionEtica: {
          confidencialidad: true,
          supervision: true,
          rolAcademico: true,
          fecha: new Date().toISOString()
        }
      });

      console.log("Estudiante registrado exitosamente:", user.email);
      
      // 🔥 4. GUARDAR EN MEMORIA Y REDIRIGIR
      localStorage.setItem('usuarioRol', 'alumno');
      localStorage.setItem('usuarioNombre', formData.nombre);
      localStorage.setItem('usuarioEmail', formData.email);
      localStorage.setItem('usuarioId', user.uid); 

      // Redirigir directamente a la Guardia (o Dashboard)
      alert("¡Registro exitoso! Ya puedes ingresar al panel.");
      navigate('/dashboard');

    } catch (err) {
      console.error("Error registro estudiante:", err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo institucional ya está registrado. Intenta iniciar sesión.");
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
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Registro de Estudiante 🎓</h3>
              <p className="mb-0 opacity-75 small">Prácticas Profesionales Supervisadas</p>
            </Card.Header>
            
            <Card.Body className="p-4 p-md-5">
              
              <Alert variant="info" className="mb-4 text-center border-0 bg-light-info">
                <Alert.Heading className="h6 fw-bold text-primary">ℹ️ Proceso de Alta</Alert.Heading>
                <p className="small mb-0 text-muted">
                  Por ahora tu cuenta se activará automáticamente para pruebas. En el futuro, tu Universidad deberá validar este acceso.
                </p>
              </Alert>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control type="text" name="nombre" placeholder="Como figura en tu DNI" required onChange={handleChange} />
                </Form.Group>

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
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Mínimo 6 caracteres" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar</Form.Label>
                      <Form.Control type="password" name="confirmPassword" placeholder="Repetir contraseña" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* 🛡️ CONTRATO ÉTICO */}
                <div className="bg-light p-3 rounded mb-4 border border-primary border-opacity-25">
                  <h6 className="fw-bold text-primary mb-3 small text-uppercase">Compromiso Ético y Legal</h6>
                  
                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="confidentiality" id="ethic1" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic1" className="small text-muted">
                      <strong>Confidencialidad Absoluta:</strong> Me comprometo a mantener el secreto profesional.
                    </Form.Check.Label>
                  </Form.Check>

                  <Form.Check className="mb-3">
                    <Form.Check.Input type="checkbox" name="supervision" id="ethic2" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic2" className="small text-muted">
                      <strong>Auditoría Permanente:</strong> Acepto que mis chats serán monitoreados por Tutores Docentes.
                    </Form.Check.Label>
                  </Form.Check>

                  <Form.Check>
                    <Form.Check.Input type="checkbox" name="academicRole" id="ethic3" required onChange={handleCheckChange} />
                    <Form.Check.Label htmlFor="ethic3" className="small text-muted">
                      Entiendo que mi rol es <strong>formativo (no clínico)</strong> y no realizaré diagnósticos.
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit"
                    disabled={loading || !ethicalChecks.confidentiality || !ethicalChecks.supervision || !ethicalChecks.academicRole}
                  >
                    {loading ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creando cuenta...</>
                    ) : (
                      "Solicitar Alta Académica"
                    )}
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
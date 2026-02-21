import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// 🔥 IMPORTAMOS FIRESTORE
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
// 🔥 IMPORTAMOS FIREBASE AUTH (NUEVO)
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ProfilePage = () => {
  const userId = localStorage.getItem('usuarioId');
  const role = localStorage.getItem('usuarioRol') || 'paciente';
  const name = localStorage.getItem('usuarioNombre') || 'Usuario';
  const email = localStorage.getItem('usuarioEmail') || `${name.toLowerCase().replace(' ', '.')}@email.com`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // 🔥 ESTADO NUEVO PARA EL MENSAJE DE CONTRASEÑA
  const [resetMsg, setResetMsg] = useState(''); 

  const [formData, setFormData] = useState({
    telefono: '',
    fechaNacimiento: '',
    ocupacion: '',
    motivoConsulta: '' 
  });

  const roleConfig = {
    paciente: { label: 'Paciente / Usuario', color: 'success', icon: '💚' },
    alumno: { label: 'Estudiante en Práctica', color: 'primary', icon: '🎓' },
    tutor: { label: 'Supervisor Profesional', color: 'info', icon: '👨‍🏫' },
    institucion: { label: 'Cuenta Institucional', color: 'dark', icon: '🏛️' }
  };
  const currentConfig = roleConfig[role] || roleConfig.paciente;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            telefono: data.telefono || '',
            fechaNacimiento: data.fechaNacimiento || '',
            ocupacion: data.ocupacion || '',
            motivoConsulta: data.emocion || 'Sin registro previo'
          });
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSuccessMsg('');
    setResetMsg('');

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        ocupacion: formData.ocupacion
      });

      setSuccessMsg('¡Datos actualizados correctamente! ✅');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  // 🔥 FUNCIÓN NUEVA: ENVIAR CORREO DE CAMBIO DE CONTRASEÑA
  const handleResetPassword = async () => {
    const auth = getAuth();
    setResetMsg('');
    setSuccessMsg('');

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg(`📩 Te hemos enviado un enlace a ${email} para cambiar tu contraseña.`);
      
      // Borramos el mensaje después de 6 segundos
      setTimeout(() => setResetMsg(''), 6000);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al intentar enviar el correo. Verifica que tu email sea válido.");
    }
  };

  const renderFormContent = () => {
    switch (role) {
      case 'alumno':
        return (
          <>
            <h5 className="mb-3 text-primary">Información Académica</h5>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group><Form.Label>Universidad</Form.Label><Form.Control type="text" value="Universidad Nacional (UNT)" disabled /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Carrera</Form.Label><Form.Control type="text" value="Licenciatura en Psicología" disabled /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Nº de Matrícula (Libreta)</Form.Label><Form.Control type="text" value="45.221-P" className="fw-bold" disabled /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Año de Cursado</Form.Label><Form.Control type="text" value="5to Año (Prácticas Finales)" disabled /></Form.Group>
              </Col>
            </Row>
          </>
        );

      case 'tutor':
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-info text-dark mb-0">Credenciales Profesionales</h5>
              <Badge bg="warning" text="dark">Verificado</Badge>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group><Form.Label>Título Profesional</Form.Label><Form.Control type="text" value="Licenciado en Psicología Clínica" disabled /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Matrícula Profesional (MP)</Form.Label><Form.Control type="text" value="MP-9942 (Colegio de Psicólogos)" className="fw-bold border-info" disabled /></Form.Group>
              </Col>
            </Row>
          </>
        );

      case 'institucion':
        return (
          <>
            <h5 className="mb-3 text-secondary">Datos de la Organización</h5>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group><Form.Label>Nombre Oficial</Form.Label><Form.Control type="text" value="Universidad Nacional de Tucumán" disabled /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Sede Central</Form.Label><Form.Control type="text" value="Ayacucho 491, San Miguel de Tucumán" disabled /></Form.Group>
              </Col>
            </Row>
          </>
        );

      default: 
        return (
          <>
            <h5 className="mb-3 text-success">Ficha Personal</h5>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ocupación</Form.Label>
                  <Form.Control type="text" name="ocupacion" placeholder="Ej: Empleado de comercio" value={formData.ocupacion} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Último Motivo de Consulta (Triaje)</Form.Label>
                  <Form.Control as="textarea" rows={2} value={formData.motivoConsulta.toUpperCase()} disabled className="bg-light text-muted" />
                </Form.Group>
              </Col>
            </Row>
          </>
        );
    }
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant={currentConfig.color} />
        <p className="mt-3 text-muted">Cargando perfil...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <div className="mb-4">
        <Link to="/dashboard" className="text-decoration-none text-muted">
          ← Volver al Tablero Principal
        </Link>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className={`bg-${currentConfig.color} text-white py-4 text-center`}>
              <div className="display-1 mb-2">{currentConfig.icon}</div>
              <h2 className="fw-bold mb-0">{name}</h2>
              <Badge bg="light" text="dark" className="mt-2 text-uppercase ls-1">
                {currentConfig.label}
              </Badge>
            </Card.Header>

            <Card.Body className="p-5">
              
              {/* ALERTA DE GUARDADO EXITOSO */}
              {successMsg && (
                <Alert variant="success" className="text-center fw-bold animate__animated animate__fadeIn">
                  {successMsg}
                </Alert>
              )}

              {/* 🔥 ALERTA DE CORREO ENVIADO */}
              {resetMsg && (
                <Alert variant="info" className="text-center fw-bold animate__animated animate__fadeIn">
                  {resetMsg}
                </Alert>
              )}

              <h5 className="mb-3 text-muted">Datos de Contacto</h5>
              <Row className="g-3 mb-4 border-bottom pb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" value={email} disabled className="bg-light" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Teléfono / Celular</Form.Label>
                    <Form.Control type="tel" name="telefono" placeholder="Ej: +54 9 381 123 4567" value={formData.telefono} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              {renderFormContent()}

              <div className="mt-5 d-flex gap-3 justify-content-end">
                {/* 🔥 BOTÓN CONECTADO A LA FUNCIÓN */}
                <Button variant="outline-secondary" onClick={handleResetPassword}>
                  Cambiar Contraseña
                </Button>
                
                <Button 
                  variant={currentConfig.color === 'light' ? 'dark' : currentConfig.color}
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
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
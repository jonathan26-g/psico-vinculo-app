import React, { useState } from 'react';
import { Container, Card, Button, Form, ProgressBar, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Controla en qué pregunta estamos
  
  // Guardamos las respuestas del paciente
  const [data, setData] = useState({
    emotion: '',     // Ansiedad, Tristeza, Soledad, etc.
    intensity: 5,    // Del 1 al 10
    hasRisk: false   // ¿Hay riesgo de vida?
  });

  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Opciones de emociones
  const emotions = [
    { id: 'ansiedad', label: 'Ansiedad / Nervios', icon: '😰' },
    { id: 'tristeza', label: 'Tristeza / Angustia', icon: '😢' },
    { id: 'soledad', label: 'Soledad', icon: '🙍‍♂️' },
    { id: 'pareja', label: 'Problemas de Pareja', icon: '💔' },
    { id: 'estudios', label: 'Estrés Académico', icon: '📚' },
    { id: 'otro', label: 'Otro motivo', icon: '💭' },
  ];

  // Función para avanzar de paso
  const handleNext = () => setStep(step + 1);

  // Función SEGURA para entrar al chat (Botón Verde)
  const handleEnterChat = () => {
    // Calculamos la prioridad basada en la intensidad (si es 8 o más, es ALTA)
    const priority = data.intensity >= 8 ? 'HIGH' : 'NORMAL';
    
    // Imprimimos para verificar (opcional)
    console.log("✅ Ingresando al chat con:", { ...data, hasRisk: false, priority });
    
    // Navegamos DIRECTAMENTE al chat
    navigate('/chat'); 
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      
      <Card className="shadow-lg border-0" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="p-5">
          
          {/* Barra de Progreso */}
          <ProgressBar variant="success" now={(step / 3) * 100} className="mb-4" style={{height: '5px'}} />
          
          {/* PASO 1: ¿QUÉ SIENTES? (MOTIVO) */}
          {step === 1 && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="fw-bold text-center mb-4">¿Qué sientes hoy?</h3>
              <Row className="g-3">
                {emotions.map((e) => (
                  <Col xs={6} key={e.id}>
                    <Button 
                      variant={data.emotion === e.id ? 'success' : 'outline-light'}
                      className={`w-100 text-dark border shadow-sm py-3 ${data.emotion === e.id ? 'text-white fw-bold' : ''}`}
                      onClick={() => setData({ ...data, emotion: e.id })}
                    >
                      <div className="fs-1">{e.icon}</div>
                      <small>{e.label}</small>
                    </Button>
                  </Col>
                ))}
              </Row>
              <div className="d-grid mt-4">
                <Button variant="primary" size="lg" disabled={!data.emotion} onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* PASO 2: INTENSIDAD (DEL 1 AL 10) */}
          {step === 2 && (
            <div className="animate__animated animate__fadeIn text-center">
              <h3 className="fw-bold mb-2">Del 1 al 10...</h3>
              <p className="text-muted mb-4">¿Qué tan fuerte es esa sensación?</p>
              
              <div className="my-5 position-relative">
                <h1 className={`display-1 fw-bold ${data.intensity >= 8 ? 'text-danger' : data.intensity >= 5 ? 'text-warning' : 'text-success'}`}>
                  {data.intensity}
                </h1>
                <Form.Range 
                  min={1} 
                  max={10} 
                  step={1} 
                  value={data.intensity} 
                  onChange={(e) => setData({ ...data, intensity: parseInt(e.target.value) })}
                  style={{ height: '30px' }}
                />
                <div className="d-flex justify-content-between text-muted small mt-2">
                  <span>Leve</span>
                  <span>Moderado</span>
                  <span>Incertidumbre Total</span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleNext}>Continuar</Button>
                <Button variant="link" className="text-muted" onClick={() => setStep(1)}>Volver</Button>
              </div>
            </div>
          )}

          {/* PASO 3: PREGUNTA DE SEGURIDAD (RIESGO) */}
          {step === 3 && (
            <div className="animate__animated animate__fadeIn">
              <div className="text-center mb-4">
                <span className="display-4">🛡️</span>
                <h3 className="fw-bold mt-3">Última pregunta importante</h3>
                <p className="text-muted">Para asignarte el mejor profesional, necesitamos saber:</p>
              </div>

              <Card className="bg-light border-0 p-3 mb-4">
                <p className="fw-bold text-center mb-0">
                  ¿Sientes que en este momento corres peligro de lastimarte a ti mismo?
                </p>
              </Card>

              <div className="d-grid gap-3">
                {/* 🔴 SI HAY RIESGO -> ABRE EL MODAL DE EMERGENCIA */}
                <Button 
                  variant="outline-danger" 
                  size="lg" 
                  onClick={() => setShowCrisisModal(true)}
                >
                  Sí, necesito ayuda urgente
                </Button>

                {/* 🟢 NO HAY RIESGO -> ENTRA AL CHAT (Función Corregida) */}
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleEnterChat}
                >
                  No, solo quiero hablar
                </Button>
              </div>
              <Button variant="link" className="text-muted w-100 mt-2" onClick={() => setStep(2)}>Volver</Button>
            </div>
          )}

        </Card.Body>
      </Card>

      {/* MODAL DE CRISIS (BLOQUEO) */}
      <Modal 
        show={showCrisisModal} 
        backdrop="static" 
        keyboard={false} 
        centered
        size="lg"
      >
        <Modal.Header className="bg-danger text-white border-0">
          <Modal.Title>⚠️ Atención Prioritaria</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 text-center">
          <h2 className="mb-4">Tu seguridad es lo más importante</h2>
          <p className="lead text-muted mb-4">
            Según lo que nos indicas, necesitas una atención más rápida y especializada que la que podemos darte por chat en este momento.
          </p>
          <div className="d-grid gap-3 col-md-8 mx-auto">
            <Button variant="danger" size="lg" href="tel:135">📞 Llamar al 135 (Gratis 24hs)</Button>
            <Button variant="outline-dark" href="tel:911">🚑 Llamar al 911 (Emergencias)</Button>
          </div>
          <hr className="my-4"/>
          <p className="small text-muted">
            Si marcaste esto por error y quieres volver al chat, <button className="btn btn-link p-0 align-baseline" onClick={() => setShowCrisisModal(false)}>haz clic aquí</button>.
          </p>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default WaitingRoom;
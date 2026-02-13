import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SessionCloseModal from './SessionCloseModal'; // Asumiendo que está en la misma carpeta

// ⚠️ LISTA DE PALABRAS CLAVE (Esto debe ser revisado por psicólogos)
const RISK_KEYWORDS = ['matar', 'suicidio', 'morir', 'acabar con todo', 'pastillas', 'sangre', 'cuchillo', 'no quiero vivir', 'desaparecer'];

const ChatPage = () => {
  const userRole = localStorage.getItem('usuarioRol');
  
  // ESTADOS
  const [showCloseModal, setShowCloseModal] = useState(false); // Modal de Cierre (Alumno)
  const [showCrisisModal, setShowCrisisModal] = useState(false); // Modal de Crisis (Paciente)
  const [inputText, setInputText] = useState(""); // Lo que se escribe en el input
  
  // Estado de los mensajes (Base de datos local simulada)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'paciente', text: 'Hola, hoy tuve un día un poco difícil, sentí mucha ansiedad.', time: '10:00 AM' },
    { id: 2, sender: 'alumno', text: 'Entiendo. ¿Hubo algún evento específico que detonara esa sensación?', time: '10:02 AM' },
  ]);

  // Referencia para que el chat baje solo al último mensaje
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 🧠 CEREBRO DEL CHAT: Analiza y envía
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Detección de Riesgo
    const lowerText = inputText.toLowerCase();
    const isRisk = RISK_KEYWORDS.some(word => lowerText.includes(word));

    // 2. Agregar el mensaje a la pantalla
    const newMessage = { 
      id: messages.length + 1, 
      sender: userRole === 'alumno' ? 'alumno' : 'paciente', 
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText(""); // Limpiar input

    // 3. REACCIÓN DEL SISTEMA (Solo si escribe el PACIENTE y hay riesgo)
    if (isRisk && userRole !== 'alumno') {
      
      // A) Mostrar el Modal Empático (Con un pequeño retraso para que no sea agresivo)
      setTimeout(() => {
        setShowCrisisModal(true); 
      }, 800);
      
      // B) El sistema interviene en el chat suavemente
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'sistema',
          text: '🛡️ Recordatorio: Este es un espacio seguro. Si sientes que la situación te desborda, recuerda que el botón de emergencia está disponible. Estoy aquí para escucharte.',
          time: 'AHORA'
        }]);
      }, 1500);
    }
  };

  return (
    <Container className="py-5 mt-5">
      
      {/* Botonera Superior */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link to="/dashboard" className="text-decoration-none text-muted">← Volver al Panel</Link>
        {userRole === 'alumno' && (
          <Button variant="outline-danger" size="sm" onClick={() => setShowCloseModal(true)}>
            🛑 Finalizar Sesión e Informar
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-0" style={{ height: '70vh' }}>
        
        {/* --- CABECERA MODIFICADA CON BOTÓN SOS --- */}
        <Card.Header className={`py-3 text-white ${userRole === 'tutor' ? 'bg-primary' : 'bg-success'}`}>
          <div className="d-flex justify-content-between align-items-center">
            
            {/* IZQUIERDA: Info del Chat */}
            <div>
              <h5 className="mb-0 fw-bold">{userRole === 'tutor' ? '👁️ Auditoría' : '💬 Sala de Vínculo'}</h5>
              <small>{userRole === 'tutor' ? 'Supervisando Caso #42' : 'Espacio Seguro y Confidencial'}</small>
            </div>

            {/* DERECHA: Botones de Acción */}
            <div className="d-flex align-items-center gap-2">
                {/* Badge para Tutor */}
                {userRole === 'tutor' && <Badge bg="warning" text="dark">Modo Supervisor</Badge>}
                
                {/* 👇 BOTÓN SOS: Solo visible para el Paciente */}
                {userRole !== 'tutor' && userRole !== 'alumno' && (
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="fw-bold shadow-sm border-white"
                        onClick={() => setShowCrisisModal(true)}
                        title="Pedir ayuda externa"
                    >
                        🆘 Ayuda
                    </Button>
                )}
            </div>

          </div>
        </Card.Header>
        
        {/* ÁREA DE MENSAJES (Dinámica) */}
        <Card.Body className="bg-light overflow-auto">
          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-3 rounded shadow-sm ${
                  msg.sender === 'sistema' ? 'align-self-center bg-warning bg-opacity-25 border border-warning text-center w-75' :
                  (msg.sender === 'alumno' ? 'align-self-end text-white' : 'align-self-start bg-white')
                }`}
                style={{
                  maxWidth: msg.sender === 'sistema' ? '90%' : '75%',
                  backgroundColor: msg.sender === 'alumno' ? '#198754' : (msg.sender === 'sistema' ? '' : 'white')
                }}
              >
                {/* Nombre del remitente (si no es sistema) */}
                {msg.sender !== 'sistema' && (
                  <small className={`d-block mb-1 fw-bold ${msg.sender === 'alumno' ? 'text-light text-end' : 'text-muted'}`}>
                    {msg.sender === 'alumno' ? 'Alumno (Juan)' : 'Tú'}
                  </small>
                )}
                
                {/* Texto del mensaje */}
                {msg.text}
                
                {/* Hora */}
                <div className={`small mt-1 ${msg.sender === 'alumno' ? 'text-white-50 text-end' : 'text-muted text-end'}`} style={{fontSize: '0.7rem'}}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>

        {/* INPUT DE TEXTO */}
        <Card.Footer className="bg-white p-3">
          <Form className="d-flex gap-2" onSubmit={handleSendMessage}>
            <Form.Control 
              type="text" 
              placeholder={userRole === 'tutor' ? "Enviar nota privada..." : "Escribe aquí cómo te sientes..."} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
            <Button variant={userRole === 'tutor' ? "warning" : "success"} type="submit">
              {userRole === 'tutor' ? "Nota" : "Enviar"}
            </Button>
          </Form>
        </Card.Footer>
      </Card>

      {/* 👇 MODAL 1: CIERRE DE SESIÓN (Para Alumnos) */}
      <SessionCloseModal show={showCloseModal} handleClose={() => setShowCloseModal(false)} />

      {/* 👇 MODAL 2: CRISIS / RIESGO (Versión Empática - Para Pacientes) */}
      <Modal 
        show={showCrisisModal} 
        onHide={() => setShowCrisisModal(false)} 
        backdrop="static" 
        keyboard={false} 
        centered
      >
        <Modal.Header className="bg-warning border-0 text-dark">
          <Modal.Title>🫂 Queremos cuidarte</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <p className="lead">
            Detectamos palabras que suelen indicar mucho dolor.
          </p>
          <p className="text-muted small">
            Si sientes que corres peligro ahora mismo, por favor usa estos recursos. Si solo necesitas desahogarte, puedes cerrar esta ventana y seguir hablando.
          </p>

          <div className="d-grid gap-2 mt-4">
            {/* Opción A: Emergencia Real */}
            <Button variant="danger" href="tel:135">
              🆘 Necesito ayuda urgente (Llamar al 135)
            </Button>

            {/* Opción B: Falsa Alarma / Desahogo */}
            <Button variant="outline-dark" onClick={() => setShowCrisisModal(false)}>
              💬 No es una emergencia, quiero seguir chateando
            </Button>
          </div>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ChatPage;
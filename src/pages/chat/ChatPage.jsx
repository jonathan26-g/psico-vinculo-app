import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SessionCloseModal from './SessionCloseModal';

// 🔥 IMPORTAMOS FIREBASE
import { db } from '../../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// ⚠️ PALABRAS CLAVE DE RIESGO
const RISK_KEYWORDS = ['matar', 'suicidio', 'morir', 'acabar con todo', 'pastillas', 'sangre', 'cuchillo', 'no quiero vivir', 'desaparecer'];

const ChatPage = () => {
  // Datos del usuario (Del LocalStorage: Es correcto, es tu sesión activa)
  const userRole = localStorage.getItem('usuarioRol');
  const userId = localStorage.getItem('usuarioId');
  const userEmail = localStorage.getItem('usuarioEmail');

  // ESTADOS
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]); 

  // REFERENCIAS (Ganchos para controlar el scroll y el foco)
  const messagesEndRef = useRef(null); // Para bajar al último mensaje
  const inputRef = useRef(null);       // 👈 NUEVO: Para controlar la cajita de texto

  // Función de Scroll Suave
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // 1. 📡 ESCUCHAR MENSAJES EN TIEMPO REAL
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      // Hacemos scroll abajo cuando llegan mensajes
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, []);

  // 2. 📨 ENVIAR MENSAJE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // A) Analizar Riesgo
    const lowerText = inputText.toLowerCase();
    const isRisk = RISK_KEYWORDS.some(word => lowerText.includes(word));

    // B) Preparar mensaje
    const newMessage = {
      text: inputText,
      senderId: userId,
      senderEmail: userEmail,
      role: userRole,
      createdAt: serverTimestamp(),
      isRisk: isRisk
    };

    // C) Guardar en Firebase
    try {
      await addDoc(collection(db, "messages"), newMessage);
      setInputText(""); // Limpiar texto
      
      // 🛑 SOLUCIÓN AL SALTO: Recuperar el foco inmediatamente
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);

    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }

    // 3. REACCIÓN AUTOMÁTICA (Bot)
    if (isRisk && userRole === 'paciente') {
      setTimeout(() => setShowCrisisModal(true), 800);
      setTimeout(async () => {
        await addDoc(collection(db, "messages"), {
          text: '🛡️ DETECCIÓN AUTOMÁTICA: Este es un espacio seguro. Si sientes que la situación te desborda, recuerda que el botón de emergencia está disponible.',
          senderId: 'sistema',
          role: 'system',
          createdAt: serverTimestamp()
        });
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
        
        {/* CABECERA */}
        <Card.Header className={`py-3 text-white ${userRole === 'tutor' ? 'bg-primary' : 'bg-success'}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">{userRole === 'tutor' ? '👁️ Auditoría' : '💬 Sala de Vínculo'}</h5>
              <small>{userRole === 'tutor' ? 'Supervisando Chat General' : 'Chat Global de Pruebas'}</small>
            </div>

            <div className="d-flex align-items-center gap-2">
                {userRole === 'tutor' && <Badge bg="warning" text="dark">Modo Supervisor</Badge>}
                {userRole !== 'tutor' && userRole !== 'alumno' && (
                    <Button 
                        variant="danger" size="sm" className="fw-bold shadow-sm border-white"
                        onClick={() => setShowCrisisModal(true)}
                    >
                        🆘 Ayuda
                    </Button>
                )}
            </div>
          </div>
        </Card.Header>
        
        {/* ÁREA DE MENSAJES */}
        <Card.Body className="bg-light overflow-auto">
          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === userId;
              const isSystem = msg.role === 'system';
              
              return (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded shadow-sm ${
                    isSystem ? 'align-self-center bg-warning bg-opacity-25 border border-warning text-center w-75' :
                    (isMe ? 'align-self-end text-white' : 'align-self-start bg-white')
                  }`}
                  style={{
                    maxWidth: isSystem ? '90%' : '75%',
                    backgroundColor: isMe ? '#198754' : (isSystem ? '' : 'white')
                  }}
                >
                  {!isSystem && (
                    <small className={`d-block mb-1 fw-bold ${isMe ? 'text-light text-end' : 'text-muted'}`}>
                      {isMe ? 'Tú' : (msg.role === 'alumno' ? 'Alumno' : 'Paciente')} 
                    </small>
                  )}
                  {msg.text}
                  {msg.createdAt && (
                    <div className={`small mt-1 ${isMe ? 'text-white-50 text-end' : 'text-muted text-end'}`} style={{fontSize: '0.7rem'}}>
                      {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>

        {/* INPUT */}
        <Card.Footer className="bg-white p-3">
          <Form className="d-flex gap-2" onSubmit={handleSendMessage}>
            <Form.Control 
              ref={inputRef}  // 👈 AQUÍ CONECTAMOS LA REFERENCIA
              type="text" 
              placeholder={userRole === 'tutor' ? "Enviar nota privada..." : "Escribe aquí..."} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
            <Button variant={userRole === 'tutor' ? "warning" : "success"} type="submit">
              Enviar
            </Button>
          </Form>
        </Card.Footer>
      </Card>

      {/* MODALES */}
      <SessionCloseModal show={showCloseModal} handleClose={() => setShowCloseModal(false)} />

      <Modal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} centered>
        <Modal.Header className="bg-warning border-0 text-dark"><Modal.Title>🫂 Queremos cuidarte</Modal.Title></Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="lead">Si sientes que corres peligro, no estás solo.</p>
          <div className="d-grid gap-2 mt-4">
            <Button variant="danger" href="tel:135">🆘 Llamar al 135</Button>
            <Button variant="outline-dark" onClick={() => setShowCrisisModal(false)}>💬 Seguir hablando</Button>
          </div>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ChatPage;
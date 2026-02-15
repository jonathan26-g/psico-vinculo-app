import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
// 1. IMPORTAMOS useParams PARA LEER LA LLAVE DE LA SALA 🔑
import { Link, useParams } from 'react-router-dom';
import SessionCloseModal from './SessionCloseModal';

import { db } from '../../firebase/config';
// 2. IMPORTAMOS 'where' PARA EL FILTRO DE SEGURIDAD 🛡️
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

const RISK_KEYWORDS = ['matar', 'suicidio', 'morir', 'acabar con todo', 'pastillas', 'sangre', 'cuchillo', 'no quiero vivir', 'desaparecer'];

const ChatPage = () => {
  // 3. CAPTURAMOS EL ID DE LA SALA DESDE LA URL (Nivel 1 de Seguridad)
  const { roomId } = useParams(); 

  const userRole = localStorage.getItem('usuarioRol');
  const userId = localStorage.getItem('usuarioId');
  const userEmail = localStorage.getItem('usuarioEmail');

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]); 

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // --- 🔒 LÓGICA DE ESCUCHA BLINDADA ---
  useEffect(() => {
    if (!roomId) return; // Si no hay sala, no escuchamos nada.

    const messagesRef = collection(db, "messages");
    
    // 🔥 FILTRO DE SEGURIDAD (Nivel 2): 
    // "Solo dame los mensajes que tengan el sello de ESTA habitación exacta"
    const q = query(
      messagesRef, 
      where("roomId", "==", roomId), // 👈 ESTO ES EL CANDADO
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [roomId]); // Si cambia el ID de sala, se reinicia el chat inmediatamente.


  // --- 🔒 LÓGICA DE ENVÍO CERTIFICADO ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const lowerText = inputText.toLowerCase();
    const isRisk = RISK_KEYWORDS.some(word => lowerText.includes(word));

    const newMessage = {
      text: inputText,
      senderId: userId,
      senderEmail: userEmail,
      role: userRole,
      createdAt: serverTimestamp(),
      isRisk: isRisk,
      roomId: roomId // 👈 CERTIFICADO: El mensaje se guarda con el ID de la sala.
    };

    try {
      await addDoc(collection(db, "messages"), newMessage);
      setInputText("");
      setTimeout(() => { inputRef.current?.focus(); }, 10);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }

    // Lógica del Bot de Seguridad
    if (isRisk && userRole === 'paciente') {
      setTimeout(() => setShowCrisisModal(true), 800);
      setTimeout(async () => {
        await addDoc(collection(db, "messages"), {
          text: '🛡️ DETECCIÓN AUTOMÁTICA: Recordatorio de seguridad.',
          senderId: 'sistema',
          role: 'system',
          createdAt: serverTimestamp(),
          roomId: roomId // El bot también respeta la sala privada
        });
      }, 1500);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link to="/dashboard" className="text-decoration-none text-muted">← Volver al Panel</Link>
        {userRole === 'alumno' && (
          <Button variant="outline-danger" size="sm" onClick={() => setShowCloseModal(true)}>
            🛑 Finalizar Sesión
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-0" style={{ height: '70vh' }}>
        <Card.Header className={`py-3 text-white ${userRole === 'tutor' ? 'bg-primary' : 'bg-success'}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">
                {userRole === 'tutor' ? '👁️ Auditoría' : '🔒 Sala Privada'}
              </h5>
              {/* Información de depuración segura */}
              <small className="opacity-75" style={{fontSize: '0.7em'}}>
                 ID Caso: {roomId ? roomId.slice(0,6) + '...' : 'Cargando'}
              </small> 
            </div>
             <div className="d-flex align-items-center gap-2">
                {userRole === 'tutor' && <Badge bg="warning" text="dark">Modo Supervisor</Badge>}
                {userRole !== 'tutor' && userRole !== 'alumno' && (
                    <Button variant="danger" size="sm" onClick={() => setShowCrisisModal(true)}>🆘 Ayuda</Button>
                )}
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="bg-light overflow-auto">
          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === userId;
              const isSystem = msg.role === 'system';
              return (
                <div key={msg.id} className={`p-3 rounded shadow-sm ${isSystem ? 'align-self-center bg-warning bg-opacity-25 w-75 text-center' : (isMe ? 'align-self-end text-white' : 'align-self-start bg-white')}`} style={{maxWidth: '75%', backgroundColor: isMe ? '#198754' : (isSystem ? '' : 'white')}}>
                   {!isSystem && <small className={`d-block mb-1 fw-bold ${isMe ? 'text-light text-end' : 'text-muted'}`}>{isMe ? 'Tú' : (msg.role === 'alumno' ? 'Alumno' : 'Paciente')}</small>}
                   {msg.text}
                   {msg.createdAt && <div className={`small mt-1 ${isMe ? 'text-white-50 text-end' : 'text-muted text-end'}`} style={{fontSize: '0.7rem'}}>{new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>

        <Card.Footer className="bg-white p-3">
          <Form className="d-flex gap-2" onSubmit={handleSendMessage}>
            <Form.Control ref={inputRef} type="text" placeholder="Mensaje seguro..." value={inputText} onChange={(e) => setInputText(e.target.value)} autoFocus />
            <Button variant={userRole === 'tutor' ? "warning" : "success"} type="submit">Enviar</Button>
          </Form>
        </Card.Footer>
      </Card>

      <SessionCloseModal show={showCloseModal} handleClose={() => setShowCloseModal(false)} patientId={roomId} />
      <Modal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} centered>
        <Modal.Header className="bg-warning border-0 text-dark"><Modal.Title>🫂 Queremos cuidarte</Modal.Title></Modal.Header>
        <Modal.Body className="p-4 text-center">
            <p className="lead">Si sientes que corres peligro, no estás solo.</p>
            <div className="d-grid gap-2 mt-4"><Button variant="danger" href="tel:135">🆘 Llamar al 135</Button><Button variant="outline-dark" onClick={() => setShowCrisisModal(false)}>💬 Seguir hablando</Button></div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ChatPage;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Badge, Modal } from 'react-bootstrap';
// 🔥 Importamos lo necesario de Firebase
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import SessionCloseModal from './SessionCloseModal'; // Tu modal de informe

const ChatPage = () => {
  const { roomId } = useParams(); // El ID de la sala (es el ID del paciente)
  const navigate = useNavigate();
  const dummy = useRef(); // Para el scroll automático

  // Estados
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 🔥 ESTADO NUEVO: Para saber si la sesión sigue viva
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [showEndAlert, setShowEndAlert] = useState(false);

  // Modal de informe (solo para el alumno)
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Datos del usuario actual
  const currentUserId = localStorage.getItem('usuarioId');
  const currentUserName = localStorage.getItem('usuarioNombre');
  const currentUserRole = localStorage.getItem('usuarioRol');

  // 1. 📨 ESCUCHAR MENSAJES (Chat en tiempo real)
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      orderBy('createdAt', 'asc') // Ordenar por fecha
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.roomId === roomId); // Filtramos solo los de esta sala
      
      setMessages(msgs);
      setLoading(false);
      
      // Agregamos 'block: nearest' para que NO mueva la página entera, solo el chat
setTimeout(() => dummy.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    });

    return () => unsubscribe();
  }, [roomId]);

  // 2. 🔒 ESCUCHAR EL ESTADO DE LA SESIÓN (¡Nuevo!)
  // Esto detecta si el alumno finalizó el caso
  useEffect(() => {
    const userRef = doc(db, "users", roomId); // Escuchamos al paciente dueño de la sala
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Si el estado es 'finalizado', bloqueamos el chat
        if (userData.estado === 'finalizado') {
          setIsSessionActive(false);
          setShowEndAlert(true);
        } else {
          setIsSessionActive(true);
          setShowEndAlert(false);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);


  // Función para enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderId: currentUserId,
      senderName: currentUserName,
      roomId: roomId
    });

    setNewMessage('');
  };

  return (
    <Container className="py-4">
      {/* Cabecera del Chat */}
      <div className="mb-3">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none ps-0">
          ← Volver
        </Button>
      </div>

      <Card className="shadow-lg border-0" style={{ height: '80vh' }}>
        {/* ENCABEZADO VERDE O AZUL SEGÚN ROL */}
        <Card.Header className={`text-white d-flex justify-content-between align-items-center ${currentUserRole === 'alumno' ? 'bg-primary' : 'bg-success'}`}>
          <div>
            <h5 className="mb-0">
              {currentUserRole === 'alumno' ? '💬 Sala de Consulta' : '🛡️ Espacio Seguro'}
            </h5>
            <small className="opacity-75">ID Caso: {roomId.slice(0, 6)}...</small>
          </div>
          
          {/* BOTÓN SOLO PARA ALUMNOS: FINALIZAR */}
          {currentUserRole === 'alumno' && isSessionActive && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => setShowCloseModal(true)}
            >
              📋 Finalizar Sesión
            </Button>
          )}

          {/* INDICADOR PARA PACIENTES */}
          {currentUserRole !== 'alumno' && (
            <Badge bg="light" text="dark">
                {isSessionActive ? '🟢 En Vivo' : '🔴 Finalizado'}
            </Badge>
          )}
        </Card.Header>

        {/* ÁREA DE MENSAJES */}
        <Card.Body className="overflow-auto bg-light" style={{ flex: 1 }}>
          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <>
              {messages.map((msg) => {
                // 🔥 LÓGICA DE VISUALIZACIÓN (DERECHA O IZQUIERDA)
                const isMe = msg.senderId === currentUserId;

                return (
                  <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                    <div 
                      className={`p-3 rounded-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border'}`}
                      style={{ maxWidth: '75%', minWidth: '150px' }}
                    >
                      {/* Nombre pequeño arriba */}
                      <small className={`d-block mb-1 fw-bold ${isMe ? 'text-light opacity-75' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                        {isMe ? 'Tú' : msg.senderName}
                      </small>
                      
                      {/* Texto del mensaje */}
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      
                      {/* Hora */}
                      <div className={`text-end mt-1 ${isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                        {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={dummy}></div>
            </>
          )}
        </Card.Body>

        {/* INPUT DE TEXTO (Bloqueado si terminó la sesión) */}
        <Card.Footer className="bg-white">
          <Form onSubmit={handleSendMessage} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder={isSessionActive ? "Escribe un mensaje..." : "La sesión ha finalizado."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-pill bg-light border-0 px-4"
              disabled={!isSessionActive} // 🔒 BLOQUEO
            />
            <Button 
                variant={currentUserRole === 'alumno' ? 'primary' : 'success'} 
                type="submit" 
                className="rounded-circle px-3"
                disabled={!newMessage.trim() || !isSessionActive}
            >
              ➤
            </Button>
          </Form>
        </Card.Footer>
      </Card>

      {/* MODAL DEL ALUMNO (Informe) */}
      <SessionCloseModal 
        show={showCloseModal} 
        handleClose={() => setShowCloseModal(false)} 
        patientId={roomId} 
      />

      {/* 🔥 MODAL DE AVISO AL PACIENTE (Cuando termina) */}
      <Modal 
        show={showEndAlert && currentUserRole !== 'alumno'} // Solo se muestra al paciente
        backdrop="static" 
        keyboard={false}
        centered
      >
        <Modal.Header className="bg-success text-white">
          <Modal.Title>👋 Sesión Finalizada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <h4>¡Gracias por confiar!</h4>
          <p className="text-muted">
            El profesional ha finalizado la consulta. Esperamos haberte ayudado.
            Este chat quedará guardado en tu historial.
          </p>
          <hr />
          <p className="small">¿Necesitas ayuda de nuevo? Puedes volver al inicio y solicitar otro turno.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-success" onClick={() => navigate('/dashboard')}>
            Volver a mi Panel
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default ChatPage;
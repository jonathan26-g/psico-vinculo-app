import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import SessionCloseModal from './SessionCloseModal';

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dummy = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [showEndAlert, setShowEndAlert] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const currentUserId = localStorage.getItem('usuarioId');
  const currentUserName = localStorage.getItem('usuarioNombre');
  const currentUserRole = localStorage.getItem('usuarioRol') || 'paciente';

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.roomId === roomId);
      
      setMessages(msgs);
      setLoading(false);
      
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const userRef = doc(db, "users", roomId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole, // Guardamos el ROL real
      roomId: roomId
    });

    setNewMessage('');
  };

  let chatPlaceholder = "Escribe un mensaje...";
  if (!isSessionActive) chatPlaceholder = "La sesión ha finalizado.";
  if (currentUserRole === 'tutor' && isSessionActive) chatPlaceholder = "🤫 Escribe una instrucción privada al alumno...";

  return (
    <Container className="py-4">
      <div className="mb-3">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none ps-0 text-muted">
          ← Volver
        </Button>
      </div>

      <Card className="shadow-lg border-0" style={{ height: '80vh' }}>
        <Card.Header className={`text-white d-flex justify-content-between align-items-center ${
          currentUserRole === 'alumno' ? 'bg-primary' : currentUserRole === 'tutor' ? 'bg-dark' : 'bg-success'
        }`}>
          <div>
            <h5 className="mb-0">
              {currentUserRole === 'alumno' ? '💬 Sala de Consulta' : currentUserRole === 'tutor' ? '👁️ Supervisión Silenciosa' : '🛡️ Espacio Seguro'}
            </h5>
            <small className="opacity-75">ID Caso: {roomId.slice(0, 6)}...</small>
          </div>
          
          {currentUserRole === 'alumno' && isSessionActive && (
            <Button variant="danger" size="sm" onClick={() => setShowCloseModal(true)}>
              📋 Finalizar Sesión
            </Button>
          )}

          {currentUserRole !== 'alumno' && (
            <Badge bg="light" text="dark">
                {isSessionActive ? '🟢 En Vivo' : '🔴 Finalizado'}
            </Badge>
          )}
        </Card.Header>

        <Card.Body className="overflow-auto bg-light" style={{ flex: 1 }}>
          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <>
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const isTutorMessage = msg.senderRole === 'tutor';
                const isStudentMessage = msg.senderRole === 'alumno';

                // 🛑 EL BLOQUEO: El paciente NUNCA ve al tutor
                if (currentUserRole === 'paciente' && isTutorMessage) return null;

                let bubbleClass = '';
                let alignmentClass = '';
                let titleColor = '';
                let displayName = '';

                // ==========================================
                // 👁️ VISTA DEL TUTOR (Supervisor)
                // ==========================================
                if (currentUserRole === 'tutor') {
                  if (isMe || isTutorMessage) {
                    bubbleClass = 'bg-dark text-white border-secondary shadow-sm';
                    alignmentClass = 'justify-content-center';
                    titleColor = 'text-warning fw-bold';
                    displayName = 'Tú (Modo Fantasma)';
                  } else if (isStudentMessage) {
                    bubbleClass = 'bg-primary bg-opacity-10 text-dark border border-primary shadow-sm';
                    alignmentClass = 'justify-content-end'; // Alumno a la derecha
                    titleColor = 'text-primary fw-bold';
                    displayName = `🎓 Alumno: ${msg.senderName}`;
                  } else {
                    bubbleClass = 'bg-white text-dark border shadow-sm';
                    alignmentClass = 'justify-content-start'; // Paciente a la izquierda
                    titleColor = 'text-success fw-bold';
                    displayName = `💚 Paciente: ${msg.senderName}`;
                  }
                } 
                // ==========================================
                // 🎓 VISTA DEL ALUMNO
                // ==========================================
                else if (currentUserRole === 'alumno') {
                  if (isMe) {
                    bubbleClass = 'bg-primary text-white shadow-sm';
                    alignmentClass = 'justify-content-end';
                    titleColor = 'text-light opacity-75';
                    displayName = 'Tú';
                  } else if (isTutorMessage) {
                    bubbleClass = 'bg-warning text-dark border-warning shadow-lg';
                    alignmentClass = 'justify-content-start';
                    titleColor = 'text-danger fw-bold';
                    displayName = `👨‍🏫 Supervisor: ${msg.senderName}`;
                  } else {
                    bubbleClass = 'bg-white text-dark border shadow-sm';
                    alignmentClass = 'justify-content-start';
                    titleColor = 'text-success fw-bold';
                    displayName = msg.senderName;
                  }
                } 
                // ==========================================
                // 💚 VISTA DEL PACIENTE
                // ==========================================
                else {
                  if (isMe) {
                    bubbleClass = 'bg-success text-white shadow-sm';
                    alignmentClass = 'justify-content-end';
                    titleColor = 'text-light opacity-75';
                    displayName = 'Tú';
                  } else {
                    bubbleClass = 'bg-white text-dark border shadow-sm';
                    alignmentClass = 'justify-content-start';
                    titleColor = 'text-primary fw-bold';
                    displayName = 'Profesional'; // Mantenemos el anonimato si quieres
                  }
                }

                return (
                  <div key={msg.id} className={`d-flex ${alignmentClass} mb-3`}>
                    <div className={`p-3 rounded-3 ${bubbleClass}`} style={{ maxWidth: '75%', minWidth: '150px' }}>
                      <small className={`d-block mb-1 ${titleColor}`} style={{ fontSize: '0.75rem' }}>
                        {displayName}
                      </small>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      <div className={`text-end mt-1 ${isMe ? 'opacity-75' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
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

        <Card.Footer className="bg-white">
          <Form onSubmit={handleSendMessage} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder={chatPlaceholder}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-pill bg-light border-0 px-4"
              disabled={!isSessionActive}
            />
            <Button 
                variant={currentUserRole === 'alumno' ? 'primary' : currentUserRole === 'tutor' ? 'dark' : 'success'} 
                type="submit" 
                className="rounded-circle px-3"
                disabled={!newMessage.trim() || !isSessionActive}
            >
              ➤
            </Button>
          </Form>
        </Card.Footer>
      </Card>

      <SessionCloseModal show={showCloseModal} handleClose={() => setShowCloseModal(false)} patientId={roomId} />
      
      <Modal show={showEndAlert && currentUserRole !== 'alumno'} backdrop="static" keyboard={false} centered>
        <Modal.Header className="bg-success text-white">
          <Modal.Title>👋 Sesión Finalizada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <h4>¡Gracias por confiar!</h4>
          <p className="text-muted">El profesional ha finalizado la consulta.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-success" onClick={() => navigate('/dashboard')}>Volver a mi Panel</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ChatPage;
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const StudentDashboard = () => {
  const [waitingPatients, setWaitingPatients] = useState([]);
  const [myPatients, setMyPatients] = useState([]); // 👈 NUEVO ESTADO
  const navigate = useNavigate();
  const myId = localStorage.getItem('usuarioId'); // Mi ID de alumno

  // 📡 RADAR 1: Pacientes en Espera (Para todos)
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("estado", "==", "esperando"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWaitingPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 📡 RADAR 2: Mis Pacientes Activos (Solo míos)
  useEffect(() => {
    if (!myId) return;

    const usersRef = collection(db, "users");
    // Buscamos usuarios que YO estoy atendiendo y siguen en consulta
    const q = query(
        usersRef, 
        where("atendidoPor", "==", myId), 
        where("estado", "==", "en_consulta")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [myId]);


  const handleJoinChat = async (patientId, isNewCase) => {
    try {
      if (isNewCase) {
        // Solo si es nuevo cambiamos el estado
        await updateDoc(doc(db, "users", patientId), {
            estado: 'en_consulta',
            atendidoPor: myId,
            fechaInicioAtencion: new Date().toISOString()
        });
      }
      navigate(`/chat/${patientId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className="py-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-bold text-primary">👨‍🎓 Sala de Guardia</h2>
            <p className="text-muted">Gestión de pacientes en tiempo real.</p>
        </div>
        <Badge bg="secondary" className="p-2">🟢 Sistema Online</Badge>
      </div>

      <Tabs defaultActiveKey="waiting" className="mb-4">
        
        {/* PESTAÑA 1: SALA DE ESPERA */}
        <Tab eventKey="waiting" title={`🚨 Sala de Espera (${waitingPatients.length})`}>
            {waitingPatients.length === 0 ? (
                <Alert variant="success" className="text-center p-5 border-0 shadow-sm">
                    <h4>☕ Guardia Tranquila</h4>
                    <p>No hay pacientes nuevos esperando.</p>
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {waitingPatients.map(p => (
                        <Col key={p.id}>
                            <Card className={`h-100 shadow-sm border-0 border-start border-5 ${p.nivelTriaje === 'ALTA' ? 'border-danger' : 'border-success'}`}>
                                <Card.Body>
                                    <Badge bg={p.nivelTriaje === 'ALTA' ? 'danger' : 'success'} className="mb-2">
                                        {p.nivelTriaje === 'ALTA' ? '🔥 URGENCIA' : '🟢 NUEVO'}
                                    </Badge>
                                    <Card.Title>{p.nombre}</Card.Title>
                                    <Card.Text><strong>{p.emocion}</strong> ({p.intensidad}/10)</Card.Text>
                                    <Button variant="outline-primary" className="w-100" onClick={() => handleJoinChat(p.id, true)}>
                                        💬 Tomar Caso
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Tab>

        {/* PESTAÑA 2: MIS CASOS */}
        <Tab eventKey="active" title={`📂 Mis Casos Activos (${myPatients.length})`}>
            {myPatients.length === 0 ? (
                <Alert variant="light" className="text-center p-5 border text-muted">
                    <h4>📂 Sin casos activos</h4>
                    <p>Tus pacientes que estés atendiendo aparecerán aquí.</p>
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {myPatients.map(p => (
                        <Col key={p.id}>
                            <Card className="h-100 shadow-sm border-0 border-start border-primary border-5">
                                <Card.Body>
                                    <Badge bg="primary" className="mb-2">EN CURSO</Badge>
                                    <Card.Title>{p.nombre}</Card.Title>
                                    <Card.Text className="small text-muted">
                                        Iniciado: {new Date(p.fechaInicioAtencion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </Card.Text>
                                    <div className="d-grid gap-2">
                                        <Button variant="primary" onClick={() => handleJoinChat(p.id, false)}>
                                            Reanudar Chat
                                        </Button>
                                        <Button variant="outline-danger" size="sm">
                                            Finalizar Caso
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Tab>

      </Tabs>
    </Container>
  );
};

export default StudentDashboard;
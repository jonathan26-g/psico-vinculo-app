import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// 🔥 Importamos Firebase
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const StudentDashboard = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 📡 RADAR ACTIVADO: Escuchar usuarios en estado 'esperando'
    const usersRef = collection(db, "users");
    
    // Filtro: "Dame solo los que están esperando"
    const q = query(usersRef, where("estado", "==", "esperando"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsList);
    });

    return () => unsubscribe(); // Apagar radar al salir
  }, []);

  const handleJoinChat = (patientId) => {
    // 🚀 El alumno viaja a la sala del paciente
    navigate(`/chat/${patientId}`);
  };

  return (
    <Container className="py-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-bold text-primary">👨‍🎓 Sala de Guardia</h2>
            <p className="text-muted">Pacientes aguardando atención en tiempo real.</p>
        </div>
        <Badge bg="secondary" className="p-2">🟢 Sistema Online</Badge>
      </div>

      {patients.length === 0 ? (
        <Alert variant="success" className="text-center p-5 shadow-sm border-0">
          <div style={{ fontSize: '3rem' }}>☕</div>
          <h4 className="mt-3">Guardia Tranquila</h4>
          <p className="mb-0">No hay pacientes en sala de espera por el momento.</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {patients.map((patient) => (
            <Col key={patient.id}>
              <Card className={`h-100 shadow border-0 ${patient.nivelTriaje === 'ALTA' ? 'border-start border-danger border-5' : 'border-start border-success border-5'}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg={patient.nivelTriaje === 'ALTA' ? 'danger' : 'success'}>
                      {patient.nivelTriaje === 'ALTA' ? '🔥 URGENCIA' : '🟢 NORMAL'}
                    </Badge>
                    <small className="text-muted">
                        {patient.fechaEspera ? new Date(patient.fechaEspera).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Reciente'}
                    </small>
                  </div>
                  
                  <Card.Title className="fw-bold">{patient.nombre || "Usuario Anónimo"}</Card.Title>
                  
                  <div className="my-3 p-2 bg-light rounded">
                    <p className="mb-1 small text-muted">Motivo de consulta:</p>
                    <strong className="text-dark d-block">
                        {patient.emocion?.toUpperCase() || 'GENERAL'} 
                        <span className="ms-2 text-muted">({patient.intensidad}/10)</span>
                    </strong>
                  </div>

                  <div className="d-grid">
                    <Button variant={patient.nivelTriaje === 'ALTA' ? 'danger' : 'primary'} onClick={() => handleJoinChat(patient.id)}>
                      💬 Atender Ahora
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentDashboard;
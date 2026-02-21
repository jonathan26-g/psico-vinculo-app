import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Tabs, Tab, Table, Spinner } from 'react-bootstrap';
// 🔥 Importamos lo necesario de Firebase
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const myId = localStorage.getItem('usuarioId');

  // Estados para las tres listas
  const [waitingPatients, setWaitingPatients] = useState([]);
  const [myActivePatients, setMyActivePatients] = useState([]);
  const [myHistory, setMyHistory] = useState([]); // 👈 ¡NUEVO ESTADO PARA EL HISTORIAL!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!myId) return;

    // 1. 📡 Escuchar "Sala de Espera" (Todos los esperando)
    const qWaiting = query(collection(db, 'users'), where('estado', '==', 'esperando'));
    const unsubWaiting = onSnapshot(qWaiting, (snapshot) => {
      setWaitingPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. 📡 Escuchar "Mis Casos Activos" (Míos + en_consulta)
    const qActive = query(
      collection(db, 'users'),
      where('estado', '==', 'en_consulta'),
      where('atendidoPor', '==', myId)
    );
    const unsubActive = onSnapshot(qActive, (snapshot) => {
      setMyActivePatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. 🔥 📡 Escuchar "Mi Historial" (Míos + finalizados)
    const qHistory = query(
      collection(db, 'users'),
      where('estado', '==', 'finalizado'),
      where('atendidoPor', '==', myId)
    );
    const unsubHistory = onSnapshot(qHistory, (snapshot) => {
      setMyHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Limpieza al salir de la pantalla
    return () => {
      unsubWaiting();
      unsubActive();
      unsubHistory();
    };
  }, [myId]);

  // Función para tomar el caso y entrar al chat
  const handleTakeCase = async (patientId) => {
    try {
      await updateDoc(doc(db, 'users', patientId), {
        estado: 'en_consulta',
        atendidoPor: myId
      });
      navigate(`/chat/${patientId}`);
    } catch (error) {
      console.error("Error al tomar caso:", error);
      alert("No se pudo tomar el caso.");
    }
  };

  return (
    <Container className="py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold text-primary mb-0">👨‍🎓 Sala de Guardia</h2>
          <p className="text-muted">Gestión de pacientes en tiempo real.</p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
          Volver al Panel
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="espera" className="mb-4 custom-tabs">
            
            {/* PESTAÑA 1: SALA DE ESPERA */}
            <Tab eventKey="espera" title={<span>🚨 Sala de Espera ({waitingPatients.length})</span>}>
              {waitingPatients.length === 0 ? (
                <div className="text-center p-5 bg-light rounded text-muted">
                  <h5>☕ Guardia Tranquila</h5>
                  <p>No hay pacientes nuevos esperando.</p>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-3">
                  {waitingPatients.map(p => (
                    <Card key={p.id} className="border-danger" style={{ width: '18rem' }}>
                      <Card.Body>
                        <Badge bg="danger" className="mb-2">NUEVO</Badge>
                        <Card.Title className="fw-bold">{p.nombre}</Card.Title>
                        <Card.Text>
                          <strong>Motivo:</strong> {p.emocion || 'No especificado'}
                        </Card.Text>
                        <Button variant="outline-primary" className="w-100" onClick={() => handleTakeCase(p.id)}>
                          💬 Tomar Caso
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>

            {/* PESTAÑA 2: CASOS ACTIVOS */}
            <Tab eventKey="activos" title={<span>📂 Mis Casos Activos ({myActivePatients.length})</span>}>
              {myActivePatients.length === 0 ? (
                <div className="text-center p-5 bg-light rounded text-muted">
                  <p>No tienes pacientes en consulta ahora mismo.</p>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-3">
                  {myActivePatients.map(p => (
                    <Card key={p.id} className="border-primary" style={{ width: '18rem' }}>
                      <Card.Body>
                        <Badge bg="primary" className="mb-2">EN CURSO</Badge>
                        <Card.Title className="fw-bold">{p.nombre}</Card.Title>
                        <Button variant="primary" className="w-100 mt-2" onClick={() => navigate(`/chat/${p.id}`)}>
                          Reanudar Chat
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>

            {/* 🔥 PESTAÑA 3: MI HISTORIAL (NUEVA) */}
            <Tab eventKey="historial" title={<span>📚 Mi Historial ({myHistory.length})</span>}>
              {loading ? (
                <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>
              ) : myHistory.length === 0 ? (
                <div className="text-center p-5 bg-light rounded text-muted">
                  <p>Aún no has finalizado ningún caso.</p>
                </div>
              ) : (
                <Table hover responsive className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Paciente</th>
                      <th>Motivo Inicial</th>
                      <th>Diagnóstico (Informe)</th>
                      <th>Riesgo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myHistory.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold">{p.nombre}</td>
                        <td>{p.emocion || '-'}</td>
                        <td className="text-capitalize">{p.informeClinico?.motivo || 'Sin informe'}</td>
                        <td>
                          {p.informeClinico?.riesgo === 'alto' && <Badge bg="danger">Alto 🚨</Badge>}
                          {p.informeClinico?.riesgo === 'medio' && <Badge bg="warning" text="dark">Medio</Badge>}
                          {p.informeClinico?.riesgo === 'bajo' && <Badge bg="success">Bajo</Badge>}
                          {!p.informeClinico?.riesgo && <Badge bg="secondary">N/A</Badge>}
                        </td>
                        <td><Badge bg="dark">Finalizado</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentDashboard;
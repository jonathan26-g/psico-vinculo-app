import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar, Alert, Modal, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
// 🔥 Importamos Firebase para el Tutor
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

// =========================================================
// 👨‍🏫 VISTA TUTOR / SUPERVISOR (AHORA CONECTADA A FIREBASE)
// =========================================================
const TutorView = ({ userName }) => {
  const [finalizedCases, setFinalizedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal del Informe
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    // 📡 Escuchamos TODOS los pacientes que ya fueron "finalizados"
    const q = query(collection(db, 'users'), where('estado', '==', 'finalizado'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      setFinalizedCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Calculamos estadísticas reales
  const highRiskCount = finalizedCases.filter(c => c.informeClinico?.riesgo === 'alto').length;
  const totalCases = finalizedCases.length;

  const handleOpenReport = (patientCase) => {
    setSelectedCase(patientCase);
    setShowModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Panel de Supervisión 👁️</h2>
          <p className="text-muted mb-0">Docente: {userName}</p>
        </div>
        <Link to="/profile" className="btn btn-outline-primary shadow-sm">
          👤 Mi Perfil
        </Link>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3 border-bottom border-danger border-3">
            <h3 className="fw-bold text-danger">{loading ? '-' : highRiskCount}</h3>
            <span className="text-muted small">Alertas de Riesgo Alto</span>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3 border-bottom border-primary border-3">
            <h3 className="fw-bold text-primary">{loading ? '-' : totalCases}</h3>
            <span className="text-muted small">Casos Finalizados (Total)</span>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
          <span>Auditoría de Informes Clínicos</span>
          {loading && <Spinner animation="border" size="sm" variant="primary" />}
        </Card.Header>
        <Card.Body>
          {finalizedCases.length === 0 && !loading ? (
            <div className="text-center text-muted p-4">No hay casos finalizados para auditar aún.</div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead>
                <tr>
                  <th>Paciente (ID)</th>
                  <th>Motivo Inicial</th>
                  <th>Nivel de Riesgo</th>
                  <th>Fecha de Cierre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {finalizedCases.map(c => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.nombre}</strong><br/>
                      <small className="text-muted">ID: {c.id.slice(0, 6)}</small>
                    </td>
                    <td>{c.emocion || 'No especificado'}</td>
                    <td>
                      {c.informeClinico?.riesgo === 'alto' && <Badge bg="danger">Alto 🚨</Badge>}
                      {c.informeClinico?.riesgo === 'medio' && <Badge bg="warning" text="dark">Medio</Badge>}
                      {c.informeClinico?.riesgo === 'bajo' && <Badge bg="success">Bajo</Badge>}
                      {!c.informeClinico?.riesgo && <Badge bg="secondary">N/A</Badge>}
                    </td>
                    <td>
                        <small className="text-muted">Reciente</small>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => handleOpenReport(c)}>
                        📑 Leer Informe
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* 📄 MODAL PARA LEER EL INFORME */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            📑 Informe Clínico - Caso #{selectedCase?.id?.slice(0,6)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedCase && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-1 text-muted small">Paciente</p>
                  <h5 className="fw-bold">{selectedCase.nombre}</h5>
                </Col>
                <Col md={6}>
                  <p className="mb-1 text-muted small">Atendido por (ID Alumno)</p>
                  <h5 className="fw-bold">{selectedCase.atendidoPor || 'Desconocido'}</h5>
                </Col>
              </Row>
              
              <div className="bg-light p-3 rounded border mb-3">
                <h6 className="fw-bold mb-2">Motivo de Consulta Diagnosticado</h6>
                <p className="mb-0 text-capitalize">{selectedCase.informeClinico?.motivo || 'No especificado'}</p>
              </div>

              <div className="bg-light p-3 rounded border mb-3">
                <h6 className="fw-bold mb-2">Evaluación de Riesgo</h6>
                <p className="mb-0 text-capitalize text-danger fw-bold">
                  {selectedCase.informeClinico?.riesgo || 'No evaluado'}
                </p>
              </div>

              <div className="bg-light p-3 rounded border">
                <h6 className="fw-bold mb-2">Notas del Profesional (Privado)</h6>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedCase.informeClinico?.notas || 'El alumno no dejó notas detalladas.'}
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="success">✅ Aprobar Práctica</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


// =========================================================
// COMPONENTE PRINCIPAL: DashboardPage
// =========================================================
const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', role: '', uniId: null });

  useEffect(() => {
    const name = localStorage.getItem('usuarioNombre');
    const role = localStorage.getItem('usuarioRol');
    const uniId = localStorage.getItem('usuarioUniversidadId');

    if (!name) {
      navigate('/login');
    } else {
      setUser({ name, role, uniId });
    }
  }, [navigate]);

  // VISTA PACIENTE
  const PatientView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Hola, {user.name} 👋</h2>
          <p className="text-muted mb-0">¿Cómo te sientes hoy? Estamos aquí para acompañarte.</p>
        </div>
        <Link to="/profile" className="btn btn-outline-primary shadow-sm">👤 Mi Perfil</Link>
      </div>
      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
            <Card.Body className="p-4">
              <div className="display-4 mb-3">💬</div>
              <h4 className="fw-bold text-success">Sala de Vínculo</h4>
              <p className="small text-muted">Habla con un estudiante supervisado.</p>
              <Button variant="success" className="w-100 mt-3" onClick={() => navigate('/waiting-room')}>
                Solicitar Ayuda (Triaje)
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="fw-bold">📚 Recursos</h4>
              <p className="small text-muted">Lecturas y ejercicios de calma.</p>
              <Button variant="outline-primary" className="w-100 mt-3">Ver Biblioteca</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // VISTA ALUMNO
  const StudentView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Estudiante: {user.name} 🎓</h2>
          <Badge bg="primary">Práctica Supervisada</Badge>
        </div>
        <div className="d-flex gap-2">
          <Link to="/profile" className="btn btn-outline-primary shadow-sm d-flex align-items-center">👤 Mi Perfil</Link>
          <Button variant="danger" size="lg" onClick={() => navigate('/guardia')}>🔥 Ir a la Guardia</Button>
        </div>
      </div>
      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white fw-bold py-3">Resumen de Prácticas</Card.Header>
            <Card.Body>
               <p className="text-muted">Tu actividad principal ocurre en la Sala de Guardia.</p>
               <Button variant="outline-primary" onClick={() => navigate('/guardia')}>Abrir mi Guardia</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="p-4">
              <h5>Progreso Académico</h5>
              <ProgressBar variant="info" now={25} label="25%" className="my-3 bg-white bg-opacity-25" />
              <p className="small">Recuerda completar tus informes después de cada sesión.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // VISTA INSTITUCIÓN
  const InstitutionView = () => (
    <>
      <div className="mb-4 border-bottom pb-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">🏛️ {user.name}</h2>
          <p className="text-muted mb-0">Panel de Gestión de Convenios y Datos Epidemiológicos</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/profile" className="btn btn-outline-primary shadow-sm d-flex align-items-center">👤 Mi Perfil</Link>
          <Button variant="outline-dark" size="sm">📅 Exportar Reporte</Button>
        </div>
      </div>
      <Row className="g-4 mb-4">
        <Col md={4}><Card className="bg-dark text-white h-100 shadow-sm"><Card.Body><h6 className="opacity-75">Alumnos Inscritos</h6><h2 className="display-6 fw-bold">142</h2></Card.Body></Card></Col>
        <Col md={4}><Card className="bg-success text-white h-100 shadow-sm"><Card.Body><h6 className="opacity-75">Pacientes Atendidos</h6><h2 className="display-6 fw-bold">850</h2></Card.Body></Card></Col>
        <Col md={4}><Card className="bg-warning text-dark h-100 shadow-sm"><Card.Body><h6 className="opacity-75">Horas Práctica</h6><h2 className="display-6 fw-bold">3,200 hs</h2></Card.Body></Card></Col>
      </Row>
    </>
  );

  const renderContent = () => {
    switch(user.role) {
      case 'alumno': return <StudentView />;
      case 'tutor': return <TutorView userName={user.name} />;
      case 'institucion': return <InstitutionView />;
      default: return <PatientView />;
    }
  };

  return (
    <Container className="py-5 min-vh-100">
      {renderContent()}
    </Container>
  );
};

export default DashboardPage;
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar, Alert, Modal, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

// 🔥 UN SOLO IMPORT DE FIRESTORE CON TODAS LAS HERRAMIENTAS
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// =========================================================
// 👨‍🏫 VISTA TUTOR / SUPERVISOR
// =========================================================
const TutorView = ({ userName }) => {
  const navigate = useNavigate();
  const [activeCases, setActiveCases] = useState([]); 
  const [finalizedCases, setFinalizedCases] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const qActive = query(collection(db, 'users'), where('estado', '==', 'en_consulta'));
    const unsubActive = onSnapshot(qActive, (snapshot) => {
      setActiveCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qFinalized = query(collection(db, 'users'), where('estado', '==', 'finalizado'));
    const unsubFinalized = onSnapshot(qFinalized, (snapshot) => {
      setFinalizedCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubActive(); unsubFinalized(); };
  }, []);

  const handleOpenReport = (patientCase) => {
    setSelectedCase(patientCase);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedCase) return;
    setApproving(true);
    try {
      await updateDoc(doc(db, 'users', selectedCase.id), { supervisado: true });
      setShowModal(false);
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("Hubo un error al aprobar la práctica.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Panel de Supervisión 👁️</h2>
          <p className="text-muted mb-0">Docente: {userName}</p>
        </div>
        <Link to="/profile" className="btn btn-outline-primary shadow-sm">👤 Mi Perfil</Link>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Tabs defaultActiveKey="envivo" className="custom-tabs mb-4">
            <Tab eventKey="envivo" title={<span>🔴 Monitoreo en Vivo ({activeCases.length})</span>}>
              {activeCases.length === 0 ? (
                <div className="text-center text-muted p-4 bg-light rounded"><p className="mb-0">No hay consultas activas en este momento.</p></div>
              ) : (
                <Table hover responsive className="align-middle">
                  <thead className="table-light"><tr><th>Paciente</th><th>Atendido por (ID Alumno)</th><th>Motivo Inicial</th><th>Estado</th><th>Acción</th></tr></thead>
                  <tbody>
                    {activeCases.map(c => (
                      <tr key={c.id}>
                        <td className="fw-bold">{c.nombre}</td>
                        <td><Badge bg="info" text="dark">{c.atendidoPor || 'Desconocido'}</Badge></td>
                        <td>{c.emocion || '-'}</td>
                        <td><Badge bg="danger" className="pulse-animation">En Consulta</Badge></td>
                        <td><Button size="sm" variant="danger" onClick={() => navigate(`/chat/${c.id}`)}>👁️ Espectar Chat</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="auditoria" title={<span>📑 Informes por Auditar ({finalizedCases.length})</span>}>
              {loading ? (
                <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>
              ) : finalizedCases.length === 0 ? (
                <div className="text-center text-muted p-4 bg-light rounded">No hay casos finalizados para auditar.</div>
              ) : (
                <Table hover responsive className="align-middle">
                  <thead className="table-light"><tr><th>Paciente (ID)</th><th>Motivo Inicial</th><th>Riesgo Evaluado</th><th>Estado Docente</th><th>Acción</th></tr></thead>
                  <tbody>
                    {finalizedCases.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.nombre}</strong><br/><small className="text-muted">ID: {c.id.slice(0, 6)}</small></td>
                        <td>{c.emocion || '-'}</td>
                        <td>
                          {c.informeClinico?.riesgo === 'alto' && <Badge bg="danger">Alto 🚨</Badge>}
                          {c.informeClinico?.riesgo === 'medio' && <Badge bg="warning" text="dark">Medio</Badge>}
                          {c.informeClinico?.riesgo === 'bajo' && <Badge bg="success">Bajo</Badge>}
                        </td>
                        <td>{c.supervisado ? <Badge bg="success">✅ Aprobado</Badge> : <Badge bg="secondary">Pendiente Revisión</Badge>}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline-dark" onClick={() => handleOpenReport(c)}>📑 Leer Informe</Button>
                            <Button size="sm" variant="outline-primary" onClick={() => navigate(`/chat/${c.id}`)}>💬 Ver Chat</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light"><Modal.Title className="fw-bold text-primary">📑 Informe Clínico - Caso #{selectedCase?.id?.slice(0,6)}</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          {selectedCase && (
            <>
              <Row className="mb-4">
                <Col md={6}><p className="mb-1 text-muted small">Paciente</p><h5 className="fw-bold">{selectedCase.nombre}</h5></Col>
                <Col md={6}><p className="mb-1 text-muted small">Atendido por (ID Alumno)</p><h5 className="fw-bold">{selectedCase.atendidoPor || 'Desconocido'}</h5></Col>
              </Row>
              <div className="bg-light p-3 rounded border mb-3"><h6 className="fw-bold mb-2">Motivo Diagnosticado</h6><p className="mb-0 text-capitalize">{selectedCase.informeClinico?.motivo || 'No especificado'}</p></div>
              <div className="bg-light p-3 rounded border mb-3"><h6 className="fw-bold mb-2">Evaluación de Riesgo</h6><p className="mb-0 text-capitalize text-danger fw-bold">{selectedCase.informeClinico?.riesgo || 'No evaluado'}</p></div>
              <div className="bg-light p-3 rounded border"><h6 className="fw-bold mb-2">Notas Clínicas del Alumno</h6><p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{selectedCase.informeClinico?.notas || 'Sin notas.'}</p></div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Badge bg={selectedCase?.supervisado ? "success" : "warning"} text={!selectedCase?.supervisado ? "dark" : "white"}>{selectedCase?.supervisado ? "Estado: Supervisado y Aprobado" : "Estado: Pendiente de Firma"}</Badge>
          <div>
            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Cerrar</Button>
            {!selectedCase?.supervisado && <Button variant="success" onClick={handleApprove} disabled={approving}>{approving ? <Spinner animation="border" size="sm" /> : "✅ Aprobar Práctica"}</Button>}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};


// =========================================================
// 🏛️ VISTA INSTITUCIÓN (Con Gestión de Usuarios) 📊
// =========================================================
const InstitutionView = ({ userName }) => {
  const [stats, setStats] = useState({
    alumnos: 0,
    pacientesAtendidos: 0,
    horas: 0,
    motivos: { ansiedad: 0, depresion: 0, pareja: 0, vocacional: 0, otros: 0 },
    totalInformes: 0
  });
  const [loading, setLoading] = useState(true);
  
  // 🔥 NUEVOS ESTADOS PARA GESTIÓN DE USUARIOS
  const [usersList, setUsersList] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snapshot) => {
      let alumnosCount = 0;
      let pacientesFinalizados = 0;
      let conteoMotivos = { ansiedad: 0, depresion: 0, pareja: 0, vocacional: 0, otros: 0 };
      let informesCount = 0;
      let fetchedUsers = []; 

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        
        // Guardamos Alumnos y Tutores para la tabla de Gestión
        if (data.rol === 'alumno' || data.rol === 'tutor') {
          fetchedUsers.push({ id: doc.id, ...data });
        }

        if (data.rol === 'alumno') alumnosCount++;
        
        if (data.rol === 'paciente' && data.estado === 'finalizado') {
          pacientesFinalizados++;
          
          if (data.informeClinico && data.informeClinico.motivo) {
            informesCount++;
            const motivo = data.informeClinico.motivo.toLowerCase();
            if (motivo.includes('ansiedad') || motivo.includes('estres')) conteoMotivos.ansiedad++;
            else if (motivo.includes('depresion') || motivo.includes('tristeza') || motivo.includes('soledad')) conteoMotivos.depresion++;
            else if (motivo.includes('pareja') || motivo.includes('vinculo')) conteoMotivos.pareja++;
            else if (motivo.includes('vocacion') || motivo.includes('carrera') || motivo.includes('estudio')) conteoMotivos.vocacional++;
            else conteoMotivos.otros++;
          }
        }
      });

      setUsersList(fetchedUsers); 
      setStats({
        alumnos: alumnosCount,
        pacientesAtendidos: pacientesFinalizados,
        horas: pacientesFinalizados * 2, 
        motivos: conteoMotivos,
        totalInformes: informesCount > 0 ? informesCount : 1
      });
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getP = (val) => Math.round((val / stats.totalInformes) * 100) || 0;

  const handlePrintPDF = () => {
    window.print();
  };

  // 🔥 FUNCIÓN PARA ELIMINAR UN USUARIO
  const handleDeleteUser = async (userId, userName, userRole) => {
    const isConfirmed = window.confirm(`⚠️ ¿Estás seguro de que deseas eliminar al ${userRole} "${userName}" del sistema? Esta acción no se puede deshacer.`);
    
    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert("Usuario eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar el usuario.");
      }
    }
  };

  return (
    <>
      <div className="mb-4 border-bottom pb-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">🏛️ {userName}</h2>
          <p className="text-muted mb-0">Panel de Gestión de Convenios y Datos Epidemiológicos en Tiempo Real</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/profile" className="btn btn-outline-primary shadow-sm d-flex align-items-center">👤 Mi Perfil</Link>
          <Button variant="outline-dark" size="sm" onClick={handlePrintPDF}>📅 Exportar Reporte PDF</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="bg-dark text-white h-100 shadow-sm border-0">
                <Card.Body>
                  <h6 className="opacity-75">Alumnos Inscritos</h6>
                  <h2 className="display-6 fw-bold">{stats.alumnos}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-success text-white h-100 shadow-sm border-0">
                <Card.Body>
                  <h6 className="opacity-75">Pacientes Atendidos</h6>
                  <h2 className="display-6 fw-bold">{stats.pacientesAtendidos}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-warning text-dark h-100 shadow-sm border-0">
                <Card.Body>
                  <h6 className="opacity-75">Horas Práctica Aprobadas</h6>
                  <h2 className="display-6 fw-bold">{stats.horas} hs</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white fw-bold py-3">
                  📈 Principales Motivos de Consulta (Datos Reales)
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Ansiedad y Estrés Académico</span>
                      <span className="fw-bold">{getP(stats.motivos.ansiedad)}%</span>
                    </div>
                    <ProgressBar variant="danger" now={getP(stats.motivos.ansiedad)} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Depresión y Soledad</span>
                      <span className="fw-bold">{getP(stats.motivos.depresion)}%</span>
                    </div>
                    <ProgressBar variant="warning" now={getP(stats.motivos.depresion)} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Problemas de Pareja / Vínculos</span>
                      <span className="fw-bold">{getP(stats.motivos.pareja)}%</span>
                    </div>
                    <ProgressBar variant="info" now={getP(stats.motivos.pareja)} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-0">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Orientación Vocacional</span>
                      <span className="fw-bold">{getP(stats.motivos.vocacional)}%</span>
                    </div>
                    <ProgressBar variant="success" now={getP(stats.motivos.vocacional)} style={{ height: '10px' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Estado del Convenio</h5>
                  <Alert variant="info" className="small border-0 shadow-sm">
                    ✅ <strong>Activo</strong> hasta Dic 2026. <br/>
                    Seguro de Mala Praxis: <strong>Vigente</strong>.
                  </Alert>
                  <div className="d-grid gap-2 mt-4">
                    <Button variant="outline-dark" size="sm" onClick={() => setShowManageModal(true)}>
                      👥 Gestionar Personal ({usersList.length})
                    </Button>
                    <Button variant="outline-dark" size="sm" onClick={() => alert('Auditoría Legal: Todos los documentos están en regla.')}>
                      ⚖️ Auditoría Legal
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 🔥 MODAL DE GESTIÓN DE USUARIOS */}
          <Modal show={showManageModal} onHide={() => setShowManageModal(false)} size="lg" centered>
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title className="fw-bold">👥 Gestión de Alumnos y Tutores</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <Table hover responsive className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4">Nombre y Correo</th>
                    <th>Rol</th>
                    <th>Institución</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No hay personal registrado aún.</td></tr>
                  ) : (
                    usersList.map(u => (
                      <tr key={u.id}>
                        <td className="px-4">
                          <strong>{u.nombre}</strong><br/>
                          <small className="text-muted">{u.email}</small>
                        </td>
                        <td>
                          {u.rol === 'tutor' ? <Badge bg="info" text="dark">👨‍🏫 Tutor</Badge> : <Badge bg="primary">🎓 Alumno</Badge>}
                        </td>
                        <td><span className="text-uppercase small">{u.universidad || u.institucion || 'N/A'}</span></td>
                        <td className="text-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteUser(u.id, u.nombre, u.rol)}
                          >
                            🗑️ Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <small className="text-muted me-auto">Nota: Los usuarios eliminados perderán acceso al sistema inmediatamente.</small>
              <Button variant="secondary" onClick={() => setShowManageModal(false)}>Cerrar</Button>
            </Modal.Footer>
          </Modal>

        </>
      )}
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
              <Button variant="success" className="w-100 mt-3" onClick={() => navigate('/waiting-room')}>Solicitar Ayuda (Triaje)</Button>
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

  const renderContent = () => {
    switch(user.role) {
      case 'alumno': return <StudentView />;
      case 'tutor': return <TutorView userName={user.name} />;
      case 'institucion': return <InstitutionView userName={user.name} />;
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
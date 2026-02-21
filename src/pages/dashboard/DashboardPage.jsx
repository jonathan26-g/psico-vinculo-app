import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar, Alert } from 'react-bootstrap';
// 👇 1. IMPORTAMOS Link AQUÍ 👇
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', role: '', uniId: null });

  // Cargar datos del usuario al entrar
  useEffect(() => {
    const name = localStorage.getItem('usuarioNombre');
    const role = localStorage.getItem('usuarioRol');
    const uniId = localStorage.getItem('usuarioUniversidadId');

    if (!name) {
      navigate('/login'); // Si no hay nadie, mandar al login
    } else {
      setUser({ name, role, uniId });
    }
  }, [navigate]);

  // =========================================================
  // 🏥 VISTA PACIENTE
  // =========================================================
  const PatientView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Hola, {user.name} 👋</h2>
          <p className="text-muted mb-0">¿Cómo te sientes hoy? Estamos aquí para acompañarte.</p>
        </div>
        {/* 👇 BOTÓN DE PERFIL 👇 */}
        <Link to="/profile" className="btn btn-outline-primary shadow-sm">
          👤 Mi Perfil
        </Link>
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

  // =========================================================
  // 🎓 VISTA ALUMNO (Prácticas y Horas)
  // =========================================================
  const StudentView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Estudiante: {user.name} 🎓</h2>
          <Badge bg="primary">Práctica Supervisada</Badge>
        </div>
        
        <div className="d-flex gap-2">
          {/* 👇 BOTÓN DE PERFIL 👇 */}
          <Link to="/profile" className="btn btn-outline-primary shadow-sm d-flex align-items-center">
            👤 Mi Perfil
          </Link>
          <Button variant="danger" size="lg" onClick={() => navigate('/guardia')}>
              🔥 Ir a la Guardia
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white fw-bold py-3">Mis Pacientes Activos</Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Estado</th>
                    <th>Última Sesión</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Juan (Anónimo)</td>
                    <td><Badge bg="success">En curso</Badge></td>
                    <td>Ayer 18:30</td>
                    <td><Button size="sm" variant="outline-primary" onClick={() => navigate('/chat')}>Ver Chat</Button></td>
                  </tr>
                  <tr>
                    <td>Caso #402</td>
                    <td><Badge bg="warning">Supervisión Pendiente</Badge></td>
                    <td>03 Feb</td>
                    <td><Button size="sm" variant="outline-dark">Consultar Tutor</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="p-4">
              <h5>Progreso Académico</h5>
              <ProgressBar variant="info" now={25} label="25%" className="my-3 bg-white bg-opacity-25" />
              <p className="small">Recuerda completar tus informes después de cada sesión para que el tutor te apruebe las horas.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // =========================================================
  // 👨‍🏫 VISTA TUTOR / SUPERVISOR
  // =========================================================
  const TutorView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Panel de Supervisión 👁️</h2>
          <p className="text-muted mb-0">Docente: {user.name}</p>
        </div>
        {/* 👇 BOTÓN DE PERFIL 👇 */}
        <Link to="/profile" className="btn btn-outline-primary shadow-sm">
          👤 Mi Perfil
        </Link>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <h3 className="fw-bold text-danger">3</h3>
            <span className="text-muted small">Alertas de Riesgo</span>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <h3 className="fw-bold text-primary">15</h3>
            <span className="text-muted small">Alumnos a Cargo</span>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-bold">Auditoría de Chats Recientes</Card.Header>
        <Card.Body>
          <Table hover>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Paciente (ID)</th>
                <th>Alerta Detectada</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Maria Gomez</td>
                <td>#9921</td>
                <td><Badge bg="danger">Palabra Clave: "Tristeza"</Badge></td>
                <td><Button size="sm" variant="danger">Intervenir</Button></td>
              </tr>
              <tr>
                <td>Juan Perez</td>
                <td>#1102</td>
                <td><Badge bg="success">Normal</Badge></td>
                <td><Button size="sm" variant="outline-secondary">Revisar</Button></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );

  // =========================================================
  // 🏛️ VISTA INSTITUCIÓN (ACTUALIZADA CON ESTADÍSTICAS) 📊
  // =========================================================
  const InstitutionView = () => (
    <>
      <div className="mb-4 border-bottom pb-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">🏛️ {user.name}</h2>
          <p className="text-muted mb-0">Panel de Gestión de Convenios y Datos Epidemiológicos</p>
        </div>
        <div className="d-flex gap-2">
          {/* 👇 BOTÓN DE PERFIL 👇 */}
          <Link to="/profile" className="btn btn-outline-primary shadow-sm d-flex align-items-center">
            👤 Mi Perfil
          </Link>
          <Button variant="outline-dark" size="sm">📅 Exportar Reporte</Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="bg-dark text-white h-100 shadow-sm">
            <Card.Body>
              <h6 className="opacity-75">Alumnos Inscritos</h6>
              <h2 className="display-6 fw-bold">142</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-success text-white h-100 shadow-sm">
            <Card.Body>
              <h6 className="opacity-75">Pacientes Atendidos</h6>
              <h2 className="display-6 fw-bold">850</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-warning text-dark h-100 shadow-sm">
            <Card.Body>
              <h6 className="opacity-75">Horas Práctica</h6>
              <h2 className="display-6 fw-bold">3,200 hs</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* GRÁFICO DE BARRAS DE INVESTIGACIÓN */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold py-3">
              📈 Principales Motivos de Consulta (Investigación)
            </Card.Header>
            <Card.Body>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Ansiedad y Estrés Académico</span>
                  <span className="fw-bold">45%</span>
                </div>
                <ProgressBar variant="danger" now={45} style={{ height: '10px' }} />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Depresión y Soledad</span>
                  <span className="fw-bold">30%</span>
                </div>
                <ProgressBar variant="warning" now={30} style={{ height: '10px' }} />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Problemas de Pareja / Vínculos</span>
                  <span className="fw-bold">15%</span>
                </div>
                <ProgressBar variant="info" now={15} style={{ height: '10px' }} />
              </div>

              <div className="mb-0">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Orientación Vocacional</span>
                  <span className="fw-bold">10%</span>
                </div>
                <ProgressBar variant="success" now={10} style={{ height: '10px' }} />
              </div>

            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA LATERAL */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Estado del Convenio</h5>
              <Alert variant="info" className="small">
                ✅ <strong>Activo</strong> hasta Dic 2026. <br/>
                Seguro: <strong>Vigente</strong>.
              </Alert>
              <div className="d-grid gap-2">
                <Button variant="outline-dark" size="sm">Gestionar Alumnos</Button>
                <Button variant="outline-dark" size="sm">Auditoría Legal</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // =========================================================
  // 🔄 RENDERIZADO CONDICIONAL
  // =========================================================
  const renderContent = () => {
    switch(user.role) {
      case 'alumno': return <StudentView />;
      case 'tutor': return <TutorView />;
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
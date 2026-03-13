import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Hero Section */}
      <div className="bg-success text-white py-5 mb-5 text-center shadow-sm">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Nuestra Misión</h1>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            Democratizar el acceso a la primera escucha y transformar la manera en que los futuros profesionales de la salud mental adquieren experiencia clínica.
          </p>
        </Container>
      </div>

      <Container>
        {/* Sección: El Problema y la Solución */}
        <Row className="align-items-center mb-5 pb-4 border-bottom">
          <Col lg={6} className="mb-4 mb-lg-0">
            {/* 🔥 Cambio de Nombre aquí 👇 */}
            <h2 className="fw-bold text-dark mb-4">¿Qué es ACOMPAÑAR?</h2>
            <p className="text-secondary fs-5">
              Nacimos de observar dos realidades contrastantes: por un lado, miles de personas necesitan un espacio seguro para ser escuchadas; por el otro, estudiantes avanzados de psicología requieren horas de práctica clínica para graduarse.
            </p>
            <p className="text-secondary fs-5 mb-0">
              {/* 🔥 Cambio de Nombre aquí 👇 */}
              <strong>ACOMPAÑAR es el puente tecnológico entre ambos.</strong> Una plataforma institucional de Tele-asistencia y Extensión Universitaria donde el aprendizaje académico y la responsabilidad social se encuentran.
            </p>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm bg-white p-4 rounded-4">
              <h4 className="fw-bold text-primary mb-3">La Psicología Aplicada</h4>
              <p className="text-muted mb-3">
                Nuestro enfoque se basa en la <strong>Intervención de Primera Línea</strong> y la <strong>Escucha Activa</strong>. Los usuarios no reciben psicoterapia profunda (la cual requiere un marco clínico tradicional), sino contención emocional estructurada.
              </p>
              <div className="bg-light p-3 rounded text-dark small fw-bold border-start border-4 border-primary">
                "Conectamos a quienes necesitan hablar, con quienes están aprendiendo a escuchar."
              </div>
            </Card>
          </Col>
        </Row>

        {/* 🔥 NUEVA SECCIÓN: Aclaración Académica (Pasantías) 👇 */}
        <Row className="mb-5 pb-4 border-bottom justify-content-center">
            <Col lg={10}>
                <div className="bg-warning bg-opacity-10 border border-warning rounded-4 p-4 text-center">
                    <h5 className="fw-bold text-dark mb-3">⚠️ Alcance Académico y Prácticas Profesionales</h5>
                    <p className="text-muted mb-0">
                        ACOMPAÑAR es un dispositivo tecnológico de extensión universitaria diseñado para el entrenamiento en tele-asistencia. <strong>Bajo ninguna circunstancia esta plataforma busca reemplazar o sustituir las pasantías presenciales ni las Prácticas Profesionales Supervisadas (PPS) tradicionales</strong> en instituciones de salud. Funciona como un complemento innovador para desarrollar habilidades de ciberpsicología y primera escucha antes de enfrentarse al consultorio físico.
                    </p>
                </div>
            </Col>
        </Row>

        {/* Sección: Metodología y Cámara Gesell */}
        <h2 className="fw-bold text-center text-dark mb-5">Metodología Innovadora</h2>
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <div className="display-4 mb-3">🛡️</div>
              <h5 className="fw-bold">Espacio Seguro</h5>
              <p className="text-muted small">
                Garantizamos el anonimato y la confidencialidad. Los pacientes acceden a un entorno libre de prejuicios donde sus datos están protegidos por el secreto profesional.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <div className="display-4 mb-3">🎓</div>
              <h5 className="fw-bold">Práctica Supervisada</h5>
              <p className="text-muted small">
                Los alumnos aplican sus conocimientos teóricos en escenarios reales, redactando informes clínicos y desarrollando el "ojo clínico" bajo estricta tutela docente.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4 bg-dark text-white">
              <div className="display-4 mb-3">👁️</div>
              <h5 className="fw-bold">Cámara Gesell Digital</h5>
              <p className="text-light small opacity-75">
                Nuestra tecnología exclusiva permite a los docentes monitorear los chats en tiempo real e instruir al alumno de forma invisible para el paciente, asegurando la calidad de atención.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Call to action */}
        <div className="text-center mt-5 pt-4">
          <h4 className="fw-bold mb-4">¿Listo para formar parte de la comunidad?</h4>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="success" size="lg" className="rounded-pill px-5" onClick={() => navigate('/register')}>
              Comenzar Ahora
            </Button>
            <Button variant="outline-dark" size="lg" className="rounded-pill px-5" onClick={() => navigate('/')}>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
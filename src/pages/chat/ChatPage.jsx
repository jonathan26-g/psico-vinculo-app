import React from 'react';
import { Container, Card, Button, Form, Badge } from 'react-bootstrap'; // Agregamos Badge
import { Link } from 'react-router-dom';

const ChatPage = () => {
  // 1. RECUPERAMOS EL ROL
  const userRole = localStorage.getItem('usuarioRol');

  return (
    <Container className="py-5 mt-5">
      
      {/* Botón Volver */}
      <div className="mb-4">
        <Link to="/dashboard" className="text-decoration-none text-muted">
          ← Volver al Panel
        </Link>
      </div>

      <Card className="shadow-sm border-0" style={{ height: '70vh' }}>
        
        {/* --- CABECERA INTELIGENTE --- */}
        <Card.Header className={`py-3 text-white ${userRole === 'tutor' ? 'bg-primary' : 'bg-success'}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">
                {userRole === 'tutor' ? '👁️ Auditoría de Sesión' : '💬 Sala de Vínculo'}
              </h5>
              <small>
                {userRole === 'tutor' 
                  ? 'Supervisando a: Alumno Juan Perez (Caso #42)' 
                  : 'Conectado con: Estudiante Asignado'}
              </small>
            </div>
            {userRole === 'tutor' && <Badge bg="warning" text="dark">Modo Supervisor</Badge>}
          </div>
        </Card.Header>
        
        {/* --- ÁREA DE MENSAJES (SIMULACIÓN) --- */}
        <Card.Body className="bg-light overflow-auto">
          <div className="d-flex flex-column gap-3">
            
            {/* Mensaje del Paciente */}
            <div className="align-self-start bg-white p-3 rounded shadow-sm" style={{maxWidth: '70%'}}>
              <small className="text-muted d-block mb-1 fw-bold">Paciente (Ana)</small>
              Hola, hoy tuve un día un poco difícil, sentí mucha ansiedad en el trabajo.
            </div>

            {/* Mensaje del Alumno */}
            <div className="align-self-end text-white p-3 rounded shadow-sm" style={{maxWidth: '70%', backgroundColor: '#198754'}}>
              <small className="text-light d-block mb-1 fw-bold text-end">Alumno (Juan)</small>
              Entiendo, Ana. ¿Hubo algún evento específico que detonara esa sensación?
            </div>

             {/* Mensaje del Paciente */}
             <div className="align-self-start bg-white p-3 rounded shadow-sm" style={{maxWidth: '70%'}}>
              <small className="text-muted d-block mb-1 fw-bold">Paciente (Ana)</small>
              Creo que fue cuando mi jefe me pidió el reporte... sentí que no llegaba.
            </div>

            {/* NOTA DEL SISTEMA (Solo visible para el tutor, simulado) */}
            {userRole === 'tutor' && (
              <div className="align-self-center my-2">
                <Badge bg="secondary">El alumno tarda en responder...</Badge>
              </div>
            )}

          </div>
        </Card.Body>

        {/* --- PIE DE PÁGINA (INPUT) --- */}
        <Card.Footer className="bg-white p-3">
          
          {userRole === 'tutor' ? (
            // VISTA DEL TUTOR: No chatea, envía Feedback
            <div className="border-top border-warning pt-2">
              <small className="text-muted fw-bold mb-2 d-block">📝 Feedback Privado para el Alumno:</small>
              <Form className="d-flex gap-2">
                <Form.Control 
                  type="text" 
                  placeholder="Ej: Buena pregunta, profundiza en eso..." 
                  style={{borderLeft: '4px solid #ffc107'}}
                />
                <Button variant="primary">Enviar Nota</Button>
                <Button variant="danger" title="Intervenir en urgencia">⚠️</Button>
              </Form>
            </div>
          ) : (
            // VISTA NORMAL (Alumno/Paciente)
            <Form className="d-flex gap-2">
              <Form.Control type="text" placeholder="Escribe tu mensaje aquí..." />
              <Button variant="success">Enviar</Button>
            </Form>
          )}

        </Card.Footer>
      </Card>

    </Container>
  );
};

export default ChatPage;
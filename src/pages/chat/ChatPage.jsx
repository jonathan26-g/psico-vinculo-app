import React from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  return (
    <Container className="py-5 mt-5">
      
      {/* Botón Volver */}
      <div className="mb-4">
        <Link to="/dashboard" className="text-decoration-none text-muted">
          ← Volver al Panel
        </Link>
      </div>

      <Card className="shadow-sm border-0" style={{ height: '70vh' }}>
        <Card.Header className="bg-success text-white py-3">
          <h5 className="mb-0 fw-bold">💬 Sala de Vínculo</h5>
          <small>Conectado con: Estudiante Asignado</small>
        </Card.Header>
        
        {/* Área de Mensajes (Simulada) */}
        <Card.Body className="bg-light overflow-auto">
          <div className="d-flex flex-column gap-3">
            
            {/* Mensaje Recibido */}
            <div className="align-self-start bg-white p-3 rounded shadow-sm" style={{maxWidth: '70%'}}>
              <small className="text-muted d-block mb-1">Estudiante</small>
              Hola, ¿cómo te sientes hoy? Estoy aquí para escucharte.
            </div>

            {/* Mensaje Enviado */}
            <div className="align-self-end bg-success text-white p-3 rounded shadow-sm" style={{maxWidth: '70%'}}>
              Hola, hoy tuve un día un poco difícil...
            </div>

          </div>
        </Card.Body>

        {/* Input para escribir */}
        <Card.Footer className="bg-white p-3">
          <Form className="d-flex gap-2">
            <Form.Control type="text" placeholder="Escribe tu mensaje aquí..." />
            <Button variant="success">Enviar</Button>
          </Form>
        </Card.Footer>
      </Card>

    </Container>
  );
};

export default ChatPage;
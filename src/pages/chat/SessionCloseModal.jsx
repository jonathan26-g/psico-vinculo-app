import React, { useState } from 'react';
import { Modal, Button, Form, Badge, Alert } from 'react-bootstrap';


const SessionCloseModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    motivo: '',
    riesgo: 'bajo',
    notas: ''
  });

  const handleSubmit = () => {
    // AQUÍ es donde enviaríamos la data al Backend en el futuro
    console.log("Datos Guardados para Estadística:", formData);
    
    // Mostramos una alerta (simulada)
    alert("✅ Informe guardado con éxito. Las horas se acreditaron a tu perfil.");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>📋 Informe de Cierre de Sesión</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="text-muted small">
          Completa este breve informe para validar tus horas de práctica y ayudar a la estadística de la Universidad.
        </p>

        <Form>
          {/* 1. ETIQUETADO DE DATOS (Lo que alimenta el gráfico de barras) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Motivo Principal de Consulta</Form.Label>
            <Form.Select 
              value={formData.motivo}
              onChange={(e) => setFormData({...formData, motivo: e.target.value})}
            >
              <option value="">Seleccionar etiqueta...</option>
              <option value="ansiedad">Ansiedad / Estrés Académico</option>
              <option value="depresion">Depresión / Tristeza / Soledad</option>
              <option value="vinculos">Problemas de Pareja / Familia</option>
              <option value="vocacional">Orientación Vocacional</option>
              <option value="violencia">Violencia / Abuso (Alerta)</option>
            </Form.Select>
          </Form.Group>

          {/* 2. NIVEL DE RIESGO (Semáforo) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nivel de Riesgo Percibido</Form.Label>
            <div className="d-flex gap-2">
              {['bajo', 'medio', 'alto'].map((nivel) => (
                <Button 
                  key={nivel}
                  variant={formData.riesgo === nivel ? (nivel === 'alto' ? 'danger' : nivel === 'medio' ? 'warning' : 'success') : 'outline-secondary'}
                  size="sm"
                  className="text-capitalize flex-grow-1"
                  onClick={() => setFormData({...formData, riesgo: nivel})}
                >
                  {nivel} {nivel === 'alto' && '🚨'}
                </Button>
              ))}
            </div>
            {formData.riesgo === 'alto' && (
              <Alert variant="danger" className="mt-2 py-2 small">
                ⚠️ <strong>Protocolo:</strong> Debes notificar al Supervisor inmediatamente.
              </Alert>
            )}
          </Form.Group>

          {/* 3. NOTAS PRIVADAS (Para supervisión) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Notas Clínicas Breves</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Resumen técnico para el supervisor (No visible para la Universidad)..."
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!formData.motivo} // No deja guardar si no eligió motivo
        >
          Guardar e Informar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionCloseModal;
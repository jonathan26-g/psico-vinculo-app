import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
// 🔥 1. IMPORTAMOS FIREBASE Y ROUTER
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const SessionCloseModal = ({ show, handleClose, patientId }) => { // 👈 2. IMPORTANTE: Recibimos patientId
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    motivo: '',
    riesgo: 'bajo',
    notas: ''
  });

  const handleSubmit = async () => {
    // Validación de seguridad
    if (!patientId) {
        alert("Error técnico: No se identificó el ID del paciente.");
        return;
    }

    setLoading(true);

    try {
      // 3. 📝 GUARDAMOS EN FIREBASE
      const patientRef = doc(db, "users", patientId);
      
      await updateDoc(patientRef, {
        estado: 'finalizado', // 🏁 ESTADO MÁGICO: Lo saca de tus listas activas
        fechaFinAtencion: new Date().toISOString(),
        informeClinico: {
            motivo: formData.motivo,
            riesgo: formData.riesgo,
            notas: formData.notas,
            alumno: localStorage.getItem('usuarioNombre') || 'Estudiante'
        }
      });

      console.log("Informe guardado y paciente finalizado.");
      
      // 4. FLUJO DE SALIDA
      handleClose(); // Cerramos el modal
      navigate('/guardia'); // 🚀 NOS LLEVAMOS AL ALUMNO A LA GUARDIA

    } catch (error) {
      console.error("Error al guardar informe:", error);
      alert("Hubo un error al guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
          {/* 1. ETIQUETADO DE DATOS */}
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

          {/* 2. NIVEL DE RIESGO */}
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

          {/* 3. NOTAS PRIVADAS */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Notas Clínicas Breves</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Resumen técnico para el supervisor..."
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!formData.motivo || loading} // Bloqueado si carga o falta motivo
        >
          {loading ? 'Guardando...' : 'Guardar e Informar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionCloseModal;
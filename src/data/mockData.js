// src/data/mockData.js

// Simulamos que estas Universidades ya existen en el sistema
export const UNIVERSIDADES_AUTORIZADAS = [
  { id: 1, nombre: 'Universidad Nacional de Tucumán (UNT)', dominio: 'unt.edu.ar' },
  { id: 2, nombre: 'Universidad del Norte Santo Tomás de Aquino (UNSTA)', dominio: 'unsta.edu.ar' },
  { id: 3, nombre: 'Universidad Tecnológica Nacional (UTN)', dominio: 'frt.utn.edu.ar' }
];

// Simulamos la "Lista Blanca" que cargaron las universidades
// Si el email del alumno NO está aquí, no podrá registrarse.
export const EMAILS_ALUMNOS_PERMITIDOS = [
  { email: 'juan.perez@alu.unt.edu.ar', universidadId: 1, nombre: 'Juan Perez' },
  { email: 'maria.gomez@unsta.edu.ar', universidadId: 2, nombre: 'Maria Gomez' },
  { email: 'tu.email@prueba.com', universidadId: 1, nombre: 'Tu Nombre (Test)' } // Agregate a ti mismo para probar
];

// Supervisores habilitados (pueden estar en varias universidades)
export const SUPERVISORES_PERMITIDOS = [
  { email: 'profesor.garcia@unt.edu.ar', universidadesIds: [1, 3] }, // Trabaja en UNT y UTN
  { email: 'dra.martinez@consultorio.com', universidadesIds: [2] }
];
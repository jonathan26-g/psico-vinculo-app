import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tus componentes
import NavbarC from './components/navbar/NavbarC';
import FooterC from './components/footer/FooterC';

import HomePage from './pages/home/HomePage'; 
import RegisterSelection from './pages/auth/RegisterSelection';
import StudentRegister from './pages/auth/StudentRegister';
import PatientRegister from './pages/auth/PatientRegister';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import InstitutionRegister from './pages/auth/InstitutionRegister';
import ChatPage from './pages/chat/ChatPage';

function App() {
  return (
    <Router>
      <NavbarC />
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterSelection />} />
          
          {/* REGISTROS ESPECÍFICOS */}
          <Route path="/register/student" element={<StudentRegister />} />    
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/institution" element={<InstitutionRegister />} />

          <Route path="/login" element={<LoginPage />} />

          {/* 👇 AQUÍ ESTÁ EL ARREGLO: Agregamos las rutas de roles 👇 */}
          {/* Ruta General (Paciente) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Rutas Nuevas (Apuntan al mismo Dashboard por ahora para que no falle) */}
          <Route path="/dashboard/tutor" element={<DashboardPage />} />
          <Route path="/dashboard/alumno" element={<DashboardPage />} />
          <Route path="/dashboard/institucion" element={<DashboardPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
      <FooterC />
    </Router>
  );
}

export default App;
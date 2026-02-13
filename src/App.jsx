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
import WaitingRoom from './pages/chat/WaitingRoom'; // ✅ Importado correctamente
import StudentDashboard from './pages/dashboard/StudentDashboard';

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

          {/* DASHBOARDS (Por ahora todos van al mismo, luego los separaremos) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/tutor" element={<DashboardPage />} />
          <Route path="/dashboard/alumno" element={<DashboardPage />} />
          <Route path="/dashboard/institucion" element={<DashboardPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* ZONA DE CHAT Y EMERGENCIA */}
         // El ":roomId" es la llave de seguridad. Sin ella, no hay chat.
          <Route path="/chat/:roomId" element={<ChatPage />} /> 
          <Route path="/waiting-room" element={<WaitingRoom />} /> 

          {/* RUTA DE LA GUARDIA (PANEL DE ALUMNO) */}
<Route path="/guardia" element={<StudentDashboard />} />
        </Routes>
      </div>
      <FooterC />
    </Router>
  );
}

export default App;
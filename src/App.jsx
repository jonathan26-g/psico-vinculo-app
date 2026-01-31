import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tus componentes
import NavbarC from './components/navbar/NavbarC';
import FooterC from './components/footer/FooterC';

// OJO AL CAMBIO DE RUTA AQUÍ: agregamos /home/
import HomePage from './pages/home/HomePage'; 
import RegisterSelection from './pages/auth/RegisterSelection';
import StudentRegister from './pages/auth/StudentRegister';
import PatientRegister from './pages/auth/PatientRegister';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';



function App() {
  return (
    <Router>
      <NavbarC />
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterSelection />} />
          {/* NUEVA RUTA DE ALUMNO */}
          <Route path="/register/student" element={<StudentRegister />} />    
          {/* NUEVA RUTA PARA PACIENTES */}
          <Route path="/register/patient" element={<PatientRegister />} />



          {/* 2. AGREGAR ESTA RUTA */}
          <Route path="/login" element={<LoginPage />} />


          {/* NUEVA RUTA DEL PANEL DE CONTROL */}
          <Route path="/dashboard" element={<DashboardPage />} />
       
        </Routes>
      </div>
      <FooterC />
    </Router>
  );
}

export default App;

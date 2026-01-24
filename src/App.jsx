import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tus componentes
import NavbarC from './components/navbar/NavbarC';
import FooterC from './components/footer/FooterC';

// OJO AL CAMBIO DE RUTA AQUÍ: agregamos /home/
import HomePage from './pages/home/HomePage'; 

function App() {
  return (
    <Router>
      <NavbarC />
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <FooterC />
    </Router>
  );
}

export default App;

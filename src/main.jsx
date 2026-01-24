import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// IMPORTANTE: Bootstrap debe ir aquí
import 'bootstrap/dist/css/bootstrap.min.css';

// Opcional: tus estilos globales si los tienes
import './index.css' 

// Fíjate aquí abajo: agregamos "ReactDOM." antes de createRoot
ReactDOM.createRoot(document.getElementById('root')).render(
  // Y agregamos "React." antes de StrictMode
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// 1. Importamos las herramientas de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Base de datos
import { getAuth } from "firebase/auth";           // Login

// 2. TUS LLAVES REALES (Las que me pasaste)
const firebaseConfig = {
  apiKey: "AIzaSyAoeREIcRZVImuC4dd4TmSVgDgTQAbwcx4",
  authDomain: "psico-vinculo-app.firebaseapp.com",
  projectId: "psico-vinculo-app",
  storageBucket: "psico-vinculo-app.firebasestorage.app",
  messagingSenderId: "607335243015",
  appId: "1:607335243015:web:c5b39e312dfef054e0b9a2"
};

// 3. Inicializamos la App
const app = initializeApp(firebaseConfig);

// 4. Preparamos y exportamos las herramientas para usarlas
const db = getFirestore(app); // La base de datos lista
const auth = getAuth(app);    // El sistema de login listo

export { db, auth };
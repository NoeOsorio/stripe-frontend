import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import SuccessPage from "./SuccessPage";
import logo from "./logo-noeosorio.png";
import "./App.css"; // Asegúrate de tener este archivo para estilos globales

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <img src={logo} alt="Logo Empresa" className="logo" />
        </header>
        <Routes>
          <Route path="/" element={<PaymentForm />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

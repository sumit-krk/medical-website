import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="logo-title">HealthCare Plus Clinic</h1>
            <p className="logo-subtitle">Dedicated to Your Well-being</p>
          </div>
        </div>
        <nav className="nav-menu">
          <a href="#home">Home</a>
          <a href="#departments">Specialties</a>
          <a href="#doctors">Our Team</a>
          <a href="#contact">Get in Touch</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
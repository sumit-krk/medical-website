import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = ({ onOpenChat }) => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-title">Professional Healthcare Services</h2>
          <p className="hero-subtitle">
            Advanced medical facilities staffed by experienced healthcare professionals across various specialties
          </p>
          <button className="hero-button" onClick={onOpenChat}>
            Schedule Your Visit <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
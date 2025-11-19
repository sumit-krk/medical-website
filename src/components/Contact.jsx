import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <h2 className="section-title">Contact Our Clinic</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">
              <Phone size={24} />
            </div>
            <h3 className="contact-title">Phone Number</h3>
            <p className="contact-text">+1 (555) 123-4567</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">
              <Mail size={24} />
            </div>
            <h3 className="contact-title">Email Address</h3>
            <p className="contact-text">contact@HealthCareplus.com</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">
              <MapPin size={24} />
            </div>
            <h3 className="contact-title">Clinic Location</h3>
            <p className="contact-text">123 Healthcare Avenue, Medical Center, USA</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
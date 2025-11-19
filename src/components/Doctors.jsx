import React from 'react';

const Doctors = () => {
  const medicalProfessionals = [
    { name: 'Dr. Benjamin', specialty: 'Cardiology', experience: '15 years practice', image: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Dr. Amelia', specialty: 'Neurology', experience: '12 years practice', image: 'https://i.pravatar.cc/150?img=45' },
    { name: 'Dr. Salvador', specialty: 'Orthopedics', experience: '18 years practice', image: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Dr. Sophia', specialty: 'Ophthalmology', experience: '10 years practice', image: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Dr. Mateo', specialty: 'General Medicine', experience: '20 years practice', image: 'https://i.pravatar.cc/150?img=51' }
  ];

  return (
    <section id="doctors" className="doctors-section">
      <div className="section-container">
        <h2 className="section-title">Our Medical Team</h2>
        <p className="section-subtitle">Skilled healthcare providers committed to your health and wellness</p>
        <div className="doctors-grid">
          {medicalProfessionals.map((professional, idx) => (
            <div key={idx} className="doctor-card">
              <img src={professional.image} alt={professional.name} className="doctor-image" />
              <div className="doctor-info">
                <h3 className="doctor-name">{professional.name}</h3>
                <p className="doctor-dept">{professional.specialty}</p>
                <p className="doctor-exp">{professional.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
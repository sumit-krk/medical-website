import React from 'react';

const Stats = () => {
  const stats = [
    { number: '500+', label: 'Medical Professionals' },
    { number: '50K+', label: 'Satisfied Patients' },
    { number: '25+', label: 'Medical Specialties' },
    { number: '15+', label: 'Years Serving Community' }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
import React from 'react';
import { Heart, Brain, Bone, Eye, Stethoscope } from 'lucide-react';

const Departments = () => {
  const medicalSpecialties = [
    { name: 'Cardiology', icon: Heart, color: 'bg-red-100 text-red-600', desc: 'Comprehensive Heart Care' },
    { name: 'Neurology', icon: Brain, color: 'bg-purple-100 text-purple-600', desc: 'Brain & Nerve Disorders' },
    { name: 'Orthopedics', icon: Bone, color: 'bg-blue-100 text-blue-600', desc: 'Musculoskeletal Treatment' },
    { name: 'Ophthalmology', icon: Eye, color: 'bg-green-100 text-green-600', desc: 'Vision & Eye Health' },
    { name: 'General Medicine', icon: Stethoscope, color: 'bg-yellow-100 text-yellow-600', desc: 'Primary Healthcare' }
  ];

  return (
    <section id="departments" className="departments-section">
      <div className="section-container">
        <h2 className="section-title">Our Medical Specialties</h2>
        <p className="section-subtitle">Complete healthcare services covering various medical fields</p>
        <div className="departments-grid">
          {medicalSpecialties.map((specialty, idx) => (
            <div key={idx} className="department-card">
              <div className={`department-icon ${specialty.color}`}>
                <specialty.icon size={32} />
              </div>
              <h3 className="department-name">{specialty.name}</h3>
              <p className="department-desc">{specialty.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;
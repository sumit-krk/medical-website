import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, MapPin, Clock, ChevronRight, Stethoscope, Heart, Brain, Bone, Eye } from 'lucide-react';
import './App.css';

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'नमस्ते! मैं MediCare Plus का AI assistant हूं। मैं आपकी appointment booking में मदद कर सकता हूं। आप किस तरह की medical help चाहते हैं?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const departments = [
    { name: 'Cardiology', icon: Heart, color: 'bg-red-100 text-red-600', desc: 'Heart & Vascular Care' },
    { name: 'Neurology', icon: Brain, color: 'bg-purple-100 text-purple-600', desc: 'Brain & Nervous System' },
    { name: 'Orthopedics', icon: Bone, color: 'bg-blue-100 text-blue-600', desc: 'Bones & Joints' },
    { name: 'Ophthalmology', icon: Eye, color: 'bg-green-100 text-green-600', desc: 'Eye Care' },
    { name: 'General Medicine', icon: Stethoscope, color: 'bg-yellow-100 text-yellow-600', desc: 'Primary Care' }
  ];

  const doctors = [
    { name: 'Dr. Rajesh Kumar', dept: 'Cardiologist', exp: '15 years', image: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Dr. Priya Sharma', dept: 'Neurologist', exp: '12 years', image: 'https://i.pravatar.cc/150?img=45' },
    { name: 'Dr. Amit Patel', dept: 'Orthopedic', exp: '18 years', image: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Dr. Sneha Verma', dept: 'Ophthalmologist', exp: '10 years', image: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Dr. Vikram Singh', dept: 'General Physician', exp: '20 years', image: 'https://i.pravatar.cc/150?img=51' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful medical appointment booking assistant for MediCare Plus hospital. Your role is to:
1. Help patients book appointments with doctors
2. Answer questions about departments, doctors, and services
3. Collect necessary information: full name, phone number, email, preferred date/time
4. Provide available appointment slots
5. Confirm bookings with a confirmation code

Available Departments:
- Cardiology (Dr. Rajesh Kumar - 15 years exp)
- Neurology (Dr. Priya Sharma - 12 years exp)
- Orthopedics (Dr. Amit Patel - 18 years exp)
- Ophthalmology (Dr. Sneha Verma - 10 years exp)
- General Medicine (Dr. Vikram Singh - 20 years exp)

Available time slots: 9:00 AM to 6:00 PM (Monday to Saturday)
Consultation types: General (30 min), Specialist (45 min), Follow-up (20 min)

Insurance accepted: Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare
Contact: (555) 123-4567 | info@medicareplus.com

Be conversational, empathetic, and helpful. Ask one question at a time. Use both English and Hindi as needed to make patients comfortable.`,
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;
      
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'माफ़ करें, कुछ technical issue है। कृपया बाद में try करें या हमें (555) 123-4567 पर call करें।' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="logo-title">MediCare Plus</h1>
              <p className="logo-subtitle">Your Health, Our Priority</p>
            </div>
          </div>
          <nav className="nav-menu">
            <a href="#home">Home</a>
            <a href="#departments">Departments</a>
            <a href="#doctors">Doctors</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h2 className="hero-title">Expert Care, Every Time</h2>
            <p className="hero-subtitle">World-class medical facilities with experienced doctors across multiple specialties</p>
            <button className="hero-button">
              Book Appointment <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Expert Doctors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">25+</div>
            <div className="stat-label">Departments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="departments-section">
        <div className="section-container">
          <h2 className="section-title">Our Departments</h2>
          <p className="section-subtitle">Comprehensive healthcare services across specialties</p>
          <div className="departments-grid">
            {departments.map((dept, idx) => (
              <div key={idx} className="department-card">
                <div className={`department-icon ${dept.color}`}>
                  <dept.icon size={32} />
                </div>
                <h3 className="department-name">{dept.name}</h3>
                <p className="department-desc">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="doctors-section">
        <div className="section-container">
          <h2 className="section-title">Our Expert Doctors</h2>
          <p className="section-subtitle">Experienced medical professionals dedicated to your care</p>
          <div className="doctors-grid">
            {doctors.map((doctor, idx) => (
              <div key={idx} className="doctor-card">
                <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-dept">{doctor.dept}</p>
                  <p className="doctor-exp">{doctor.exp} Experience</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <h3 className="contact-title">Phone</h3>
              <p className="contact-text">(555) 123-4567</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <h3 className="contact-title">Email</h3>
              <p className="contact-text">info@medicareplus.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <h3 className="contact-title">Location</h3>
              <p className="contact-text">123 Health Street, Medical District</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 MediCare Plus. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="chat-button">
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="chat-title">MediCare Assistant</h3>
                <p className="chat-status">Online</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="chat-close">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-bubble assistant">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="chat-send"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
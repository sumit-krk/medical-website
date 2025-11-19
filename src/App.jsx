import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';
import './App.css';

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: 'Welcome! I am your virtual healthcare assistant from HealthCare Plus Clinic. How can I assist you with scheduling your medical appointment today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    date: '',
    time: ''
  });

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Utility functions
  const createTimeSlots = useCallback(() => {
    const slots = [];
    const startMinutes = 9 * 60;
    const endMinutes = 17 * 60;
    const slotInterval = 30;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += slotInterval) {
      const hourValue = Math.floor(minutes / 60);
      const minuteValue = minutes % 60;
      const timePeriod = hourValue >= 12 ? 'PM' : 'AM';
      const displayHour = hourValue % 12 || 12;
      const formattedTime = `${displayHour}:${minuteValue.toString().padStart(2, '0')} ${timePeriod}`;
      slots.push(formattedTime);
    }
    return slots;
  }, []);

  const createAvailableDates = useCallback(() => {
    const dateOptions = [];
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    
    for (let dayCount = 1; dayCount <= 30; dayCount++) {
      const newDate = new Date(nextDay);
      newDate.setDate(nextDay.getDate() + (dayCount - 1));
      
      if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
        dateOptions.push({
          date: newDate.toISOString().split('T')[0],
          shortDisplay: newDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          longDisplay: newDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric',
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    return dateOptions;
  }, []);

  const timeSlots = createTimeSlots();
  const availableDates = createAvailableDates();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Extract booking information from conversation
  const getBookingDetails = useCallback((userInput, aiResponse) => {
    const currentData = { ...bookingData };

    // Get patient name
    if (!currentData.name && userInput.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/)) {
      const namePattern = userInput.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/);
      if (namePattern) currentData.name = namePattern[0];
    }

    // Get contact number
    if (!currentData.phone && userInput.match(/\d{10}/)) {
      const phonePattern = userInput.match(/\d{10}/);
      if (phonePattern) currentData.phone = phonePattern[0];
    }

    // Get email address
    if (!currentData.email && userInput.match(/[\w.-]+@[\w.-]+\.\w+/)) {
      const emailPattern = userInput.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailPattern) currentData.email = emailPattern[0];
    }

    // Identify medical department
    const departmentOptions = ['cardiology', 'neurology', 'orthopedics', 'ophthalmology', 'general medicine', 'pediatrics', 'dermatology'];
    const inputLower = userInput.toLowerCase();
    for (const department of departmentOptions) {
      if (inputLower.includes(department)) {
        currentData.department = department.charAt(0).toUpperCase() + department.slice(1);
        break;
      }
    }

    // Get appointment date
    if (userInput.match(/\d{4}-\d{2}-\d{2}/)) {
      const datePattern = userInput.match(/\d{4}-\d{2}-\d{2}/);
      if (datePattern) currentData.date = datePattern[0];
    }

    // Get appointment time
    if (userInput.match(/\d{1,2}:\d{2}\s*(AM|PM|am|pm)?/)) {
      const timePattern = userInput.match(/\d{1,2}:\d{2}\s*(AM|PM|am|pm)?/);
      if (timePattern) currentData.time = timePattern[0];
    }

    setBookingData(currentData);
    return currentData;
  }, [bookingData]);

  // Send booking confirmations (simulated function)
  const sendBookingConfirmations = async (bookingInfo) => {
    try {
      console.log('Email notification to:', bookingInfo.email);
      console.log('Text message to:', bookingInfo.phone);
      console.log('Appointment information:', bookingInfo);

      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Notification error:', error);
      return false;
    }
  };

  // Main send message function - defined first to avoid reference errors
  const sendMessage = useCallback(async (customMessage = null) => {
    const messageToSend = customMessage || inputMessage.trim();
    
    if (!messageToSend) return;

    // Always clear input message
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [
      ...prev,
      {
        type: "user",
        text: messageToSend,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    ]);

    try {
      const messageHistory = messages
        .filter(msg => msg.type === "user" || msg.type === "bot")
        .map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const completeMessageSet = [
        {
          role: "system",
          content: `You serve as a medical appointment scheduling assistant for HealthCare Plus Clinic.

Your responsibility involves gathering these details sequentially:
1. Patient's complete name
2. Contact number (exactly 10 digits)
3. Email address
4. Required medical specialty (Cardiology, Neurology, Orthopedics, Ophthalmology, General Medicine, Pediatrics, Dermatology)
5. Desired appointment date (YYYY-MM-DD format)
6. Preferred appointment time

Guidelines:
- Pose one inquiry at a time
- Verify phone (10 digits) and email (must include @ symbol)
- Maintain concise and courteous responses (2-3 sentences maximum)
- When inquiring about date, use phrases like "Which date works best for your appointment?" or "When would you like to schedule your visit?"
- When inquiring about time, use phrases like "What time slot would you prefer?" or "Please select your preferred appointment time"
- After obtaining all 6 details, present a summary:
  "Appointment Summary:
  - Patient Name: [name]
  - Contact Number: [phone]
  - Email Address: [email]
  - Medical Department: [department]
  - Appointment Date: [date]
  - Appointment Time: [time]
  
  Please verify these details by responding 'Yes' or 'Confirm'"
- Only proceed after receiving explicit confirmation using "yes", "confirm", or "correct", then respond: "Excellent! Finalizing your appointment booking..."
- Avoid automatic confirmation without clear user approval`
        },
        ...messageHistory,
        { role: "user", content: messageToSend }
      ];

      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: completeMessageSet,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const responseData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(responseData.error?.message || "API call unsuccessful");
      }

      const aiReply = responseData?.choices?.[0]?.message?.content || "Currently experiencing connection issues. Please attempt again shortly.";

      if (aiReply) {
        const currentBookingData = getBookingDetails(messageToSend, aiReply);

        const requestingDate = (
          aiReply.toLowerCase().includes('date') || 
          aiReply.toLowerCase().includes('when') ||
          aiReply.toLowerCase().includes('schedule')
        ) && (
          aiReply.toLowerCase().includes('prefer') || 
          aiReply.toLowerCase().includes('which') || 
          aiReply.toLowerCase().includes('what') ||
          aiReply.toLowerCase().includes('like')
        ) && !currentBookingData.date;

        const requestingTime = (
          aiReply.toLowerCase().includes('time') || 
          aiReply.toLowerCase().includes('hour') ||
          aiReply.toLowerCase().includes('slot')
        ) && (
          aiReply.toLowerCase().includes('prefer') || 
          aiReply.toLowerCase().includes('which') || 
          aiReply.toLowerCase().includes('what') ||
          aiReply.toLowerCase().includes('convenient')
        ) && !currentBookingData.time && currentBookingData.date;

        const allDetailsCollected = currentBookingData.name && currentBookingData.phone &&
          currentBookingData.email && currentBookingData.department &&
          currentBookingData.date && currentBookingData.time;

        const userConfirming = (messageToSend.toLowerCase().includes('yes') ||
          messageToSend.toLowerCase().includes('confirm') ||
          messageToSend.toLowerCase().includes('correct')) &&
          allDetailsCollected;

        setMessages(prev => [
          ...prev,
          {
            type: "bot",
            text: aiReply,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        if (requestingDate) {
          setShowDatePicker(true);
          setShowTimePicker(false);
        } else if (requestingTime) {
          setShowTimePicker(true);
          setShowDatePicker(false);
        } else {
          setShowDatePicker(false);
          setShowTimePicker(false);
        }

        if (userConfirming && aiReply.toLowerCase().includes('processing')) {
          setTimeout(async () => {
            setIsTyping(true);

            const notificationsSuccessful = await sendBookingConfirmations(currentBookingData);

            setIsTyping(false);

            setMessages(prev => [
              ...prev,
              {
                type: "bot",
                text: `🎉 Appointment Successfully Booked!\n\n📧 Confirmation sent to: ${currentBookingData.email}\n📱 Notification sent to: ${currentBookingData.phone}\n\nYour medical appointment is scheduled for ${currentBookingData.date} at ${currentBookingData.time}.\n\nWe recommend arriving 15 minutes before your scheduled time. Looking forward to assisting you! 🏥`,
                isConfirmation: true,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("API Connection Error:", error);

      setMessages(prev => [
        ...prev,
        {
          type: "bot",
          text: "We're currently experiencing technical difficulties. Please try again in a few moments or contact us directly at +1 (555) 123-4567.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setIsLoading(false);
    setIsTyping(false);
  }, [inputMessage, messages, getBookingDetails, OPENAI_API_KEY]);

  // Date and Time selection functions - defined AFTER sendMessage
  const selectAppointmentDate = useCallback((selectedDate) => {
    const updatedInfo = { ...bookingData, date: selectedDate };
    setBookingData(updatedInfo);
    setShowDatePicker(false);
    
    // Auto-send the selected date
    setTimeout(() => {
      sendMessage(`I'd like to book for ${selectedDate}`);
    }, 500);
  }, [bookingData, sendMessage]);

  const selectAppointmentTime = useCallback((selectedTime) => {
    const updatedInfo = { ...bookingData, time: selectedTime };
    setBookingData(updatedInfo);
    setShowTimePicker(false);
    
    // Auto-send the selected time
    setTimeout(() => {
      sendMessage(`${selectedTime} works for me`);
    }, 500);
  }, [bookingData, sendMessage]);

  // Voice input function
  const activateVoiceInput = useCallback(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Voice recognition is not supported in your browser.");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;
        setInputMessage(voiceText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
    } catch (err) {
      console.error("Voice recognition setup error:", err);
      setIsRecording(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <Stats />
      <Departments />
      <Doctors />
      <Contact />
      <Footer />

      {!chatOpen && (
        <ChatButton onOpen={() => setChatOpen(true)} />
      )}

      <ChatWindow
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        isLoading={isLoading}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={sendMessage}
        onVoiceInput={activateVoiceInput}
        isRecording={isRecording}
        showDatePicker={showDatePicker}
        showTimePicker={showTimePicker}
        availableDates={availableDates}
        timeSlots={timeSlots}
        bookingData={bookingData}
        onDateSelect={selectAppointmentDate}
        onTimeSelect={selectAppointmentTime}
        onCloseDatePicker={() => setShowDatePicker(false)}
        onCloseTimePicker={() => setShowTimePicker(false)}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default App;
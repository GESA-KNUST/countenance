'use client';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import Container from '../custom/Container';

const ContactForm = () => {
  // ... (keeping existing state and handlers)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        message: 'Please fill in all required fields (First Name, Last Name, Email, and Message).',
        type: 'error'
      });
      return;
    }

    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({
        message: 'Please enter a valid email address.',
        type: 'error'
      });
      return;
    }

    const templateParams = {
      firstName: firstName,
      lastName: lastName,
      messageType: subject,
      messageBody: message,
      emailFrom: email,
      email: 'thegesaknust@gmail.com',
    };

    emailjs.send(
      'service_dj6nnll',
      'template_vjomjvq',
      templateParams,
      'nsEZld8wCEmOsyI4w'
    ).then((response) => {
      setFeedback({ message: 'Your message has been sent successfully.', type: 'success' });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSubject('General Inquiry');
      setMessage('');
    }, (err) => {
      setFeedback({ message: 'Failed to send message. Please try again later.', type: 'error' });
    });
  };

  return (
    <div className="px-page-sx md:px-page-x py-12">
      <div className='max-w-360 mx-auto w-full'>
        <div className='bg-white shadow-lg rounded-lg flex flex-col-reverse lg:flex-row h-auto overflow-hidden'>
          <div className='w-full lg:w-1/3 bg-black text-white p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[350px] lg:min-h-[600px]'>
            <div className='relative z-10'>
              <h2 className='text-2xl md:text-3xl font-bold text-yellow-500 mb-2 font-header'>Contact Information</h2>
              <p className='mb-8 text-sm md:text-base opacity-90'>Your feedback and inquiries matter to us.</p>
              <div className='space-y-4 md:space-y-6'>
                <div className='flex items-center gap-4'>
                  <Phone className="shrink-0 w-5 h-5" />
                  <span className="text-sm md:text-base">024-342-6670</span>
                </div>
                <div className='flex items-center gap-4'>
                  <Mail className="shrink-0 w-5 h-5" />
                  <span className="text-sm md:text-base">info@gesaknust.org</span>
                </div>
                <div className='flex items-center gap-4'>
                  <MapPin className="shrink-0 w-5 h-5" />
                  <span className="text-sm md:text-base">College of Engineering, KNUST</span>
                </div>
              </div>
            </div>

            <div className='relative z-10 flex items-center gap-4 mt-8 md:mt-auto mb-2'>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://x.com/thegesaknust?s=11" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/thegesaknust?igsh=MXhidHNqZndwYmdqMg==" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/gesa-knust/" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                <Linkedin size={18} />
              </a>
            </div>

            {/* Decorative circles - more responsive sizes */}
            <div className="absolute w-[180px] h-[180px] md:w-[269px] md:h-[269px] bg-[rgba(255,190,0,0.3)] rounded-full -bottom-10 -right-10 md:-bottom-20 md:-right-20"></div>
            <div className="absolute w-[100px] h-[100px] md:w-[138px] md:h-[138px] bg-[rgba(255,190,0,0.3)] rounded-full top-20 -right-10 md:bottom-[60px] md:right-20"></div>

          </div>
          <div className='w-full lg:w-2/3 p-6 md:p-10'>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">First Name</label>
                  <input type="text" placeholder="John" className='border-b-2 border-gray-200 focus:border-yellow-500 outline-none p-2 transition-colors' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">Last Name</label>
                  <input type="text" placeholder="Doe" className='border-b-2 border-gray-200 focus:border-yellow-500 outline-none p-2 transition-colors' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <input type="email" placeholder="john@example.com" className='border-b-2 border-gray-200 focus:border-yellow-500 outline-none p-2 transition-colors' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                  <input type="tel" placeholder="+233..." className='border-b-2 border-gray-200 focus:border-yellow-500 outline-none p-2 transition-colors' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-4 text-gray-700'>Select Subject?</h3>
                <div className='flex items-center gap-6 flex-wrap'>
                  <label className='flex items-center gap-2 cursor-pointer group'>
                    <input type="radio" name="subject" className='w-4 h-4 accent-yellow-500' value="General Inquiry" checked={subject === "General Inquiry"} onChange={(e) => setSubject(e.target.value)} />
                    <span className="text-sm md:text-base group-hover:text-yellow-600 transition-colors">General Inquiry</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer group'>
                    <input type="radio" name="subject" className='w-4 h-4 accent-yellow-500' value="Partnership" checked={subject === "Partnership"} onChange={(e) => setSubject(e.target.value)} />
                    <span className="text-sm md:text-base group-hover:text-yellow-600 transition-colors">Partnership</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer group'>
                    <input type="radio" name="subject" className='w-4 h-4 accent-yellow-500' value="Feedback" checked={subject === "Feedback"} onChange={(e) => setSubject(e.target.value)} />
                    <span className="text-sm md:text-base group-hover:text-yellow-600 transition-colors">Feedback</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Message</label>
                <textarea placeholder="Write your message here..." className='w-full border-b-2 border-gray-200 focus:border-yellow-500 outline-none p-2 transition-colors resize-none' rows={3} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>
              {feedback.message && (
                <div className={`p-4 rounded-md text-sm font-medium ${feedback.type === 'success' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {feedback.message}
                </div>
              )}
              <div className='pt-4'>
                <button type="button" onClick={handleSubmit} className='w-full sm:w-auto bg-yellow-500 text-white py-3 px-10 rounded-md shadow-lg shadow-yellow-500/20 hover:bg-yellow-600 hover:shadow-xl transition-all font-semibold'>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

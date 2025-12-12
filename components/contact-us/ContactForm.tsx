'use client';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useState } from 'react';

const ContactForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const mailtoLink = `mailto:thegesaknust@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className='relative pb-20'>
        <div className='max-w-6xl mx-auto p-4'>
          <div className='bg-white shadow-lg rounded-lg flex flex-col md:flex-row min-h-[667px]'>
            <div className='w-full md:w-1/3 bg-black text-white p-8 rounded-l-lg relative overflow-hidden'>
                <div className='relative z-10 h-full flex flex-col justify-between'>
                    <div>
                        <h2 className='text-3xl font-bold text-yellow-500 mb-2'>Contact Information</h2>
                        <p className='mb-8'>Your feedback and inquiries matter to us.</p>
                        <div className='space-y-6'>
                            <div className='flex items-center gap-4'>
                                <Phone />
                                <span>+233 20 057 6468</span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <Mail />
                                <span>thegesaknust@gmail.com</span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <MapPin />
                                <span>College of Engineering, KNUST</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 mt-8 md:mt-0 md:gap-3 mb-4'>
                        <a href="#" className="bg-black text-white p-1 rounded-full hover:bg-white hover:text-black transition-colors">
                            <Facebook size={16} />
                        </a>
                        <a href="#" className="bg-black text-white p-1 rounded-full hover:bg-white hover:text-black transition-colors">
                            <Twitter size={16} />
                        </a>
                        <a href="#" className="bg-black text-white p-1 rounded-full hover:bg-white hover:text-black transition-colors">
                            <Instagram size={16} />
                        </a>
                        <a href="#" className="bg-black text-white p-1 rounded-full hover:bg-white hover:text-black transition-colors">
                            <Linkedin size={16} />
                        </a>
                    </div>
                </div>

                <div className="absolute w-[269px] h-[269px] bg-[rgba(255,190,0,0.5)] rounded-full bottom-[-100px] right-[-80px]"></div>
                <div className="absolute w-[138px] h-[138px] bg-[rgba(255,190,0,0.5)] rounded-full bottom-[60px] right-[80px]"></div>

            </div>
            <div className='w-full md:w-2/3 p-8'>
              <form className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <input type="text" placeholder="First Name" className='border-b-2 border-gray-300 focus:border-yellow-500 outline-none p-2' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input type="text" placeholder="Last Name" className='border-b-2 border-gray-300 focus:border-yellow-500 outline-none p-2' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <input type="email" placeholder="Email" className='border-b-2 border-gray-300 focus:border-yellow-500 outline-none p-2' value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="tel" placeholder="Phone Number" className='border-b-2 border-gray-300 focus:border-yellow-500 outline-none p-2' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Select Subject?</h3>
                  <div className='flex items-center gap-4 flex-wrap'>
                    <label className='flex items-center gap-2'>
                      <input type="radio" name="subject" className='form-radio' value="General Inquiry" checked={subject === "General Inquiry"} onChange={(e) => setSubject(e.target.value)} />
                      General Inquiry
                    </label>
                    <label className='flex items-center gap-2'>
                      <input type="radio" name="subject" className='form-radio' value="Partnership" checked={subject === "Partnership"} onChange={(e) => setSubject(e.target.value)} />
                      Partnership
                    </label>
                    <label className='flex items-center gap-2'>
                      <input type="radio" name="subject" className='form-radio' value="Feedback" checked={subject === "Feedback"} onChange={(e) => setSubject(e.target.value)} />
                      Feedback
                    </label>
                  </div>
                </div>
                <div>
                  <textarea placeholder="Write your message.." className='w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none p-2' rows={3} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <div className='text-right'>
                  <button type="button" onClick={handleSubmit} className='bg-yellow-500 text-white py-3 px-8 rounded-md shadow-lg hover:bg-yellow-600 transition-colors'>
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ContactForm

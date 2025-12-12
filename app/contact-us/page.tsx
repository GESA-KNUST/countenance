import ContactForm from '@/components/contact-us/ContactForm';
import Hero from '@/components/contact-us/Hero';

const ContactPage = () => {
  return (
    <div className="bg-white text-gray-800 font-poppins relative">
      <Hero />
      <ContactForm />
    </div>
  );
};

export default ContactPage;

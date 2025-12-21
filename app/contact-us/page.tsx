import ContactForm from '@/components/contact-us/ContactForm';
import Hero from '@/components/contact-us/Hero';

const ContactPage = () => {
  return (
    <div className='font-poppins min-h-screen w-full overflow-x-hidden'>
      <Hero />
      <ContactForm />
    </div>
  );
};

export default ContactPage;

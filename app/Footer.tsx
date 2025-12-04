'use client';
import Image from 'next/image';
import logo from '../public/images/logo2.svg'
import fb from '../public/images/fb.svg'
import ig from '../public/images/ig.svg'
import linkedin from '../public/images/linkedIn.svg'
import x from '../public/images/x.svg'
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { Separator } from '../components/ui/separator';

const Footer = () => {

  const socialLinks = [
    { img: fb, to: "/" },
    { img: x, to: "/" },
    { img: ig, to: "/" },
    { img: linkedin, to: "/" },
  ]

  const pageLinks = [
    {
      title: "Popular Search",
      path: [
        { page: "Personality of the Week", to: "/" },
        { page: "GESA blog", to: "/blog" },
        { page: "GESA Quiz", to: "/" },
        { page: "Apply for Scholarship", to: "/" },
      ]
    },
    {
      title: "Quick Links",
      path: [
        { page: "Events", to: "/events" },
        { page: "Executives", to: "/executives" },
        { page: "clubs", to: "/clubs" },
        { page: "Hub", to: "/hub" },
        { page: "Gallery", to: "/gallery" },
        { page: "FAQs", to: "/" },
      ]
    },
    {
      title: "Discovery",
      path: [
        { page: "Campus", to: "/" },
        { page: "KNUST", to: "/" },
      ]
    },
  ]

  return (
    <div className='md:px-page-x py-12 px-page-sx font-poppins bg-black text-white'>
      <div className='max-w-360 flex flex-col gap-6 mx-auto'>

        {/* section 1 */}
        <div className='flex flex-col lg:flex-row justify-between gap-10'>
          <div className='flex flex-col gap-6 flex-1'>
            <div className='flex items-start gap-4'>
              <Image src={logo} alt='logo' />
              <div className='flex flex-col'>
                <h3 className='text-primary font-semibold text-2xl'>GESA-KNUST</h3>
                <p className='text-sm text-warm-gray'>Kwame Nkrumah University of <br className='hidden md:block' /> Science and Technology</p>
                <p className='text-sm text-warm-gray'>College of Engineering</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-10 items-start'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-sm font-bold text-primary'>Contact Us</h3>
                <span className='text-warm-gray'>024-342-6670</span>
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-sm font-bold text-primary'>Email</h3>
                <span className='text-warm-gray'>info@gesaknust.org</span>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <h3 className='text-sm font-bold text-primary'>Follow us on social media</h3>
              <div className='flex items-center gap-6 flex-wrap'>
                {socialLinks.map((link, i) => (
                  <Image src={link.img} alt='logo' key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* section2 */}
          <div className='flex flex-col gap-8 flex-1'>
            <div className='space-y-6'>
              <h3 className='text-primary font-semibold'>Keep Yourself Up to Date(GESA Newsletter)</h3>
              <form className='bg-white/8 lg:w-[600px] w-full flex flex-col sm:flex-row items-center p-2 rounded'>
                <input
                  type="email"
                  placeholder='Your Email'
                  className='p-4 outline-none text-sm flex-1 w-full'
                />
                <Button type="submit" className="font-poppins font-semibold h-full bg-white/8 cursor-pointer w-full sm:w-auto">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* links */}
            <div className='flex flex-wrap gap-10 justify-between'>
              {pageLinks.map((link, i) => (
                <div className='space-y-4 text-sm min-w-[140px]' key={i}>
                  <h3 className='font-bold text-primary'>{link.title}</h3>
                  <ul className='text-warm-gray space-y-4'>
                    {link.path.map((link, i) => (
                      <li key={i}>
                        <Link href={link.to} className='hover:underline transition-all'>{link.page}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* bottom */}
        <div className='flex flex-col sm:flex-row justify-between gap-4 text-warm-gray text-sm text-center'>
          <h2>&copy;2025  GESA KNUST - All rights reserved</h2>
          <div className='flex gap-2 items-center justify-center sm:justify-start'>
            <Link href="/">Privacy</Link>
            <span className='block rounded-full w-1 h-1 bg-white/80'></span>
            <Link href="/">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;

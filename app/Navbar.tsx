'use client'
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Logo from '../public/images/logo.svg'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';



const Navbar = () => {
  const currentPath = usePathname()
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });



  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'GESA Blog', link: '/blog' },
    { name: 'Events', link: '/events' },
    { name: 'Executives', link: '/executives' },
    { name: 'Hub', link: '/hubs' },
    { name: 'Clubs', link: '/clubs' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Contact Us', link: '/contact-us' },
  ]

  return (
    <div className='flex items-center justify-between md:px-page-x lg:py-page-y px-page-sx font-poppins max-w-360 mx-auto h-(--navbar-height)'>
      <Link href="/">
        <Image src={Logo} alt='logo' />
      </Link>
      <div className='hidden lg:block'>
        <ul
          onMouseLeave={() => {
            setPosition((pv) => ({
              ...pv,
              opacity: 0,
            }));
          }}
          className='flex items-center gap-4 xl:gap-4 lg:gap-2'
        >
          {navItems.map((nav, i) => (
            <Tab setPosition={setPosition} key={i}>
              <Link href={nav.link} className={`font-semibold ${currentPath == nav.link && 'bg-primary rounded-full'} md:px-5 md:py-3 py-1.5`}>{nav.name}</Link>
            </Tab>
          ))}


          <Cursor position={position} />
        </ul>

      </div>

      <div className='lg:hidden'>
        <Menu
          strokeWidth={3}
          size={30}
          className='text-primary cursor-pointer'
          onClick={() => setIsOpen(prev => !prev)}
        />

        {isOpen && (
          <div className='fixed top-0 left-0 h-full w-full z-50'>
            <div className="px-4 pb-4 bg-white flex flex-col relative ">
              <div
                onClick={() => setIsOpen(false)}
                className='absolute right-10 top-4 p-2 text-yellow-500 hover:bg-yellow-500 hover:text-white cursor-pointer rounded-full transition duration-300'
              >
                <X strokeWidth={3} size={30} />
              </div>
              <ul className="flex flex-col gap-2 py-16">
                {navItems.map((nav, i) => (
                  <li key={i}>
                    <Link
                      href={nav.link}
                      className={`block ${currentPath == nav.link ? 'bg-primary text-white' : ''
                        } hover:bg-primary hover:text-white py-2 px-3 font-semibold transition duration-300 rounded-md`}
                      onClick={() => setIsOpen(false)}
                    >
                      {nav.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer text-xs uppercase text-black xl:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-primary md:h-12"
    />
  );
};
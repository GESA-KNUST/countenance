'use client'
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Logo from '../public/images/logo.svg'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const currentPath = usePathname()
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    setIsOpen(false);
    setOpenSubmenu(null);
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', link: '/' },
    {
      name: 'Academics',
      sublinks: [
        { name: 'Faculties', link: '/faculty' },
        { name: 'Departments', link: '/department' },
      ]
    },
    { name: 'GESA Blog', link: '/blog' },
    { name: 'Events', link: '/events' },
    { name: 'Executives', link: '/executives' },
    {
      name: 'Community',
      sublinks: [
        { name: 'Opportunities Hub', link: '/hubs' },
        { name: 'Clubs and Societies', link: '/clubs' },
      ]
    },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Team', link: '/team' },
    { name: 'Contact Us', link: '/contact-us' },
  ]

  return (
    <div className='flex items-center justify-between md:px-page-x lg:py-page-y px-page-sx font-poppins max-w-360 mx-auto h-(--navbar-height) relative z-[999]'>
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
          {navItems.map((nav, i) => {
            if (nav.sublinks) {
              const isSubActive = nav.sublinks.some(sub =>
                currentPath === sub.link || (sub.link !== '/' && currentPath?.startsWith(`${sub.link}/`))
              );
              const isExpanded = openSubmenu === nav.name;

              return (
                <Tab
                  key={i}
                  setPosition={setPosition}
                  onClick={() => setOpenSubmenu(isExpanded ? null : nav.name)}
                >
                  <div
                    className={`font-semibold cursor-pointer ${isSubActive ? 'bg-primary rounded-full' : ''} md:px-5 md:py-3 py-1.5 flex items-center gap-1 select-none whitespace-nowrap`}
                  >
                    {nav.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] p-2 min-w-[220px]">
                          {nav.sublinks.map((sub, si) => (
                            <Link
                              key={si}
                              href={sub.link}
                              onClick={() => setOpenSubmenu(null)}
                              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${currentPath === sub.link ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-primary/5 text-gray-700 hover:text-primary'}`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Tab>
              );
            }

            const isActive = currentPath === nav.link ||
              (currentPath === '/blog-2' && nav.link === '/blog') ||
              (nav.link !== '/' && currentPath?.startsWith(`${nav.link}/`));

            return (
              <Tab setPosition={setPosition} key={i}>
                <Link
                  href={nav.link!}
                  className={`font-semibold ${isActive ? 'bg-primary rounded-full' : ''} md:px-5 md:py-3 py-1.5 whitespace-nowrap`}
                >
                  <span suppressHydrationWarning>{nav.name}</span>
                </Link>
              </Tab>
            )
          })}
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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 left-0 h-full w-full z-[999] bg-white'
            >
              <div className="px-6 pb-4 flex flex-col relative h-full overflow-y-auto">
                <div
                  onClick={() => {
                    setIsOpen(false);
                    setOpenSubmenu(null);
                  }}
                  className='absolute right-6 top-4 p-2 text-primary hover:bg-primary/10 cursor-pointer rounded-full transition duration-300'
                >
                  <X strokeWidth={3} size={28} />
                </div>

                <div className="pt-20 pb-10">
                  <ul className="flex flex-col gap-4">
                    {navItems.map((nav, i) => (
                      <li key={i} className="flex flex-col">
                        {nav.sublinks ? (
                          <div className="flex flex-col">
                            <button
                              onClick={() => setOpenSubmenu(openSubmenu === nav.name ? null : nav.name)}
                              className={`flex items-center justify-between w-full py-3 px-4 rounded-2xl font-bold text-lg transition-all ${openSubmenu === nav.name ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-gray-50'}`}
                            >
                              {nav.name}
                              <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${openSubmenu === nav.name ? 'rotate-180' : ''}`}
                              />
                            </button>

                            <AnimatePresence>
                              {openSubmenu === nav.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col gap-2 mt-2 ml-4 border-l-2 border-primary/20 pl-4 py-2">
                                    {nav.sublinks.map((sub, si) => (
                                      <Link
                                        key={si}
                                        href={sub.link}
                                        className={`block py-3 px-4 font-semibold text-base transition duration-300 rounded-xl ${currentPath === sub.link ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
                                        onClick={() => setIsOpen(false)}
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={nav.link!}
                            className={`block py-3 px-4 font-bold text-lg transition duration-300 rounded-2xl ${(currentPath === nav.link || (currentPath === '/blog-2' && nav.link === '/blog'))
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'text-gray-900 hover:bg-primary/5'
                              }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {nav.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Navbar;

const Tab = ({ children, setPosition, onClick = () => { } }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onClick={onClick}
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
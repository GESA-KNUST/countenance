'use client'
import Image from 'next/image';
import Logo from '../public/images/logo.svg'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const currentPath = usePathname()
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'GESA Blog', link: '/gesa-blog' },
    { name: 'Events', link: '/events' },
    { name: 'Executives', link: '/executives' },
    { name: 'Hub', link: '/hub' },
    { name: 'Clubs', link: '/clubs' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Contact Us', link: '/contact-us' },
  ]

  return (
    <div className='flex items-center justify-between md:px-page-x lg:py-page-y px-page-sx font-poppins max-w-360 mx-auto h-(--navbar-height)'>
      <Image src={Logo} alt='logo' />
      <div className='hidden lg:block'>
        <ul className='flex items-center gap-4 xl:gap-4 lg:gap-2'>
          {navItems.map((nav, i) => (
            <li className='' key={i}>
              <Link href={nav.link} className={`${currentPath == nav.link && 'px-5 py-2 bg-primary'} hover:rounded-full hover:bg-primary py-2 px-3 font-semibold transition duration-300 rounded-full`}>{nav.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      {/* mobile screen */}
      <div className='lg:hidden'>
        <Menu
          strokeWidth={3}
          size={30}
          className='text-primary cursor-pointer'
          onClick={() => setIsOpen(prev => !prev)}
        />

        {/* Mobile nav */}
        {isOpen && (
          <div className='fixed top-0 left-0 h-full w-full z-50'>
            <div className="px-4 pb-4 bg-white flex flex-col relative ">
              <div
                onClick={() => setIsOpen(false)}
                className='absolute right-10 top-4 p-2 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer rounded-full transition duration-300'
              >
                <X strokeWidth={3} size={30} />
              </div>
              <ul className="flex flex-col gap-2 py-16">
                {navItems.map((nav, i) => (
                  <li key={i}>
                    <Link
                      href={nav.link}
                      className={`block ${currentPath === nav.link ? 'bg-primary text-white' : ''
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
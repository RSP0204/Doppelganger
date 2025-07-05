'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const centerNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' }
];

const rightNavLink = { href: '/login', label: 'Log In' };

export function NavHeader() {
    const pathname = usePathname();
    const [hoveredLink, setHoveredLink] = useState(pathname);
    const navRef = useRef<HTMLUListElement>(null);

    return (
        <nav className="relative flex justify-center items-center w-full px-8">
            <div className="absolute left-8">
                <Link href="/">
                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                </Link>
            </div>
            <ul
                ref={navRef}
                className="flex items-center p-2 rounded-full bg-background/50 border border-border/40 shadow-inner"
                onMouseLeave={() => setHoveredLink(pathname)}
            >
                {centerNavLinks.map((link) => (
                    <li
                        key={link.href}
                        className="relative"
                        onMouseEnter={() => setHoveredLink(link.href)}
                    >
                        {hoveredLink === link.href && (
                            <motion.div
                                layoutId="pill-center"
                                className="absolute inset-0 bg-primary/20 rounded-full"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Link
                            href={link.href}
                            className={cn(
                                'relative block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300',
                                pathname === link.href ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="absolute right-8">
                <ul
                    className="flex items-center p-2 rounded-full bg-background/50 border border-border/40 shadow-inner"
                    onMouseLeave={() => setHoveredLink(pathname)}
                >
                    <li
                        key={rightNavLink.href}
                        className="relative"
                        onMouseEnter={() => setHoveredLink(rightNavLink.href)}
                    >
                        {hoveredLink === rightNavLink.href && (
                            <motion.div
                                layoutId="pill-right"
                                className="absolute inset-0 bg-primary/20 rounded-full"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Link
                            href={rightNavLink.href}
                            className={cn(
                                'relative block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300',
                                pathname === rightNavLink.href ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
                            )}
                        >
                            {rightNavLink.label}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavHeader;

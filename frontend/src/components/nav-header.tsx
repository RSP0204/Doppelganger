'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/login', label: 'Log In' },
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' }
];

export function NavHeader() {
    const pathname = usePathname();
    const [hoveredLink, setHoveredLink] = useState(pathname);
    const navRef = useRef<HTMLUListElement>(null);

    return (
        <nav className="relative">
            <ul
                ref={navRef}
                className="flex items-center justify-center p-2 rounded-full bg-background/50 border border-border/40 shadow-inner"
                onMouseLeave={() => setHoveredLink(pathname)}
            >
                {navLinks.map((link) => (
                    <li
                        key={link.href}
                        className="relative"
                        onMouseEnter={() => setHoveredLink(link.href)}
                    >
                        {hoveredLink === link.href && (
                            <motion.div
                                layoutId="pill"
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
        </nav>
    );
}

export default NavHeader;

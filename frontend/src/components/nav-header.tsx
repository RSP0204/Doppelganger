'use client';

import {
    Home,
    User,
    Mail,
    LogIn
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const centerLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: User },
    { name: 'Contact Us', href: '/contact', icon: Mail }
];

const rightLink = { name: 'Log In', href: '/login', icon: LogIn };

export function NavHeader() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-4 inset-x-0 max-w-screen-lg mx-auto flex items-center justify-between p-2 rounded-full bg-background/50 border border-border/40 shadow-inner">
            <div className="flex items-center justify-center flex-1 gap-2">
                {centerLinks.map((link) => {
                    const isActive = pathname === link.href;
                    
return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'relative flex items-center justify-center w-12 h-12 rounded-full text-foreground/60 hover:text-foreground transition-colors duration-300',
                                isActive ? 'text-primary' : ''
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bubble"
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                    style={{ borderRadius: 9999 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <link.icon className="w-6 h-6" />
                        </Link>
                    );
                })}
            </div>
            <div className="flex items-center justify-end">
                <Link
                    key={rightLink.href}
                    href={rightLink.href}
                    className={cn(
                        'relative flex items-center justify-center w-12 h-12 rounded-full text-foreground/60 hover:text-foreground transition-colors duration-300',
                        pathname === rightLink.href ? 'text-primary' : ''
                    )}
                >
                    {pathname === rightLink.href && (
                        <motion.div
                            layoutId="bubble"
                            className="absolute inset-0 bg-primary/20 rounded-full"
                            style={{ borderRadius: 9999 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                    <rightLink.icon className="w-6 h-6" />
                </Link>
            </div>
        </nav>
    );
}

export default NavHeader;
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/registry/new-york-v4/ui/tooltip';

const centerLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: User },
    { name: 'Contact Us', href: '/contact', icon: Mail }
];

const rightLink = { name: 'Log In', href: '/login', icon: LogIn };

export function NavHeader() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#693efe] backdrop-blur-sm">
            <div className="container flex items-center justify-between h-16">
                <div className="flex items-center justify-center flex-1 gap-2">
                    {centerLinks.map((link) => {
                        const isActive = pathname === link.href;
                        
return (
                            <TooltipProvider key={link.href}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                'relative flex items-center justify-center w-12 h-12 rounded-full text-foreground/60 hover:text-foreground transition-colors duration-300',
                                                isActive ? 'text-black' : ''
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="bubble"
                                                    className="absolute inset-0 bg-white rounded-full"
                                                    style={{ borderRadius: 9999 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <link.icon className="w-6 h-6" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{link.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
                <div className="flex items-center justify-end">
                    <TooltipProvider key={rightLink.href}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={rightLink.href}
                                    className={cn(
                                        'relative flex items-center justify-center w-12 h-12 rounded-full text-foreground/60 hover:text-foreground transition-colors duration-300',
                                        pathname === rightLink.href ? 'text-black' : ''
                                    )}
                                >
                                    {pathname === rightLink.href && (
                                        <motion.div
                                            layoutId="bubble"
                                            className="absolute inset-0 bg-white rounded-full"
                                            style={{ borderRadius: 9999 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <rightLink.icon className="w-6 h-6" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{rightLink.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </nav>
    );
}

export default NavHeader;
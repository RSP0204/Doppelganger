'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/registry/new-york-v4/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function NavHeader() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/charts', label: 'Charts' },
        { href: '/forms', label: 'Forms' },
        { href: '/login', label: 'Login' }
    ];

    return (
        <NavigationMenu className="flex justify-center w-full">
            <NavigationMenuList className="group flex items-center justify-center gap-2 p-2 rounded-full bg-background/50 border border-border/40 shadow-inner">
                {navLinks.map(({ href, label }) => (
                    <NavigationMenuItem key={href}>
                        <NavigationMenuLink asChild active={pathname === href}>
                            <Link
                                href={href}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out',
                                    'hover:bg-primary/10 hover:text-primary',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                                    {
                                        'bg-primary/20 text-primary shadow-md': pathname === href
                                    }
                                )}
                            >
                                {label}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
export default NavHeader;

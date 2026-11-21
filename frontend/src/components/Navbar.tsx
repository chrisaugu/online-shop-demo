"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CART_KEY = "shop-cart";
const CART_EVENT = "shop-cart-updated";

function getCartCount() {
    try {
        const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;
    } catch {
        return 0;
    }
}

export function Navbar() {
    const pathname = usePathname();
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const updateCount = () => setCartCount(getCartCount());
        updateCount();
        window.addEventListener(CART_EVENT, updateCount);
        window.addEventListener("storage", updateCount);
        return () => {
            window.removeEventListener(CART_EVENT, updateCount);
            window.removeEventListener("storage", updateCount);
        };
    }, []);

    useEffect(() => setMenuOpen(false), [pathname]);

    const links = [
        { label: "Products", href: "/products" },
        { label: "About", href: "/about" },
        // { label: "Journal", href: "/blog" },
    ];

    const linkClass = (href: string) =>
        `text-sm font-medium transition hover:text-amber-800 ${pathname === href || pathname.startsWith(`${href}/`) ? "text-stone-950" : "text-stone-600"}`;

    return (
        <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
            <nav aria-label="Main navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link href="/" aria-label="Common Goods home" className="group flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-amber-100 transition group-hover:bg-amber-800" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 21V9m0 4c0-4-2.5-6-6-6 0 3.7 2 6 6 6Zm0-2c0-3.7 2-6 6-6 0 3.7-2 6-6 6Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">Common Goods</span>
                </Link>

                <div className="hidden items-center gap-9 md:flex">
                    {links.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/cart" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950" aria-label={`Shopping cart, ${cartCount} items`}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                            <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="19" r="1" /><circle cx="17" cy="19" r="1" />
                        </svg>
                        <span className="hidden sm:inline">Cart</span>
                        <span className="flex min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">{cartCount}</span>
                    </Link>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 md:hidden"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
                        )}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="border-t border-stone-200 bg-[#faf9f6] px-5 py-3 md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col">
                        {links.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100">{link.label}</Link>)}
                        <Link href="/cart" className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100">Shopping cart ({cartCount})</Link>
                    </div>
                </div>
            )}
        </header>
    );
}

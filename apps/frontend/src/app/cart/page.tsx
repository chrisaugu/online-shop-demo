"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

const CART_KEY = "shop-cart";
const CART_EVENT = "shop-cart-updated";
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function readCart(): CartItem[] {
    try {
        const stored = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const sync = () => setItems(readCart());
        sync();
        window.addEventListener(CART_EVENT, sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener(CART_EVENT, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const save = (next: CartItem[]) => {
        setItems(next);
        window.localStorage.setItem(CART_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(CART_EVENT));
    };

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-900">
            <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
                <Link href="/products" className="text-sm font-medium text-stone-500 transition hover:text-stone-900">← Continue shopping</Link>
                <div className="mt-7 flex items-end justify-between gap-4 border-b border-stone-200 pb-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Your selections</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Shopping cart</h1>
                    </div>
                    <span className="pb-1 text-sm text-stone-500">{items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>

                {items.length === 0 ? (
                    <section className="mt-12 rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-2xl" aria-hidden="true">🛍</div>
                        <h2 className="mt-5 text-xl font-semibold">Your cart is waiting</h2>
                        <p className="mt-2 text-sm text-stone-500">Take a look through the collection and add something you love.</p>
                        <Link href="/products" className="mt-7 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800">Browse products</Link>
                    </section>
                ) : (
                    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
                        <section className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-5 sm:px-7" aria-label="Cart items">
                            {items.map((item) => (
                                <article key={item.id} className="flex gap-4 py-5 sm:gap-6">
                                    {item.image ? <img src={item.image} alt="" className="h-24 w-24 rounded-xl bg-stone-100 object-cover sm:h-28 sm:w-28" /> : <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-amber-50 to-stone-200 sm:h-28 sm:w-28" />}
                                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="font-semibold">{item.title}</h2>
                                            <p className="mt-1 text-sm text-stone-500">{money(item.price)} each</p>
                                            <button onClick={() => save(items.filter((entry) => entry.id !== item.id))} className="mt-2 text-xs font-medium text-stone-500 underline underline-offset-4 hover:text-red-700">Remove</button>
                                        </div>
                                        <div className="flex items-center justify-between gap-5 sm:justify-end">
                                            <div className="flex items-center rounded-lg border border-stone-200">
                                                <button aria-label={`Decrease ${item.title} quantity`} onClick={() => save(item.quantity <= 1 ? items.filter((entry) => entry.id !== item.id) : items.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity - 1 } : entry))} className="px-3 py-2 text-stone-600 hover:text-stone-950">−</button>
                                                <span className="min-w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                                                <button aria-label={`Increase ${item.title} quantity`} onClick={() => save(items.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry))} className="px-3 py-2 text-stone-600 hover:text-stone-950">+</button>
                                            </div>
                                            <span className="min-w-20 text-right text-sm font-semibold">{money(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>
                        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
                            <h2 className="text-lg font-semibold">Order summary</h2>
                            <div className="mt-5 flex justify-between text-sm text-stone-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                            <p className="mt-2 text-xs leading-5 text-stone-500">Shipping and taxes are calculated at checkout.</p>
                            <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 font-semibold"><span>Total</span><span>{money(subtotal)}</span></div>
                            <Link href="/checkout" className="mt-6 flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-amber-800">Continue to checkout</Link>
                            <p className="mt-3 text-center text-xs text-stone-500">Secure payment powered by Stripe.</p>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

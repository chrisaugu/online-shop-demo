"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

const CART_KEY = "shop-cart";
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function readCart(): CartItem[] {
    try {
        const value = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

export default function CheckoutPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

    useEffect(() => setItems(readCart()), []);

    async function submitCheckout(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!items.length) {
            setError("Your cart is empty. Add a product before checking out.");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        if (!apiUrl) {
            setError("Checkout is not configured. Please contact the shop for help.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/checkout/create-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({ documentId: item.id, quantity: item.quantity })),
                    customerEmail: email.trim(),
                }),
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(typeof result.error?.message === "string" ? result.error.message : typeof result.message === "string" ? result.message : "We couldn’t start checkout. Please try again.");
            }
            if (!result.url || typeof result.url !== "string") {
                throw new Error("Checkout did not return a payment link. Please try again.");
            }

            window.location.assign(result.url);
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : "We couldn’t start checkout. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-900">
            <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
                <Link href="/cart" className="text-sm font-medium text-stone-500 transition hover:text-stone-900">← Back to cart</Link>
                <div className="mt-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Almost yours</p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight">Checkout</h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Enter your email to continue to secure payment. Your order total is confirmed by the shop before payment.</p>
                </div>

                {items.length === 0 ? (
                    <section className="mt-10 rounded-3xl border border-stone-200 bg-white px-6 py-14 text-center">
                        <h2 className="text-xl font-semibold">Your cart is empty</h2>
                        <p className="mt-2 text-sm text-stone-500">Add something from the collection to continue.</p>
                        <Link href="/products" className="mt-7 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800">Browse products</Link>
                    </section>
                ) : (
                    <form onSubmit={submitCheckout} className="mt-9 grid gap-8 lg:grid-cols-[1fr_380px]">
                        <section className="h-fit rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-semibold">Contact details</h2>
                            <p className="mt-1 text-sm text-stone-500">We’ll send your receipt and order updates here.</p>
                            <label htmlFor="checkout-email" className="mt-7 block text-sm font-medium text-stone-700">Email address</label>
                            <input
                                id="checkout-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15"
                            />
                            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
                            <button type="submit" disabled={submitting} className="mt-7 w-full rounded-xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                                {submitting ? "Connecting to secure checkout…" : "Continue to payment"}
                            </button>
                            <p className="mt-3 text-center text-xs leading-5 text-stone-500">Payment details are entered securely on Stripe.</p>
                        </section>

                        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
                            <h2 className="text-lg font-semibold">Order summary</h2>
                            <div className="mt-5 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        {item.image ? <img src={item.image} alt="" className="h-14 w-14 rounded-lg bg-stone-100 object-cover" /> : <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-amber-50 to-stone-200" />}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{item.title}</p>
                                            <p className="mt-1 text-xs text-stone-500">Qty {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-medium">{money(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between border-t border-stone-200 pt-5 text-sm text-stone-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                            <p className="mt-2 text-xs leading-5 text-stone-500">Shipping and any applicable taxes are calculated securely during payment.</p>
                            <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 font-semibold"><span>Estimated total</span><span>{money(subtotal)}</span></div>
                        </aside>
                    </form>
                )}
            </div>
        </main>
    );
}


// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// async function handleCheckout(cartItems, customerEmail) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/checkout/create-session`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       items: cartItems.map(item => ({
//         documentId: item.documentId,
//         quantity: item.quantity,
//       })),
//       customerEmail,
//     }),
//   });

//   const { url } = await response.json();
//   window.location.href = url;
// }
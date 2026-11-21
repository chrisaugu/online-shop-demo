"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function OrderSuccessPage() {
    useEffect(() => {
        window.localStorage.removeItem("shop-cart");
        window.dispatchEvent(new Event("shop-cart-updated"));
    }, []);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6] px-5 py-16 text-stone-900">
            <section className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white px-7 py-12 text-center shadow-sm sm:px-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-700" aria-hidden="true">✓</span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Order received</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">Thank you for your order.</h1>
                <p className="mt-4 text-sm leading-6 text-stone-600">Your payment was submitted securely. A receipt and order update will be sent to the email you provided.</p>
                <Link href="/products" className="mt-8 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800">Continue shopping</Link>
            </section>
        </main>
    );
}

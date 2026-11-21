"use client";

import { useState } from "react";
import type { Product } from "@/types";

const CART_KEY = "shop-cart";
const CART_EVENT = "shop-cart-updated";

type CartItem = { id: string; title: string; price: number; image?: string; quantity: number };

export default function BuyButton({ product, imageBaseUrl = "" }: { product: Product; imageBaseUrl?: string }) {
    const [added, setAdded] = useState(false);

    const addToCart = () => {
        let cart: CartItem[] = [];
        try {
            const stored = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
            if (Array.isArray(stored)) cart = stored;
        } catch {
            cart = [];
        }

        const id = product.documentId || String(product.id);
        const existing = cart.find((item) => item.id === id);
        const image = product.images?.[0]?.url;
        const imageUrl = image ? (image.startsWith("http") ? image : `${imageBaseUrl}${image}`) : undefined;
        const next = existing
            ? cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...cart, { id, title: product.title, price: Number(product.price) || 0, image: imageUrl, quantity: 1 }];

        window.localStorage.setItem(CART_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(CART_EVENT));
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
    };

    return (
        <button
            type="button"
            onClick={addToCart}
            className="w-full rounded-xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
            aria-live="polite"
        >
            {added ? "Added to cart ✓" : `Add to cart · $${(Number(product.price) || 0).toFixed(2)}`}
        </button>
    );
}

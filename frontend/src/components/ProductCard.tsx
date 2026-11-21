'use client';
import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import { STRAPI_URL } from "@/lib/strapi-url";
import { Product } from "@/types";

const money = (value: number) =>
    new Intl.NumberFormat("en-PG", { style: "currency", currency: "PGK" }).format(value);

export default function ProductCard({ product }: { product: Product }) {
    const image = product.images?.[0];

    return (
        <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60">
            <Link href={`/products/${product.documentId}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    {image ? (
                        <img
                            src={`${STRAPI_URL}${image.url}`}
                            alt={image.alternativeText || product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-50 to-stone-200 text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
                            Featured product
                        </div>
                    )}
                    {
                        (product.inventory && (product.inventory > 0)) ? (
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700 backdrop-blur">
                                In the shop
                            </span>
                        ) : (
                            <span className="absolute left-4 top-4 rounded-full bg-red/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700 backdrop-blur">
                                Out of stock
                            </span>
                        )
                    }
                </div>
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg font-semibold tracking-tight text-stone-900">{product.title}</h2>
                        <span className="shrink-0 text-base font-semibold text-stone-900">{money(product.price)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">
                        {product.description || "A thoughtful find, selected for everyday use."}
                    </p>
                    <p className="mt-3 text-xs font-medium text-stone-500">
                        Quantity available: <span className="text-stone-800">{Math.max(0, product.inventory ?? 0)}</span>
                    </p>
                </div>
            </Link>
            <div className="px-5 pb-5">
                <BuyButton product={product} imageBaseUrl={STRAPI_URL} />
            </div>
        </article>
    );
}

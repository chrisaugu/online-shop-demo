import Link from "next/link";
import { getProducts } from "@/lib/dal";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export const instant = false;

async function getRenderedAt() {
    'use cache'
    return Date.now()
}

// export default async function Page() {
//     const renderedAt = await getRenderedAt()
//     return <ReportFooter renderedAt={renderedAt} />
// }

export default async function ProductsPage() {
    let products: Product[] = [];
    let unavailable = false;
    try {
        products = await getProducts();
    } catch {
        unavailable = true;
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-900">
            <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
                <div className="mb-12 max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">The collection</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Good things, thoughtfully chosen.</h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                        Browse the pieces we love. Find the details, then choose what belongs with you.
                    </p>
                </div>

                {unavailable ? (
                    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
                        <h2 className="text-xl font-semibold">The collection is taking a moment</h2>
                        <p className="mt-2 text-sm text-stone-500">Please check back soon.</p>
                    </div>
                ) : products.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => <ProductCard key={product.documentId || product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
                        <h2 className="text-xl font-semibold">A little room for what’s next</h2>
                        <p className="mt-2 text-sm text-stone-500">There are no products available right now.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

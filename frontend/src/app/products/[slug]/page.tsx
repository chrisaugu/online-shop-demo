import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getProductById } from "@/lib/dal";
import { STRAPI_URL } from "@/lib/strapi-url";
import type { Product } from "@/types";
import BuyButton from "../../../components/BuyButton";
import ProductImageGallery from "../../../components/ProductImageGallery";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

async function loadProduct(slug: string): Promise<Product | null> {
    try {
        return await getProductById(slug);
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await loadProduct(slug);
    return {
        title: product ? `${product.title} | Shop` : "Product | Shop",
        description: product?.description,
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params;
    const product = await loadProduct(slug);
    if (!product) notFound();

    const images = product.images ?? [];

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-900">
            <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900">
                    <span aria-hidden="true">←</span> Back to collection
                </Link>

                <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div className="space-y-4">
                        <ProductImageGallery images={images} title={product.title} imageBaseUrl={STRAPI_URL} />
                    </div>

                    <section className="self-start lg:sticky lg:top-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Selected for you</p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{product.title}</h1>
                        <p className="mt-5 text-2xl font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</p>
                        {product.description && <p className="mt-6 text-base leading-7 text-stone-600">{product.description}</p>}
                        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
                            <BuyButton product={product} imageBaseUrl={STRAPI_URL} />
                            <p className="mt-3 text-center text-xs text-stone-500">Secure checkout · Carefully packed</p>
                        </div>
                        {product.content?.length ? (
                            <div className="content prose prose-stone mt-10 max-w-none prose-headings:font-semibold prose-p:leading-7">
                                {/* <h2 className="text-xl">A closer look</h2> */}
                                <BlocksRenderer content={product.content} />
                            </div>
                        ) : null}
                    </section>
                </div>
            </div>
        </main>
    );
}

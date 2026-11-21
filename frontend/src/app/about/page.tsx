import Link from "next/link";
import { getStrapiData } from "@/lib/dal";
import { SingleType } from "@/types";

export const instant = false;

const principles = [
    {
        number: "01",
        title: "Chosen with care",
        description: "We look for the details that make something worth keeping: a useful form, a considered finish, and a little character.",
    },
    {
        number: "02",
        title: "Made for real life",
        description: "Good design belongs in everyday routines. Our collection is here to be used, enjoyed, and lived with.",
    },
    {
        number: "03",
        title: "Less, but better",
        description: "A thoughtful edit makes it easier to find something you’ll reach for often and feel good bringing home.",
    },
];

export default async function AboutPage() {
    let title = "A little more about us";
    let description = "We believe the things we bring into our lives should earn their place. Our shop is a small, considered collection of useful objects and everyday favourites.";

    try {
        const response = await getStrapiData<SingleType>("/about");
        if (response.data?.title) title = response.data.title;
        if (response.data?.description) description = response.data.description;
    } catch {
        // Keep the page useful if the CMS is temporarily unavailable.
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-900">
            <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Our story</p>
                    <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
                    <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-stone-600 sm:text-lg">{description}</p>
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link href="/products" className="inline-flex items-center gap-3 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800">
                            Explore the collection <span aria-hidden="true">→</span>
                        </Link>
                        <span className="text-sm text-stone-500">Everyday things, chosen well.</span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute -right-3 -top-3 h-28 w-28 rounded-full bg-amber-200/70 sm:-right-5 sm:-top-5 sm:h-36 sm:w-36" />
                    <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-amber-800/25 sm:-bottom-6 sm:-left-6 sm:h-32 sm:w-32" />
                    <div className="relative overflow-hidden rounded-[2rem] bg-[#e9e3d8] p-5 sm:p-7">
                        <div className="flex aspect-[4/4.2] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[#d9c8ad] p-7 sm:p-10">
                            <div className="flex items-start justify-between">
                                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">Common Goods</span>
                                <span className="font-serif text-4xl text-amber-900/75">✳</span>
                            </div>
                            <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-amber-900/20 bg-[#efe9de] shadow-[0_20px_60px_rgba(77,53,27,0.12)] sm:h-60 sm:w-60">
                                <div className="absolute h-36 w-36 rounded-full border border-amber-900/20 sm:h-44 sm:w-44" />
                                <svg viewBox="0 0 160 160" className="h-36 w-36 text-amber-900 sm:h-44 sm:w-44" fill="none" aria-hidden="true">
                                    <path d="M81 131V76m0 25c0-21-13-33-35-33 0 22 13 34 35 34Zm0-14c0-21 13-33 35-33 0 22-13 34-35 34Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M53 132h56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="max-w-[15rem] font-serif text-2xl leading-tight text-stone-800 sm:text-3xl">A quieter kind of everyday.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-stone-200 bg-white/70">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                    <div className="mb-10 max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">What guides us</p>
                        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">The little things matter.</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {principles.map((principle) => (
                            <article key={principle.number} className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-6 sm:p-7">
                                <span className="text-xs font-semibold tracking-[0.18em] text-amber-700">{principle.number}</span>
                                <h3 className="mt-7 text-lg font-semibold tracking-tight">{principle.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-stone-600">{principle.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Find your favourite</p>
                    <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">A good place to start.</h2>
                </div>
                <Link href="/products" className="inline-flex items-center gap-3 rounded-full border border-stone-300 px-6 py-3.5 text-sm font-semibold transition hover:border-stone-900 hover:bg-stone-900 hover:text-white">
                    Shop all products <span aria-hidden="true">→</span>
                </Link>
            </section>
        </main>
    );
}

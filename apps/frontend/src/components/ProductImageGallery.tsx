"use client";

import { useEffect, useState } from "react";

type GalleryImage = { url: string; alternativeText?: string | null; name?: string | null; id?: number; documentId?: string };

export default function ProductImageGallery({ images, title, imageBaseUrl }: { images: GalleryImage[]; title: string; imageBaseUrl: string }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const activeImage = images[activeIndex];
    const imageSrc = (image: GalleryImage) => image.url.startsWith("http") ? image.url : `${imageBaseUrl}${image.url}`;

    useEffect(() => {
        if (!previewOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setPreviewOpen(false);
            if (event.key === "ArrowRight" && images.length > 1) setActiveIndex((index) => (index + 1) % images.length);
            if (event.key === "ArrowLeft" && images.length > 1) setActiveIndex((index) => (index - 1 + images.length) % images.length);
        };
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [previewOpen, images.length]);

    if (!activeImage) {
        return <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-stone-200 text-sm font-medium uppercase tracking-[0.2em] text-stone-400">{title}</div>;
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl bg-stone-100 text-left focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
                aria-label={`Preview ${title} image`}
            >
                <img src={imageSrc(activeImage)} alt={activeImage.alternativeText || title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-stone-700 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus:opacity-100">Click to enlarge</span>
            </button>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            type="button"
                            key={image.documentId || image.id || image.url}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Show image ${index + 1} of ${images.length}`}
                            aria-pressed={index === activeIndex}
                            className={`overflow-hidden rounded-xl bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-700 ${index === activeIndex ? "ring-2 ring-stone-900 ring-offset-2" : "opacity-75 hover:opacity-100"}`}
                        >
                            <img src={imageSrc(image)} alt="" className="aspect-square w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {previewOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} image preview`}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
                    onClick={() => setPreviewOpen(false)}
                >
                    <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close image preview" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20">×</button>
                    {images.length > 1 && (
                        <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((index) => (index - 1 + images.length) % images.length); }} aria-label="Previous image" className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-6">‹</button>
                    )}
                    <img
                        src={imageSrc(activeImage)}
                        alt={activeImage.alternativeText || title}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[88vh] max-w-[90vw] rounded-lg object-contain"
                    />
                    {images.length > 1 && (
                        <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((index) => (index + 1) % images.length); }} aria-label="Next image" className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-6">›</button>
                    )}
                    <span className="absolute bottom-4 text-sm text-white/75">{activeIndex + 1} / {images.length}</span>
                </div>
            )}
        </>
    );
}

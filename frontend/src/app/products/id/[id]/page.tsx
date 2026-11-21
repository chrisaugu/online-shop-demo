import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { getProductById, STRAPI_URL } from "@/lib/dal";
import Link from 'next/link';

// page that fetches data
import { draftMode } from 'next/headers'

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

async function getData() {
    const { isEnabled } = await draftMode()

    const url = isEnabled
        ? 'https://draft.example.com'
        : 'https://production.example.com'

    const res = await fetch(url)

    return res.json()
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // const query = new URLSearchParams({
    //     fields: ['title', 'description', 'price', 'images', 'documentId'],
    //     populate: {
    //         images: {
    //             fields: ['name', 'url'],
    //         },
    //     },
    // }).toString();
    // const response = await fetch(`${STRAPI_URL}/products?slug=${slug}&${query}?filters[slug][$eq]=${slug}&populate=images`);
    const product = await getProductById(id);

    if (!product) {
        return <div>No product found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-lg mb-2">{product.description}</p>
            <BlocksRenderer
                content={product.content ?? []}
            // blocks={{
            //     // You can use the default components to set class names...
            //     paragraph: ({ children }) => <p className="text-neutral900 max-w-prose">{children}</p>,
            //     // ...or point to a design system
            //     heading: ({ children, level }) => {
            //         switch (level) {
            //             case 1:
            //                 return <h1>{children}</h1>
            //             case 2:
            //                 return <h1>{children}</h1>
            //             case 3:
            //                 return <h1>{children}</h1>
            //             case 4:
            //                 return <h1>{children}</h1>
            //             case 5:
            //                 return <h1>{children}</h1>
            //             case 6:
            //                 return <h1>{children}</h1>
            //             default:
            //                 return <h1>{children}</h1>
            //         }
            //     },
            //     link: ({ children, url }) => <Link href={url}>{children}</Link>,
            // }}
            // modifiers={{
            //     bold: ({ children }) => <strong>{children}</strong>,
            //     italic: ({ children }) => <span className="italic">{children}</span>,
            // }}
            />
            <p className="text-xl font-semibold mb-4">${product.price}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.images && product.images.map((image: any) => (
                    <img
                        key={image.id}
                        src={`${STRAPI_URL}${image.url}`}
                        alt={image.name}
                        className="w-full h-auto rounded-lg"
                    />
                ))}
            </div>

            <div className="mt-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add to Cart
                </button>
                <button className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Buy Now
                </button>
            </div>
        </div>
    );
}

import { APIResponseType, ArticleType, getArticles, getStrapiData, STRAPI_URL } from "@/lib/dal";
import { formatDate } from "@/lib/dateUtils";
import Image from "next/image";
import qs from 'qs';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Blog() {
    const query = qs.stringify(
        {
            fields: ['title', 'slug', 'description', 'documentId', 'author'],
            populate: {
                'author': {
                    'fields': ['name'],
                }
                // headerImage: {
                //     fields: ['name', 'url'],
                // },
            },
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );

    const strapiData: APIResponseType<ArticleType[]> = await getArticles(); //${query}

    if (!strapiData) return "Loading";

    if (strapiData.error) {
        return <div>Error: {strapiData.error.message}</div>;
    }

    if (!strapiData.data) {
        return <div>No data found</div>;
    }

    const { data: articles, meta } = strapiData;

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-8">Next.js and Strapi Integration</h1>
            <div>
                <h2 className="text-2xl font-semibold mb-6">Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <a href={`/blog/${article.documentId}`}>
                                <Image
                                    className="w-full h-48 object-cover"
                                    src={STRAPI_URL + article.cover.url}
                                    alt={article.title}
                                    width={180}
                                    height={38}
                                    priority
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                                    <p className="text-gray-600 mb-4">{article.content}</p>
                                    <p className="text-sm text-gray-500">
                                        Published: {formatDate(article.publishedAt)}
                                    </p>
                                </div>
                            </a>
                        </article>
                    ))}
                </div>
            </div>

            {meta && (
                <div className="flex justify-between">
                    <button>&lt; Previous</button>
                    <span>{meta.pagination.page} / {meta.pagination.total}</span>
                    <button>Next &gt;</button>
                </div>
            )}
        </div>
    )
}
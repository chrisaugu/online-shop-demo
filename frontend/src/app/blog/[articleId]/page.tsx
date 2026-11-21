import { APIResponseType, ArticleType, getArticle, STRAPI_URL } from "@/lib/dal";
import Image from "next/image";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Article(props: { params: Promise<{ articleId: number }> }) {
    const { articleId } = await props.params;
    // GET /api/blogs?filters\[Slug\][$eq]=create-a-slug-system-with-strapi-v4
    const graphQLQuery = `
        query {
            blogs(filters: { Slug: { eq: "create-a-slug-system-with-strapi-v4" } }) {
                data {
                id
                attributes{
                    Title
                    Slug
                    publishedAt
                }
                }
            }
        }
    `;

    const strapiData: APIResponseType<ArticleType> = await getArticle(articleId);

    console.log(strapiData)

    if (!strapiData) return "Loading";

    if (strapiData.error) {
        return <div>Error: {strapiData.error.message}</div>;
    }

    if (!strapiData.data) {
        return <div>No data found</div>;
    }

    const { data: article, meta } = strapiData;

    return (
        <div className="bg-white p-6 text-black">
            <h1 className="text-4xl font-bold mb-8">Next.js and Strapi Integration</h1>
            <div>
                <h2 className="text-2xl font-semibold mb-6">Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <article>
                        <h2>{article.title}</h2>
                        <p>By {article?.author?.name ?? ""}</p>
                        <p>{article.description}</p>
                        {article.cover && (
                            <Image
                                className="w-full h-48 object-cover"
                                src={STRAPI_URL + article.cover.url}
                                alt={article.cover.alternativeText || article.title}
                                width={article.cover.width}
                                height={article.cover.height}
                                priority
                            />
                        )}
                    </article>

                </div>
            </div>
        </div>
    )
}
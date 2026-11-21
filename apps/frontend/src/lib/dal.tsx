import "server-only";

import fs from "fs";
import fetch, { RequestInfo } from "node-fetch";
import FormData from "form-data";
import { appConfig } from "./env";
import type { ArticleType, Author, Product, SingleType } from "@/types";
import path from "path";
import { fileURLToPath } from "url";
import { STRAPI_URL } from "./strapi-url";
export { STRAPI_URL };

export const API_BASE_URL = STRAPI_URL + "/api";

type MetaType = {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    }
}

type APIResponseType<T extends any> = {
    data: T;
    meta?: MetaType;
    // }

    // type NotRoundResponseType = APIResponseType<null> & {
    error: {
        status: number,
        name: string,
        message: string,
        details: Record<string, any>
    }
}

async function getStrapiData<T>(url: string, query?: string | null): Promise<APIResponseType<T>> {
    const token = appConfig.apiKey;

    try {
        const response = await fetch(API_BASE_URL + url, {
            // method: "POST",
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            // body: {}
        });

        // if (!response.ok) {
        //     const text = await response.text();
        //     throw new Error(text);
        // }

        const data = await response.json() as any;
        return data as APIResponseType<T>;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

export function getArticles(query = null): Promise<APIResponseType<ArticleType[]>> {
    return getStrapiData<ArticleType[]>("/articles?populate=*", query);
}

export async function getArticle(articleId: number): Promise<APIResponseType<ArticleType>> {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}?populate=*`);

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }
        const data = await response.json() as any;
        return data as APIResponseType<ArticleType>;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

export async function getArticleBySlug(slug: string): Promise<APIResponseType<ArticleType>> {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}?populate=*`);

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }
        const data = await response.json() as any;
        return data as APIResponseType<ArticleType>;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}
// /articles?sort=publishedAt:desc&pagination[limit]=10
// /posts?populate=*&filters[destination][slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=10&sort=publishedAt:desc

function getRecentArticles(
    page: number = 1,
    pageSize: number = 10,
): Promise<APIResponseType<ArticleType[]>> {
    const query = `?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc&populate=*`;
    return getStrapiData<ArticleType[]>(`/articles${query}`);
}

export async function getAuthors(): Promise<APIResponseType<Author[]>> {
    try {
        const response = await fetch(`${API_BASE_URL}/authors?populate=*`);
        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }
        const data = await response.json() as any;
        return data as APIResponseType<Author[]>;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

export async function getHomePageData(): Promise<APIResponseType<SingleType>> {
    try {
        const response = await fetch(`${API_BASE_URL}/home-page?populate=*`);
        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }
        const data = await response.json() as any;
        return data as APIResponseType<SingleType>;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

async function getEntries() {
    const url = API_BASE_URL + "/strapi-contents";
    const token = "YOUR_TOKEN";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        const entries = jsonResponse.data;
        console.log("Data retrieved:", entries);

        // retrieve specific collection fields

        /* const courseTitles = entries.map(entry => entry.CourseTitle);
            console.log('Course Titles:', courseTitles);
            // console.log('Data retrieved:', entries);*/
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

async function createEntry(url: string) {
    try {
        const response = await fetch(API_BASE_URL + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({ data }),
        });

        const jsonResponse = await response.json() as any;
        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }

        console.log("Success:", jsonResponse);
        return jsonResponse;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

async function getEntry(entryId: any) {
    const url = `${API_BASE_URL}/strapi-contents/${entryId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const jsonResponse = await response.json() as any;
        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }

        console.log("Success:", jsonResponse);
        return jsonResponse;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

// Function to update an entry
async function updateEntry(entryId: any) {
    const url = `${API_BASE_URL}/strapi-contents/${entryId}`;
    const updatedData = {
        data: {
            CourseTitle: "Advanced Programming",
            CourseDescription: "An advanced course on programming concepts.",
        },
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        console.log("Update successful:", jsonResponse);
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}


// Function to delete an entry
async function deleteEntry(entryId: any) {
    const url = `${API_BASE_URL}/strapi-contents/${entryId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(errorData.message || "Network response was not ok");
        }

        console.log("Delete successful");
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}


// Function to retrieve paginated entries using page-based pagination
async function getPageBasedEntries(page: any, pageSize: any) {
    const url = `${API_BASE_URL}/strapi-contents?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const token = "Your API token";

    console.log(`Fetching paginated entries from: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            console.error("Error details:", errorData);
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        const entries = jsonResponse.data;
        console.log("Paginated Data retrieved:", entries);
    } catch (error: any) {
        console.error("Error occurred:", error.message);
    }
}

// getPageBasedEntries(1, 10); // Retrieve the first page with 10 entries per page


// Function to retrieve paginated entries using offset-based pagination
async function getOffsetBasedEntries(start: any, limit: any) {
    const url = `${API_BASE_URL}/strapi-contents?pagination[start]=${start}&pagination[limit]=${limit}`;
    const token = "Your API token";

    console.log(`Fetching paginated entries from: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            console.error("Error details:", errorData);
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        const entries = jsonResponse.data;
        console.log("Paginated Data retrieved:", entries);
    } catch (error: any) {
        console.error("Error occurred:", error.message);
    }
}

// getOffsetBasedEntries(2, 10); // Retrieve entries starting from index 2, limit to 10 entries


// Function to retrieve filtered entries
async function getFilteredEntries(filterKey: any, filterValue: any) {
    const filterQuery = `filters[${filterKey}][$contains]=${filterValue}`;
    const url = `${API_BASE_URL}/strapi-contents?${filterQuery}`;
    const token = "YOUR_TOKEN";

    console.log(`Fetching filtered entries from: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            console.error("Error details:", errorData);
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        const entries = jsonResponse.data;
        console.log("Filtered Data retrieved:", entries);
    } catch (error: any) {
        console.error("Error occurred:", error.message);
    }
}

// Example usage
const filterKey = "CourseTitle";
const filterValue = "Strapi";

// getFilteredEntries(filterKey, filterValue);



// Function to retrieve entries and populate related data
async function getEntriesWithPopulate() {
    // Replace '*' with specific relations if needed
    const url = API_BASE_URL + "/strapi-contents?populate=*";
    const token = "Your token";

    console.log(`Fetching entries with populated data from: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json() as any;
            console.error("Error details:", errorData);
            throw new Error(errorData.message || "Network response was not ok");
        }

        const jsonResponse = await response.json() as any;
        const entries = jsonResponse.data;

        console.dir(entries, { depth: null });
    } catch (error: any) {
        console.error("Error occurred:", error.message);
    }
}

// getEntriesWithPopulate();


// Function to upload file and link it to a specific entry
async function uploadFileAndLink(filePath: fs.PathLike, refId: any, ref: string, field: string) {
    const url = API_BASE_URL + "/upload";
    const token = "your-token";

    const formData = new FormData();
    formData.append("files", fs.createReadStream(filePath));
    formData.append("refId", refId);
    formData.append("ref", ref);
    formData.append("field", field);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            // Handle non-JSON responses correctly
            const text = await response.text();
            throw new Error(text);
        }

        const jsonResponse = await response.json() as any;
        console.log("File uploaded and linked successfully:", jsonResponse);
        return jsonResponse;
    } catch (error: any) {
        console.error("Error:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

// Function to update a specific entry with unique files
async function updateSpecificEntry(entryId: any, logoPath: any, materialsPaths: any) {
    try {
        // Upload course logo and link to the entry
        await uploadFileAndLink(
            logoPath,
            entryId,
            "api::strapi-content.strapi-content",
            "CourseLogo",
        );

        // Upload course materials (e.g., PDFs) and link to the entry
        for (const material of materialsPaths) {
            await uploadFileAndLink(
                material,
                entryId,
                "api::strapi-content.strapi-content",
                "CourseMaterials",
            );
        }
    } catch (error: any) {
        console.error("Error in updating entry with unique files:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

// Run the function to update a specific entry
const entryId = 4; // Specify the entry ID to update
const logoPath = "logo-advanced-programming.jpg"; // Specify the path to the logo file
const materialsPaths = ["material1.pdf"]; // Specify the paths to the material files
// updateSpecificEntry(entryId, logoPath, materialsPaths);


// Function to download a file from a given URL
async function downloadFile(fileUrl: URL | RequestInfo, dest: fs.PathLike) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
        response.body?.pipe(fileStream);
        response.body?.on("error", reject);
        fileStream.on("finish", () => resolve(undefined));
    });
}

// Function to download files linked to a specific entry
async function downloadEntryFiles(entryId: any) {
    try {
        // Retrieve the specific entry data with populated media fields
        const entry = await getEntry(entryId);

        if (!entry) {
            console.log(`Entry ID ${entryId} not found.`);
            return;
        }

        // Determine the directory path for downloads
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Download CourseLogo
        const logo = entry.attributes.CourseLogo?.data;
        if (logo) {
            const logoUrl = `http://localhost:30080${logo.attributes.url}`;
            const logoDest = path.join(__dirname, path.basename(logo.attributes.url));
            await downloadFile(logoUrl, logoDest);
            console.log(`Downloaded CourseLogo to ${logoDest}`);
        }

        // Download CourseMaterials
        const materials = entry.attributes.CourseMaterials?.data || [];
        for (const material of materials) {
            const materialUrl = `http://localhost:30080${material.attributes.url}`;
            const materialDest = path.join(
                __dirname,
                path.basename(material.attributes.url),
            );
            await downloadFile(materialUrl, materialDest);
            console.log(`Downloaded CourseMaterial to ${materialDest}`);
        }
    } catch (error: any) {
        console.error("Error in downloading entry files:", error);
        throw new Error("Failed to fetch data from Strapi");
    }
}

// downloadEntryFiles(entryId);


export const getProductsResponse = async () => {
    try {
        const response = await getStrapiData<Product[]>('/products');
        console.log('Products fetched successfully:', response.data);
        return response;
    } catch (error: any) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const getProductByIdResponse = async (id: string) => {
    try {
        // , {
        //     next: { revalidate: 60 },
        // }
        const response = await getStrapiData<Product>(`/products/${id}`);
        return response;
    } catch (error: any) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
}

/** Product and category CRUD methods. */
async function requestStrapi<T>(path: string, init: any = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json" },
    });

    const body = await response.text();
    const result = body ? JSON.parse(body) as any : {};
    if (!response.ok) {
        throw new Error(result?.error?.message || result?.message || `Strapi request failed (${response.status})`);
    }
    return result as T;
}

type StrapiEntity<T> = { data: T };

export async function getProducts(): Promise<Product[]> {
    const response = await requestStrapi<StrapiEntity<Product[]>>("/products?populate=*");
    return response.data;
}

export async function getProductById(id: string): Promise<Product> {
    const response = await requestStrapi<StrapiEntity<Product>>(`/products/${encodeURIComponent(id)}?populate=*`);
    return response.data;
}

export const createProduct = (productData: Partial<Product>) =>
    requestStrapi("/products", { method: "POST", body: JSON.stringify(productData) });

export const updateProduct = (id: string, productData: Partial<Product>) =>
    requestStrapi(`/products/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(productData) });

export const deleteProduct = (id: string) =>
    requestStrapi(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });

export const getCategories = () => requestStrapi("/categories");

export const getCategoryById = (id: string) =>
    requestStrapi(`/categories/${encodeURIComponent(id)}`);

export const createCategory = (categoryData: unknown) =>
    requestStrapi("/categories", { method: "POST", body: JSON.stringify(categoryData) });

export const updateCategory = (id: string, categoryData: unknown) =>
    requestStrapi(`/categories/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(categoryData) });

export const deleteCategory = (id: string) =>
    requestStrapi(`/categories/${encodeURIComponent(id)}`, { method: "DELETE" });

export type {
    MetaType,
    APIResponseType,
    ArticleType
}

export { getStrapiData };


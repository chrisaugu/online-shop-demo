import { type BlocksContent } from '@strapi/blocks-react-renderer';

export interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {};
}

export interface Product {
  id: number;
  title: string;
  description: string;
  content: BlocksContent;
  price: number;
  inventory?: number;
  images: ImageType[];
  documentId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string;
}

export type ProductType = {
  author: Author;
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  cover: ImageType;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  publishedAt: Date;
}

export interface ImageType {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Object[];
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: null;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string;
}

export type ArticleType = {
  author: Author;
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  cover: ImageType;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string;
}

export type SingleType = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date
  blocks: [
    {
      "__component": "shared.media",
      "id": 1
    }
  ]
}

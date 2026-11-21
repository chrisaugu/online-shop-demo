import { Product } from "@/types";
import * as api from "@/lib/dal";


export const UserDAO = () => {
    // User Data Access Object (DAO) implementation
    // This function can be used to interact with user-related data
    // For example, it can include methods to create, read, update, and delete user data
    // Example methods:
    // - getUserById(id: string): Promise<User>
    // - createUser(userData: User): Promise<User>
}

export interface ProductDAO {
    getProducts(): Promise<Product[]>
    getProductById(id: string): Promise<Product>
    createProduct(productData: Product): Promise<Product>
    updateProduct(id: string, productData: Product): Promise<Product>
    deleteProduct(id: string): Promise<void>
}
export class ProductDAOImpl implements ProductDAO {
    async getProducts(): Promise<Product[]> {
        return api.getProducts();
    }

    async getProductById(id: string): Promise<Product> {
        return api.getProductById(id);
    }

    async createProduct(productData: Product): Promise<Product> {
        // Implementation to create a new product
        return await api.createProduct(productData) as Product;
    }

    async updateProduct(id: string, productData: Product): Promise<Product> {
        // Implementation to update an existing product
        return await api.updateProduct(id, productData) as Product;
    }

    async deleteProduct(id: string): Promise<void> {
        // Implementation to delete a product by ID
        await api.deleteProduct(id);
    }
}
export const productDAO = new ProductDAOImpl();

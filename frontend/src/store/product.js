import { create } from "zustand"; // Import Zustand for state management

// Create the Zustand store for managing products
export const useProductStore = create((set) => ({
    // 🔹 State: List of products
    products: [],

    // 🔹 Set the products list manually (useful for initial data setup)
    setProducts: (products) => set({ products }),

    // 🔹 Fetch all products from the API
    fetchProducts: async () => {
        try {
            // Send a GET request to the API
            const res = await fetch("/api/products");
            const data = await res.json();

            // Check if the response is successful, otherwise throw an error
            if (!res.ok) throw new Error(data.message || "Failed to fetch products");

            // Update the store with fetched products
            set({ products: data.message });
        } catch (error) {
            console.error("Fetch Products Error:", error.message);
        }
    },

    // 🔹 Create a new product and add it to the store
    createProduct: async (newProduct) => {
        // Validate input fields before making the API request
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            return { success: false, message: "Please fill in all fields." };
        }

        try {
            // Send a POST request to create a new product
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct), // Convert object to JSON string
            });

            // Parse the response from the API
            const data = await res.json();

            // Check if the API request was successful
            if (!res.ok) throw new Error(data.message || "Failed to create product");

            // Add the new product to the store
            set((state) => ({ products: [...state.products, data.data] }));

            // Return success message
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            console.error("Create Product Error:", error.message);
            return { success: false, message: error.message };
        }
    },

    // 🔹 Delete a product from the API and update the store
    deleteProduct: async (pid) => {
        try {
            // Send a DELETE request to remove the product
            const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
            const data = await res.json();

            // Check if the deletion was successful
            if (!res.ok) throw new Error(data.message || "Failed to delete product");

            // Remove the deleted product from the state
            set((state) => ({
                products: state.products.filter((product) => product._id !== pid),
            }));

            return { success: true, message: data.message };
        } catch (error) {
            console.error("Delete Product Error:", error.message);
            return { success: false, message: error.message };
        }
    },

    // 🔹 Update an existing product and reflect the changes in the store
    updateProduct: async (pid, updatedProduct) => {
        try {
            // Send a PUT request to update the product
            const res = await fetch(`/api/products/${pid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });

            // Parse response from the API
            const data = await res.json();

            // Check if the update was successful
            if (!res.ok) throw new Error(data.message || "Failed to update product");

            // Update the product inside the store
            set((state) => ({
                products: state.products.map((product) =>
                    product._id === pid ? data.data : product
                ),
            }));

            return { success: true, message: "Product updated successfully" };
        } catch (error) {
            console.error("Update Product Error:", error.message);
            return { success: false, message: error.message };
        }
    },
}));

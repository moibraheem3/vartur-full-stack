import { defineStore } from "pinia";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

interface ProductState {
  product: Product | null;
  products: Product[] | null;
}

export const useProductStore = defineStore("products", {
  state: (): ProductState => ({
    products: null,
    product: null,
  }),

  actions: {
    async getAll() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.products = response.products;
        return this.products;
      } catch {
        return null;
      }
    },

    async create(
      name: string,
      price: string,
      categoryId: number,
      description?: string | null,
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch("/api/products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { name, description, price, categoryId },
        });

        this.product = response.product;
        return this.product;
      } catch {
        return null;
      }
    },

    async update(
      id: number,
      name: string,
      price: string,
      categoryId: number,
      description?: string | null,
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { name, description, price, categoryId },
        });

        this.product = response.product;
        return this.product;
      } catch {
        return null;
      }
    },

    async delete(id: number) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        await $fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return true;
      } catch {
        return null;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}

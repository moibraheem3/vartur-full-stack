import { defineStore } from "pinia";

type Category = {
  id: number;
  name: string;
  parentId?: number;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface CategoryState {
  category: Category | null;
  categories: Category[] | null;
}

export const useCategoryStore = defineStore("categories", {
  state: (): CategoryState => ({
    categories: null,
    category: null,
  }),

  actions: {
    async getAll() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.categories = response.categories.map((x) => {
          let productsCount = x._count.products;
          x.children.forEach((c) => (productsCount += c._count.products));

          return {
            id: x.id,
            name: x.name,
            parentId: x.parentId,
            productsCount,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          } as Category;
        });
        return this.categories;
      } catch {
        return null;
      }
    },

    async create(name: string, parentId?: number) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch("/api/categories", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { name, parentId },
        });

        this.category = response.category as Category;
        return this.category;
      } catch {
        return null;
      }
    },

    async update(id: number, name: string, parentId?: number) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { name, parentId },
        });

        this.category = response.category as Category;
        return this.category;
      } catch {
        return null;
      }
    },

    async delete(id: number) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        await $fetch(`/api/categories/${id}`, {
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

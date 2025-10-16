import { defineStore } from "pinia";

interface User {
  id: number;
  email: string | null;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  }),

  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },

    async login(username: string, password: string) {
      try {
        const response = await $fetch("/api/auth/login", {
          method: "POST",
          body: { username, password },
        });

        this.setToken(response.token);
        this.setUser(response.user);
        return true;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    async logout() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        await $fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } finally {
        this.clearAuth();
        await navigateTo("/");
      }
    },

    async checkAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const response = await $fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.setToken(token);
        this.setUser(response.user);
        return true;
      } catch {
        this.clearAuth();
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}

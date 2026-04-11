import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "../data/products";

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + qty } : i,
            ),
          });
        } else {
          set({ items: [...items, { ...product, qty }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty < 1) return get().removeItem(id);
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    { name: "hermed-cart" },
  ),
);

// Wishlist Store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().items.some((item) => item.id === product.id)) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      contains: (id) => get().items.some((item) => item.id === id),

      get count() {
        return get().items.length;
      },
    }),
    { name: "hermed-wishlist" },
  ),
);

// Products Store
export const useProductStore = create((set, get) => ({
  products: initialProducts,

  addProduct: (product) => {
    const products = get().products;
    const newProduct = {
      ...product,
      id: Date.now(),
      slug: product.name.toLowerCase().replace(/\s+/g, "-"),
      rating: 0,
      reviews: 0,
      images: [product.image],
    };
    set({ products: [...products, newProduct] });
  },

  updateProduct: (id, updates) =>
    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }),

  deleteProduct: (id) =>
    set({ products: get().products.filter((p) => p.id !== id) }),
}));

// Auth Store (user authentication)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,

      // Initialize with demo user if no users exist
      init: () => {
        const existingUsers = JSON.parse(
          localStorage.getItem("hermed-users") || "[]",
        );
        if (existingUsers.length === 0) {
          const demoUser = {
            id: "demo",
            email: "demo@hermed.com",
            name: "Demo User",
            password: "demo123",
            createdAt: new Date().toISOString(),
            isAdmin: false,
          };
          localStorage.setItem("hermed-users", JSON.stringify([demoUser]));
        }
      },

      // User registration
      register: (userData) => {
        const { email, password, name } = userData;

        // Check if user already exists
        const existingUsers = JSON.parse(
          localStorage.getItem("hermed-users") || "[]",
        );
        if (existingUsers.some((u) => u.email === email)) {
          return { success: false, message: "Email already registered" };
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          email,
          name,
          password, // In real app, this would be hashed
          createdAt: new Date().toISOString(),
          isAdmin: false,
        };

        // Save to localStorage
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("hermed-users", JSON.stringify(updatedUsers));

        // Set as current user
        set({
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          isAdmin: false,
        });

        return { success: true, message: "Account created successfully" };
      },

      // User login
      login: (email, password) => {
        // Check admin login
        if (email === "admin@hermed.com" && password === "hermed2024") {
          set({ user: { id: "admin", email, name: "Admin" }, isAdmin: true });
          return { success: true, message: "Admin login successful" };
        }

        // Check user login
        const users = JSON.parse(localStorage.getItem("hermed-users") || "[]");
        const user = users.find(
          (u) => u.email === email && u.password === password,
        );

        if (user) {
          set({
            user: { id: user.id, email: user.email, name: user.name },
            isAdmin: false,
          });
          return { success: true, message: "Login successful" };
        }

        return { success: false, message: "Invalid email or password" };
      },

      // Logout
      logout: () => set({ user: null, isAdmin: false }),

      // Check if user is logged in
      get isLoggedIn() {
        return get().user !== null;
      },
    }),
    {
      name: "hermed-auth",
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    },
  ),
);

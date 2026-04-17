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
export const useProductStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,

      addProduct: (product) => {
        const products = get().products;
        const newProduct = {
          ...product,
          id: Date.now(),
          slug: product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
          rating: 0,
          reviews: 0,
        };
        set({ products: [newProduct, ...products] });
      },

      updateProduct: (id, updates) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        }),

      deleteProduct: (id) =>
        set({
          products: get().products.filter((p) => p.id !== id),
        }),
    }),
    {
      name: "hermed-products",
      // Ensure all critical product fields survive page refresh
      partialize: (state) => ({
        products: state.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.category,
          image: p.image,
          inStock: p.inStock,
          slug: p.slug,
          description: p.description,
          features: p.features,
          badge: p.badge,
          sku: p.sku,
          rating: p.rating,
          reviews: p.reviews,
        })),
      }),
    },
  ),
);

// Auth Store (user authentication)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      users: [], // Keep all users and their orders here in state

      // Initialize with demo user if no users exist
      init: () => {
        if (get().users.length === 0) {
          const demoUser = {
            id: "demo",
            email: "demo@hermed.com",
            name: "Demo User",
            password: "demo123",
            createdAt: new Date().toISOString(),
            isAdmin: false,
            orders: [],
          };
          set({ users: [demoUser] });
        }
      },

      // User registration
      register: (userData) => {
        const { email, password, name } = userData;
        const users = get().users;

        if (users.some((u) => u.email === email)) {
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
          orders: [],
        };

        // Set as current user
        set({
          users: [...users, newUser],
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            orders: [],
          },
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
        const users = get().users;
        const u = users.find(
          (u) => u.email === email && u.password === password,
        );

        if (u) {
          set({
            user: {
              id: u.id,
              email: u.email,
              name: u.name,
              orders: u.orders || [],
            },
            isAdmin: false,
          });
          return { success: true, message: "Login successful" };
        }

        return { success: false, message: "Invalid email or password" };
      },

      // Logout
      logout: () => set({ user: null, isAdmin: false }),

      addOrder: (order) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.email === currentUser.email) {
              return { ...u, orders: [order, ...(u.orders || [])] };
            }
            return u;
          });

          return {
            users: updatedUsers,
            user: {
              ...currentUser,
              orders: [order, ...(currentUser.orders || [])],
            },
          };
        });
      },

      updateOrderStatus: (orderId, newStatus) => {
        set((state) => {
          let updatedActiveUser = state.user ? { ...state.user } : null;

          const updatedUsers = state.users.map((u) => {
            const hasOrder = u.orders?.some((o) => o.id === orderId);
            if (hasOrder) {
              const updatedOrders = u.orders.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o,
              );

              // Sync active session if this updated order belongs to the current user
              if (state.user && state.user.email === u.email) {
                updatedActiveUser = { ...state.user, orders: updatedOrders };
              }

              return { ...u, orders: updatedOrders };
            }
            return u;
          });

          return { users: updatedUsers, user: updatedActiveUser };
        });
      },

      // Check if user is logged in
      get isLoggedIn() {
        return get().user !== null;
      },
    }),
    {
      name: "hermed-auth",
      partialize: (state) => ({
        user: state.user,
        isAdmin: state.isAdmin,
        users: state.users,
      }),
    },
  ),
);

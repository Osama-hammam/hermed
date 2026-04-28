import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { products as fallbackProducts, categories as fallbackCategories } from "../data/products";

// ═══════════════════════════════════════════════════════════════
// CART STORE — stays in localStorage for instant UX
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// WISHLIST STORE — localStorage + Supabase sync when available
// ═══════════════════════════════════════════════════════════════
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().items.some((item) => item.id === product.id)) {
          set({ items: [...get().items, product] });
          // Sync to Supabase if available
          if (isSupabaseConfigured && supabase) {
            const userId = useAuthStore.getState().user?.id;
            if (userId) {
              supabase.from('wishlist').insert({ user_id: userId, product_id: product.id }).then();
            }
          }
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        if (isSupabaseConfigured && supabase) {
          const userId = useAuthStore.getState().user?.id;
          if (userId) {
            supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', id).then();
          }
        }
      },

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

// ═══════════════════════════════════════════════════════════════
// PRODUCT STORE — Supabase with fallback to local data
// ═══════════════════════════════════════════════════════════════
export const useProductStore = create((set, get) => ({
  products: [],
  categories: fallbackCategories,
  loading: false,
  initialized: false,

  fetchProducts: async () => {
    if (get().loading) return;
    set({ loading: true });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Map Supabase fields to app fields
          const mapped = data.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category_id,
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : null,
            rating: parseFloat(p.rating || 0),
            reviews: p.reviews || 0,
            badge: p.badge,
            image: p.image,
            images: p.images || [],
            description: p.description,
            features: p.features || [],
            inStock: p.in_stock,
            stockCount: p.stock_count,
            sku: p.sku,
          }));
          set({ products: mapped, loading: false, initialized: true });
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using fallback data');
      }
    }

    // Fallback to local data
    set({ products: fallbackProducts, loading: false, initialized: true });
  },

  addProduct: async (product) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').insert({
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        category_id: product.category,
        price: product.price,
        original_price: product.originalPrice || null,
        badge: product.badge || null,
        image: product.image,
        images: product.images || [],
        description: product.description,
        features: product.features || [],
        in_stock: (parseInt(product.stockCount) || 0) > 0,
        stock_count: parseInt(product.stockCount) || 0,
        sku: product.sku,
      }).select().single();

      if (!error && data) {
        await get().fetchProducts();
        return;
      }
    }

    // Fallback: add to local state
    const products = get().products;
    const newProduct = {
      ...product,
      id: Date.now(),
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      rating: 0,
      reviews: 0,
    };
    set({ products: [newProduct, ...products] });
  },

  updateProduct: async (id, updates) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').update({
        name: updates.name,
        slug: updates.slug || updates.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        category_id: updates.category,
        price: updates.price,
        original_price: updates.originalPrice || null,
        badge: updates.badge || null,
        image: updates.image,
        description: updates.description,
        features: updates.features || [],
        in_stock: updates.inStock,
        stock_count: updates.stockCount,
        sku: updates.sku,
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      if (!error) {
        await get().fetchProducts();
        return;
      }
    }

    // Fallback
    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    });
  },

  deleteProduct: async (id) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        await get().fetchProducts();
        return;
      }
    }

    // Fallback
    set({ products: get().products.filter((p) => p.id !== id) });
  },
}));

// ═══════════════════════════════════════════════════════════════
// AUTH STORE — Supabase Auth with localStorage fallback
// ═══════════════════════════════════════════════════════════════
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      loading: false,
      initialized: false,

      // Initialize auth — call once on app load
      init: async () => {
        if (get().initialized) return;

        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            set({
              user: {
                id: session.user.id,
                email: session.user.email,
                name: profile?.name || session.user.email?.split('@')[0],
              },
              isAdmin: profile?.role === 'admin',
              initialized: true,
            });
          } else {
            set({ initialized: true });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              set({
                user: {
                  id: session.user.id,
                  email: session.user.email,
                  name: profile?.name || session.user.email?.split('@')[0],
                },
                isAdmin: profile?.role === 'admin',
              });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAdmin: false });
            }
          });
        } else {
          set({ initialized: true });
        }
      },

      // Register
      register: async (userData) => {
        const { email, password, name } = userData;

        if (isSupabaseConfigured && supabase) {
          set({ loading: true });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });

          set({ loading: false });

          if (error) {
            return { success: false, message: error.message };
          }

          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: name,
              },
              isAdmin: false,
            });
            return { success: true, message: "Account created successfully" };
          }
          return { success: true, message: "Check your email for confirmation" };
        }

        // Fallback — demo mode
        set({
          user: { id: Date.now().toString(), email, name },
          isAdmin: false,
        });
        return { success: true, message: "Account created (demo mode)" };
      },

      // Login
      login: async (email, password) => {
        if (isSupabaseConfigured && supabase) {
          set({ loading: true });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          set({ loading: false });

          if (error) {
            return { success: false, message: error.message };
          }

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            set({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: profile?.name || data.user.email?.split('@')[0],
              },
              isAdmin: profile?.role === 'admin',
            });
            return { success: true, message: "Login successful" };
          }
        }

        // Fallback — demo mode
        if (email === "demo@hermed.com" && password === "demo123") {
          set({
            user: { id: "demo", email, name: "Demo User" },
            isAdmin: false,
          });
          return { success: true, message: "Login successful (demo)" };
        }
        if (email === "admin@hermed.com" && password === "admin123") {
          set({
            user: { id: "admin", email, name: "Admin" },
            isAdmin: true,
          });
          return { success: true, message: "Admin login (demo)" };
        }
        return { success: false, message: "Invalid email or password" };
      },

      // Logout
      logout: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signOut();
        }
        set({ user: null, isAdmin: false });
      },

      // Place order
      addOrder: async (order) => {
        if (isSupabaseConfigured && supabase) {
          const currentUser = get().user;
          if (!currentUser) return;

          const { error } = await supabase.from('orders').insert({
            id: order.id,
            user_id: currentUser.id,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_phone: order.customerPhone,
            shipping_address: order.shippingAddress,
            shipping_city: order.shippingCity,
            shipping_country: order.shippingCountry || 'Egypt',
            notes: order.notes,
            payment_method: order.paymentMethod,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
            status: 'Processing',
          });

          if (!error && order.items) {
            const orderItems = order.items.map(item => ({
              order_id: order.id,
              product_id: item.id,
              product_name: item.name,
              product_image: item.image,
              quantity: item.qty,
              price: item.price,
            }));
            await supabase.from('order_items').insert(orderItems);
          }
        }
      },

      // Fetch user orders
      fetchUserOrders: async () => {
        if (isSupabaseConfigured && supabase) {
          const currentUser = get().user;
          if (!currentUser) return [];

          const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

          return data || [];
        }
        return [];
      },

      // Fetch all orders (admin)
      fetchAllOrders: async () => {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });
          return data || [];
        }
        return [];
      },

      // Update order status (admin)
      updateOrderStatus: async (orderId, newStatus) => {
        if (isSupabaseConfigured && supabase) {
          await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);
        }
      },

      get isLoggedIn() {
        return get().user !== null;
      },
    }),
    {
      name: "hermed-auth",
      partialize: (state) => ({
        user: state.user,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);

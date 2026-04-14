import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../store";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import Pagination from "../components/Pagination";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Shop() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const [searchParams, setSearchParams] = useSearchParams();
  const products = useProductStore((s) => s.products);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("default");

  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);
  const itemsPerPage = 20;

  useEffect(() => {
    const isSearchDiff = search !== (searchParams.get("search") || "");
    const isCategoryDiff = category !== (searchParams.get("category") || "");

    if (isSearchDiff || isCategoryDiff) {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (search) p.set("search", search);
          else p.delete("search");
          if (category) p.set("category", category);
          else p.delete("category");
          p.set("page", "1");
          return p;
        },
        { replace: true },
      );
    }
  }, [search, category, searchParams, setSearchParams]);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, search, sort]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const handlePageChange = (p) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", p.toString());
        return next;
      },
      { replace: true },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={contentRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 md:translate-y-10"}`}
    >
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
          Shop All Products
        </h1>
        <p className="text-slate-500 mt-1">
          Professional dental supplies for your clinic
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <CategorySidebar
            selected={category}
            onSelect={setCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input md:w-48 h-11 md:h-auto text-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500 mb-5">
            Showing{" "}
            <strong className="text-slate-700">{filtered.length}</strong>{" "}
            product{filtered.length !== 1 ? "s" : ""}
            {category && (
              <span>
                {" "}
                in{" "}
                <strong className="text-brand-600 capitalize">
                  {category}
                </strong>
              </span>
            )}
            {search && (
              <span>
                {" "}
                for "<strong className="text-brand-600">{search}</strong>"
              </span>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-2xl">
              <MagnifyingGlassIcon className="mx-auto w-14 h-14 text-slate-300 mb-4" />
              <h3 className="font-semibold text-slate-700 text-lg mb-2">
                No products found
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                className="btn-secondary hover:bg-slate-100 active:scale-[0.98] transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              key={page}
              className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5"
            >
              {paginated.map((p, index) => (
                <div
                  key={p.id}
                  className={`${contentVisible ? `animate-fade-in-up` : "opacity-0"}`}
                  style={{
                    animationDelay: `${(index % 6) * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

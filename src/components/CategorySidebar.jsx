import { categories } from "../data/products";
import {
  ShoppingBagIcon,
  WrenchIcon,
  ScissorsIcon,
  BeakerIcon,
  PhotoIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const categoryIcons = {
  handpieces: WrenchIcon,
  instruments: ScissorsIcon,
  materials: BeakerIcon,
  imaging: PhotoIcon,
  hygiene: ShieldCheckIcon,
  chairs: Squares2X2Icon,
  orthodontics: SparklesIcon,
  endodontics: ShieldCheckIcon,
};

export default function CategorySidebar({ selected, onSelect, counts = {} }) {
  return (
    <aside className="w-full">
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Squares2X2Icon className="w-4 h-4 text-brand-500" />
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelect("")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                selected === ""
                  ? "bg-brand-500 text-white font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBagIcon className="w-4 h-4" /> All Products
              </span>
              {counts["all"] !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${selected === "" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {counts["all"]}
                </span>
              )}
            </button>
          </li>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Squares2X2Icon;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    selected === cat.id
                      ? "bg-brand-500 text-white font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" /> {cat.name}
                  </span>
                  {counts[cat.id] !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${selected === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {counts[cat.id]}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

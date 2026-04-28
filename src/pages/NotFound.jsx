import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-enter min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-brand-100 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary text-center"
          >
            Go Home
          </Link>
          <Link
            to="/shop"
            className="btn-secondary text-center"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

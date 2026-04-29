import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-6 sm:px-16 py-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <img src="/hermed.jpeg" alt="HERMED" className="h-9 w-auto object-contain"
              onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=HERMED&background=6366f1&color=fff")} />
            <span className="font-bold text-slate-900 text-lg">HERMED</span>
          </div>

          {/* Success */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm mb-1">We sent a confirmation link to</p>
              <p className="text-brand-600 font-semibold mb-6">{formData.email}</p>
              <p className="text-slate-400 text-xs mb-8 leading-relaxed max-w-xs mx-auto">
                Click the link to verify your account. Check spam if you don't see it.
              </p>
              <Link to="/login" className="inline-block px-8 py-3 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
              <p className="text-slate-400 text-sm mb-8">Join HERMED to start ordering</p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Creating account…
                    </span>
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
                  Sign in
                </Link>
              </p>

              <div className="mt-6 text-center p-4 bg-brand-50 rounded-xl">
                <p className="text-xs text-brand-700">
                  🎉 <strong>Welcome Bonus:</strong> 15% off first order with code <strong>HERMED15</strong>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 items-center justify-center p-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-sm text-center">
          <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 mx-auto mb-8">
            <img src="/hermed.jpeg" alt="" className="h-7 w-auto object-contain"
              onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=H&background=6366f1&color=fff&size=28")} />
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Join thousands of<br />dental professionals
          </h2>
          <p className="text-brand-300/60 text-sm leading-relaxed mb-10">
            Get access to 500+ premium products, fast delivery, and exclusive member prices.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "500+", label: "Products" },
              { num: "2K+", label: "Clinics" },
              { num: "15+", label: "Years" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.06]">
                <div className="text-lg font-bold text-white">{s.num}</div>
                <div className="text-[11px] text-brand-300/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

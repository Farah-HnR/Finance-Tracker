import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import NetworkBackground from "../components/ui/NetworkBackground";

const EYE_STYLES = `
  @keyframes eyePop    { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes homeFlow  { 0%,100%{background-position:0% 50%}  50%{background-position:100% 50%} }
  @keyframes homeText  { 0%,100%{background-position:0% 50%}  50%{background-position:100% 50%} }
  @keyframes homePulse { 0%,100%{box-shadow:0 0 24px rgba(139,92,246,.55),0 0 48px rgba(99,102,241,.22),0 4px 20px rgba(0,0,18,.65)} 50%{box-shadow:0 0 44px rgba(139,92,246,.9),0 0 80px rgba(99,102,241,.4),0 4px 24px rgba(0,0,18,.7)} }
`;

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
    <path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeSlashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
    <path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function PasswordInput({ label, placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-blue-200">{label}</label>}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border bg-blue-950/60 px-4 py-3 pr-11 text-white placeholder-blue-400/50 outline-none transition-all duration-200
            ${error
              ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-blue-700/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            }`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(v => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/50 hover:text-blue-300 transition-colors duration-200 focus:outline-none"
        >
          <span key={show ? "off" : "on"} style={{display:"block", animation:"eyePop .18s ease-out"}}>
            {show ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function validate(email, password, confirm) {
  const errors = {};
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!confirm) errors.confirm = "Please confirm your password";
  else if (confirm !== password) errors.confirm = "Passwords do not match";
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-green-500"];
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form.email, form.password, form.confirm);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await register(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#020c1e" }}>
      <style>{EYE_STYLES}</style>
      <NetworkBackground />

      {/* Back to Home */}
      <div style={{position:"fixed",top:16,left:18,zIndex:50}}>
        <div style={{
          padding:"1.5px", borderRadius:13,
          background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#22d3ee,#6366f1,#8b5cf6,#6d28d9)",
          backgroundSize:"300% 300%",
          animation:"homeFlow 3s ease-in-out infinite, homePulse 3s ease-in-out infinite",
        }}>
          <Link to="/" style={{
            display:"flex", alignItems:"center", gap:9,
            padding:"8px 18px", borderRadius:11.5,
            background:"linear-gradient(135deg,rgba(4,6,26,.94),rgba(3,5,20,.96))",
            backdropFilter:"blur(18px)",
            textDecoration:"none",
          }}>
            <div style={{
              width:26, height:26, borderRadius:8, flexShrink:0,
              background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 14px rgba(139,92,246,.75), inset 0 0 6px rgba(255,255,255,.12)",
              fontSize:14, fontWeight:800, color:"#fff",
            }}>←</div>
            <span style={{
              fontSize:13.5, fontWeight:700, letterSpacing:".02em",
              background:"linear-gradient(90deg,#c084fc,#8b5cf6,#22d3ee,#8b5cf6,#c084fc)",
              backgroundSize:"200% 100%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              animation:"homeText 2.5s ease-in-out infinite",
            }}>Home</span>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-md" style={{ zIndex: 10 }}>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">FinanceBudget</h1>
          <p className="mt-1 text-sm text-blue-400">Start tracking your finances today</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-blue-800/40 bg-blue-950/40 p-8 shadow-2xl shadow-blue-900/30 backdrop-blur-xl">
          <h2 className="mb-1 text-xl font-semibold text-white">Create account</h2>
          <p className="mb-6 text-sm text-blue-400">Fill in the details below to get started</p>

          {apiError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />

            <div className="flex flex-col gap-1">
              <PasswordInput
                label="Password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />
              {form.password && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-blue-900"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-blue-400">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <PasswordInput
              label="Confirm password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
            />

            <Button type="submit" loading={loading} className="mt-2">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-blue-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-300 hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Features hint */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["Track Expenses", "Set Budgets", "View Reports"].map((f) => (
            <div key={f} className="rounded-xl border border-blue-800/30 bg-blue-900/20 px-3 py-2 text-center backdrop-blur-sm">
              <p className="text-xs text-blue-400">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

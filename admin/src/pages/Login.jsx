import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Clapperboard, Eye, EyeOff, Lock, Mail } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email: form.email,
        password: form.password,
      });

      if (!data.isAdmin) {
        toast.error("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_email", data.email || form.email);
      toast.success("Welcome back, Admin!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 44px 12px 16px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #09090f 0%, #0f0f1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Inter, sans-serif",
    }}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "linear-gradient(135deg, rgba(15,15,26,0.95), rgba(10,10,18,0.98))",
        border: "1px solid rgba(220,38,38,0.2)",
        borderRadius: "20px",
        padding: "40px 36px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.05)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Clapperboard size={28} style={{ color: "#f87171" }} />
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            ADMIN ACCESS
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            CineVerse Management Portal
          </p>
        </div>

        {/* Red bar accent */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #dc2626, #ef4444, transparent)",
          borderRadius: "2px",
          marginBottom: "28px",
        }} />

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="admin@cineverse.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "rgba(220,38,38,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <Mail size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#4b5563", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "rgba(220,38,38,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0, color: "#4b5563",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading ? "rgba(220,38,38,0.5)" : "linear-gradient(135deg, #dc2626, #b91c1c)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: "6px",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Verifying...
              </>
            ) : (
              <>
                <Lock size={15} />
                ACCESS ADMIN PANEL
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#374151", marginTop: "20px" }}>
          Restricted to authorised personnel only.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4b5563; }
      `}</style>
    </div>
  );
}

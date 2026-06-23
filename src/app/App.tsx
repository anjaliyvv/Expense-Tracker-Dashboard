import { useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup, signOut, onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase.ts";
import {
  LayoutDashboard, Receipt, Target, BarChart3, User,
  LogOut, Search, Bell, Plus, ArrowUpRight, ArrowDownRight,
  TrendingUp, Wallet, Pencil, Trash2, X, Eye, EyeOff,
  Coffee, ShoppingBag, Bus, BookOpen, Home, Utensils,
  Gamepad2, Phone, Mail, Menu, ChevronRight,
  Heart, AlertCircle, CheckCircle, Zap, Camera, Download,
  CreditCard, Settings as SettingsIcon, Filter, Briefcase
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Types ─────────────────────────────────────────────
type AppPage = "dashboard" | "transactions" | "budget" | "analytics" | "profile";

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}
type Budget = {
  category: string;
  budgeted: number;
  color: string;
  Icon: any;
  spent: number;
  remaining: number;
};
// ─── Category Config ────────────────────────────────────
const CAT: Record<string, { color: string; Icon: React.ElementType }> = {
  "Housing": { color: "#6366F1", Icon: Home },
  "Food & Dining": { color: "#F59E0B", Icon: Utensils },
  "Transport": { color: "#06B6D4", Icon: Bus },
  "Education": { color: "#3B82F6", Icon: BookOpen },
  "Shopping": { color: "#EC4899", Icon: ShoppingBag },
  "Entertainment": { color: "#8B5CF6", Icon: Gamepad2 },
  "Coffee": { color: "#B45309", Icon: Coffee },
  "Health": { color: "#10B981", Icon: Heart },
  "Income": { color: "#10B981", Icon: Wallet },
  "Freelance": { color: "#059669", Icon: Zap },
};
const EXPENSE_CATS = ["Housing", "Food & Dining", "Transport", "Education", "Shopping", "Entertainment", "Coffee", "Health"];
const INCOME_CATS = ["Income", "Freelance"];

const fmt = (n: number) => "₹" + Math.abs(n).toLocaleString("en-IN");

// ══════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════


function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Google Authentication Handler
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setError(error.message || "Failed to authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Email and Password Routing Logic
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (mode === "login") {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register a completely new user
        await createUserWithEmailAndPassword(auth, email, password);
      }

      onLogin();
    } catch (error: any) {
      console.error("Auth Exception Raised:", error);
      if (mode === "login") {
        setError("Invalid email or password.");
      } else {
        // Gives readable feedback from Firebase (e.g., weak-password, email-already-in-use)
        setError(error.message || "Failed to create an account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">

      {/* LOGIN BOX */}
      <div className="w-full max-w-[380px]">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>

          <div>
            <p className="font-bold text-[#0B1437] text-lg">SpendSmart</p>
            <p className="text-xs text-slate-400">Student Finance · India</p>
          </div>
        </div>

        {/* TITLE (Changes dynamically based on mode) */}
        <h1 className="text-[28px] font-bold text-[#0B1437]">
          {mode === "login" ? "Welcome back 👋" : "Create Account 🚀"}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {mode === "login" ? "Sign in to continue" : "Sign up for free to start tracking your finances"}
        </p>

        {/* GOOGLE ACC SIGNUP / SIGNIN BUTTON */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-semibold text-sm text-[#0B1437] transition-colors shadow-sm mb-4 disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.2 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.9 1.9 14.7 1 12.2 1 7.4 1 3.4 3.8 1.6 7.8l3.4 2.6c.8-2.4 3.1-4 5.6-4z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12.2v4.5h6.3c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.1-2 3.7-4.9 3.7-8.8z" />
            <path fill="#FBBC05" d="M5 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.6C.6 9.5 0 11.7 0 14s.6 4.5 1.6 6.4l3.4-2.6z" />
            <path fill="#34A853" d="M12.2 23c3.3 0 6.1-1.1 8.1-3l-3.7-2.9c-1.1.7-2.6 1.2-4.4 1.2-4.1 0-7.6-2.8-8.8-6.6L1.6 14.3C3.4 20.2 8.3 23 12.2 23z" />
          </svg>
          {mode === "login" ? "Continue with Google" : "Sign Up with Google"}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-[10px] font-bold text-slate-300 uppercase px-3 tracking-wider">or email</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#0B1437]"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#0B1437]"
            />

            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* ERROR BOUNDARY ALERT */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
          </div>
        )}

        {/* OPTIONS BAR */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
            <input type="checkbox" className="rounded border-slate-300 accent-blue-600" defaultChecked />
            Remember me
          </label>
          {mode === "login" && (
            <button type="button" className="text-sm text-[#2563EB] font-semibold hover:underline">
              Forgot password?
            </button>
          )}
        </div>

        {/* MAIN PRIMARY CTA BUTTON */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : mode === "login" ? "Sign in" : "Register Now"}
        </button>

        {/* DYNAMIC MODE TOGGLE LINK */}
        <p className="text-center text-sm text-slate-400 mt-5">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className="text-[#2563EB] font-bold hover:underline cursor-pointer"
              >
                Create one for free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-[#2563EB] font-bold hover:underline cursor-pointer"
              >
                Sign In instead
              </button>
            </>
          )}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100"></div>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 SpendSmart. All rights reserved.
        </p>

      </div>
    </div>
  );
}

// Export array safely below component definition block
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", Icon: Receipt },
  { id: "budget", label: "Budgets", Icon: Target },
  { id: "analytics", label: "Reports", Icon: BarChart3 },
  { id: "profile", label: "Profile", Icon: User },
];

// ══════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════
function Sidebar({
  active,
  setPage,
  onLogout,
  open,
  profile
}: {
  active: AppPage;
  setPage: (p: AppPage) => void;
  onLogout: () => void;
  open: boolean;
  profile: {
    name: string;
    occupation?: string;
  };
}) {
  return (
    <aside className={`fixed top-0 left-0 h-screen z-30 w-[240px] bg-[#0B1437] flex flex-col transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-[15px] leading-tight">SpendSmart</p>
          <p className="text-[11px] text-blue-300/50 font-medium">Student Finance</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-blue-300/30 uppercase tracking-[0.15em] px-3 mb-3">Main Menu</p>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id as AppPage)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${isActive
                ? "bg-[#2563EB] text-white shadow-lg shadow-blue-600/25"
                : "text-blue-200/50 hover:text-white hover:bg-white/6"
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-blue-300/40 group-hover:text-blue-200"}`} />
              {label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/5">
          <p className="text-[10px] font-bold text-blue-300/30 uppercase tracking-[0.15em] px-3 mb-3">Account</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-200/50 hover:text-white hover:bg-white/6 transition-all cursor-pointer group">
            <SettingsIcon className="w-4 h-4 flex-shrink-0 text-blue-300/40 group-hover:text-blue-200" />
            Settings
          </button>
        </div>
      </nav>

      {/* User + Logout */}

      <div className="px-3 pb-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/4 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {profile.name
              ? profile.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
              : "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">
              {profile.name || "User"}
            </p>

            <p className="text-xs text-blue-300/40 truncate">
              {profile.occupation || "Student"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>

    </aside>
  );
}

// ══════════════════════════════════════════════════════════
// TOP BAR
// ══════════════════════════════════════════════════════════
function TopBar({ page, onMenuClick, onAdd }: { page: AppPage; onMenuClick: () => void; onAdd: () => void }) {
  const titles: Record<AppPage, string> = {
    dashboard: "Dashboard", transactions: "Transactions",
    budget: "Budgets", analytics: "Analytics", profile: "Profile & Settings",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-4 lg:px-7 flex-shrink-0 shadow-sm">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
        <Menu className="w-5 h-5 text-slate-600" />
      </button>
      <h1 className="font-bold text-[#0B1437] text-lg flex-shrink-0 hidden sm:block">{titles[page]}</h1>
      <div className="flex-1 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input placeholder="Search…" className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-300 transition-all placeholder:text-slate-300" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-200 active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">Add Transaction</span>
        </button>
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* DYNAMIC AVATAR REPLACEMENT */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white cursor-pointer shadow">
          {auth.currentUser?.displayName ? (
            auth.currentUser.displayName
              .trim()
              .split(" ")
              .map((word: string) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          ) : auth.currentUser?.email ? (
            // Fallback to first 2 letters of email if display name is processing
            auth.currentUser.email.slice(0, 2).toUpperCase()
          ) : (
            "US"
          )}
        </div>
      </div>
    </header>
  );
}

// ══════════════════════════════════════════════════════════
// STAT CARD
// ══════════════════════════════════════════════════════════
function StatCard({ title, value, change, positive, icon: Icon, dark = false, iconBg = "bg-blue-50", iconColor = "text-blue-600" }: {
  title: string; value: string; change: string; positive: boolean;
  icon: React.ElementType; dark?: boolean; iconBg?: string; iconColor?: string;
}) {
  if (dark) {
    return (
      <div className="bg-gradient-to-br from-[#0B1437] via-[#0F2464] to-[#1E40AF] rounded-2xl p-5 text-white relative overflow-hidden shadow-xl shadow-blue-900/30">
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-2 w-36 h-36 rounded-full bg-white/4" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-200/70 text-[11px] font-bold uppercase tracking-widest">{title}</p>
            <div className="p-1.5 bg-white/10 rounded-lg"><Icon className="w-4 h-4 text-blue-200" /></div>
          </div>
          <p className="text-[26px] font-bold mb-1.5 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{value}</p>
          <div className="flex items-center gap-1 text-emerald-300 text-xs font-semibold">
            <ArrowUpRight className="w-3 h-3" />{change} from last month
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-xl ${iconBg}`}><Icon className={`w-4 h-4 ${iconColor}`} /></div>
      </div>
      <p className="text-[22px] font-bold text-[#0B1437] mb-1.5 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{value}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span>{change} vs last month</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ══════════════════════════════════════════════════════════
function DashboardPage({
  transactions,
  onAdd,
  monthlyData,
  profile
}: {
  transactions: Transaction[];
  onAdd: () => void;
  monthlyData: any[];
  profile: any;
}) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : "0";

  const catMap: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
  });
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value, color: CAT[name]?.color ?? "#94A3B8" }));

  const CustomPieTip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-3 py-2 text-xs">
          <p className="text-slate-500 mb-0.5">{payload[0].name}</p>
          <p className="font-bold text-[#0B1437]" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-3 text-xs space-y-1">
          <p className="font-bold text-[#0B1437] mb-2">{label} 2026</p>
          {payload.map(p => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-500">{p.name}</span>
              </div>
              <span className="font-bold text-[#0B1437]" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  const transactionCount = transactions.length;

  const avgIncome =
    transactions.filter(t => t.type === "income").length > 0
      ? totalIncome /
      transactions.filter(t => t.type === "income").length
      : 0;

  const avgExpense =
    transactions.filter(t => t.type === "expense").length > 0
      ? totalExpense /
      transactions.filter(t => t.type === "expense").length
      : 0;

  const totalBalance =
    Number(profile.balance || 0) +
    totalIncome -
    totalExpense;
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={fmt(totalBalance)}
          change="Available Funds"
          positive
          dark
          icon={Wallet}
        />

        <StatCard
          title="Monthly Income"
          value={fmt(totalIncome)}
          change={`Avg ${fmt(avgIncome)}`}
          positive
          icon={ArrowUpRight}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Monthly Expenses"
          value={fmt(totalExpense)}
          change={`Avg ${fmt(avgExpense)}`}
          positive={false}
          icon={ArrowDownRight}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />

        <StatCard
          title="Savings"
          value={fmt(savings)}
          change={`${savingsRate}% saved`}
          positive={savings >= 0}
          icon={TrendingUp}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-[#0B1437]">Monthly Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Income vs Expenses · 2026</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-500 rounded-full" /><span className="text-slate-500 font-medium">Income</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-red-400 rounded-full" /><span className="text-slate-500 font-medium">Expenses</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gEx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomAreaTip />} />
              <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#gIn)" strokeWidth={2.5} name="Income" dot={false} activeDot={{ r: 5, fill: "#10B981", stroke: "white", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#gEx)" strokeWidth={2.5} name="Expenses" dot={false} activeDot={{ r: 5, fill: "#EF4444", stroke: "white", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-[#0B1437] mb-0.5">Expense Breakdown</h2>
          <p className="text-xs text-slate-400 mb-4">June 2026</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={74} paddingAngle={3} dataKey="value" stroke="none">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomPieTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.slice(0, 5).map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-500 flex-1 truncate">{d.name}</span>
                <span className="text-xs font-bold text-[#0B1437] tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-[#0B1437]">Recent Transactions</h2>
          <button className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.slice(0, 6).map((tx) => {
            const cfg = CAT[tx.category] ?? { color: "#94A3B8", Icon: CreditCard };
            const Icon = cfg.Icon;
            return (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.color + "18" }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B1437] truncate">{tx.name}</p>
                  <p className="text-xs text-slate-400">{tx.category} · {tx.date}</p>
                </div>
                <p className="text-sm font-bold tabular-nums flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: tx.type === "income" ? "#10B981" : "#EF4444" }}>
                  {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3.5 border-t border-slate-50 bg-slate-50/40">
          <button onClick={onAdd} className="flex items-center gap-2 text-xs text-[#2563EB] font-bold hover:underline">
            <Plus className="w-3.5 h-3.5" />Add new transaction
          </button>
        </div>
      </div>
    </div>
  );
  <button
    onClick={() => signOut(auth)}
  >
    Logout
  </button>
}

// ══════════════════════════════════════════════════════════
// TRANSACTION MODAL
// ══════════════════════════════════════════════════════════
function TransactionModal({ tx, onSave, onClose }: {
  tx: Transaction | null;
  onSave: (t: Transaction) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: tx?.name ?? "",
    amount: tx ? String(Math.abs(tx.amount)) : "",
    category: tx?.category ?? "Food & Dining",
    date: tx?.date ?? new Date().toISOString().split("T")[0],
    type: (tx?.type ?? "expense") as "income" | "expense",
  });
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.amount) { setError("Please fill in all required fields."); return; }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) { setError("Please enter a valid positive amount."); return; }
    onSave({
      id: tx?.id ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      amount: form.type === "expense" ? -amt : amt,
      date: form.date,
      type: form.type,
    });
  };

  const catOptions = form.type === "income" ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-[#0B1437] text-lg">{tx ? "Edit Transaction" : "New Transaction"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
            {(["expense", "income"] as const).map((t) => (
              <button key={t} onClick={() => { set("type", t); set("category", t === "income" ? "Income" : "Food & Dining"); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${form.type === t
                  ? t === "income" ? "bg-emerald-500 text-white shadow-sm" : "bg-red-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
                  }`}
              >
                {t === "income" ? "💰 Income" : "💸 Expense"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. BigBasket Groceries"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[#0B1437] placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount (₹) *</label>
              <input type="number" min="0" value={form.amount} onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[#0B1437] placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[#0B1437]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[#0B1437] cursor-pointer"
            >
              {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={handleSave}
            className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors cursor-pointer shadow-lg ${form.type === "income" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" : "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-blue-200"}`}
          >
            {tx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TRANSACTIONS PAGE
// ══════════════════════════════════════════════════════════
function TransactionsPage({ transactions, setTransactions, onEdit }: {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onEdit: (tx: Transaction) => void;
}) {
  const [search, setSearch] = useState("");
  const [catFil, setCatFil] = useState("All");
  const [typeFil, setTypeFil] = useState<"all" | "income" | "expense">("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = transactions.filter(tx =>
    tx.name.toLowerCase().includes(search.toLowerCase()) &&
    (catFil === "All" || tx.category === catFil) &&
    (typeFil === "all" || tx.type === typeFil)
  );

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-300 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={catFil} onChange={(e) => setCatFil(e.target.value)}
              className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-medium">
              <option value="All">All Categories</option>
              {Object.keys(CAT).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-1 p-1.5 bg-slate-50 border border-slate-100 rounded-xl">
              {(["all", "income", "expense"] as const).map(t => (
                <button key={t} onClick={() => setTypeFil(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${typeFil === t ? "bg-white text-[#0B1437] shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
                  {t}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer font-medium">
              <Download className="w-4 h-4" /><span className="hidden sm:block">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Category</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Date</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Type</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-sm text-slate-400">No transactions match your filters.</td></tr>
              )}
              {filtered.map((tx) => {
                const cfg = CAT[tx.category] ?? { color: "#94A3B8", Icon: CreditCard };
                const TxIcon = cfg.Icon;
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.color + "15" }}>
                          <TxIcon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0B1437] truncate">{tx.name}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{tx.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold border" style={{ backgroundColor: cfg.color + "10", borderColor: cfg.color + "25", color: cfg.color }}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-500 font-medium">{tx.date}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${tx.type === "income" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-bold tabular-nums" style={{ fontFamily: "'DM Mono', monospace", color: tx.type === "income" ? "#10B981" : "#EF4444" }}>
                        {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(tx)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-300 hover:text-blue-500 transition-colors cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(tx.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
          <span>Showing all results</span>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-[#0B1437] text-lg mb-1">Delete Transaction?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The transaction will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => { setTransactions(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null); }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// BUDGET PAGE
// ══════════════════════════════════════════════════════════

function BudgetPage({
  transactions,
  budgets,
  monthlyBudget,
  setMonthlyBudget
}: {
  transactions: Transaction[];
  budgets: any[];
  monthlyBudget: number;
  setMonthlyBudget: React.Dispatch<React.SetStateAction<number>>;
}) {
  const spent: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    spent[t.category] = (spent[t.category] || 0) + Math.abs(t.amount);
  });

  const totalBudgeted = monthlyBudget;

  const totalSpent = budgets.reduce(
    (s: number, b: { category: string | number; }) => s + (spent[b.category] || 0),
    0
  );

  const overBudgetCount = budgets.filter(
    (b: { category: string | number; budgeted: number; }) => (spent[b.category] || 0) > b.budgeted
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border">
        <label className="block text-sm font-semibold mb-2">
          Monthly Budget
        </label>

        <input
          type="number"
          value={monthlyBudget}
          onChange={(e) =>
            setMonthlyBudget(Number(e.target.value))
          }
          placeholder="Enter monthly budget"
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>
      {/* Overview strip */}
      <div className="bg-gradient-to-br from-[#0B1437] via-[#0F2464] to-[#1E40AF] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-200/60 text-[11px] font-bold uppercase tracking-widest mb-1">June 2026 · Monthly Budget</p>
            <p className="text-[32px] font-bold tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(totalBudgeted)}</p>
          </div>
          <div className="flex gap-6 sm:gap-10">
            <div>
              <p className="text-blue-200/60 text-xs font-semibold mb-1">Spent</p>
              <p className="text-2xl font-bold tabular-nums text-red-300" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(totalSpent)}</p>
            </div>
            <div>
              <p className="text-blue-200/60 text-xs font-semibold mb-1">Remaining</p>
              <p className="text-2xl font-bold tabular-nums text-emerald-300" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(totalBudgeted - totalSpent)}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-blue-200/60 font-semibold mb-2">
            <span>Overall budget used · {overBudgetCount > 0 ? `${overBudgetCount} categor${overBudgetCount > 1 ? "ies" : "y"} over limit` : "All within limits"}</span>
            <span>{Math.round((totalSpent / totalBudgeted) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-700" style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Budget cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {budgets.map((b) => {
          const s = spent[b.category] || 0;
          const pct = Math.round((s / b.budgeted) * 100);
          const over = pct > 100;
          const near = pct >= 80 && !over;
          const BIcon = b.Icon;
          return (
            <div key={b.category} className={`bg-white rounded-2xl border shadow-sm p-5 transition-shadow hover:shadow-md ${over ? "border-red-100" : "border-slate-100"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: b.color + "15" }}>
                  <BIcon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0B1437] text-sm truncate">{b.category}</p>
                  {over && <div className="flex items-center gap-1 text-red-500 text-[11px] font-semibold"><AlertCircle className="w-3 h-3" />Over budget</div>}
                  {near && <div className="text-amber-500 text-[11px] font-semibold">Near limit</div>}
                  {!over && !near && <div className="text-slate-400 text-[11px]">On track</div>}
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? "#EF4444" : near ? "#F59E0B" : b.color }} />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-base font-bold tabular-nums" style={{ fontFamily: "'DM Mono', monospace", color: over ? "#EF4444" : "#0B1437" }}>{fmt(s)}</p>
                <p className="text-xs text-slate-400 tabular-nums font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>/ {fmt(b.budgeted)}</p>
              </div>
              <p className="text-xs mt-1 font-semibold" style={{ color: over ? "#EF4444" : "#94A3B8" }}>
                {over ? `Over by ${fmt(s - b.budgeted)}` : `${pct}% used · ${fmt(b.budgeted - s)} left`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// REPORTS PAGE
// ══════════════════════════════════════════════════════════
function ReportsPage({
  transactions,
  monthlyData
}: {
  transactions: Transaction[];
  monthlyData: any[];
}) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExp = Math.abs(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const net = totalIncome - totalExp;
  const savingsRate = totalIncome > 0 ? ((net / totalIncome) * 100).toFixed(1) : "0";

  const catMap: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
  });
  const barData = Object.entries(catMap).map(([name, value]) => ({ name: name.split(" ")[0], full: name, value, color: CAT[name]?.color ?? "#94A3B8" })).sort((a, b) => b.value - a.value);
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value, color: CAT[name]?.color ?? "#94A3B8" }));

  const CustomBar = (props: { fill?: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => {
    const { x = 0, y = 0, width = 0, height = 0, color } = props;
    return <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={color} />;
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Income", value: fmt(totalIncome), icon: ArrowUpRight, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", change: "+5.2%", positive: true },
          { label: "Total Expenses", value: fmt(totalExp), icon: ArrowDownRight, iconBg: "bg-red-50", iconColor: "text-red-500", change: "+8.1%", positive: false },
          { label: "Net Savings", value: fmt(net), icon: TrendingUp, iconBg: "bg-blue-50", iconColor: "text-blue-600", change: "+14.2%", positive: true },
          { label: "Savings Rate", value: `${savingsRate}%`, icon: Target, iconBg: "bg-purple-50", iconColor: "text-purple-600", change: "+2.1%", positive: true },
        ].map((s) => (
          <StatCard key={s.label} title={s.label} value={s.value} change={s.change} positive={s.positive} icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Income vs Expenses area */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-[#0B1437] mb-0.5">Income vs Expenses</h2>
          <p className="text-xs text-slate-400 mb-5">Monthly trend · Jan–Jun 2026</p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ri" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="re" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", fontSize: "12px", padding: "10px 14px" }} formatter={(v: number) => [fmt(v), ""]} labelStyle={{ fontWeight: 700, color: "#0B1437" }} />
              <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#ri)" strokeWidth={2.5} name="Income" dot={false} activeDot={{ r: 5, fill: "#10B981", stroke: "white", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#re)" strokeWidth={2.5} name="Expenses" dot={false} activeDot={{ r: 5, fill: "#EF4444", stroke: "white", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-[#0B1437] mb-0.5">Spending by Category</h2>
          <p className="text-xs text-slate-400 mb-5">June 2026 breakdown</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", fontSize: "12px", padding: "10px 14px" }} formatter={(v: number) => [fmt(v), ""]} labelStyle={{ fontWeight: 700, color: "#0B1437" }} />
              <Bar dataKey="value" name="Spending" radius={[6, 6, 0, 0]} shape={(props: { fill?: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => <CustomBar {...props} />}>
                {barData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + monthly table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-[#0B1437] mb-0.5">Category Breakdown</h2>
          <p className="text-xs text-slate-400 mb-4">% share of total expenses</p>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={74} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} formatter={(v: number) => [fmt(v), ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-500 flex-1 truncate font-medium">{d.name}</span>
                  <span className="text-xs font-bold text-[#0B1437]">{totalExp > 0 ? Math.round((d.value / totalExp) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="font-bold text-[#0B1437]">Monthly Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">2026 at a glance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/40">
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Month</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Income</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expenses</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthlyData.map((r) => {
                  const s = r.income - r.expenses;
                  return (
                    <tr key={r.month} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-bold text-[#0B1437]">{r.month} 2026</td>
                      <td className="px-5 py-3.5 text-right text-sm tabular-nums text-emerald-600 font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(r.income)}</td>
                      <td className="px-5 py-3.5 text-right text-sm tabular-nums text-red-500 font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(r.expenses)}</td>
                      <td className="px-5 py-3.5 text-right text-sm tabular-nums text-[#2563EB] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════════════════
function ProfilePage({
  profile,
  setProfile,
  darkMode,
  setDarkMode
}: {
  profile: {
    name: string;
    occupation?: string;
    email?: string;
    phone?: string;
    balance?: number;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [occupation, setOccupation] = useState(profile.occupation || "");
  const [balance, setBalance] = useState(String(profile.balance ?? 0));
  const [currency, setCurrency] = useState("INR");
  const [notifs, setNotifs] = useState({
    budget: true,
    weekly: true,
    tips: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile({
      name,
      email,
      phone,
      occupation,
      balance: parseFloat(balance) || 0
    });


    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${on ? "bg-[#2563EB]" : "bg-slate-200"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${on ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="space-y-5 max-w-full">

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-[#0B1437] via-[#1530A0] to-[#2563EB] relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-4 border-white flex items-center justify-center text-2xl font-black text-white shadow-xl">
                  {name
                    ? name
                      .split(" ")
                      .map(word => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                    : "U"}
                </div>

                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#1D4ED8] transition-colors shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md ${saved ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-blue-200"}`}>
              {saved ? <><CheckCircle className="w-4 h-4" />Saved!</> : "Save Changes"}
            </button>
          </div>
          <h2 className="font-bold text-[#0B1437] text-xl">{name}</h2>
          <p className="text-slate-400 text-sm mt-0.5">Track expenses • Build budgets • Save more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-50">
            {[
              { Icon: Mail, text: email },
              { Icon: Phone, text: phone },
              { Icon: Target, text: "Track • Budget • Save" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                <Icon className="w-4 h-4 text-[#2563EB] flex-shrink-0" /><span className="truncate">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-[#0B1437] mb-5">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Full Name",
              value: name,
              set: setName,
              type: "text",
              icon: null,
            },
            {
              label: "Email",
              value: email,
              set: setEmail,
              type: "email",
              icon: Mail,
            },
            {
              label: "Phone",
              value: phone,
              set: setPhone,
              type: "tel",
              icon: Phone,
            },
            {
              label: "Occupation",
              value: occupation,
              set: setOccupation,
              type: "text",
              icon: Target,
            },
            {
              label: "Current Balance",
              value: balance,
              set: setBalance,
              type: "number",
              icon: Wallet,
            },
          ].map(({ label, value, set, type, icon: FieldIcon }) => (
            <div key={label}>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
              </label>

              <div className="relative">
                {FieldIcon && (
                  <FieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                )}

                <input
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className={`w-full py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[#0B1437] ${FieldIcon ? "pl-10 pr-4" : "px-4"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-[#0B1437] mb-5">Preferences</h3>
        <div className="space-y-0 divide-y divide-slate-50">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-bold text-[#0B1437]">Currency</p>
              <p className="text-xs text-slate-400 mt-0.5">Preferred display currency</p>
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-[#0B1437] focus:outline-none font-semibold cursor-pointer">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-bold text-[#0B1437]">Dark Mode</p>
              <p className="text-xs text-slate-400 mt-0.5">Switch interface to dark theme</p>
            </div>
            <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
          {[
            { key: "budget", label: "Budget Alerts", desc: "Alert when near or over budget limit" },
            { key: "weekly", label: "Weekly Summary", desc: "Receive a weekly spending digest" },
            { key: "tips", label: "Saving Tips", desc: "Personalized insights and tips" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-bold text-[#0B1437]">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <Toggle on={notifs[key as keyof typeof notifs]} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof n] }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h3 className="font-bold text-red-500 mb-4 text-sm uppercase tracking-widest">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B1437]">Delete Account</p>
            <p className="text-xs text-slate-400 mt-0.5">Permanently remove your account and all data</p>
          </div>
          <button className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// APP (MAIN)
// ══════════════════════════════════════════════════════════
export default function App() {
  const [activePage, setActivePage] = useState<AppPage>("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // Unified Single Source of Truth for Auth
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", phone: "", occupation: "", balance: 0 };
  });

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    return Number(localStorage.getItem("monthlyBudget")) || 0;
  });

  // Local Storage Synchronization
  useEffect(() => {
    localStorage.setItem("monthlyBudget", String(monthlyBudget));
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Data Computations
  const monthlyData = useMemo(() => {
    const map: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleString("en-US", { month: "short" });
      if (!map[month]) map[month] = { income: 0, expenses: 0 };

      if (tx.type === "income") {
        map[month].income += tx.amount;
      } else {
        map[month].expenses += Math.abs(tx.amount);
      }
    });
    return Object.entries(map).map(([month, val]) => ({
      month,
      income: val.income,
      expenses: val.expenses,
    }));
  }, [transactions]);

  const budgets = useMemo(() => {
    return [
      { category: "Housing", budgeted: 10000, color: "#6366F1", Icon: Home },
      { category: "Food & Dining", budgeted: 3000, color: "#F59E0B", Icon: Utensils },
      { category: "Shopping", budgeted: 2000, color: "#EC4899", Icon: ShoppingBag },
      { category: "Transport", budgeted: 1500, color: "#06B6D4", Icon: Bus },
      { category: "Education", budgeted: 2000, color: "#3B82F6", Icon: BookOpen },
      { category: "Entertainment", budgeted: 500, color: "#8B5CF6", Icon: Gamepad2 },
      { category: "Coffee", budgeted: 300, color: "#B45309", Icon: Coffee },
      { category: "Health", budgeted: 1000, color: "#10B981", Icon: Heart },
    ].map(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        ...b,
        spent,
        remaining: b.budgeted - spent,
      };
    });
  }, [transactions]);

  // Transaction Actions
  const openAdd = () => { setEditTx(null); setShowModal(true); };
  const openEdit = (tx: Transaction) => { setEditTx(tx); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTx(null); };

  const handleSaveTx = (tx: Transaction) => {
    if (editTx) {
      setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    } else {
      setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
    }
    closeModal();
  };

  // Structured View Management
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F0F4FF]">
        <p className="text-sm font-bold text-[#0B1437]">Loading your financials...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => { }} />;
  }

  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-950 text-white" : "bg-[#F0F4FF]"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        active={activePage}
        setPage={(p) => { setActivePage(p); setSidebarOpen(false); }}
        onLogout={() => signOut(auth)} // Fires proper Firebase Signout hook now!
        open={sidebarOpen}
        profile={profile}
      />

      <div className="flex-1 flex flex-col lg:pl-[240px] overflow-hidden min-w-0">
        <TopBar page={activePage} onMenuClick={() => setSidebarOpen(true)} onAdd={openAdd} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activePage === "dashboard" && (
            <DashboardPage
              transactions={transactions}
              onAdd={openAdd}
              monthlyData={monthlyData}
              profile={profile}
            />
          )}
          {activePage === "transactions" && (
            <TransactionsPage
              transactions={transactions}
              setTransactions={setTransactions}
              onEdit={openEdit}
            />
          )}
          {activePage === "budget" && (
            <BudgetPage
              transactions={transactions}
              budgets={budgets}
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
            />
          )}
          {activePage === "analytics" && (
            <ReportsPage
              transactions={transactions}
              monthlyData={monthlyData}
            />
          )}
          {activePage === "profile" && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </main>
      </div>

      {showModal && (
        <TransactionModal tx={editTx} onSave={handleSaveTx} onClose={closeModal} />
      )}
    </div>
  );
}

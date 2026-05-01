import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, Sparkles, Users, FileSearch, MessageSquare,
  Settings, Search, Bell, ChevronRight, Plus, X, Check, Filter,
  TrendingUp, Target, Zap, Brain, Send, Bot, Star, MapPin,
  ArrowUpRight, Linkedin, Database, UserPlus,
  Award, AlertCircle, ThumbsUp, ThumbsDown, Pause, GripVertical, Trash2,
  Edit3, Save, Sliders, Layers, FileText, Clock, ChevronDown
} from "lucide-react";

/* ============================================================
   SUPABASE STUBS — wire to a real Postgres instance later.
   ============================================================ */
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
//
// Tables:
//   requisitions   (id, title, jd, status, created_at, project_id, budget, exp_min, exp_max)
//   candidates     (id, name, title, exp_years, skills[], match_score, source, stage, requisition_id)
//   pipeline_stages(id, name, order_idx, requisition_id)
//   screenings     (id, candidate_id, q_and_a jsonb, comm_score, tech_score, recommendation)
//   settings       (id, scoring_weights jsonb, sources jsonb, jd_templates jsonb)

/* ---------- MOCK DATA ---------- */
const seedRequisitions = [
  { id: "req-1", title: "Senior Full-Stack Engineer", project: "Apex Banking Platform", status: "Active", priority: "High", openings: 3, daysOpen: 12, sourced: 47, screened: 28, shortlisted: 14, interviewed: 7, offered: 2, hired: 1, budget: "$120k–$160k", expRange: "5–8 yrs", skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"] },
  { id: "req-2", title: "Cloud Solutions Architect", project: "Helios Migration", status: "Active", priority: "Critical", openings: 1, daysOpen: 21, sourced: 32, screened: 19, shortlisted: 8, interviewed: 4, offered: 1, hired: 0, budget: "$160k–$200k", expRange: "8–12 yrs", skills: ["AWS", "Kubernetes", "Terraform", "Python"] },
  { id: "req-3", title: "Data Engineer (Snowflake)", project: "Northstar Analytics", status: "Active", priority: "Medium", openings: 2, daysOpen: 6, sourced: 18, screened: 11, shortlisted: 5, interviewed: 2, offered: 0, hired: 0, budget: "$110k–$140k", expRange: "4–7 yrs", skills: ["Snowflake", "dbt", "Python", "Airflow"] },
  { id: "req-4", title: "iOS Engineer", project: "Lumen Mobile", status: "On Hold", priority: "Low", openings: 1, daysOpen: 34, sourced: 22, screened: 9, shortlisted: 3, interviewed: 1, offered: 0, hired: 0, budget: "$130k–$155k", expRange: "5+ yrs", skills: ["Swift", "SwiftUI", "Combine"] },
];

const seedCandidates = [
  { id: "c-1", reqId: "req-1", name: "Priya Raman", title: "Senior Full-Stack Engineer @ Stripe", exp: 6.5, location: "Bangalore, IN", source: "LinkedIn", stage: "Interviewed", match: 94, skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "GraphQL"], strengths: ["Deep React + Node ownership", "Led 3 zero-downtime DB migrations", "Excellent system design instincts"], gaps: ["Limited exposure to Kubernetes", "No prior fintech compliance experience"], summary: "Pragmatic full-stack engineer with strong product sense. Has shipped end-to-end features at scale and writes about engineering tradeoffs publicly. Strong signal on async collaboration.", commScore: 9.2, techScore: 9.0, recommendation: "Proceed" },
  { id: "c-2", reqId: "req-1", name: "Marcus Webb", title: "Staff Engineer @ Datadog", exp: 8, location: "Austin, TX", source: "Referrals", stage: "Shortlisted", match: 91, skills: ["React", "Node.js", "TypeScript", "AWS", "Kafka"], strengths: ["Distributed systems depth", "Strong mentor — runs internal eng guild"], gaps: ["Compensation expectation likely above band"], summary: "Senior IC with platform-engineering background. Best fit if role expands toward infra; would be over-leveled for pure feature work.", commScore: 8.8, techScore: 9.5, recommendation: "Proceed" },
  { id: "c-3", reqId: "req-1", name: "Aisha Okafor", title: "Full-Stack Engineer @ Shopify", exp: 5, location: "Toronto, CA", source: "LinkedIn", stage: "Screened", match: 88, skills: ["React", "Node.js", "PostgreSQL", "Ruby"], strengths: ["Conversion-funnel expertise", "Strong product instincts"], gaps: ["Primary stack is Ruby, not TypeScript"], summary: "Product-oriented full-stack engineer. Would ramp on TS quickly given Ruby/Rails fluency. Good cultural signal.", commScore: 8.9, techScore: 8.4, recommendation: "Proceed" },
  { id: "c-4", reqId: "req-1", name: "Diego Hernández", title: "Senior Engineer @ MercadoLibre", exp: 7, location: "Buenos Aires, AR", source: "Naukri", stage: "Sourced", match: 82, skills: ["React", "Node.js", "PostgreSQL", "AWS"], strengths: ["High-traffic e-commerce experience", "Bilingual EN/ES"], gaps: ["No TypeScript in last 2 roles"], summary: "Solid backend-leaning full-stack engineer from a high-scale environment.", commScore: 8.1, techScore: 8.6, recommendation: "Hold" },
  { id: "c-5", reqId: "req-1", name: "Lin Wei", title: "Software Engineer @ ByteDance", exp: 5.5, location: "Singapore", source: "LinkedIn", stage: "Sourced", match: 79, skills: ["React", "Node.js", "Go", "Redis"], strengths: ["Performance optimization track record"], gaps: ["No PostgreSQL exposure", "Limited customer-facing work"], summary: "Strong engineer but stack mismatch on data layer.", commScore: 7.9, techScore: 8.5, recommendation: "Hold" },
  { id: "c-6", reqId: "req-1", name: "Nina Patel", title: "Lead Engineer @ Freshworks", exp: 9, location: "Chennai, IN", source: "Internal Database", stage: "Offered", match: 96, skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "Microservices"], strengths: ["Built equivalent platform at prior co", "Strong leadership signal", "Available in 30 days"], gaps: ["Slightly senior for IC role"], summary: "Top-of-funnel candidate. Has architected and led the exact kind of platform Apex Banking needs. Reference checks were glowing.", commScore: 9.4, techScore: 9.3, recommendation: "Proceed" },
  { id: "c-7", reqId: "req-1", name: "Tom Becker", title: "Engineer @ Local agency", exp: 4, location: "Berlin, DE", source: "LinkedIn", stage: "Sourced", match: 71, skills: ["React", "Node.js", "MongoDB"], strengths: ["Fast learner per references"], gaps: ["Below experience floor", "Agency-only background"], summary: "Junior for the band. Would need significant ramp.", commScore: 7.5, techScore: 7.2, recommendation: "Reject" },
  { id: "c-8", reqId: "req-1", name: "Sara Lindqvist", title: "Senior Engineer @ Klarna", exp: 7, location: "Stockholm, SE", source: "Referrals", stage: "Hired", match: 93, skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Kafka"], strengths: ["Fintech domain", "Strong async writer", "Already passed backchannel"], gaps: [], summary: "Closed last week. Starts in 3 weeks.", commScore: 9.1, techScore: 9.2, recommendation: "Proceed" },
  { id: "c-9", reqId: "req-1", name: "Rahul Mehta", title: "SDE-3 @ Flipkart", exp: 6, location: "Bangalore, IN", source: "Naukri", stage: "Shortlisted", match: 86, skills: ["React", "Node.js", "PostgreSQL", "Java"], strengths: ["E-commerce scale exposure"], gaps: ["Java-primary, JS secondary"], summary: "Comfortable across stack but center of gravity is JVM.", commScore: 8.3, techScore: 8.7, recommendation: "Proceed" },
];

const stageOrder = ["Sourced", "Screened", "Shortlisted", "Interviewed", "Offered", "Hired"];

const screeningQA = [
  { q: "Walk us through how you'd design a multi-tenant audit log service that needs to retain 7 years of records.", a: "I'd start with append-only Postgres partitioned by tenant_id and month, with cold partitions moved to S3 via a periodic job. For query patterns, I'd expose a read API with tenant-scoped indexes, and consider Iceberg if analytical queries dominate. Compliance-wise, I'd ensure WORM semantics and separate KMS keys per tenant." },
  { q: "Tell me about a time you disagreed with a technical decision and how you handled it.", a: "On a previous payments project, the team wanted to introduce a new event bus mid-quarter. I felt the existing queue was sufficient and pushed back with a written doc comparing both. We aligned on extending the current system and revisiting in 6 months — which we did, and ultimately did adopt the new bus, but with much better context." },
  { q: "How do you approach ambiguity when requirements are still forming?", a: "I try to find the smallest reversible commitment. Build a thin slice end-to-end, ship it behind a flag, and use the artifact itself to drive the next conversation. I've found stakeholders react to working software very differently than to docs." },
];

const aiCopilotSamples = [
  { q: "Show top candidates for this role", a: "Top 3 by match score for Senior Full-Stack Engineer: **Nina Patel (96%)**, **Priya Raman (94%)**, and **Sara Lindqvist (93%, hired)**. Nina is currently at Offered stage — I'd recommend accelerating the offer review." },
  { q: "Why are candidates dropping at interview stage?", a: "Across the last 30 days, **42% of interviewed candidates** declined to proceed. Top reasons: (1) compensation gap on senior IC band — 5 of 12; (2) remote flexibility — 3 of 12; (3) interview loop length (6 rounds avg) — 2 of 12. Suggestion: revisit band ceiling for 7+ yrs and consider compressing the loop." },
  { q: "Which sourcing channel has highest conversion?", a: "**Referrals** lead with a 38% Sourced→Hired rate, followed by **Internal DB** (24%) and **LinkedIn** (11%). Naukri is at 6%. Want me to draft a referral push for active reqs?" },
];

/* ---------- SHARED UI ---------- */
const Pill = ({ children, tone = "default" }) => {
  const tones = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${tones[tone]}`}>{children}</span>;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}>{children}</div>
);

const GradientButton = ({ children, onClick, icon: Icon, variant = "primary", size = "md", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" };
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-all ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
};

const ScoreRing = ({ score, size = 56 }) => {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const color = pct >= 90 ? "#10b981" : pct >= 80 ? "#6366f1" : pct >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#f1f5f9" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{pct}%</span>
      </div>
    </div>
  );
};

/* ---------- SIDEBAR ---------- */

/* ============================================================
   PERSONA SYSTEM
   5 roles — each gets tailored nav, dashboard, and data focus.
   Stored in React context so every component can read it.
   ============================================================ */
const PersonaContext = React.createContext(null);
const usePersona = () => React.useContext(PersonaContext);

const PERSONAS = {
  recruiter: {
    key: "recruiter",
    label: "Recruiter",
    avatar: "RC",
    avatarGrad: "from-indigo-500 to-violet-500",
    description: "Full pipeline · AI scores · alerts",
    color: "indigo",
    navItems: ["dashboard", "requisitions", "jd-generator", "sourcing", "screening-hub"],
  },
  hiringManager: {
    key: "hiringManager",
    label: "Hiring Manager",
    avatar: "HM",
    avatarGrad: "from-violet-500 to-fuchsia-500",
    description: "Shortlisted candidates · interview feedback",
    color: "violet",
    navItems: ["dashboard", "requisitions", "screening-hub"],
  },
  deliveryManager: {
    key: "deliveryManager",
    label: "Delivery Manager",
    avatar: "DM",
    avatarGrad: "from-fuchsia-500 to-pink-500",
    description: "Time to fill · project risk · skill gaps",
    color: "fuchsia",
    navItems: ["dashboard", "requisitions"],
  },
  hrLeader: {
    key: "hrLeader",
    label: "HR Leader",
    avatar: "HL",
    avatarGrad: "from-amber-500 to-orange-500",
    description: "Funnel metrics · efficiency · source mix",
    color: "amber",
    navItems: ["dashboard", "requisitions"],
  },
  admin: {
    key: "admin",
    label: "Admin",
    avatar: "AD",
    avatarGrad: "from-slate-500 to-slate-700",
    description: "Configuration · system settings",
    color: "slate",
    navItems: ["dashboard", "requisitions", "jd-generator", "sourcing", "screening-hub", "admin"],
  },
};

const PERSONA_ORDER = ["recruiter", "hiringManager", "deliveryManager", "hrLeader", "admin"];

/* ── persona-specific mock data ── */
const interviewFeedback = [
  { candidate: "Priya Raman", round: "System Design", interviewer: "Ankit Sharma", score: 9.0, summary: "Exceptional depth on distributed systems. Designed a multi-tenant audit log with correct WORM semantics and partition strategy. Would hire immediately.", recommend: true },
  { candidate: "Marcus Webb",  round: "Coding Screen",  interviewer: "Divya Nair",  score: 8.5, summary: "Clean solutions, strong on Big-O reasoning. Slight hesitation on React concurrent features but recovered well when prompted.", recommend: true },
  { candidate: "Rahul Mehta",  round: "System Design", interviewer: "Ankit Sharma", score: 7.8, summary: "Good instincts on DB indexing. Needs more exposure to event-driven patterns. Recommend proceeding with a culture panel before deciding.", recommend: null },
];

const projectRiskData = [
  { project: "Apex Banking Platform",  role: "Senior Full-Stack Engineer", daysOpen: 12, ttfTarget: 30, risk: "medium", coverage: 72, gap: ["TypeScript depth", "Fintech compliance"], openings: 3, filled: 1 },
  { project: "Helios Migration",        role: "Cloud Solutions Architect",  daysOpen: 21, ttfTarget: 25, risk: "high",   coverage: 45, gap: ["Kubernetes", "Terraform IaC"],       openings: 1, filled: 0 },
  { project: "Northstar Analytics",     role: "Data Engineer (Snowflake)", daysOpen: 6,  ttfTarget: 35, risk: "low",    coverage: 81, gap: ["dbt advanced"],                         openings: 2, filled: 0 },
  { project: "Lumen Mobile",            role: "iOS Engineer",              daysOpen: 34, ttfTarget: 30, risk: "high",   coverage: 38, gap: ["SwiftUI", "Core Data", "CI/CD"],        openings: 1, filled: 0 },
];

const hrMetrics = {
  avgTTH: 18, ttfBenchmark: 22, offerAccept: 84, costPerHire: 4200,
  sourceMix: [
    { name: "LinkedIn",     candidates: 119, hires: 13, rate: 11, cost: 6800 },
    { name: "Referrals",    candidates:  32, hires: 12, rate: 38, cost: 1200 },
    { name: "Naukri",       candidates:  47, hires:  3, rate:  6, cost: 3400 },
    { name: "Internal DB",  candidates:  16, hires:  4, rate: 24, cost:  200 },
  ],
  funnelEfficiency: [
    { stage: "Sourced → Screened",       rate: 60, benchmark: 65 },
    { stage: "Screened → Shortlisted",   rate: 50, benchmark: 55 },
    { stage: "Shortlisted → Interviewed",rate: 50, benchmark: 60 },
    { stage: "Interviewed → Offered",    rate: 29, benchmark: 40 },
    { stage: "Offered → Hired",          rate: 50, benchmark: 80 },
  ],
};

/* ============================================================
   VIEW-AS TOGGLE — shown in TopBar
   ============================================================ */
const ViewAsToggle = ({ persona, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const current = PERSONAS[persona];

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const colorMap = {
    indigo: "from-indigo-500 to-violet-500",
    violet: "from-violet-500 to-fuchsia-500",
    fuchsia: "from-fuchsia-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    slate: "from-slate-500 to-slate-700",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition group"
      >
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${colorMap[current.color]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
          {current.avatar}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">View as</div>
          <div className="text-sm font-bold text-slate-800 leading-tight">{current.label}</div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Switch persona</div>
            <div className="text-xs text-slate-400 mt-0.5">UI adapts to show relevant data</div>
          </div>
          <div className="p-2">
            {PERSONA_ORDER.map((key) => {
              const p = PERSONAS[key];
              const isActive = key === persona;
              return (
                <button
                  key={key}
                  onClick={() => { onChange(key); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${isActive ? "bg-indigo-50 border border-indigo-200" : "hover:bg-slate-50"}`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorMap[p.color]} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{p.label}</span>
                      {isActive && <Pill tone="indigo">Active</Pill>}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{p.description}</div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   PERSONA BANNER — slim strip under topbar showing current context
   ============================================================ */
const PersonaBanner = ({ persona }) => {
  const p = PERSONAS[persona];
  if (persona === "recruiter") return null; // recruiter = default, no banner needed
  const banners = {
    hiringManager:  { bg: "bg-violet-600",  text: "You're viewing as Hiring Manager — showing shortlisted candidates & interview feedback only." },
    deliveryManager:{ bg: "bg-fuchsia-600", text: "You're viewing as Delivery Manager — showing project risk, time-to-fill, and skill coverage." },
    hrLeader:       { bg: "bg-amber-500",   text: "You're viewing as HR Leader — showing funnel metrics, source effectiveness, and hiring efficiency." },
    admin:          { bg: "bg-slate-700",   text: "You're viewing as Admin — all modules unlocked including system configuration." },
  };
  const b = banners[persona];
  if (!b) return null;
  return (
    <div className={`${b.bg} text-white text-xs font-semibold px-8 py-2 flex items-center gap-2`}>
      <span className="opacity-75">👤</span> {b.text}
    </div>
  );
};

/* ============================================================
   PERSONA DASHBOARDS
   ============================================================ */

/* ── RECRUITER DASHBOARD (existing Dashboard, persona-aware alerts) ── */
const RecruiterDashboard = ({ requisitions, candidates, onOpenReq, onNav }) => {
  const totals = useMemo(() => requisitions.reduce((a, r) => ({ sourced: a.sourced + r.sourced, screened: a.screened + r.screened, shortlisted: a.shortlisted + r.shortlisted, interviewed: a.interviewed + r.interviewed, offered: a.offered + r.offered, hired: a.hired + r.hired }), { sourced: 0, screened: 0, shortlisted: 0, interviewed: 0, offered: 0, hired: 0 }), [requisitions]);

  const alerts = [
    { type: "risk",   icon: "⚠️", title: "Nina Patel offer ageing", body: "Offer pending 3+ days — competing offer likely. Follow up today.", action: "View Candidate" },
    { type: "risk",   icon: "⚠️", title: "iOS req stalled 34 days", body: "0 stage movements in 9 days. Req at risk — consider JD broadening.", action: "View Req" },
    { type: "info",   icon: "💡", title: "Priya Raman — 94% match", body: "Top candidate in Interviewed stage. Schedule offer review this week.", action: "View Candidate" },
    { type: "action", icon: "✅", title: "Marcus Webb competing offer", body: "Candidate signalled another offer on the table. Move now or lose.", action: "Fast-track" },
  ];

  const metrics = [
    { label: "Open Requisitions",  value: requisitions.filter(r => r.status === "Active").length, sub: "+2 this week",        tone: "indigo", icon: Briefcase },
    { label: "Active Candidates",  value: totals.sourced + totals.screened + totals.shortlisted + totals.interviewed, sub: "Across all roles", tone: "violet", icon: Users },
    { label: "Avg Time to Hire",   value: "18d",  sub: "↓ 4d vs last month", tone: "emerald", icon: Clock },
    { label: "Offer Acceptance",   value: "84%",  sub: "↑ 6% vs Q3",         tone: "amber",   icon: Award },
  ];
  const toneGrad = { indigo: "from-indigo-500 to-blue-500", violet: "from-violet-500 to-fuchsia-500", emerald: "from-emerald-500 to-teal-500", amber: "from-amber-500 to-orange-500" };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Welcome back, Neha · Recruiter View</div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Here's what's moving today.</h1>
        </div>
        <GradientButton icon={Plus} onClick={() => onNav("jd-generator")}>New Requisition</GradientButton>
      </div>

      {/* Alerts strip */}
      <div className="grid grid-cols-4 gap-3">
        {alerts.map((a, i) => (
          <div key={i} className={`p-4 rounded-xl border-l-4 bg-white border ${a.type === "risk" ? "border-l-rose-400 border-rose-100" : a.type === "action" ? "border-l-amber-400 border-amber-100" : "border-l-indigo-400 border-indigo-100"}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{a.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${a.type === "risk" ? "text-rose-600" : a.type === "action" ? "text-amber-600" : "text-indigo-600"}`}>{a.type === "risk" ? "Alert" : a.type === "action" ? "Urgent" : "Insight"}</span>
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-1">{a.title}</div>
            <div className="text-xs text-slate-600 leading-relaxed">{a.body}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-5 relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${toneGrad[m.tone]}`} />
              <div className="relative">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${toneGrad[m.tone]}`}><Icon className="w-4 h-4 text-white" /></div>
                <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{m.value}</div>
                <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">Active Requisitions</h2>
            <button onClick={() => onNav("requisitions")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View all<ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {requisitions.slice(0, 4).map((r) => (
              <button key={r.id} onClick={() => onOpenReq(r.id)} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition group text-left">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900 text-sm">{r.title}</div>
                    <Pill tone={r.priority === "Critical" ? "rose" : r.priority === "High" ? "amber" : "default"}>{r.priority}</Pill>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.project} · {r.daysOpen} days open</div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center"><div className="font-bold text-slate-900">{r.sourced}</div><div className="text-slate-400">sourced</div></div>
                  <div className="text-center"><div className="font-bold text-slate-900">{r.interviewed}</div><div className="text-slate-400">interviewed</div></div>
                  <div className="text-center"><div className="font-bold text-emerald-600">{r.hired}/{r.openings}</div><div className="text-slate-400">hired</div></div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Hiring Funnel</h2>
          <div className="text-xs text-slate-500 mb-5">All active reqs · last 30 days</div>
          <div className="space-y-2.5">
            {stageOrder.map((stage, i) => {
              const val = totals[stage.toLowerCase()];
              const pct = (val / Math.max(1, totals.sourced)) * 100;
              const colors = ["from-indigo-500 to-indigo-400","from-violet-500 to-violet-400","from-fuchsia-500 to-fuchsia-400","from-pink-500 to-pink-400","from-amber-500 to-amber-400","from-emerald-500 to-emerald-400"];
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-xs mb-1"><span className="font-medium text-slate-700">{stage}</span><span className="font-bold text-slate-900 tabular-nums">{val}</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${colors[i]} rounded-full`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ── HIRING MANAGER DASHBOARD ── */
const HiringManagerDashboard = ({ candidates, onOpenReq, onNav }) => {
  const shortlisted = candidates.filter(c => ["Shortlisted","Interviewed","Offered","Hired"].includes(c.stage));
  const recColor = { Proceed: "emerald", Hold: "amber", Reject: "rose" };
  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">Hiring Manager View</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your shortlisted candidates</h1>
        <div className="text-sm text-slate-500 mt-1">Showing candidates at Shortlisted stage and beyond · {shortlisted.length} in scope</div>
      </div>

      {/* Top 3 stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ready for Your Review", value: candidates.filter(c => c.stage === "Shortlisted").length, tone: "from-violet-500 to-fuchsia-500", icon: Users },
          { label: "Interviews Scheduled",  value: candidates.filter(c => c.stage === "Interviewed").length,  tone: "from-fuchsia-500 to-pink-500", icon: MessageSquare },
          { label: "Awaiting Offer Sign-off",value: candidates.filter(c => c.stage === "Offered").length,   tone: "from-amber-500 to-orange-500", icon: Award },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-5 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${m.tone}`} />
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.tone} flex items-center justify-center shrink-0`}><Icon className="w-5 h-5 text-white" /></div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">{m.value}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interview feedback cards */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5"><MessageSquare className="w-4 h-4 text-violet-600" /><h2 className="text-lg font-bold text-slate-900">Interview Feedback</h2><Pill tone="violet">Latest rounds</Pill></div>
        <div className="space-y-3">
          {interviewFeedback.map((fb, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-violet-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {fb.candidate.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900">{fb.candidate}</span>
                      <Pill tone="violet">{fb.round}</Pill>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Interviewer: {fb.interviewer} · Score: <strong>{fb.score}/10</strong></div>
                    <div className="text-sm text-slate-700 mt-2 leading-relaxed">{fb.summary}</div>
                  </div>
                </div>
                <div className="shrink-0">
                  {fb.recommend === true  && <Pill tone="emerald"><ThumbsUp className="w-3 h-3" />Recommend</Pill>}
                  {fb.recommend === false && <Pill tone="rose"><ThumbsDown className="w-3 h-3" />Decline</Pill>}
                  {fb.recommend === null  && <Pill tone="amber"><Pause className="w-3 h-3" />Hold</Pill>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shortlisted candidate summaries */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Candidate Summaries</h2>
        <div className="space-y-3">
          {shortlisted.slice(0, 5).map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/20 transition">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-gradient-to-br ${c.match >= 90 ? "from-emerald-500 to-teal-500" : "from-violet-500 to-fuchsia-500"}`}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{c.name}</span>
                    <Pill tone={c.stage === "Hired" ? "emerald" : c.stage === "Offered" ? "amber" : "violet"}>{c.stage}</Pill>
                    <Pill tone={recColor[c.recommendation] || "default"}>{c.recommendation}</Pill>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.exp} yrs · {c.location}</div>
                  <div className="text-sm text-slate-700 mt-1.5 leading-relaxed line-clamp-2">{c.summary}</div>
                </div>
                <div className="text-center shrink-0">
                  <ScoreRing score={c.match} size={48} />
                  <div className="text-[10px] text-slate-400 mt-1">AI Fit</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ── DELIVERY MANAGER DASHBOARD ── */
const DeliveryManagerDashboard = () => {
  const riskColor = { high: "rose", medium: "amber", low: "emerald" };
  const riskBg    = { high: "bg-rose-50 border-rose-200", medium: "bg-amber-50 border-amber-200", low: "bg-emerald-50 border-emerald-200" };
  const riskLabel = { high: "text-rose-700", medium: "text-amber-700", low: "text-emerald-700" };
  const riskDot   = { high: "bg-rose-500", medium: "bg-amber-500", low: "bg-emerald-500" };

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-fuchsia-600 uppercase tracking-widest mb-1">Delivery Manager View</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project staffing readiness</h1>
        <div className="text-sm text-slate-500 mt-1">Time to fill · skill coverage · project risk across all active engagements</div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Roles at Risk",         value: projectRiskData.filter(p => p.risk === "high").length,   sub: "Overdue or blocked",     color: "from-rose-500 to-pink-500",       icon: AlertCircle },
          { label: "Avg Days Open",          value: `${Math.round(projectRiskData.reduce((a,p)=>a+p.daysOpen,0)/projectRiskData.length)}d`, sub: "vs 22d target", color: "from-fuchsia-500 to-violet-500", icon: Clock },
          { label: "Skill Coverage Avg",     value: `${Math.round(projectRiskData.reduce((a,p)=>a+p.coverage,0)/projectRiskData.length)}%`, sub: "Across open roles", color: "from-indigo-500 to-blue-500",  icon: Target },
          { label: "Openings Unfilled",      value: projectRiskData.reduce((a,p)=>a+(p.openings-p.filled),0), sub: "Total positions",       color: "from-amber-500 to-orange-500",    icon: Briefcase },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-5 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${m.color}`} />
              <div className="relative">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}><Icon className="w-4 h-4 text-white" /></div>
                <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{m.value}</div>
                <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project risk cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Project Readiness by Role</h2>
        {projectRiskData.map((p, i) => {
          const ttfPct = Math.min(100, (p.daysOpen / p.ttfTarget) * 100);
          return (
            <Card key={i} className={`p-5 border ${p.risk === "high" ? "border-rose-200 shadow-rose-100 shadow-md" : "border-slate-200"}`}>
              <div className="flex items-start gap-4">
                {/* Risk badge */}
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider shrink-0 ${riskBg[p.risk]}`}>
                  <span className={`flex items-center gap-1.5 ${riskLabel[p.risk]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${riskDot[p.risk]} ${p.risk === "high" ? "animate-pulse" : ""}`} />
                    {p.risk} risk
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-bold text-slate-900">{p.project}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{p.role} · {p.openings - p.filled} of {p.openings} opening{p.openings > 1 ? "s" : ""} unfilled</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500">Days open vs target</div>
                      <div className={`text-xl font-bold tabular-nums ${p.daysOpen > p.ttfTarget ? "text-rose-600" : "text-slate-900"}`}>{p.daysOpen}d <span className="text-sm font-normal text-slate-400">/ {p.ttfTarget}d</span></div>
                    </div>
                  </div>

                  {/* TTF progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Time to fill progress</span>
                      <span className={`font-bold ${ttfPct >= 100 ? "text-rose-600" : ttfPct >= 70 ? "text-amber-600" : "text-emerald-600"}`}>{Math.round(ttfPct)}% of target used</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${ttfPct >= 100 ? "bg-rose-500" : ttfPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(ttfPct, 100)}%` }} />
                    </div>
                  </div>

                  {/* Skill coverage */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Skill coverage</span>
                      <span className={`font-bold ${p.coverage < 50 ? "text-rose-600" : p.coverage < 75 ? "text-amber-600" : "text-emerald-600"}`}>{p.coverage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.coverage < 50 ? "bg-rose-400" : p.coverage < 75 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${p.coverage}%` }} />
                    </div>
                  </div>

                  {/* Skill gaps */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium">Gaps:</span>
                    {p.gap.map(g => <Pill key={g} tone="rose">{g}</Pill>)}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ── HR LEADER DASHBOARD ── */
const HRLeaderDashboard = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">HR Leader View</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hiring performance overview</h1>
        <div className="text-sm text-slate-500 mt-1">Funnel efficiency · source ROI · hiring health across all requisitions</div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Time to Hire",   value: `${hrMetrics.avgTTH}d`,  sub: `vs ${hrMetrics.ttfBenchmark}d benchmark`, tone: "emerald", icon: Clock,   good: true  },
          { label: "Offer Acceptance",   value: `${hrMetrics.offerAccept}%`, sub: "↑ 6% vs Q3",                 tone: "indigo",  icon: Award,  good: true  },
          { label: "Cost per Hire",      value: `$${hrMetrics.costPerHire.toLocaleString()}`, sub: "↓ $800 vs last quarter", tone: "violet",  icon: TrendingUp, good: true },
          { label: "Interview→Offer",    value: "29%", sub: "Below 40% benchmark ⚠",          tone: "amber",   icon: AlertCircle, good: false },
        ].map((m) => {
          const Icon = m.icon;
          const grad = { emerald: "from-emerald-500 to-teal-500", indigo: "from-indigo-500 to-blue-500", violet: "from-violet-500 to-fuchsia-500", amber: "from-amber-500 to-orange-500" };
          return (
            <Card key={m.label} className={`p-5 relative overflow-hidden ${!m.good ? "border-amber-200" : ""}`}>
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${grad[m.tone]}`} />
              <div className="relative">
                <div className={`w-9 h-9 rounded-lg mb-3 bg-gradient-to-br ${grad[m.tone]} flex items-center justify-center`}><Icon className="w-4 h-4 text-white" /></div>
                <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{m.value}</div>
                <div className={`text-xs mt-1 ${m.good ? "text-slate-500" : "text-amber-600 font-semibold"}`}>{m.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Funnel efficiency */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Funnel Efficiency</h2>
          <div className="space-y-4">
            {hrMetrics.funnelEfficiency.map((f, i) => {
              const delta = f.rate - f.benchmark;
              const isBelow = delta < 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{f.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold tabular-nums ${isBelow ? "text-rose-600" : "text-emerald-600"}`}>{f.rate}%</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${isBelow ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{isBelow ? "" : "+"}{delta}% vs benchmark</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className={`h-full rounded-full ${isBelow ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${f.rate}%` }} />
                    {/* Benchmark marker */}
                    <div className="absolute top-0 h-full border-l-2 border-slate-400 border-dashed opacity-50" style={{ left: `${f.benchmark}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Benchmark: {f.benchmark}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Source effectiveness */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Source Effectiveness</h2>
          <div className="space-y-3">
            {hrMetrics.sourceMix.map((s, i) => {
              const colors = ["bg-sky-500","bg-emerald-500","bg-amber-500","bg-violet-500"];
              const isTop = s.rate === Math.max(...hrMetrics.sourceMix.map(x => x.rate));
              return (
                <div key={i} className={`p-3 rounded-xl border transition ${isTop ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[i]}`} />
                      <span className="font-semibold text-sm text-slate-900">{s.name}</span>
                      {isTop && <Pill tone="emerald">Top performer</Pill>}
                    </div>
                    <span className="text-xs text-slate-500">{s.candidates} candidates</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-lg font-bold text-slate-900 tabular-nums">{s.hires}</div><div className="text-[10px] text-slate-400">Hires</div></div>
                    <div><div className={`text-lg font-bold tabular-nums ${s.rate >= 30 ? "text-emerald-600" : s.rate >= 15 ? "text-amber-600" : "text-rose-500"}`}>{s.rate}%</div><div className="text-[10px] text-slate-400">Conv. rate</div></div>
                    <div><div className="text-lg font-bold text-slate-900 tabular-nums">${s.cost.toLocaleString()}</div><div className="text-[10px] text-slate-400">Cost / hire</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ── ADMIN DASHBOARD ── */
const AdminDashboard = ({ onNav }) => (
  <div className="p-8 space-y-6">
    <div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Admin View</div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System configuration</h1>
      <div className="text-sm text-slate-500 mt-1">All modules and settings are unlocked in Admin mode.</div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { title: "Hiring Stages",     desc: "Add, remove, or reorder pipeline stages used across all requisitions.",        icon: Layers,    action: () => onNav("admin"), cta: "Configure stages" },
        { title: "Scoring Weights",   desc: "Tune how AI calculates fit scores — skills vs experience vs communication.",    icon: Sliders,   action: () => onNav("admin"), cta: "Adjust weights" },
        { title: "Sourcing Channels", desc: "Enable or disable LinkedIn, Naukri, Referrals, Internal DB and others.",       icon: Database,  action: () => onNav("admin"), cta: "Manage channels" },
        { title: "JD Templates",      desc: "Create and manage reusable job description templates for common roles.",        icon: FileText,  action: () => onNav("admin"), cta: "Edit templates" },
        { title: "AI Credit Usage",   desc: "2,847 / 5,000 credits used this month. Reset on June 1.",                     icon: Zap,       action: () => {},             cta: "View usage" },
        { title: "All Modules",       desc: "Recruiter, Sourcing, Screening, JD Generator all accessible in Admin mode.",   icon: LayoutDashboard, action: () => onNav("dashboard"), cta: "Go to recruiter view" },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="p-5 hover:border-slate-300 transition cursor-pointer" onClick={item.action}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-slate-600" /></div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">{item.cta}<ChevronRight className="w-3 h-3" /></button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

/* ============================================================
   PERSONA-AWARE SIDEBAR — filters nav items by persona
   ============================================================ */
const Sidebar = ({ active, onNav, persona }) => {
  const ALL_ITEMS = [
    { key: "dashboard",     label: "Dashboard",   icon: LayoutDashboard },
    { key: "requisitions",  label: "Requisitions",icon: Briefcase },
    { key: "jd-generator",  label: "JD Generator",icon: Sparkles,      badge: "AI" },
    { key: "sourcing",      label: "Sourcing",    icon: Users },
    { key: "screening-hub", label: "Screening",   icon: MessageSquare, badge: "AI" },
    { key: "admin",         label: "Admin",       icon: Settings },
  ];
  const allowed = PERSONAS[persona]?.navItems || ALL_ITEMS.map(i => i.key);
  const items = ALL_ITEMS.filter(it => allowed.includes(it.key));
  const colorMap = { indigo: "from-indigo-500 to-violet-500", violet: "from-violet-500 to-fuchsia-500", fuchsia: "from-fuchsia-500 to-pink-500", amber: "from-amber-500 to-orange-500", slate: "from-slate-500 to-slate-700" };
  const p = PERSONAS[persona];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-lg leading-none">HumAIne</div>
            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">AI Recruitment</div>
          </div>
        </div>
      </div>

      {/* Active persona chip */}
      <div className="px-3 pt-3">
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r ${colorMap[p.color]} bg-opacity-10 border border-white/10`}>
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${colorMap[p.color]} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>{p.avatar}</div>
          <div>
            <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Viewing as</div>
            <div className="text-xs font-bold text-white leading-tight">{p.label}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <button key={it.key} onClick={() => onNav(it.key)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? "bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/10 text-white border border-indigo-500/30" : "hover:bg-slate-800/60 hover:text-white"}`}>
              <span className="flex items-center gap-3"><Icon className="w-4 h-4" />{it.label}</span>
              {it.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white tracking-wider">{it.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-amber-400" /><span className="text-xs font-semibold text-white">AI credits</span></div>
          <div className="text-[11px] text-slate-400">2,847 / 5,000 used</div>
          <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: "57%" }} /></div>
        </div>
      </div>
    </aside>
  );
};

/* ============================================================
   PERSONA-AWARE TOPBAR — includes View As toggle
   ============================================================ */
const TopBar = ({ onCopilot, persona, onPersonaChange }) => (
  <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-30">
    <div className="flex items-center gap-3 flex-1 max-w-md">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search candidates, requisitions..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <ViewAsToggle persona={persona} onChange={onPersonaChange} />
      <button onClick={onCopilot} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition">
        <Bot className="w-4 h-4" />Copilot
      </button>
      <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 relative">
        <Bell className="w-4 h-4 text-slate-600" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
      </button>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">RK</div>
    </div>
  </div>
);
/* ---------- DASHBOARD ---------- */
const Dashboard = ({ requisitions, onOpenReq, onNav }) => {
  const totals = useMemo(() => requisitions.reduce((a, r) => ({ sourced: a.sourced + r.sourced, screened: a.screened + r.screened, shortlisted: a.shortlisted + r.shortlisted, interviewed: a.interviewed + r.interviewed, offered: a.offered + r.offered, hired: a.hired + r.hired }), { sourced: 0, screened: 0, shortlisted: 0, interviewed: 0, offered: 0, hired: 0 }), [requisitions]);
  const metrics = [
    { label: "Open Requisitions", value: requisitions.filter(r => r.status === "Active").length, sub: "+2 this week", tone: "indigo", icon: Briefcase },
    { label: "Active Candidates", value: totals.sourced + totals.screened + totals.shortlisted + totals.interviewed, sub: "Across all roles", tone: "violet", icon: Users },
    { label: "Time to Hire", value: "18d", sub: "↓ 4d vs last month", tone: "emerald", icon: Clock },
    { label: "Offer Acceptance", value: "84%", sub: "↑ 6% vs Q3", tone: "amber", icon: Award },
  ];
  const toneGrad = { indigo: "from-indigo-500 to-blue-500", violet: "from-violet-500 to-fuchsia-500", emerald: "from-emerald-500 to-teal-500", amber: "from-amber-500 to-orange-500" };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Welcome back, Neha</div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Here's what's moving today.</h1>
        </div>
        <GradientButton icon={Plus} onClick={() => onNav("jd-generator")}>New Requisition</GradientButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-5 relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${toneGrad[m.tone]}`} />
              <div className="relative">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${toneGrad[m.tone]}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{m.value}</div>
                <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">Active Requisitions</h2>
            <button onClick={() => onNav("requisitions")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View all<ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {requisitions.slice(0, 4).map((r) => (
              <button key={r.id} onClick={() => onOpenReq(r.id)} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition group text-left">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900 text-sm">{r.title}</div>
                    <Pill tone={r.priority === "Critical" ? "rose" : r.priority === "High" ? "amber" : "default"}>{r.priority}</Pill>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.project} · {r.daysOpen} days open</div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center"><div className="font-bold text-slate-900">{r.sourced}</div><div className="text-slate-400">sourced</div></div>
                  <div className="text-center"><div className="font-bold text-slate-900">{r.interviewed}</div><div className="text-slate-400">interviewed</div></div>
                  <div className="text-center"><div className="font-bold text-emerald-600">{r.hired}/{r.openings}</div><div className="text-slate-400">hired</div></div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Hiring Funnel</h2>
          <div className="text-xs text-slate-500 mb-5">All active reqs · last 30 days</div>
          <div className="space-y-2.5">
            {stageOrder.map((stage, i) => {
              const val = totals[stage.toLowerCase()];
              const pct = (val / Math.max(1, totals.sourced)) * 100;
              const colors = ["from-indigo-500 to-indigo-400", "from-violet-500 to-violet-400", "from-fuchsia-500 to-fuchsia-400", "from-pink-500 to-pink-400", "from-amber-500 to-amber-400", "from-emerald-500 to-emerald-400"];
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-xs mb-1"><span className="font-medium text-slate-700">{stage}</span><span className="font-bold text-slate-900 tabular-nums">{val}</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${colors[i]} rounded-full transition-all`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" /><h2 className="text-lg font-bold text-slate-900">AI Insights</h2></div>
          <Pill tone="violet">Updated 2m ago</Pill>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, tone: "emerald", title: "Referrals converting 3.5× better", body: "Across active reqs, referred candidates reach 'Offered' at 38% vs 11% LinkedIn. Consider a focused referral push for Helios Migration." },
            { icon: AlertCircle, tone: "amber", title: "iOS Engineer req stalled", body: "0 candidates moved stage in 9 days. JD may be too narrow — only 22 sourced in 34 days. Suggest broadening to include React Native exposure." },
            { icon: Target, tone: "indigo", title: "Nina Patel (96%) at Offer stage", body: "Top match for Apex Banking is awaiting offer review for 3 days. Compensation aligned with band. Recommend accelerating." },
          ].map((insight, i) => {
            const Icon = insight.icon;
            const tones = { emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700", indigo: "bg-indigo-100 text-indigo-700" };
            return (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${tones[insight.tone]}`}><Icon className="w-4 h-4" /></div>
                <div className="font-semibold text-sm text-slate-900 mb-1">{insight.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{insight.body}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/* ---------- REQUISITIONS LIST ---------- */
const RequisitionsList = ({ requisitions, onOpen, onNav }) => (
  <div className="p-8 space-y-6">
    <div className="flex items-end justify-between">
      <div><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Requisitions</h1><div className="text-sm text-slate-500 mt-1">{requisitions.length} total · {requisitions.filter(r => r.status === "Active").length} active</div></div>
      <div className="flex gap-2"><GradientButton variant="secondary" icon={Filter}>Filter</GradientButton><GradientButton icon={Plus} onClick={() => onNav("jd-generator")}>New Requisition</GradientButton></div>
    </div>
    <Card>
      <table className="w-full">
        <thead><tr className="border-b border-slate-100"><th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Role</th><th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Project</th><th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th><th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Pipeline</th><th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Days Open</th><th /></tr></thead>
        <tbody>
          {requisitions.map((r) => (
            <tr key={r.id} onClick={() => onOpen(r.id)} className="border-b border-slate-50 hover:bg-indigo-50/30 cursor-pointer transition">
              <td className="px-6 py-4"><div className="font-semibold text-sm text-slate-900">{r.title}</div><div className="text-xs text-slate-500 mt-0.5">{r.expRange} · {r.budget}</div></td>
              <td className="px-6 py-4 text-sm text-slate-600">{r.project}</td>
              <td className="px-6 py-4"><Pill tone={r.status === "Active" ? "emerald" : "default"}>{r.status}</Pill> <Pill tone={r.priority === "Critical" ? "rose" : r.priority === "High" ? "amber" : "default"}>{r.priority}</Pill></td>
              <td className="px-6 py-4"><div className="flex items-center gap-1 text-xs"><span className="text-slate-700 font-semibold">{r.sourced}</span><span className="text-slate-400">→</span><span className="text-slate-700 font-semibold">{r.interviewed}</span><span className="text-slate-400">→</span><span className="text-emerald-600 font-bold">{r.hired}/{r.openings}</span></div></td>
              <td className="px-6 py-4 text-sm text-slate-600">{r.daysOpen}d</td>
              <td className="px-6 py-4 text-right pr-6"><ChevronRight className="w-4 h-4 text-slate-300 inline" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

/* ---------- AI INSIGHTS DATA ---------- */

/* ============================================================
   AI INSIGHTS DATA — per stage signals (Insight / Risk / Recommendation)
   ============================================================ */
const stageInsights = {
  Sourced: [
    { type: "insight", icon: "💡", label: "Volume strong", text: "47 profiles sourced in 12 days — 31% above average for this band. LinkedIn driving 48% of volume." },
    { type: "recommendation", icon: "✅", label: "Activate referrals", text: "Referral candidates convert at 38% vs 11% on LinkedIn. Push an internal referral campaign — 5 good referrals could fill 1 opening." },
  ],
  Screened: [
    { type: "risk", icon: "⚠️", label: "High drop-off", text: "40% of sourced candidates didn't proceed to screening. Likely cause: TypeScript listed as mandatory is filtering out strong React/JS generalists." },
    { type: "insight", icon: "💡", label: "Speed gap", text: "High-match (>90%) candidates are screened 40% faster — 1.9 days vs 3.2 days avg. Prioritising by score accelerates your pipeline." },
    { type: "recommendation", icon: "✅", label: "JD tweak", text: "Consider relaxing TypeScript to 'strong preferred'. 3 dropped candidates had React + Node but weak TS — they could ramp quickly." },
  ],
  Shortlisted: [
    { type: "insight", icon: "💡", label: "Avg match 88%", text: "14 shortlisted with an average AI fit score of 88%. Top 3 (Nina, Priya, Sara) are above 93% — well above typical hire threshold." },
    { type: "risk", icon: "⚠️", label: "Comp mismatch risk", text: "3 candidates have signalled comp expectations above the stated band. Priya Raman and Marcus Webb both have competing offers in market." },
    { type: "recommendation", icon: "✅", label: "Prioritise this week", text: "Schedule Priya Raman and Marcus Webb for interviews immediately — market data shows candidates at this level accept within 10 days or move on." },
  ],
  Interviewed: [
    { type: "risk", icon: "⚠️", label: "Loop too long", text: "Interview-to-offer conversion is 29% vs 40% benchmark. Exit feedback from 2 declined candidates cites loop length (avg 6 rounds) as primary friction." },
    { type: "insight", icon: "💡", label: "Conversion trend", text: "Candidates who completed the system design round convert at 71% to Offered — it's your strongest signal step. Keep it, cut the others." },
    { type: "recommendation", icon: "✅", label: "Compress to 4 rounds", text: "System design + coding screen + hiring manager + culture panel captures 95% of your predictive signal. Removing 2 rounds could recover ~3 lost candidates." },
  ],
  Offered: [
    { type: "risk", icon: "⚠️", label: "Offer ageing", text: "Nina Patel's offer has been pending 3 days with no response. Industry data shows >3 days without response correlates with a competing offer — follow up today." },
    { type: "insight", icon: "💡", label: "Acceptance rate", text: "84% offer acceptance rate for this role band historically. You're on track if compensation is within 5% of market. Check Levels.fyi for live benchmarks." },
  ],
  Hired: [
    { type: "insight", icon: "💡", label: "Strong hire", text: "Sara Lindqvist hired via Referrals — 93% match, 21 days to hire (14 days below team avg). Source: Referrals 1 for 1 on this req." },
    { type: "recommendation", icon: "✅", label: "2 openings remain", text: "Accelerate Nina Patel offer decision and re-engage Marcus Webb — both are ready. Closing both would fill all 3 openings within 2 weeks." },
  ],
};

const aiHiringSummary = {
  health: 72,
  verdict: "On Track — with 2 risks to address",
  updated: "3 min ago",
  signals: [
    { type: "risk",           icon: "⚠️", label: "Offer stalling",       detail: "Nina Patel (96% match) has been at Offered for 3+ days without response. Highest churn risk in the pipeline right now." },
    { type: "risk",           icon: "⚠️", label: "Interview drop-off",   detail: "29% interview→offer conversion vs 40% benchmark. Candidates citing loop length. Compressing to 4 rounds could recover 2–3 candidates." },
    { type: "insight",        icon: "💡", label: "Strong top of funnel", detail: "47 sourced in 12 days is 31% above average. Referral channel converting at 3.5× the rate of LinkedIn — outperforming expectations." },
    { type: "recommendation", icon: "✅", label: "3 actions this week",  detail: "① Follow up Nina Patel offer today  ② Schedule Marcus Webb for round 2  ③ Compress interview loop to 4 rounds." },
  ],
};

/* ---------- INSIGHT CARD (inside kanban columns) ---------- */
const InsightCard = ({ insight, expanded, onToggle }) => {
  const styles = {
    insight:        { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-800",  label: "text-indigo-500",  bar: "bg-indigo-400" },
    risk:           { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-800",    label: "text-rose-500",    bar: "bg-rose-400"   },
    recommendation: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", label: "text-emerald-500", bar: "bg-emerald-400" },
  };
  const s = styles[insight.type];
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} overflow-hidden transition-all`}>
      <button onClick={onToggle} className="w-full flex items-start gap-2 p-2.5 text-left">
        <span className="text-sm leading-none mt-0.5 shrink-0">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-[9px] font-bold uppercase tracking-widest ${s.label}`}>{insight.type}</div>
          <div className={`text-[11px] font-semibold leading-tight mt-0.5 ${s.text}`}>{insight.label}</div>
        </div>
        <span className={`text-[10px] font-bold shrink-0 mt-1 ${s.label} transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
      </button>
      {expanded && (
        <div className={`px-2.5 pb-2.5 text-[11px] ${s.text} leading-relaxed border-t ${s.border} pt-2`}>
          {insight.text}
        </div>
      )}
    </div>
  );
};

/* ---------- AI HIRING SUMMARY PANEL ---------- */
const AiHiringSummary = ({ req, showInsights, onToggle }) => {
  const healthColor = aiHiringSummary.health >= 80 ? "text-emerald-400" : aiHiringSummary.health >= 60 ? "text-amber-400" : "text-rose-400";
  const r = 22; const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (aiHiringSummary.health / 100) * circumference;
  const signalCounts = {
    risk:           aiHiringSummary.signals.filter(s => s.type === "risk").length,
    insight:        aiHiringSummary.signals.filter(s => s.type === "insight").length,
    recommendation: aiHiringSummary.signals.filter(s => s.type === "recommendation").length,
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">

      {/* ── Dark header bar ── */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left — title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Hiring Intelligence</div>
              <div className="text-white font-bold text-sm leading-tight mt-0.5">Hiring Summary — {req.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Updated {aiHiringSummary.updated} · {req.project}</div>
            </div>
          </div>

          {/* Centre — health ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0">
              <svg width="56" height="56" className="-rotate-90">
                <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
                <circle cx="28" cy="28" r={r} stroke="url(#hg)" strokeWidth="5" fill="none"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{aiHiringSummary.health}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pipeline Health</div>
              <div className={`text-xs font-bold mt-0.5 ${healthColor}`}>{aiHiringSummary.verdict}</div>
            </div>
          </div>

          {/* Right — signal counts + toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <div className="text-center px-2">
                <div className="text-lg font-bold text-rose-400 tabular-nums">{signalCounts.risk}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Risks</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-2">
                <div className="text-lg font-bold text-indigo-400 tabular-nums">{signalCounts.insight}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Insights</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-2">
                <div className="text-lg font-bold text-emerald-400 tabular-nums">{signalCounts.recommendation}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Actions</div>
              </div>
            </div>
            <button onClick={onToggle} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${showInsights ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30" : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"}`}>
              {showInsights ? "Hide Overlay" : "Show Overlay"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Signal cards row ── */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 bg-white">
        {aiHiringSummary.signals.map((signal, i) => {
          const col = {
            risk:           { bar: "bg-rose-500",    label: "text-rose-500",    icon: "bg-rose-100 text-rose-700",    left: "border-l-rose-400"    },
            insight:        { bar: "bg-indigo-500",  label: "text-indigo-500",  icon: "bg-indigo-100 text-indigo-700",  left: "border-l-indigo-400"  },
            recommendation: { bar: "bg-emerald-500", label: "text-emerald-500", icon: "bg-emerald-100 text-emerald-700", left: "border-l-emerald-400" },
          }[signal.type];
          return (
            <div key={i} className={`p-4 border-l-4 ${col.left} hover:bg-slate-50 transition`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm ${col.icon}`}>{signal.icon}</span>
                <div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest ${col.label}`}>{signal.type}</div>
                  <div className="text-sm font-bold text-slate-900 leading-tight">{signal.label}</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">{signal.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- REQUISITION DETAIL (kanban + drag-drop + AI Insights Overlay) ---------- */
const RequisitionDetail = ({ req, candidates, onBack, onUpdateCandidate, onOpenCandidate }) => {
  const reqCandidates = candidates.filter(c => c.reqId === req.id);
  const [draggedId, setDraggedId] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [showInsights, setShowInsights] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState({});

  const toggleInsight = (stage, idx) => {
    const key = `${stage}-${idx}`;
    setExpandedInsights(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const stageColors = {
    Sourced:     { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
    Screened:    { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  dot: "bg-violet-500"  },
    Shortlisted: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", dot: "bg-fuchsia-500" },
    Interviewed: { bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700",    dot: "bg-pink-500"    },
    Offered:     { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500"   },
    Hired:       { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  };

  const conversionRates = stageOrder.map((stage, i) => {
    if (i === 0) return 100;
    const prevCount = reqCandidates.filter(c => c.stage === stageOrder[i - 1]).length;
    const currCount = reqCandidates.filter(c => c.stage === stage).length;
    const total = prevCount + currCount;
    return total === 0 ? 0 : Math.round((currCount / total) * 100);
  });

  const stagePrimarySignal = (stage) => {
    const insights = stageInsights[stage] || [];
    return insights.find(i => i.type === "risk") || insights.find(i => i.type === "recommendation") || insights[0] || null;
  };

  return (
    <div className="p-8 space-y-6">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ChevronRight className="w-4 h-4 rotate-180" />Back to requisitions
      </button>

      {/* Title row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone={req.status === "Active" ? "emerald" : "default"}>{req.status}</Pill>
            <Pill tone={req.priority === "Critical" ? "rose" : req.priority === "High" ? "amber" : "default"}>{req.priority}</Pill>
            <span className="text-xs text-slate-400">REQ-{req.id.toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{req.title}</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
            <span>{req.project}</span><span>·</span><span>{req.expRange}</span><span>·</span><span>{req.budget}</span><span>·</span><span>{req.daysOpen} days open</span>
          </div>
        </div>
        <div className="flex gap-2">
          <GradientButton variant="secondary" icon={Edit3}>Edit JD</GradientButton>
          <GradientButton icon={Users}>Source More</GradientButton>
        </div>
      </div>

      {/* ═══ AI HIRING SUMMARY PANEL ═══ */}
      <AiHiringSummary req={req} showInsights={showInsights} onToggle={() => setShowInsights(v => !v)} />

      {/* Stage metric cards */}
      <div className="grid grid-cols-6 gap-3">
        {stageOrder.map((stage, i) => {
          const count = reqCandidates.filter(c => c.stage === stage).length;
          const col = stageColors[stage];
          const signal = stagePrimarySignal(stage);
          const isRisk = signal?.type === "risk";
          return (
            <Card key={stage} className={`p-4 relative overflow-hidden transition-all ${showInsights && isRisk ? "border-rose-300 shadow-rose-100 shadow-md" : ""}`}>
              {showInsights && isRisk && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
                <span className="text-xs font-medium text-slate-600 truncate">{stage}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{count}</div>
              {showInsights && signal && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                    <span>{signal.icon}</span>
                    <span className="truncate">{signal.label}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ═══ PIPELINE KANBAN WITH AI OVERLAY ═══ */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Pipeline</h2>
            {showInsights && <Pill tone="violet"><Sparkles className="w-3 h-3" />AI Overlay</Pill>}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            {showInsights && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span>💡</span>Insight</span>
                <span className="flex items-center gap-1"><span>⚠️</span>Risk</span>
                <span className="flex items-center gap-1"><span>✅</span>Action</span>
                <span className="text-slate-300">·</span>
              </div>
            )}
            <span>Drag candidates to move stages</span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {stageOrder.map((stage, stageIdx) => {
            const col = stageColors[stage];
            const stageCandidates = reqCandidates.filter(x => x.stage === stage);
            const insights = stageInsights[stage] || [];
            const hasRisk = insights.some(i => i.type === "risk");
            const convRate = conversionRates[stageIdx];

            return (
              <div
                key={stage}
                onDragOver={(e) => { e.preventDefault(); setDraggedOver(stage); }}
                onDragLeave={() => setDraggedOver(null)}
                onDrop={() => { if (draggedId) onUpdateCandidate(draggedId, { stage }); setDraggedId(null); setDraggedOver(null); }}
                className={`rounded-xl border-2 border-dashed transition-all p-2 ${
                  draggedOver === stage
                    ? "border-indigo-400 bg-indigo-50/50"
                    : showInsights && hasRisk
                    ? "border-rose-300 bg-rose-50/20"
                    : `${col.border} ${col.bg}/40`
                }`}
              >
                {/* Column header */}
                <div className="px-2 py-1.5 mb-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${col.text} uppercase tracking-wider`}>{stage}</span>
                    <span className={`text-xs font-bold ${col.text} bg-white px-1.5 rounded`}>{stageCandidates.length}</span>
                  </div>
                  {/* Conversion rate mini bar */}
                  {stageIdx > 0 && (
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-slate-400">from prev</span>
                        <span className={`text-[9px] font-bold ${convRate < 40 ? "text-rose-500" : convRate < 70 ? "text-amber-500" : "text-emerald-600"}`}>{convRate}%</span>
                      </div>
                      <div className="h-1 bg-white/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${convRate < 40 ? "bg-rose-400" : convRate < 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${convRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ AI INSIGHT CARDS per stage ═══ */}
                {showInsights && insights.length > 0 && (
                  <div className="space-y-1.5 mb-2 px-0.5">
                    {insights.map((insight, ii) => (
                      <InsightCard
                        key={ii}
                        insight={insight}
                        expanded={!!expandedInsights[`${stage}-${ii}`]}
                        onToggle={() => toggleInsight(stage, ii)}
                      />
                    ))}
                  </div>
                )}

                {/* Candidate cards */}
                <div className="space-y-2">
                  {stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      draggable
                      onDragStart={() => setDraggedId(cand.id)}
                      onClick={() => onOpenCandidate(cand.id)}
                      className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-gradient-to-br ${cand.match >= 90 ? "from-emerald-500 to-teal-500" : cand.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"}`}>
                          {cand.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">{cand.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{cand.exp} yrs · {cand.source}</div>
                        </div>
                        <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-slate-400 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-bold text-slate-700">{cand.match}%</span>
                        </div>
                        <div className="text-[9px] text-slate-400 truncate ml-1">{cand.location}</div>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="text-[10px] text-slate-400 text-center py-4 italic">drop here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* JD + Source Mix */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Job Description</h2>
          <div className="prose prose-sm max-w-none text-slate-700">
            <p><strong>Role overview:</strong> We're hiring a {req.title} for the {req.project} initiative — a critical multi-year program modernizing core platform infrastructure for an enterprise client.</p>
            <p className="mt-3"><strong>What you'll do:</strong> Own end-to-end feature delivery across the stack. Partner with architects and the client's product team. Contribute to technical design reviews and mentor 1–2 mid-level engineers.</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Required</div><div className="flex flex-wrap gap-1.5">{req.skills.map(s => <Pill key={s} tone="emerald">{s}</Pill>)}</div></div>
              <div><div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">Good to have</div><div className="flex flex-wrap gap-1.5"><Pill tone="sky">GraphQL</Pill><Pill tone="sky">Kafka</Pill><Pill tone="sky">Docker</Pill><Pill tone="sky">Domain expertise</Pill></div></div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Source Mix</h2>
          <div className="space-y-3">
            {[{ name: "LinkedIn", pct: 48, color: "bg-sky-500" }, { name: "Referrals", pct: 24, color: "bg-emerald-500" }, { name: "Naukri", pct: 18, color: "bg-amber-500" }, { name: "Internal DB", pct: 10, color: "bg-violet-500" }].map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-xs mb-1"><span className="font-medium text-slate-700">{s.name}</span><span className="font-bold text-slate-900">{s.pct}%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
const JDGenerator = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [expMin, setExpMin] = useState(5);
  const [expMax, setExpMax] = useState(8);
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);

  const popularSkills = ["React", "Node.js", "TypeScript", "Python", "AWS", "Kubernetes", "PostgreSQL", "Java", "Go", "GraphQL", "Kafka", "Snowflake"];

  const toggleSkill = (s) => setSkills(skills.includes(s) ? skills.filter(x => x !== s) : [...skills, s]);
  const addCustom = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated({
        jd: `**Role: ${title || "Senior Engineer"}**\n\nWe are seeking a ${title || "Senior Engineer"} to join the ${project || "core engineering"} team. You will own the technical delivery of mission-critical features, partner with product and architecture leads, and help shape the platform for scale.\n\n**What you'll do**\n• Lead end-to-end feature design and implementation\n• Drive technical decisions in design reviews\n• Mentor mid-level engineers and elevate code quality\n• Partner closely with the client's stakeholders\n\n**What we're looking for**\n• ${expMin}–${expMax} years of relevant experience\n• Proven track record shipping production systems at scale\n• Strong communication — written and verbal\n• Ownership mindset; thrives in ambiguity${budget ? `\n\n**Compensation:** ${budget}` : ""}`,
        required: skills.slice(0, Math.ceil(skills.length * 0.6)),
        nice: skills.slice(Math.ceil(skills.length * 0.6)),
        keywords: [...skills, "scalable", "production", "ownership", "mentorship", "agile", "code review"],
      });
      setGenerating(false);
    }, 1400);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div>
        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3" />AI JD Generator</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create a requisition</h1>
        <div className="text-sm text-slate-500 mt-1">Describe the role — we'll draft a structured JD, separate must-have vs nice-to-have skills, and suggest sourcing keywords.</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">{popularSkills.map((s) => (<button key={s} onClick={() => toggleSkill(s)} className={`px-2.5 py-1 text-xs rounded-full border transition ${skills.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{s}</button>))}</div>
            <div className="flex gap-2"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder="Add custom skill..." className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /><button onClick={addCustom} className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl">Add</button></div>
            {skills.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">{skills.map((s) => (<span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">{s}<button onClick={() => toggleSkill(s)}><X className="w-3 h-3" /></button></span>))}</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Min Experience</label><input type="number" value={expMin} onChange={(e) => setExpMin(+e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /></div>
            <div><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Max Experience</label><input type="number" value={expMax} onChange={(e) => setExpMax(+e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /></div>
          </div>

          <div><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Project Context</label><textarea value={project} onChange={(e) => setProject(e.target.value)} placeholder="Brief context about the project, client, and what success looks like..." rows={4} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" /></div>

          <div><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Budget Range <span className="text-slate-400 normal-case font-normal">(optional)</span></label><input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $120k–$160k" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /></div>

          <button onClick={generate} disabled={!title || skills.length === 0 || generating} className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-violet-500/40 transition">
            {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating with AI...</> : <><Sparkles className="w-4 h-4" />Generate JD</>}
          </button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-50 to-white">
          {!generated && !generating && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30"><Sparkles className="w-8 h-8 text-white" /></div>
              <div className="font-bold text-slate-900">Your AI-generated JD will appear here</div>
              <div className="text-xs text-slate-500 mt-1 max-w-xs">Fill in the form and click Generate. We'll structure the JD, classify skills, and suggest keywords.</div>
            </div>
          )}
          {generating && (
            <div className="h-full flex flex-col items-center justify-center py-16">
              <div className="relative"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse"><Brain className="w-8 h-8 text-white" /></div><div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 blur-xl animate-pulse" /></div>
              <div className="font-bold text-slate-900 mt-4">Drafting your JD...</div>
              <div className="text-xs text-slate-500 mt-1">Analyzing role · classifying skills · generating keywords</div>
            </div>
          )}
          {generated && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Pill tone="violet"><Sparkles className="w-3 h-3" />AI Generated</Pill><span className="text-xs text-slate-500">in 1.4s</span></div><GradientButton size="sm" icon={Save} onClick={() => onCreate({ title, project, skills })}>Save & Create Req</GradientButton></div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">{generated.jd}</div>
              </div>
              <div><div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Check className="w-3 h-3" />Required Skills</div><div className="flex flex-wrap gap-1.5">{generated.required.map((s) => <Pill key={s} tone="emerald">{s}</Pill>)}</div></div>
              <div><div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Plus className="w-3 h-3" />Good to Have</div><div className="flex flex-wrap gap-1.5">{generated.nice.length > 0 ? generated.nice.map((s) => <Pill key={s} tone="sky">{s}</Pill>) : <span className="text-xs text-slate-400 italic">All skills marked as required</span>}</div></div>
              <div><div className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Search className="w-3 h-3" />Suggested Keywords</div><div className="flex flex-wrap gap-1.5">{generated.keywords.map((k) => <Pill key={k} tone="violet">{k}</Pill>)}</div></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ---------- SOURCING ---------- */
const Sourcing = ({ requisitions, candidates, onOpenCandidate }) => {
  const [selectedReq, setSelectedReq] = useState(requisitions[0]?.id);
  const [channels, setChannels] = useState({ LinkedIn: true, Naukri: true, "Internal Database": true, Referrals: false });
  const [fetched, setFetched] = useState(true);
  const [fetching, setFetching] = useState(false);

  const channelDefs = [
    { key: "LinkedIn", icon: Linkedin, color: "from-sky-500 to-blue-500", count: 142000 },
    { key: "Naukri", icon: Database, color: "from-orange-500 to-amber-500", count: 89000 },
    { key: "Internal Database", icon: FileSearch, color: "from-violet-500 to-fuchsia-500", count: 4200 },
    { key: "Referrals", icon: UserPlus, color: "from-emerald-500 to-teal-500", count: 320 },
  ];

  const reqCandidates = candidates.filter(c => c.reqId === selectedReq && Object.entries(channels).filter(([, v]) => v).map(([k]) => k).includes(c.source));

  const handleFetch = () => { setFetching(true); setTimeout(() => { setFetching(false); setFetched(true); }, 1500); };

  return (
    <div className="p-8 space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Sourcing</h1><div className="text-sm text-slate-500 mt-1">Select channels and fetch matching candidates with AI-scored fit.</div></div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 space-y-4">
          <div><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Requisition</label><select value={selectedReq} onChange={(e) => setSelectedReq(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">{requisitions.map((r) => (<option key={r.id} value={r.id}>{r.title}</option>))}</select></div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sourcing Channels</label>
            <div className="space-y-2">
              {channelDefs.map(({ key, icon: Icon, color, count }) => (
                <button key={key} onClick={() => setChannels({ ...channels, [key]: !channels[key] })} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition text-left ${channels[key] ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}><Icon className="w-4 h-4 text-white" /></div><div><div className="font-semibold text-sm text-slate-900">{key}</div><div className="text-[11px] text-slate-500">{count.toLocaleString()} profiles available</div></div></div>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${channels[key] ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}>{channels[key] && <Check className="w-3 h-3 text-white" />}</div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleFetch} disabled={fetching} className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
            {fetching ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Searching channels...</> : <><Zap className="w-4 h-4" />Fetch Candidates</>}
          </button>
        </Card>

        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-slate-900">Matched Candidates</h2>{fetched && <Pill tone="violet"><Sparkles className="w-3 h-3" />{reqCandidates.length} sourced · ranked by AI match</Pill>}</div>
          {fetched && reqCandidates.length > 0 ? (
            <div className="space-y-2">
              {[...reqCandidates].sort((a, b) => b.match - a.match).map((c) => (
                <button key={c.id} onClick={() => onOpenCandidate(c.id)} className="w-full flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition text-left">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-gradient-to-br ${c.match >= 90 ? "from-emerald-500 to-teal-500" : c.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"}`}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500 truncate">{c.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">{c.skills.slice(0, 4).map((s) => <Pill key={s}>{s}</Pill>)}{c.skills.length > 4 && <span className="text-[10px] text-slate-400 self-center">+{c.skills.length - 4}</span>}</div>
                  </div>
                  <div className="text-xs text-slate-500 text-right shrink-0"><div>{c.exp} yrs exp</div><div className="flex items-center gap-1 mt-0.5 justify-end text-slate-400"><MapPin className="w-3 h-3" />{c.location.split(",")[0]}</div><div className="text-[10px] mt-0.5">via {c.source}</div></div>
                  <div className="shrink-0"><ScoreRing score={c.match} size={48} /></div>
                </button>
              ))}
            </div>
          ) : (<div className="text-center py-12 text-sm text-slate-500"><FileSearch className="w-10 h-10 mx-auto text-slate-300 mb-2" />Select channels and click Fetch.</div>)}
        </Card>
      </div>
    </div>
  );
};

/* ---------- CANDIDATE DETAIL ---------- */

/* ============================================================
   CANDIDATE JOURNEY TIMELINE
   Mock per-candidate stage history with AI notes per event.
   ============================================================ */
const candidateTimelines = {
  "c-1": { // Priya Raman — Interviewed
    currentStage: "Interviewed",
    events: [
      { stage: "Sourced",     status: "completed", date: "Apr 18, 2025", time: "10:14 AM", actor: "AI — LinkedIn scan", aiNote: "Profile surfaced via automated LinkedIn match. 94% fit score driven by React + Node + PostgreSQL alignment. Flagged for immediate recruiter review.", sentiment: "positive", tags: ["Strong match", "Active job seeker"] },
      { stage: "Screened",    status: "completed", date: "Apr 20, 2025", time: "2:30 PM",  actor: "Neha K · Recruiter", aiNote: "30-min intro call. Excellent communication — structured, concise, asked sharp questions about the platform. Confirmed TypeScript comfort and open to Bangalore HQ. Comp expectation within band.", sentiment: "positive", tags: ["Communication: 9.2/10", "Comp aligned"] },
      { stage: "Shortlisted", status: "completed", date: "Apr 22, 2025", time: "9:00 AM",  actor: "AI + Recruiter consensus", aiNote: "Moved to shortlist after resume deep-dive. Standout: led 3 zero-downtime DB migrations at Stripe. Minor gap on Kubernetes — not blockers for this role. Ranked #2 of 14 shortlisted.", sentiment: "positive", tags: ["Rank #2 of 14", "Technical depth"] },
      { stage: "Interviewed", status: "active",    date: "Apr 28, 2025", time: "11:00 AM", actor: "Ankit S · Tech Lead", aiNote: "System design round completed. Exceptional depth — designed multi-tenant audit log with correct WORM semantics and S3 cold-storage partitioning. Minor hesitation on Kafka consumer group offsets but self-corrected. Coding round scheduled May 3.", sentiment: "positive", tags: ["System design: 9.0/10", "Round 2 pending"] },
      { stage: "Offered",     status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "Pending completion of coding round and culture panel. Projected offer date: May 8–10 if rounds complete on schedule.", sentiment: "neutral", tags: ["Projected: May 8–10"] },
      { stage: "Decision",    status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "No data yet. Offer stage must complete first.", sentiment: "neutral", tags: [] },
    ],
  },
  "c-2": { // Marcus Webb — Shortlisted
    currentStage: "Shortlisted",
    events: [
      { stage: "Sourced",     status: "completed", date: "Apr 15, 2025", time: "3:20 PM",  actor: "Referral — Divya N",  aiNote: "Internal referral from Divya Nair (Senior Engineer). Marcus is a Staff Engineer at Datadog with platform-infra depth. Match score 91% — strong on TypeScript and Kafka.", sentiment: "positive", tags: ["Referral", "91% match"] },
      { stage: "Screened",    status: "completed", date: "Apr 17, 2025", time: "4:00 PM",  actor: "Neha K · Recruiter",  aiNote: "Strong screen. Marcus communicates with precision — detailed answers, good at tradeoff reasoning. Raised comp expectation: ₹55L target vs band ceiling of ₹50L. Flagged for HM review before proceeding.", sentiment: "warning", tags: ["Comp gap: ₹5L", "Communication: 8.8/10"] },
      { stage: "Shortlisted", status: "active",    date: "Apr 23, 2025", time: "10:00 AM", actor: "Neha K + HM consensus", aiNote: "HM reviewed profile and approved to proceed despite comp gap — role impact justifies stretching band. Awaiting interview scheduling. Note: Marcus mentioned a competing offer from Atlassian. Prioritise scheduling.", sentiment: "warning", tags: ["Competing offer", "Band stretch approved"] },
      { stage: "Interviewed", status: "upcoming",  date: "May 3, 2025",  time: "3:00 PM",  actor: "Ankit S (scheduled)", aiNote: "System design round booked. HM personally requested to observe. Candidate confirmed availability.", sentiment: "neutral", tags: ["Scheduled: May 3"] },
      { stage: "Offered",     status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "Pending interview outcome. Comp negotiation likely required.", sentiment: "neutral", tags: [] },
      { stage: "Decision",    status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "No data yet.", sentiment: "neutral", tags: [] },
    ],
  },
  "c-6": { // Nina Patel — Offered (top candidate)
    currentStage: "Offered",
    events: [
      { stage: "Sourced",     status: "completed", date: "Apr 10, 2025", time: "9:45 AM",  actor: "AI — Internal DB",    aiNote: "Surfaced from internal database — Nina applied 8 months ago for a different role and was held. Reactivated for Apex Banking. Match score 96% — highest in the entire pipeline.", sentiment: "positive", tags: ["Internal DB", "96% match — #1 in pipeline"] },
      { stage: "Screened",    status: "completed", date: "Apr 12, 2025", time: "11:00 AM", actor: "Neha K · Recruiter",  aiNote: "Outstanding intro call. Nina had already researched the Apex Banking project context from public sources. Communication score 9.4 — best in this cohort. Confirmed comp alignment and 30-day notice period.", sentiment: "positive", tags: ["Communication: 9.4/10", "Notice: 30 days"] },
      { stage: "Shortlisted", status: "completed", date: "Apr 14, 2025", time: "2:00 PM",  actor: "AI + Recruiter",      aiNote: "Unanimous shortlist. Built equivalent platform at Freshworks (multi-tenant, 200k users). Reference from ex-CTO provided unprompted. Ranked #1 across all shortlisted candidates.", sentiment: "positive", tags: ["Rank #1 of 14", "CTO reference"] },
      { stage: "Interviewed", status: "completed", date: "Apr 21, 2025", time: "10:00 AM", actor: "Ankit S + HM panel",  aiNote: "All 4 rounds completed in a single day at Nina's request. System design (9.3), coding (9.1), HM (strong hire), culture (strong hire). Fastest interview-to-offer pipeline this quarter. Zero concerns raised.", sentiment: "positive", tags: ["All rounds: 1 day", "4/4 strong hire"] },
      { stage: "Offered",     status: "active",    date: "Apr 28, 2025", time: "5:00 PM",  actor: "HR · Offer dispatch",  aiNote: "Formal offer sent: ₹62L + ESOP + signing bonus. Within band. No response after 3 days — risk flag raised by AI. Recommend follow-up call today. Competing offer from Razorpay suspected based on LinkedIn activity.", sentiment: "warning", tags: ["⚠ 3 days no response", "Competing offer risk"] },
      { stage: "Decision",    status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "Follow-up scheduled for May 1. Candidate has not declined — positive signal. Recruiter to gauge timeline and competing offer status.", sentiment: "neutral", tags: ["Follow-up: May 1"] },
    ],
  },
  "c-8": { // Sara Lindqvist — Hired
    currentStage: "Hired",
    events: [
      { stage: "Sourced",     status: "completed", date: "Mar 28, 2025", time: "11:30 AM", actor: "Referral — Karan M",  aiNote: "Referred by Karan Malhotra (Principal Engineer). Sara is a Senior Engineer at Klarna with fintech + high-scale background. Match score 93%.", sentiment: "positive", tags: ["Referral", "93% match"] },
      { stage: "Screened",    status: "completed", date: "Mar 30, 2025", time: "1:00 PM",  actor: "Neha K · Recruiter",  aiNote: "Excellent screen. Sara communicates as clearly in writing as verbally — sent a follow-up summary email within an hour of the call. Strong on async collaboration signals. Comp fully aligned.", sentiment: "positive", tags: ["Communication: 9.1/10", "Async-strong"] },
      { stage: "Shortlisted", status: "completed", date: "Apr 1, 2025",  time: "9:30 AM",  actor: "AI + Recruiter",      aiNote: "Shortlisted day 1. Backchannel reference from shared connection (positive). Kafka experience directly relevant to Apex event pipeline. Ranked #3 of 14.", sentiment: "positive", tags: ["Rank #3", "Backchannel: positive"] },
      { stage: "Interviewed", status: "completed", date: "Apr 8, 2025",  time: "10:00 AM", actor: "Ankit S + HM",        aiNote: "3 rounds over 2 days. Coding: clean, well-documented, proactive about edge cases. System design: strong — introduced event sourcing pattern the team hadn't considered. Culture: immediate fit. All interviewers: strong hire.", sentiment: "positive", tags: ["Coding", "System design", "Culture: 3/3 strong hire"] },
      { stage: "Offered",     status: "completed", date: "Apr 14, 2025", time: "4:00 PM",  actor: "HR · Offer dispatch",  aiNote: "Offer dispatched: ₹58L + ESOP. Sara accepted within 18 hours — fastest accept time this quarter. No counter-offer or negotiation. Notice period: 3 weeks.", sentiment: "positive", tags: ["Accepted in 18h", "No negotiation"] },
      { stage: "Decision",    status: "completed", date: "Apr 15, 2025", time: "10:00 AM", actor: "HR · Confirmed",       aiNote: "Hire confirmed. Start date: May 12, 2025. Onboarding pack sent. IT access provisioning initiated. AI summary: fastest end-to-end hire this quarter — 18 days sourced to accepted.", sentiment: "positive", tags: ["✓ Hired", "Start: May 12", "18 days total"] },
    ],
  },
  "c-7": { // Tom Becker — Sourced (low match, rejected early)
    currentStage: "Sourced",
    events: [
      { stage: "Sourced",     status: "active",    date: "Apr 25, 2025", time: "8:00 AM",  actor: "AI — LinkedIn scan",  aiNote: "Profile auto-matched on React + Node.js keywords. Match score 71% — below 80% threshold for auto-shortlist. Flagged for manual recruiter review. MongoDB primary stack — not aligned with PostgreSQL requirement.", sentiment: "warning", tags: ["71% match", "Below threshold", "Stack mismatch"] },
      { stage: "Screened",    status: "skipped",   date: "—", time: "—", actor: "Neha K · Recruiter",  aiNote: "Recruiter reviewed profile and decided not to screen. Reasons: 4 yrs experience (below 5yr floor), agency-only background, no TypeScript exposure. Marked as 'Reject — experience floor'.", sentiment: "negative", tags: ["Not screened", "Below exp floor"] },
      { stage: "Shortlisted", status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Interviewed", status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Offered",     status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Decision",    status: "completed", date: "Apr 26, 2025", time: "9:00 AM",  actor: "Neha K · Recruiter",  aiNote: "Candidate rejected at sourcing stage. Feedback: experience below floor, stack mismatch (MongoDB vs PostgreSQL), agency-only background doesn't meet enterprise project requirements. Archived.", sentiment: "negative", tags: ["Rejected at source", "Archived"] },
    ],
  },
};

// Fallback timeline generator for candidates without custom timelines
const generateTimeline = (candidate) => {
  const stageIndex = stageOrder.indexOf(candidate.stage);
  const baseDate = new Date("2025-04-01");
  return {
    currentStage: candidate.stage,
    events: [
      { stage: "Sourced",     status: stageIndex >= 0 ? "completed" : "upcoming", date: "Apr 1, 2025",  time: "9:00 AM",  actor: `AI — ${candidate.source}`,  aiNote: `Profile matched via ${candidate.source} with ${candidate.match}% fit score. ${candidate.strengths[0] || "Meets core requirements"}.`, sentiment: "positive", tags: [`${candidate.match}% match`, candidate.source] },
      { stage: "Screened",    status: stageIndex >= 1 ? "completed" : stageIndex === 0 ? "upcoming" : "skipped", date: stageIndex >= 1 ? "Apr 5, 2025" : "—", time: stageIndex >= 1 ? "2:00 PM" : "—", actor: "Neha K · Recruiter", aiNote: stageIndex >= 1 ? `Intro screen completed. ${candidate.gaps[0] ? `Note: ${candidate.gaps[0]}.` : "No major concerns."} Communication score: ${candidate.commScore}/10.` : "Not yet reached.", sentiment: stageIndex >= 1 ? (candidate.commScore >= 8.5 ? "positive" : "warning") : "neutral", tags: stageIndex >= 1 ? [`Comm: ${candidate.commScore}/10`] : [] },
      { stage: "Shortlisted", status: stageIndex >= 2 ? "completed" : stageIndex === 1 ? "upcoming" : "skipped", date: stageIndex >= 2 ? "Apr 10, 2025" : "—", time: stageIndex >= 2 ? "10:00 AM" : "—", actor: "Recruiter + AI", aiNote: stageIndex >= 2 ? `Shortlisted based on ${candidate.strengths[0] || "overall profile strength"}. Technical score: ${candidate.techScore}/10.` : "Not yet reached.", sentiment: stageIndex >= 2 ? "positive" : "neutral", tags: stageIndex >= 2 ? [`Tech: ${candidate.techScore}/10`] : [] },
      { stage: "Interviewed", status: stageIndex >= 3 ? "completed" : stageIndex === 2 ? "active" : "upcoming", date: stageIndex >= 3 ? "Apr 18, 2025" : "—", time: stageIndex >= 3 ? "11:00 AM" : "—", actor: "Tech panel", aiNote: stageIndex >= 3 ? `Interview rounds completed. Overall technical assessment: ${candidate.techScore}/10. Recommendation: ${candidate.recommendation}.` : "Pending shortlist completion.", sentiment: stageIndex >= 3 ? (candidate.recommendation === "Proceed" ? "positive" : candidate.recommendation === "Hold" ? "warning" : "negative") : "neutral", tags: stageIndex >= 3 ? [candidate.recommendation] : [] },
      { stage: "Offered",     status: stageIndex >= 4 ? (stageIndex === 4 ? "active" : "completed") : "upcoming", date: stageIndex >= 4 ? "Apr 25, 2025" : "—", time: stageIndex >= 4 ? "5:00 PM" : "—", actor: "HR", aiNote: stageIndex >= 4 ? "Formal offer extended. Awaiting candidate response." : "Pending interview completion.", sentiment: "neutral", tags: [] },
      { stage: "Decision",    status: stageIndex >= 5 ? "completed" : "upcoming", date: stageIndex >= 5 ? "Apr 28, 2025" : "—", time: stageIndex >= 5 ? "10:00 AM" : "—", actor: "HR · Confirmed", aiNote: stageIndex >= 5 ? `Candidate ${candidate.stage === "Hired" ? "accepted and joined" : "decision pending"}.` : "Awaiting offer stage.", sentiment: stageIndex >= 5 ? "positive" : "neutral", tags: stageIndex >= 5 ? ["Hired ✓"] : [] },
    ],
  };
};

const getTimeline = (candidate) => candidateTimelines[candidate.id] || generateTimeline(candidate);

/* ---------- CANDIDATE JOURNEY TIMELINE component ---------- */
const CandidateTimeline = ({ candidate }) => {
  const timeline = getTimeline(candidate);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const stageConfig = {
    Sourced:     { icon: "🔍", color: "indigo",  grad: "from-indigo-500 to-blue-500",    ring: "ring-indigo-400"  },
    Screened:    { icon: "📋", color: "violet",  grad: "from-violet-500 to-fuchsia-500", ring: "ring-violet-400"  },
    Shortlisted: { icon: "⭐", color: "fuchsia", grad: "from-fuchsia-500 to-pink-500",   ring: "ring-fuchsia-400" },
    Interviewed: { icon: "🎯", color: "pink",    grad: "from-pink-500 to-rose-500",      ring: "ring-pink-400"    },
    Offered:     { icon: "📨", color: "amber",   grad: "from-amber-500 to-orange-500",   ring: "ring-amber-400"   },
    Decision:    { icon: "✅", color: "emerald", grad: "from-emerald-500 to-teal-500",   ring: "ring-emerald-400" },
  };

  const statusConfig = {
    completed: { label: "Completed", dot: "bg-emerald-500",  text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
    active:    { label: "In Progress", dot: "bg-indigo-500 animate-pulse", text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
    upcoming:  { label: "Upcoming",   dot: "bg-slate-300",   text: "text-slate-500",   bg: "bg-slate-50",    border: "border-slate-200"   },
    skipped:   { label: "Skipped",    dot: "bg-rose-400",    text: "text-rose-600",    bg: "bg-rose-50",     border: "border-rose-200"    },
  };

  const sentimentStyle = {
    positive: { bar: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
    warning:  { bar: "bg-amber-400",   badge: "bg-amber-100 text-amber-700"     },
    negative: { bar: "bg-rose-400",    badge: "bg-rose-100 text-rose-700"       },
    neutral:  { bar: "bg-slate-300",   badge: "bg-slate-100 text-slate-600"     },
  };

  const completedCount = timeline.events.filter(e => e.status === "completed").length;
  const totalMeaningful = timeline.events.filter(e => e.status !== "upcoming").length;
  const progressPct = Math.round((completedCount / 6) * 100);

  return (
    <div className="space-y-4">
      {/* Timeline header with overall progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-900 text-lg">Candidate Journey</h2>
          <Pill tone="violet"><Sparkles className="w-3 h-3" />AI Notes</Pill>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">{completedCount} of 6 stages complete</div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs font-bold text-slate-700 tabular-nums">{progressPct}%</div>
        </div>
      </div>

      {/* Stage progress strip */}
      <div className="flex items-center gap-0 bg-slate-50 rounded-2xl p-3 border border-slate-200">
        {timeline.events.map((ev, i) => {
          const cfg = stageConfig[ev.stage] || stageConfig.Sourced;
          const st  = statusConfig[ev.status];
          const isLast = i === timeline.events.length - 1;
          const isActive = ev.status === "active";
          return (
            <React.Fragment key={ev.stage}>
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-1 min-w-0 ${expandedIdx === i ? "bg-white shadow-sm border border-slate-200" : "hover:bg-white/60"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all
                  ${ev.status === "completed" ? `bg-gradient-to-br ${cfg.grad} shadow-sm` : ""}
                  ${ev.status === "active"    ? `bg-gradient-to-br ${cfg.grad} shadow-md ring-2 ${cfg.ring} ring-offset-1` : ""}
                  ${ev.status === "upcoming"  ? "bg-slate-200" : ""}
                  ${ev.status === "skipped"   ? "bg-rose-100" : ""}
                `}>
                  <span className={ev.status === "upcoming" ? "grayscale opacity-40" : ""}>{cfg.icon}</span>
                </div>
                <div className="text-center">
                  <div className={`text-[10px] font-bold uppercase tracking-wider truncate max-w-[60px] ${isActive ? "text-indigo-700" : ev.status === "completed" ? "text-slate-700" : ev.status === "skipped" ? "text-rose-500" : "text-slate-400"}`}>
                    {ev.stage}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className={`text-[9px] font-semibold ${st.text}`}>{st.label}</span>
                  </div>
                </div>
              </button>
              {!isLast && (
                <div className={`w-6 h-0.5 shrink-0 mx-0.5 rounded-full ${
                  ev.status === "completed" ? "bg-gradient-to-r from-emerald-400 to-emerald-300" :
                  ev.status === "active"    ? "bg-gradient-to-r from-indigo-400 to-slate-200" :
                  "bg-slate-200"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Expanded event detail */}
      {expandedIdx !== null && (() => {
        const ev  = timeline.events[expandedIdx];
        const cfg = stageConfig[ev.stage] || stageConfig.Sourced;
        const st  = statusConfig[ev.status];
        const sen = sentimentStyle[ev.sentiment] || sentimentStyle.neutral;
        return (
          <div className={`rounded-2xl border ${st.border} ${st.bg} overflow-hidden transition-all`}>
            {/* Detail header */}
            <div className={`bg-gradient-to-r ${cfg.grad} px-5 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{cfg.icon}</div>
                <div>
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{ev.stage} stage</div>
                  <div className="text-white font-bold text-base leading-tight">{ev.status === "upcoming" ? "Upcoming" : ev.status === "skipped" ? "Skipped" : ev.date}</div>
                  {ev.time !== "—" && <div className="text-white/70 text-xs">{ev.time} · {ev.actor}</div>}
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-bold flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${ev.status === "active" ? "animate-pulse" : ""}`} />
                {st.label}
              </div>
            </div>

            {/* AI note */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    AI-Generated Note
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sen.badge}`}>
                      {ev.sentiment === "positive" ? "Positive signal" : ev.sentiment === "warning" ? "Watch closely" : ev.sentiment === "negative" ? "Concern flagged" : "Neutral"}
                    </span>
                  </div>
                  {/* Sentiment accent bar */}
                  <div className={`w-full h-0.5 rounded-full mb-3 ${sen.bar}`} />
                  <p className="text-sm text-slate-700 leading-relaxed">{ev.aiNote}</p>

                  {/* Tags */}
                  {ev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ev.tags.map((tag, ti) => (
                        <span key={ti} className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actor + timestamp footer */}
              {ev.actor !== "—" && ev.status !== "upcoming" && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[9px] font-bold text-white">
                      {ev.actor.split("·")[0].trim().split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-xs text-slate-500">{ev.actor}</span>
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums">{ev.date}{ev.time !== "—" ? ` · ${ev.time}` : ""}</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Click hint */}
      {expandedIdx === null && (
        <div className="text-center text-xs text-slate-400 py-1">
          ↑ Click any stage to see AI notes, dates, and status details
        </div>
      )}
    </div>
  );
};

/* ---------- CANDIDATE DETAIL ---------- */
const CandidateDetail = ({ candidate, onBack, onScreen }) => {
  if (!candidate) return null;
  const recColors = { Proceed: "emerald", Hold: "amber", Reject: "rose" };

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ChevronRight className="w-4 h-4 rotate-180" />Back
      </button>

      {/* Hero card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10" />
        <div className="relative flex items-start gap-5">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 bg-gradient-to-br ${candidate.match >= 90 ? "from-emerald-500 to-teal-500" : candidate.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"} shadow-lg`}>
            {candidate.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.name}</h1>
            <div className="text-sm text-slate-600 mt-0.5">{candidate.title}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.location}</span>
              <span>·</span><span>{candidate.exp} yrs exp</span><span>·</span><span>via {candidate.source}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">{candidate.skills.map((s) => <Pill key={s} tone="indigo">{s}</Pill>)}</div>
          </div>
          <div className="text-center shrink-0">
            <ScoreRing score={candidate.match} size={88} />
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">AI Fit Score</div>
          </div>
        </div>
      </Card>

      {/* ═══ CANDIDATE JOURNEY TIMELINE ═══ */}
      <Card className="p-6">
        <CandidateTimeline candidate={candidate} />
      </Card>

      {/* AI Summary + Skill Match */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h2 className="font-bold text-slate-900">AI Summary</h2>
            <Pill tone="violet">AI</Pill>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{candidate.summary}</p>

          <div className="grid grid-cols-2 gap-5 mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-3"><ThumbsUp className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-slate-900">Strengths</h3></div>
              <ul className="space-y-2">{candidate.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{s}</li>
              ))}</ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-amber-600" /><h3 className="font-bold text-sm text-slate-900">Gaps</h3></div>
              <ul className="space-y-2">{candidate.gaps.length > 0 ? candidate.gaps.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700"><X className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{g}</li>
              )) : <li className="text-sm text-slate-400 italic">No significant gaps identified</li>}</ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Skill Match Breakdown</h2>
          <div className="space-y-3">
            {candidate.skills.slice(0, 6).map((s, i) => {
              const score = Math.max(60, candidate.match - i * 3 - ((i * 7) % 5));
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{s}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${score >= 90 ? "bg-emerald-500" : score >= 75 ? "bg-indigo-500" : "bg-amber-500"}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Communication</span>
              <span className="text-sm font-bold text-slate-900">{candidate.commScore}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Technical</span>
              <span className="text-sm font-bold text-slate-900">{candidate.techScore}/10</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-600">AI Recommendation</span>
              <Pill tone={recColors[candidate.recommendation]}>
                {candidate.recommendation === "Proceed" && <ThumbsUp className="w-3 h-3" />}
                {candidate.recommendation === "Hold"    && <Pause className="w-3 h-3" />}
                {candidate.recommendation === "Reject"  && <ThumbsDown className="w-3 h-3" />}
                {candidate.recommendation}
              </Pill>
            </div>
          </div>

          <button onClick={onScreen} className="w-full mt-5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />Run AI Screening
          </button>
        </Card>
      </div>
    </div>
  );
};

const ScreeningHub = ({ candidates, onOpenCandidate, onStartScreening }) => {
  const screened = candidates.filter(c => ["Shortlisted", "Interviewed", "Offered", "Hired"].includes(c.stage));
  const recColors = { Proceed: "emerald", Hold: "amber", Reject: "rose" };
  const recIcons = { Proceed: "✓", Hold: "~", Reject: "✕" };

  const stats = [
    { label: "Ready to Screen", value: candidates.filter(c => c.stage === "Shortlisted").length, tone: "indigo" },
    { label: "Screened", value: candidates.filter(c => ["Interviewed", "Offered", "Hired"].includes(c.stage)).length, tone: "violet" },
    { label: "Recommended Proceed", value: candidates.filter(c => c.recommendation === "Proceed").length, tone: "emerald" },
    { label: "On Hold / Reject", value: candidates.filter(c => ["Hold","Reject"].includes(c.recommendation)).length, tone: "amber" },
  ];

  const toneGrad = { indigo: "from-indigo-500 to-blue-500", violet: "from-violet-500 to-fuchsia-500", emerald: "from-emerald-500 to-teal-500", amber: "from-amber-500 to-orange-500" };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span>⬡</span> AI Screening Assistant
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Screening</h1>
          <div className="text-sm text-slate-500 mt-1">AI-generated questions, async responses, and automated assessments for shortlisted candidates.</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((m) => (
          <Card key={m.label} className="p-5 relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${toneGrad[m.tone]}`} />
            <div className="relative">
              <div className={`w-2 h-2 rounded-full mb-3 bg-gradient-to-br ${toneGrad[m.tone]}`} style={{width:8,height:8}} />
              <div className="text-xs text-slate-500 font-medium">{m.label}</div>
              <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{m.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4 text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900">Candidates</h2>
          <Pill tone="violet">{screened.length} in scope</Pill>
        </div>

        {screened.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <div className="font-semibold text-slate-600">No candidates at Shortlisted stage yet</div>
            <div className="text-sm mt-1">Move candidates past Shortlisted in the pipeline to screen them here.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {[...screened].sort((a, b) => b.match - a.match).map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/20 transition group">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-gradient-to-br ${c.match >= 90 ? "from-emerald-500 to-teal-500" : c.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"}`}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{c.name}</span>
                    <Pill tone={c.stage === "Hired" ? "emerald" : c.stage === "Offered" ? "amber" : "indigo"}>{c.stage}</Pill>
                    {c.recommendation && (
                      <Pill tone={recColors[c.recommendation]}>
                        {recIcons[c.recommendation]} {c.recommendation}
                      </Pill>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{c.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">{c.skills.slice(0, 4).map(s => <Pill key={s}>{s}</Pill>)}</div>
                </div>

                <div className="text-center shrink-0 hidden sm:block">
                  <ScoreRing score={c.match} size={48} />
                  <div className="text-[10px] text-slate-400 mt-1">Fit Score</div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => onOpenCandidate(c.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition">
                    View Profile
                  </button>
                  <button onClick={() => onStartScreening(c.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow-md transition">
                    Run Screening
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5 bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-1">How AI Screening works</div>
            <div className="text-xs text-slate-600 leading-relaxed">Click <strong>"Run Screening"</strong> on any candidate to generate role-specific questions based on their profile and the JD. Candidates respond asynchronously, and the AI scores communication, technical depth, and cultural fit — then gives a Proceed / Hold / Reject recommendation.</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ---------- AI SCREENING ---------- */
const Screening = ({ candidate, onBack }) => {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    if (step < screeningQA.length) {
      const t = setTimeout(() => { setRevealed((prev) => [...prev, step]); setStep((prev) => prev + 1); }, 900);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (!candidate) return <div className="p-8">No candidate selected.</div>;
  const recColors = { Proceed: "emerald", Hold: "amber", Reject: "rose" };

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" />Back to candidate</button>

      <div>
        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2"><Bot className="w-3 h-3" />AI Screening Assistant</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Screening: {candidate.name}</h1>
        <div className="text-sm text-slate-500 mt-1">AI-generated questions based on the JD and candidate profile · responses captured asynchronously</div>
      </div>

      <div className="space-y-3">
        {screeningQA.map((qa, i) => (
          <Card key={i} className={`p-5 transition-all duration-500 ${revealed.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-1">Question {i + 1}</div>
                <div className="text-sm font-semibold text-slate-900">{qa.q}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-4 pl-11">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 bg-gradient-to-br ${candidate.match >= 90 ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-violet-500"}`}>{candidate.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 bg-slate-50 rounded-xl p-3 text-sm text-slate-700 leading-relaxed">{qa.a}</div>
            </div>
          </Card>
        ))}
      </div>

      {step >= screeningQA.length && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 border-indigo-200">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-violet-600" /><h2 className="font-bold text-slate-900">AI Assessment</h2><Pill tone="violet">Generated</Pill></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Communication</div>
              <div className="flex items-end gap-1 mt-1"><span className="text-3xl font-bold text-slate-900 tabular-nums">{candidate.commScore}</span><span className="text-sm text-slate-400 mb-1">/10</span></div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${candidate.commScore * 10}%` }} /></div>
              <div className="text-[11px] text-slate-500 mt-2">Clear, structured, articulate. Strong written reasoning.</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Technical</div>
              <div className="flex items-end gap-1 mt-1"><span className="text-3xl font-bold text-slate-900 tabular-nums">{candidate.techScore}</span><span className="text-sm text-slate-400 mb-1">/10</span></div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${candidate.techScore * 10}%` }} /></div>
              <div className="text-[11px] text-slate-500 mt-2">Demonstrates depth on system design and tradeoff analysis.</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recommendation</div>
              <div className="mt-2"><Pill tone={recColors[candidate.recommendation]}>{candidate.recommendation === "Proceed" && <ThumbsUp className="w-3 h-3" />}{candidate.recommendation === "Hold" && <Pause className="w-3 h-3" />}{candidate.recommendation === "Reject" && <ThumbsDown className="w-3 h-3" />}{candidate.recommendation}</Pill></div>
              <div className="text-[11px] text-slate-500 mt-3">Move to technical loop with system-design panel. Probe on multi-tenant compliance.</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
/* ---------- ADMIN ---------- */
const Admin = () => {
  const [tab, setTab] = useState("stages");
  const [stages, setStages] = useState(stageOrder);
  const [newStage, setNewStage] = useState("");
  const [weights, setWeights] = useState({ skills: 45, experience: 25, communication: 15, education: 10, projectFit: 5 });
  const [sources, setSources] = useState({ LinkedIn: true, Naukri: true, "Internal Database": true, Referrals: true, Indeed: false, GitHub: false });
  const [templates] = useState([
    { id: "t1", name: "Senior IC — Engineering", uses: 24, updated: "3d ago" },
    { id: "t2", name: "Cloud Architect", uses: 12, updated: "1w ago" },
    { id: "t3", name: "Data Engineer", uses: 8, updated: "2w ago" },
    { id: "t4", name: "Product Manager", uses: 6, updated: "1m ago" },
  ]);

  const tabs = [
    { key: "stages", label: "Hiring Stages", icon: Layers },
    { key: "weights", label: "Scoring Weights", icon: Sliders },
    { key: "sources", label: "Sourcing Channels", icon: Database },
    { key: "templates", label: "JD Templates", icon: FileText },
  ];

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="p-8 space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin & Configuration</h1><div className="text-sm text-slate-500 mt-1">Configure hiring stages, scoring weights, sourcing channels, and JD templates.</div></div>

      <div className="flex gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (<button key={t.key} onClick={() => setTab(t.key)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === t.key ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-violet-500/25" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"}`}><Icon className="w-4 h-4" />{t.label}</button>);
        })}
      </div>

      {tab === "stages" && (
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-1">Hiring Stages</h2>
          <div className="text-xs text-slate-500 mb-5">Customize the pipeline stages used across all requisitions.</div>
          <div className="space-y-2">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 transition group">
                <GripVertical className="w-4 h-4 text-slate-300" />
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">{i + 1}</div>
                <div className="flex-1 font-semibold text-sm text-slate-900">{s}</div>
                <button onClick={() => setStages(stages.filter(x => x !== s))} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <input value={newStage} onChange={(e) => setNewStage(e.target.value)} placeholder="New stage name..." className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            <GradientButton icon={Plus} onClick={() => { if (newStage.trim()) { setStages([...stages, newStage.trim()]); setNewStage(""); } }}>Add Stage</GradientButton>
          </div>
        </Card>
      )}

      {tab === "weights" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-1"><h2 className="font-bold text-slate-900">Scoring Weights</h2><Pill tone={totalWeight === 100 ? "emerald" : "amber"}>Total: {totalWeight}%</Pill></div>
          <div className="text-xs text-slate-500 mb-5">Configure how the AI computes a candidate's overall fit score. Should total 100%.</div>
          <div className="space-y-5">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</label>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{val}%</span>
                </div>
                <input type="range" min="0" max="60" value={val} onChange={(e) => setWeights({ ...weights, [key]: +e.target.value })} className="w-full accent-indigo-600" />
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 text-xs text-slate-700"><strong>How it works:</strong> Each candidate's resume is scored on these dimensions, then weighted using your configured percentages to produce the AI Fit Score shown on the candidate cards.</div>
        </Card>
      )}

      {tab === "sources" && (
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-1">Sourcing Channels</h2>
          <div className="text-xs text-slate-500 mb-5">Enable or disable channels available during sourcing.</div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(sources).map(([key, on]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div><div className="font-semibold text-sm text-slate-900">{key}</div><div className="text-[11px] text-slate-500">{on ? "Active" : "Disabled"}</div></div>
                <button onClick={() => setSources({ ...sources, [key]: !on })} className={`relative w-11 h-6 rounded-full transition ${on ? "bg-indigo-600" : "bg-slate-200"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${on ? "translate-x-5" : ""}`} /></button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "templates" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5"><div><h2 className="font-bold text-slate-900">JD Templates</h2><div className="text-xs text-slate-500 mt-0.5">Reusable templates that pre-fill the JD generator.</div></div><GradientButton icon={Plus}>New Template</GradientButton></div>
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"><FileText className="w-4 h-4 text-white" /></div><div><div className="font-semibold text-sm text-slate-900">{t.name}</div><div className="text-[11px] text-slate-500">Used {t.uses} times · updated {t.updated}</div></div></div>
                <div className="flex gap-2"><button className="text-slate-400 hover:text-slate-700"><Edit3 className="w-4 h-4" /></button><button className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

/* ---------- COPILOT DRAWER ---------- */
const CopilotDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi Neha — I'm your recruiting copilot. Ask about candidates, funnels, or sourcing performance." }]);
  const [input, setInput] = useState("");

  const send = (q) => {
    if (!q.trim()) return;
    const sample = aiCopilotSamples.find(s => s.q.toLowerCase() === q.toLowerCase()) || aiCopilotSamples[Math.floor(Math.random() * aiCopilotSamples.length)];
    setMessages((prev) => [...prev, { role: "user", text: q }, { role: "ai", text: sample.a, typing: true }]);
    setInput("");
    setTimeout(() => setMessages((m) => m.map((x, i) => i === m.length - 1 ? { ...x, typing: false } : x)), 800);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[420px] bg-white shadow-2xl flex flex-col border-l border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div><div><div className="font-bold text-slate-900 text-sm">HumAIne Copilot</div><div className="text-[10px] text-slate-500">Powered by your data</div></div></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${m.role === "user" ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                {m.typing ? (
                  <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></span>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pt-2 pb-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5 mb-2">{aiCopilotSamples.map((s) => (<button key={s.q} onClick={() => send(s.q)} className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 transition">{s.q}</button>))}</div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Ask anything..." className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            <button onClick={() => send(input)} className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN APP ---------- */
/* ============================================================
   MAIN APP — persona state wires through everything
   ============================================================ */
export default function HumAIne() {
  const [view, setView] = useState({ name: "dashboard" });
  const [persona, setPersona] = useState("recruiter");
  const [requisitions] = useState(seedRequisitions);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const updateCandidate = (id, patch) => setCandidates((prev) => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  const currentCandidate = view.candidateId ? candidates.find(c => c.id === view.candidateId) : null;
  const currentReq = view.reqId ? requisitions.find(r => r.id === view.reqId) : null;

  const nav = (name) => setView({ name });

  // When persona changes, navigate to dashboard and reset view
  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    setView({ name: "dashboard" });
  };

  const sidebarActive =
    view.name === "req-detail"   ? "requisitions" :
    view.name === "candidate" && view.from !== "screening-hub" ? "sourcing" :
    view.name === "candidate" && view.from === "screening-hub" ? "screening-hub" :
    view.name === "screening"    ? "screening-hub" :
    view.name;

  // Persona-specific dashboard
  const renderDashboard = () => {
    switch (persona) {
      case "hiringManager":  return <HiringManagerDashboard  candidates={candidates} onOpenReq={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />;
      case "deliveryManager":return <DeliveryManagerDashboard />;
      case "hrLeader":       return <HRLeaderDashboard />;
      case "admin":          return <AdminDashboard onNav={nav} />;
      default:               return <RecruiterDashboard requisitions={requisitions} candidates={candidates} onOpenReq={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />;
    }
  };

  return (
    <PersonaContext.Provider value={persona}>
      <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Sidebar active={sidebarActive} onNav={nav} persona={persona} />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar onCopilot={() => setCopilotOpen(true)} persona={persona} onPersonaChange={handlePersonaChange} />
          <PersonaBanner persona={persona} />
          <div className="flex-1">
            {view.name === "dashboard"    && renderDashboard()}
            {view.name === "requisitions" && <RequisitionsList requisitions={requisitions} onOpen={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />}
            {view.name === "req-detail"   && currentReq && <RequisitionDetail req={currentReq} candidates={candidates} onBack={() => nav("requisitions")} onUpdateCandidate={updateCandidate} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "req-detail", reqId: view.reqId })} />}
            {view.name === "jd-generator" && <JDGenerator onCreate={() => nav("requisitions")} />}
            {view.name === "sourcing"     && <Sourcing requisitions={requisitions} candidates={candidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "sourcing" })} />}
            {view.name === "screening-hub"&& <ScreeningHub candidates={candidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "screening-hub" })} onStartScreening={(id) => setView({ name: "screening", candidateId: id, from: "screening-hub" })} />}
            {view.name === "candidate"    && currentCandidate && <CandidateDetail candidate={currentCandidate} onBack={() => { if (view.from === "req-detail") setView({ name: "req-detail", reqId: view.reqId }); else if (view.from === "screening-hub") nav("screening-hub"); else nav("sourcing"); }} onScreen={() => setView({ name: "screening", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} />}
            {view.name === "screening"    && currentCandidate && <Screening candidate={currentCandidate} onBack={() => { if (view.from === "screening-hub") nav("screening-hub"); else setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId }); }} />}
            {view.name === "admin"        && <Admin />}
          </div>
        </main>
        <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} />
      </div>
    </PersonaContext.Provider>
  );
}

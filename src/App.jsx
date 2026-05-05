import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import {
  LayoutDashboard, Briefcase, Sparkles, Users, FileSearch, MessageSquare,
  Settings, Search, Bell, ChevronRight, Plus, X, Check, Filter,
  TrendingUp, Target, Zap, Brain, Send, Bot, Star, MapPin,
  ArrowUpRight, Linkedin, Database, UserPlus,
  Award, AlertCircle, ThumbsUp, ThumbsDown, Pause, GripVertical, Trash2,
  Edit3, Save, Sliders, Layers, FileText, Clock, ChevronDown,
  Calendar, ClipboardList, BarChart2, Flag, Shield, Activity,
  PlayCircle, CheckCircle2, XCircle, HelpCircle, BookOpen, Lightbulb,
  DollarSign, FileSignature, Mail, UserCheck, AlertTriangle, Timer
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
  { id: "req-1", title: "Senior Full-Stack Engineer", project: "Apex Banking Platform", status: "Active", priority: "High", openings: 3, daysOpen: 12, sourced: 47, screened: 28, shortlisted: 14, interviewed: 7, offered: 2, hired: 1, budget: "$120k–$160k", expRange: "5–8 yrs", skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
    bu: "Financial Services", department: "Engineering", product: "Apex Banking", costCenter: "CC-1042", locationOffice: "Bangalore" },
  { id: "req-2", title: "Cloud Solutions Architect", project: "Helios Migration", status: "Active", priority: "Critical", openings: 1, daysOpen: 21, sourced: 32, screened: 19, shortlisted: 8, interviewed: 4, offered: 1, hired: 0, budget: "$160k–$200k", expRange: "8–12 yrs", skills: ["AWS", "Kubernetes", "Terraform", "Python"],
    bu: "Enterprise Cloud", department: "Architecture", product: "Helios Platform", costCenter: "CC-2201", locationOffice: "Pune" },
  { id: "req-3", title: "Data Engineer (Snowflake)", project: "Northstar Analytics", status: "Active", priority: "Medium", openings: 2, daysOpen: 6, sourced: 18, screened: 11, shortlisted: 5, interviewed: 2, offered: 0, hired: 0, budget: "$110k–$140k", expRange: "4–7 yrs", skills: ["Snowflake", "dbt", "Python", "Airflow"],
    bu: "Data & Analytics", department: "Data Engineering", product: "Northstar", costCenter: "CC-3105", locationOffice: "Hyderabad" },
  { id: "req-4", title: "iOS Engineer", project: "Lumen Mobile", status: "On Hold", priority: "Low", openings: 1, daysOpen: 34, sourced: 22, screened: 9, shortlisted: 3, interviewed: 1, offered: 0, hired: 0, budget: "$130k–$155k", expRange: "5+ yrs", skills: ["Swift", "SwiftUI", "Combine"],
    bu: "Consumer Products", department: "Mobile Engineering", product: "Lumen App", costCenter: "CC-4012", locationOffice: "Bangalore" },
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
   ORG FILTER SYSTEM
   Multi-dimensional org filtering (BU / Dept / Product / Location / Cost Center).
   Filter values come from Admin config in real life — mocked here.
   Filters are global state via Context, applied across all data-bearing screens.
   ============================================================ */
const OrgFilterContext = React.createContext(null);
const useOrgFilters = () => React.useContext(OrgFilterContext);

/* The dimensions config — what Admin can edit. Each dimension has:
   - key: matches the requisition field name
   - label: shown in UI
   - icon: lucide icon
   - enabled: whether it's used at all
   - values: full list of selectable values
*/
const DEFAULT_FILTER_DIMENSIONS = [
  {
    key: "bu", label: "Business Unit", icon: "Briefcase", enabled: true,
    values: ["Financial Services", "Enterprise Cloud", "Data & Analytics", "Consumer Products", "Healthcare Tech", "Public Sector"],
  },
  {
    key: "department", label: "Department", icon: "Layers", enabled: true,
    values: ["Engineering", "Architecture", "Data Engineering", "Mobile Engineering", "Product", "Design", "QA"],
  },
  {
    key: "product", label: "Product", icon: "Target", enabled: true,
    values: ["Apex Banking", "Helios Platform", "Northstar", "Lumen App", "Pulse CRM", "Atlas Health"],
  },
  {
    key: "locationOffice", label: "Location", icon: "MapPin", enabled: true,
    values: ["Bangalore", "Pune", "Hyderabad", "Mumbai", "Delhi NCR", "Chennai", "Remote"],
  },
  {
    key: "costCenter", label: "Cost Center", icon: "DollarSign", enabled: false, // off by default — admin can enable
    values: ["CC-1042", "CC-2201", "CC-3105", "CC-4012", "CC-5007"],
  },
];

const iconMap = { Briefcase, Layers, Target, MapPin, DollarSign };

/* Apply current filters to a list of requisitions */
const applyOrgFilters = (requisitions, filters) => {
  if (!filters || Object.keys(filters).length === 0) return requisitions;
  return requisitions.filter(r => {
    return Object.entries(filters).every(([key, vals]) => {
      if (!vals || vals.length === 0) return true; // empty filter = no constraint
      return vals.includes(r[key]);
    });
  });
};

/* Apply filters to candidates by routing through their requisition */
const applyOrgFiltersToCandidates = (candidates, requisitions, filters) => {
  if (!filters || Object.keys(filters).length === 0) return candidates;
  const allowedReqIds = new Set(applyOrgFilters(requisitions, filters).map(r => r.id));
  return candidates.filter(c => allowedReqIds.has(c.reqId));
};

/* Count how many filters are currently active */
const countActiveFilters = (filters) =>
  Object.values(filters || {}).reduce((acc, vals) => acc + (vals?.length || 0), 0);

/* ============================================================
   ORG FILTER BAR — slim strip below TopBar, always visible
   ============================================================ */
const OrgFilterBar = ({ dimensions, filters, onChange }) => {
  const [openDim, setOpenDim] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenDim(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const enabledDims = dimensions.filter(d => d.enabled);
  const activeCount = countActiveFilters(filters);

  const toggleValue = (dimKey, val) => {
    const current = filters[dimKey] || [];
    const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    onChange({ ...filters, [dimKey]: next.length ? next : undefined });
  };

  const clearAll = () => onChange({});
  const clearDimension = (dimKey) => {
    const next = { ...filters };
    delete next[dimKey];
    onChange(next);
  };

  return (
    <div ref={ref} className="bg-white border-b border-slate-200 px-8 py-2.5 flex items-center gap-2 flex-wrap relative z-20">
      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 shrink-0">
        <Filter className="w-3.5 h-3.5" />Filter scope:
      </span>

      {enabledDims.map(dim => {
        const Icon = iconMap[dim.icon] || Filter;
        const selected = filters[dim.key] || [];
        const isActive = selected.length > 0;
        const isOpen = openDim === dim.key;

        return (
          <div key={dim.key} className="relative">
            <button
              onClick={() => setOpenDim(isOpen ? null : dim.key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isActive
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{dim.label}</span>
              {isActive && (
                <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">{selected.length}</span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dim.label}</span>
                  {isActive && (
                    <button onClick={() => clearDimension(dim.key)} className="text-[10px] font-semibold text-rose-600 hover:text-rose-700">
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto p-1">
                  {dim.values.map(val => {
                    const checked = selected.includes(val);
                    return (
                      <button
                        key={val}
                        onClick={() => toggleValue(dim.key, val)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition text-left ${
                          checked ? "bg-indigo-50 text-indigo-900" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          checked ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="truncate">{val}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="ml-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-3 h-3" />Clear all ({activeCount})
        </button>
      )}

      <span className="ml-auto text-[10px] text-slate-400">
        Filters apply across dashboards, lifecycles & all data views
      </span>
    </div>
  );
};

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
    navItems: ["dashboard", "requisitions", "jd-generator", "sourcing", "screening-hub", "interviews", "offers"],
  },
  hiringManager: {
    key: "hiringManager",
    label: "Hiring Manager",
    avatar: "HM",
    avatarGrad: "from-violet-500 to-fuchsia-500",
    description: "Shortlisted candidates · interview feedback",
    color: "violet",
    navItems: ["dashboard", "requisitions", "interviews", "offers", "screening-hub"],
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
    navItems: ["dashboard", "requisitions", "jd-generator", "sourcing", "screening-hub", "interviews", "offers", "admin"],
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
  { project: "Apex Banking Platform",  role: "Senior Full-Stack Engineer", daysOpen: 12, ttfTarget: 30, risk: "medium", coverage: 72, gap: ["TypeScript depth", "Fintech compliance"], openings: 3, filled: 1, bu: "Financial Services", department: "Engineering",        product: "Apex Banking" },
  { project: "Helios Migration",        role: "Cloud Solutions Architect",  daysOpen: 21, ttfTarget: 25, risk: "high",   coverage: 45, gap: ["Kubernetes", "Terraform IaC"],       openings: 1, filled: 0, bu: "Enterprise Cloud",   department: "Architecture",       product: "Helios Platform" },
  { project: "Northstar Analytics",     role: "Data Engineer (Snowflake)", daysOpen: 6,  ttfTarget: 35, risk: "low",    coverage: 81, gap: ["dbt advanced"],                         openings: 2, filled: 0, bu: "Data & Analytics",   department: "Data Engineering",   product: "Northstar" },
  { project: "Lumen Mobile",            role: "iOS Engineer",              daysOpen: 34, ttfTarget: 30, risk: "high",   coverage: 38, gap: ["SwiftUI", "Core Data", "CI/CD"],        openings: 1, filled: 0, bu: "Consumer Products",  department: "Mobile Engineering", product: "Lumen App" },
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
   INTERVIEW INTELLIGENCE — MOCK DATA
   ============================================================ */

const interviewRounds = ["L1 — Technical Screen", "L2 — System Design", "L3 — Hiring Manager", "HR — Culture & Comp"];

/* Per-candidate interview records */
const interviewRecords = {
  "c-1": { // Priya Raman — Interviewed
    rounds: [
      { id: "r1", round: "L1 — Technical Screen",   interviewer: "Divya Nair",    date: "Apr 24, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 8.5, communication: 9.0, problemSolving: 8.8, cultureFit: 8.5, comments: "Excellent problem articulation. Walked through a clean microservices decomposition, identified edge cases proactively. Strong communicator — no hand-holding needed.", notes: "Asked good clarifying questions. Seemed genuinely excited about the fintech domain.", recommendation: "Proceed" } },
      { id: "r2", round: "L2 — System Design",      interviewer: "Ankit Sharma",  date: "Apr 28, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 9.0, communication: 9.2, problemSolving: 9.1, cultureFit: 8.8, comments: "Exceptional system design round. Designed a multi-tenant audit log with correct WORM semantics and S3 cold-storage strategy. Introduced idempotency keys unprompted.", notes: "Best system design I've seen this quarter. Would trust her with full ownership.", recommendation: "Proceed" } },
      { id: "r3", round: "L3 — Hiring Manager",     interviewer: "Sanjay R (HM)", date: "May 3, 2025",  status: "Scheduled", kitGenerated: false, feedback: null },
      { id: "r4", round: "HR — Culture & Comp",     interviewer: "Riya K",        date: "—",            status: "Pending",   kitGenerated: false, feedback: null },
    ]
  },
  "c-2": { // Marcus Webb — Shortlisted
    rounds: [
      { id: "r5", round: "L1 — Technical Screen",   interviewer: "Divya Nair",    date: "Apr 26, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 9.5, communication: 8.8, problemSolving: 9.2, cultureFit: 7.5, comments: "Outstanding technical depth — best Big-O reasoning I've seen. Strong on distributed systems. Slightly reserved on cultural questions; doesn't open up easily.", notes: "Culture fit is the question. Technically exceptional.", recommendation: "Proceed" } },
      { id: "r6", round: "L2 — System Design",      interviewer: "Ankit Sharma",  date: "May 3, 2025",  status: "Scheduled", kitGenerated: false, feedback: null },
    ]
  },
  "c-6": { // Nina Patel — Offered (all rounds complete)
    rounds: [
      { id: "r7", round: "L1 — Technical Screen",   interviewer: "Divya Nair",    date: "Apr 20, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 9.1, communication: 9.4, problemSolving: 9.0, cultureFit: 9.2, comments: "Rare combination of technical depth and communication clarity. Built comparable systems at Freshworks. Coding was clean, explained every decision. No hesitation.", notes: "Sent a follow-up email within the hour summarising what she'd do differently. Impressive.", recommendation: "Proceed" } },
      { id: "r8", round: "L2 — System Design",      interviewer: "Ankit Sharma",  date: "Apr 21, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 9.3, communication: 9.4, problemSolving: 9.2, cultureFit: 9.1, comments: "Strong hire. Designed the Apex Banking event pipeline with correct partitioning, failure modes, and exactly-once delivery semantics. Proposed an event sourcing approach we hadn't considered.", notes: "Went beyond the brief. Clear that she's thought about this class of problem deeply.", recommendation: "Proceed" } },
      { id: "r9", round: "L3 — Hiring Manager",     interviewer: "Sanjay R (HM)", date: "Apr 21, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 8.8, communication: 9.5, problemSolving: 8.9, cultureFit: 9.4, comments: "Strong hire. Nina asks better questions than most candidates at offer stage. Showed initiative in asking about team charter and Q3 milestones.", notes: "Told me she sees this as a 3-year engagement. That's exactly what we need.", recommendation: "Proceed" } },
      { id: "r10", round: "HR — Culture & Comp",    interviewer: "Riya K",        date: "Apr 21, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: null, communication: 9.0, problemSolving: null, cultureFit: 9.3, comments: "Comp fully aligned. Nina raised no counter-offer. Start date confirmed for 30 days. Positive references — 2 provided unprompted. Strong culture signal.", notes: "Clean HR round. Ready to offer.", recommendation: "Proceed" } },
    ]
  },
  "c-9": { // Rahul Mehta — Shortlisted  
    rounds: [
      { id: "r11", round: "L1 — Technical Screen",  interviewer: "Divya Nair",    date: "Apr 30, 2025", status: "Completed", kitGenerated: true,
        feedback: { technical: 8.7, communication: 8.3, problemSolving: 8.4, cultureFit: 8.0, comments: "Solid engineering fundamentals. PostgreSQL knowledge is strong but Java-centric thinking leaks through. Asked clarifying questions but answers were verbose at times.", notes: "Good engineer, needs TypeScript exposure. Core instincts are sound.", recommendation: "Hold" } },
      { id: "r12", round: "L2 — System Design",     interviewer: "Ankit Sharma",  date: "May 5, 2025",  status: "Scheduled", kitGenerated: false, feedback: null },
    ]
  },
};

/* AI Interview Kit templates keyed by candidate */
const interviewKits = {
  "c-1": {
    role: "Senior Full-Stack Engineer",
    candidate: "Priya Raman",
    focusAreas: [
      { area: "Kubernetes / container orchestration", reason: "Gap: Limited Kubernetes exposure identified in resume review", priority: "high" },
      { area: "Fintech compliance (PCI-DSS, SOC2)", reason: "Gap: No prior fintech compliance experience", priority: "high" },
      { area: "Large-scale TypeScript architecture", reason: "Strength — verify depth under pressure and at scale", priority: "medium" },
    ],
    structure: [
      { segment: "Intro & context setting", mins: 5 },
      { segment: "Technical deep-dive (Q1–Q3)", mins: 25 },
      { segment: "System design problem", mins: 30 },
      { segment: "Behavioural & culture", mins: 15 },
      { segment: "Candidate Q&A", mins: 10 },
      { segment: "Interviewer debrief notes", mins: 5 },
    ],
    technicalQs: [
      "Walk me through how you'd design an audit trail system that retains 7 years of records, supports tenant isolation, and can be queried in under 200ms.",
      "You've shipped a zero-downtime DB migration at Stripe. What was the biggest risk, how did you mitigate it, and what would you do differently?",
      "Describe how you'd introduce TypeScript into a large, existing JavaScript codebase incrementally — including how you'd manage the team's ramp-up.",
      "How would you structure a multi-tenant Postgres schema for a banking platform where each tenant has different data retention requirements?",
      "What's your approach when you inherit a codebase with no tests, tight deadlines, and a need to ship new features?",
    ],
    behaviouralQs: [
      "Tell me about a time you pushed back on a technical direction from a senior leader. What happened?",
      "Describe a situation where requirements changed significantly mid-sprint. How did you handle it and what was the outcome?",
      "How do you onboard yourself onto an unfamiliar codebase? Walk me through your last experience doing this.",
      "Give me an example of mentoring a junior engineer who was struggling. What did you do and what was the result?",
    ],
    tips: [
      "Probe on the Kubernetes gap — ask specifically about container networking and rolling deployments, not just 'have you used Kubernetes'",
      "For the fintech question: look for awareness of compliance frameworks, not just theoretical knowledge",
      "Candidate communicates well — if an answer is vague, it's intentional; push for specifics",
      "She has competing offers — avoid a long debrief loop. Keep the round tight and decision-making fast.",
    ]
  },
  "c-6": {
    role: "Senior Full-Stack Engineer",
    candidate: "Nina Patel",
    focusAreas: [
      { area: "IC vs leadership balance", reason: "Risk: Slightly senior for an IC role — verify motivation to stay hands-on", priority: "high" },
      { area: "Microservices ownership at scale", reason: "Strength — verify end-to-end ownership breadth", priority: "medium" },
      { area: "Fintech regulatory context", reason: "Validate prior exposure to banking-domain compliance", priority: "medium" },
    ],
    structure: [
      { segment: "Intro & role alignment", mins: 5 },
      { segment: "Leadership vs IC motivation", mins: 15 },
      { segment: "Technical deep-dive", mins: 25 },
      { segment: "Platform design problem", mins: 25 },
      { segment: "Culture & team dynamics", mins: 15 },
      { segment: "Q&A", mins: 10 },
    ],
    technicalQs: [
      "You've led a platform team at Freshworks. How would you approach leading the Apex Banking platform as an IC, not a manager?",
      "Describe the microservices architecture you owned at Freshworks — what was the hardest operational challenge and how did you solve it?",
      "How would you design a real-time transaction monitoring service that must detect anomalies within 500ms for 10,000 TPS?",
      "What's your approach to API versioning in a microservices environment with multiple downstream consumers?",
    ],
    behaviouralQs: [
      "Tell me about a time you had to convince a team to adopt a technical standard you introduced. How did you build buy-in?",
      "Describe a time when you were overloaded. How did you triage and who did you lean on?",
      "How do you stay hands-on technically while also influencing broader architecture decisions?",
    ],
    tips: [
      "Primary risk is over-levelling — spend time on IC motivation. Listen for 'I want to build', not just 'I want to influence'.",
      "Nina communicates exceptionally well — use that as a signal, not a ceiling. Dig technical.",
      "This candidate has a competing offer. If the round goes well, fast-track the debrief to same day.",
      "Reference her unprompted CTO reference — ask what specifically the CTO valued in her.",
    ]
  },
};

const generateKit = (candidate) => interviewKits[candidate.id] || {
  role: "Senior Engineer",
  candidate: candidate.name,
  focusAreas: candidate.gaps.map((g, i) => ({ area: g, reason: `Identified gap from resume review`, priority: i === 0 ? "high" : "medium" })),
  structure: [
    { segment: "Intro", mins: 5 },
    { segment: "Technical deep-dive", mins: 30 },
    { segment: "System design", mins: 30 },
    { segment: "Behavioural", mins: 15 },
    { segment: "Candidate Q&A", mins: 10 },
  ],
  technicalQs: [
    `Walk me through the most complex ${candidate.skills[0] || "system"} problem you've solved recently.`,
    `How would you approach scaling a ${candidate.skills[1] || "backend"} service to 10× its current load?`,
    "Describe your approach to debugging a production incident with no logs and an ambiguous symptom.",
    "How do you decide when to refactor vs rewrite a piece of legacy code?",
    "What's your philosophy on code review — as a reviewer and as an author?",
  ],
  behaviouralQs: [
    "Tell me about a time you disagreed with a technical decision. What happened?",
    "Describe a project where you had to work with very ambiguous requirements.",
    "How do you mentor engineers who are more junior than you?",
    "Give me an example of a time you failed. What did you learn?",
  ],
  tips: [
    `Focus on the identified gaps: ${candidate.gaps.join(", ") || "none flagged"}`,
    "Probe for specific examples, not hypotheticals",
    "Watch for communication clarity — candidate scored " + candidate.commScore + "/10 in screening",
    "Keep the session to 90 minutes max. Decision within 24h ideally.",
  ]
};

const getInterviewRecord = (candidateId) => interviewRecords[candidateId] || { rounds: [] };

/* AI feedback summary generator (mock) */
const generateAiFeedbackSummary = (rounds) => {
  const completed = rounds.filter(r => r.feedback);
  if (completed.length === 0) return null;

  const avgTech  = completed.filter(r => r.feedback.technical).reduce((a, r) => a + r.feedback.technical, 0) / completed.filter(r => r.feedback.technical).length;
  const avgComm  = completed.reduce((a, r) => a + r.feedback.communication, 0) / completed.length;
  const avgPS    = completed.filter(r => r.feedback.problemSolving).reduce((a, r) => a + r.feedback.problemSolving, 0) / completed.filter(r => r.feedback.problemSolving).length;
  const avgCulture = completed.reduce((a, r) => a + r.feedback.cultureFit, 0) / completed.length;
  const allProceed = completed.every(r => r.feedback.recommendation === "Proceed");
  const anyHold   = completed.some(r => r.feedback.recommendation === "Hold");

  const confidence = Math.round(((avgTech + avgComm + avgPS + avgCulture) / 4) * 10);
  const recommendation = allProceed ? "Hire" : anyHold ? "Hold" : "No Hire";

  const inconsistencies = [];
  if (completed.length > 1) {
    const techScores = completed.filter(r => r.feedback.technical).map(r => r.feedback.technical);
    if (Math.max(...techScores) - Math.min(...techScores) > 1.5) {
      inconsistencies.push(`Technical scores vary by ${(Math.max(...techScores) - Math.min(...techScores)).toFixed(1)} points across rounds — review L1 vs L2 notes`);
    }
    const recs = completed.map(r => r.feedback.recommendation);
    if (new Set(recs).size > 1) {
      inconsistencies.push(`Split recommendation: interviewers disagree on ${recs.join(" vs ")}`);
    }
  }

  return { avgTech: avgTech || 0, avgComm, avgPS: avgPS || 0, avgCulture, confidence, recommendation, inconsistencies, completedRounds: completed.length };
};

/* ============================================================
   INTERVIEW DASHBOARD (tab inside requisition / standalone)
   ============================================================ */
const InterviewDashboard = ({ candidates, onOpenKit, onOpenFeedback, onOpenCandidate }) => {
  const interviewCandidates = candidates.filter(c => ["Shortlisted", "Interviewed", "Offered"].includes(c.stage));

  const statusColor = { Completed: "emerald", Scheduled: "indigo", Pending: "amber" };
  const statusIcon  = { Completed: CheckCircle2, Scheduled: Calendar, Pending: HelpCircle };

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "In Interview Pipeline", value: interviewCandidates.length,
            sub: "Shortlisted → Offered",  icon: Users,        color: "from-indigo-500 to-violet-500" },
          { label: "Rounds Completed",      value: Object.values(interviewRecords).flatMap(r => r.rounds).filter(r => r.status === "Completed").length,
            sub: "Across all candidates",  icon: CheckCircle2, color: "from-emerald-500 to-teal-500"  },
          { label: "Pending Feedback",      value: Object.values(interviewRecords).flatMap(r => r.rounds).filter(r => r.status === "Completed" && !r.feedback).length,
            sub: "Action needed",          icon: Flag,         color: "from-amber-500 to-orange-500"  },
          { label: "Scheduled This Week",   value: Object.values(interviewRecords).flatMap(r => r.rounds).filter(r => r.status === "Scheduled").length,
            sub: "Upcoming interviews",    icon: Calendar,     color: "from-fuchsia-500 to-pink-500"  },
        ].map(m => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-4 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${m.color}`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">{m.label}</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{m.value}</div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Candidate interview rows */}
      <div className="space-y-3">
        {interviewCandidates.map(cand => {
          const record = getInterviewRecord(cand.id);
          const aiSummary = generateAiFeedbackSummary(record.rounds);
          const pendingFeedback = record.rounds.filter(r => r.status === "Completed" && !r.feedback).length;

          return (
            <Card key={cand.id} className="overflow-hidden">
              {/* Candidate header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${cand.match >= 90 ? "bg-emerald-500" : cand.match >= 80 ? "bg-indigo-500" : "bg-slate-400"}`}>
                  {cand.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => onOpenCandidate(cand.id)} className="font-semibold text-sm text-slate-900 hover:text-indigo-700 transition">{cand.name}</button>
                    <Pill tone={cand.stage === "Offered" ? "amber" : "violet"}>{cand.stage}</Pill>
                    {pendingFeedback > 0 && <Pill tone="amber"><Flag className="w-3 h-3" />{pendingFeedback} feedback pending</Pill>}
                    {aiSummary && (
                      <Pill tone={aiSummary.recommendation === "Hire" ? "emerald" : aiSummary.recommendation === "Hold" ? "amber" : "rose"}>
                        AI: {aiSummary.recommendation}
                      </Pill>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{cand.exp} yrs · {cand.source} · AI Fit: {cand.match}%</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onOpenKit(cand)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                    <BookOpen className="w-3.5 h-3.5" />Generate Kit
                  </button>
                  {aiSummary && (
                    <button onClick={() => onOpenFeedback(cand)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
                      <BarChart2 className="w-3.5 h-3.5" />View Summary
                    </button>
                  )}
                </div>
              </div>

              {/* Round rows */}
              {record.rounds.length > 0 && (
                <div className="divide-y divide-slate-50">
                  {record.rounds.map((rnd, ri) => {
                    const StatusIcon = statusIcon[rnd.status] || HelpCircle;
                    const sTone = statusColor[rnd.status] || "default";
                    return (
                      <div key={ri} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/50 transition">
                        <div className="w-32 shrink-0">
                          <div className="text-xs font-semibold text-slate-700 truncate">{rnd.round.split("—")[0].trim()}</div>
                          <div className="text-[10px] text-slate-400 truncate">{rnd.round.split("—")[1]?.trim()}</div>
                        </div>
                        <div className="text-xs text-slate-500 w-28 shrink-0">{rnd.interviewer}</div>
                        <div className="text-xs text-slate-400 w-24 shrink-0">{rnd.date}</div>
                        <div className="flex-1">
                          <Pill tone={sTone}>
                            <StatusIcon className="w-3 h-3" />{rnd.status}
                          </Pill>
                        </div>
                        {rnd.feedback && (
                          <div className="flex items-center gap-2 shrink-0">
                            {["technical","communication","problemSolving","cultureFit"].filter(k => rnd.feedback[k]).map(k => (
                              <div key={k} className="text-center">
                                <div className="text-xs font-bold text-slate-800 tabular-nums">{rnd.feedback[k]}</div>
                                <div className="text-[9px] text-slate-400 capitalize">{k === "problemSolving" ? "PS" : k === "cultureFit" ? "Cult." : k === "communication" ? "Comm." : "Tech."}</div>
                              </div>
                            ))}
                            <Pill tone={rnd.feedback.recommendation === "Proceed" ? "emerald" : rnd.feedback.recommendation === "Hold" ? "amber" : "rose"}>
                              {rnd.feedback.recommendation}
                            </Pill>
                          </div>
                        )}
                        {rnd.status === "Completed" && !rnd.feedback && (
                          <button onClick={() => onOpenFeedback(cand, rnd)} className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition shrink-0">
                            Add feedback
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {record.rounds.length === 0 && (
                <div className="px-5 py-3 text-xs text-slate-400 italic">No rounds scheduled yet.</div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   AI INTERVIEW KIT
   ============================================================ */
const InterviewKit = ({ candidate, onBack, onAddFeedback }) => {
  const kit = generateKit(candidate);
  const [activeSection, setActiveSection] = useState("questions");

  const sections = [
    { key: "questions",  label: "Questions",      icon: HelpCircle },
    { key: "focus",      label: "Focus Areas",    icon: Target },
    { key: "structure",  label: "Structure",      icon: ClipboardList },
    { key: "tips",       label: "Interviewer Tips",icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      {/* Kit header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d946ef 0%, transparent 50%)" }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">AI-Generated Interview Kit</span>
            </div>
            <h2 className="text-xl font-bold leading-tight">{kit.candidate}</h2>
            <div className="text-slate-400 text-sm mt-1">{kit.role} · Generated from profile, gaps & JD alignment</div>
          </div>
          <button onClick={onBack} className="text-slate-400 hover:text-white transition text-sm flex items-center gap-1">
            <X className="w-4 h-4" />Close
          </button>
        </div>
        {/* Focus area pills */}
        <div className="relative flex flex-wrap gap-2 mt-4">
          {kit.focusAreas.map((f, i) => (
            <span key={i} className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${f.priority === "high" ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-white/10 border-white/20 text-slate-300"}`}>
              {f.priority === "high" ? "⚠ " : ""}{f.area}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeSection === s.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <Icon className="w-3.5 h-3.5" />{s.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeSection === "questions" && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><Brain className="w-4 h-4 text-indigo-700" /></div>
              <h3 className="font-bold text-slate-900">Technical Questions</h3>
              <Pill tone="indigo">{kit.technicalQs.length}</Pill>
            </div>
            <ol className="space-y-3">
              {kit.technicalQs.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{q}</p>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center"><Users className="w-4 h-4 text-violet-700" /></div>
              <h3 className="font-bold text-slate-900">Behavioural Questions</h3>
              <Pill tone="violet">{kit.behaviouralQs.length}</Pill>
            </div>
            <ol className="space-y-3">
              {kit.behaviouralQs.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{q}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}

      {activeSection === "focus" && (
        <div className="space-y-3">
          {kit.focusAreas.map((f, i) => (
            <Card key={i} className={`p-4 border-l-4 ${f.priority === "high" ? "border-l-rose-500" : "border-l-amber-400"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${f.priority === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{f.area}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${f.priority === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{f.priority} priority</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "structure" && (
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 mb-4">Suggested Time Split — {kit.structure.reduce((a, s) => a + s.mins, 0)} minutes total</h3>
          <div className="space-y-2">
            {kit.structure.map((s, i) => {
              const total = kit.structure.reduce((a, x) => a + x.mins, 0);
              const pct = (s.mins / total) * 100;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-800">{s.segment}</span>
                      <span className="font-bold text-slate-600 tabular-nums text-xs">{s.mins} min</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeSection === "tips" && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900">Interviewer Tips</h3>
            <Pill tone="amber">AI-curated</Pill>
          </div>
          <ul className="space-y-3">
            {kit.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-amber-500 text-sm shrink-0">💡</span>
                <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action */}
      <div className="flex gap-3">
        <GradientButton icon={ClipboardList} onClick={onAddFeedback}>Add Interview Feedback</GradientButton>
        <GradientButton variant="secondary" icon={FileText}>Export Kit as PDF</GradientButton>
      </div>
    </div>
  );
};

/* ============================================================
   FEEDBACK FORM
   ============================================================ */
const FeedbackForm = ({ candidate, round, onSubmit, onBack }) => {
  const [scores, setScores] = useState({ technical: 0, communication: 0, problemSolving: 0, cultureFit: 0 });
  const [comments, setComments] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const criteria = [
    { key: "technical",      label: "Technical Skills",  desc: "Depth, accuracy, and breadth of technical knowledge" },
    { key: "communication",  label: "Communication",     desc: "Clarity, structure, and confidence in responses" },
    { key: "problemSolving", label: "Problem Solving",   desc: "Logical thinking, approach to ambiguity, creativity" },
    { key: "cultureFit",     label: "Culture Fit",       desc: "Collaboration, ownership mindset, team alignment" },
  ];

  const handleSubmit = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setSubmitted(true); onSubmit({ scores, comments, notes, recommendation }); }, 1400);
  };

  const avg = Object.values(scores).filter(Boolean).length > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).filter(Boolean).length).toFixed(1)
    : null;

  if (submitted) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
        <CheckCircle2 className="w-8 h-8 text-white" />
      </div>
      <div className="text-xl font-bold text-slate-900 mb-1">Feedback submitted</div>
      <div className="text-sm text-slate-500 mb-6">AI is generating the feedback summary...</div>
      <GradientButton onClick={onBack}>View AI Summary</GradientButton>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Interview Feedback</h2>
          <div className="text-sm text-slate-500 mt-0.5">{candidate.name} · {round?.round || "General"}</div>
        </div>
        {avg && (
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{avg}<span className="text-sm font-normal text-slate-400">/10</span></div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg score</div>
          </div>
        )}
      </div>

      {/* Score sliders */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Ratings</h3>
        <div className="space-y-5">
          {criteria.map(c => (
            <div key={c.key}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-semibold text-slate-800">{c.label}</span>
                  <span className="text-xs text-slate-400 ml-2">{c.desc}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 tabular-nums w-8 text-right">{scores[c.key] || "—"}</span>
              </div>
              <input type="range" min="1" max="10" step="0.5"
                value={scores[c.key] || 1}
                onChange={e => setScores(p => ({ ...p, [c.key]: +e.target.value }))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1 — Poor</span><span>5 — Average</span><span>10 — Exceptional</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Comments */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Written Assessment</h3>
        <textarea
          value={comments} onChange={e => setComments(e.target.value)}
          placeholder="Overall assessment — what stood out, what concerned you, specific examples..."
          rows={4}
          className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
        />
      </Card>

      {/* Interview notes */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Interview Notes / Transcript</h3>
        <p className="text-xs text-slate-400 mb-3">Paste raw notes or transcript — AI will extract key signals automatically</p>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Paste interview notes, key quotes, or transcript excerpt here..."
          rows={5}
          className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono text-xs"
        />
      </Card>

      {/* Recommendation */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Your Recommendation</h3>
        <div className="flex gap-3">
          {["Proceed", "Hold", "Reject"].map(r => (
            <button key={r} onClick={() => setRecommendation(r)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${
                recommendation === r
                  ? r === "Proceed" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : r === "Hold" ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}>
              {r === "Proceed" ? "✓ " : r === "Hold" ? "~ " : "✕ "}{r}
            </button>
          ))}
        </div>
      </Card>

      <GradientButton
        onClick={handleSubmit}
        className="w-full justify-center"
        disabled={!recommendation || Object.values(scores).some(s => s === 0)}
      >
        {generating ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating AI Summary...</>
        ) : (
          <><Sparkles className="w-4 h-4" />Submit & Generate AI Summary</>
        )}
      </GradientButton>
    </div>
  );
};

/* ============================================================
   AI FEEDBACK SUMMARY
   ============================================================ */
const AiFeedbackSummary = ({ candidate, onBack, onAddFeedback }) => {
  const record = getInterviewRecord(candidate.id);
  const summary = generateAiFeedbackSummary(record.rounds);

  if (!summary) return (
    <div className="text-center py-12">
      <div className="text-slate-400 mb-4"><ClipboardList className="w-12 h-12 mx-auto text-slate-200" /></div>
      <div className="font-semibold text-slate-700 mb-2">No completed rounds yet</div>
      <div className="text-sm text-slate-400 mb-6">Complete at least one interview round and submit feedback to generate an AI summary.</div>
      <GradientButton onClick={onAddFeedback} icon={ClipboardList}>Add Feedback Now</GradientButton>
    </div>
  );

  const recColors = { Hire: "emerald", Hold: "amber", "No Hire": "rose" };
  const scores = [
    { label: "Technical",      val: summary.avgTech,    color: "bg-indigo-500" },
    { label: "Communication",  val: summary.avgComm,    color: "bg-violet-500" },
    { label: "Problem Solving",val: summary.avgPS,      color: "bg-fuchsia-500" },
    { label: "Culture Fit",    val: summary.avgCulture, color: "bg-pink-500" },
  ].filter(s => s.val);

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">AI Feedback Summary</span>
            </div>
            <h2 className="text-xl font-bold">{candidate.name}</h2>
            <div className="text-slate-400 text-sm mt-0.5">{summary.completedRounds} round{summary.completedRounds > 1 ? "s" : ""} analysed · {record.rounds.length - summary.completedRounds} pending</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 relative">
              <svg width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
                <circle cx="32" cy="32" r="26" stroke="url(#cg)" strokeWidth="5" fill="none"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - summary.confidence / 100)}
                  strokeLinecap="round" />
                <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#d946ef" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{summary.confidence}%</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Confidence</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-300">Final recommendation:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            summary.recommendation === "Hire" ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
            : summary.recommendation === "Hold" ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
            : "bg-rose-500/30 text-rose-300 border border-rose-500/40"
          }`}>{summary.recommendation === "Hire" ? "✓ " : summary.recommendation === "Hold" ? "~ " : "✕ "}{summary.recommendation}</span>
        </div>
      </div>

      {/* Score bars */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Interview Scores — Average across {summary.completedRounds} round{summary.completedRounds > 1 ? "s" : ""}</h3>
        <div className="space-y-3">
          {scores.map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{s.label}</span>
                <span className="font-bold text-slate-900 tabular-nums">{s.val.toFixed(1)}<span className="text-slate-400 font-normal">/10</span></span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.val * 10}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Round-by-round breakdown */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Round-by-Round Feedback</h3>
        <div className="space-y-4">
          {record.rounds.filter(r => r.feedback).map((rnd, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm text-slate-900">{rnd.round}</span>
                  <span className="text-xs text-slate-400 ml-2">· {rnd.interviewer}</span>
                </div>
                <Pill tone={rnd.feedback.recommendation === "Proceed" ? "emerald" : rnd.feedback.recommendation === "Hold" ? "amber" : "rose"}>
                  {rnd.feedback.recommendation}
                </Pill>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{rnd.feedback.comments}</p>
              {rnd.feedback.notes && (
                <p className="text-xs text-slate-400 mt-2 italic">"{rnd.feedback.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Inconsistencies */}
      {summary.inconsistencies.length > 0 && (
        <Card className="p-5 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-amber-800 text-sm">Inconsistencies Detected</h3>
          </div>
          <ul className="space-y-2">
            {summary.inconsistencies.map((inc, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800">
                <span className="shrink-0">⚠</span>{inc}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <GradientButton variant="secondary" onClick={onAddFeedback} icon={ClipboardList}>Add More Feedback</GradientButton>
    </div>
  );
};

/* ============================================================
   INTERVIEW INTELLIGENCE PANEL (inside CandidateDetail)
   ============================================================ */
const InterviewIntelligencePanel = ({ candidate, onOpenKit, onOpenFeedback }) => {
  const record = getInterviewRecord(candidate.id);
  const summary = generateAiFeedbackSummary(record.rounds);
  const completed = record.rounds.filter(r => r.feedback);
  const pending = record.rounds.filter(r => r.status !== "Upcoming" && !r.feedback);

  const riskFlags = [];
  if (summary?.inconsistencies?.length > 0) riskFlags.push({ label: "Inconsistent feedback across rounds", level: "warning" });
  if (candidate.commScore < 8) riskFlags.push({ label: "Communication score below threshold (8.0)", level: "warning" });
  if (record.rounds.length === 0) riskFlags.push({ label: "No interview rounds scheduled", level: "info" });
  if (pending.length > 0) riskFlags.push({ label: `${pending.length} round${pending.length > 1 ? "s" : ""} awaiting feedback`, level: "info" });

  return (
    <div className="space-y-5">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-600" />
          <h2 className="font-bold text-slate-900">Interview Intelligence</h2>
          {summary && <Pill tone={summary.recommendation === "Hire" ? "emerald" : summary.recommendation === "Hold" ? "amber" : "rose"}>{summary.recommendation}</Pill>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onOpenKit(candidate)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <BookOpen className="w-3.5 h-3.5" />Generate Kit
          </button>
          <button onClick={() => onOpenFeedback(candidate)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
            <BarChart2 className="w-3.5 h-3.5" />View Summary
          </button>
        </div>
      </div>

      {/* Grid: scores + flags */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left — interview scores */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {summary ? `Interview Scores (${summary.completedRounds} rounds)` : "Interview Scores"}
          </div>
          {summary ? (
            [["Technical", summary.avgTech, "bg-indigo-500"],
             ["Communication", summary.avgComm, "bg-violet-500"],
             ["Problem Solving", summary.avgPS, "bg-fuchsia-500"],
             ["Culture Fit", summary.avgCulture, "bg-emerald-500"]].filter(([,v]) => v).map(([label, val, color]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{val.toFixed(1)}/10</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${val * 10}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No completed rounds yet.</p>
          )}

          {summary && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">Confidence Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${summary.confidence}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-900">{summary.confidence}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Right — rounds status + risk flags */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Round Status</div>
          {record.rounds.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No rounds scheduled.</p>
          ) : (
            <div className="space-y-1.5">
              {record.rounds.map((rnd, i) => {
                const sBg = { Completed: "bg-emerald-50 border-emerald-200 text-emerald-700", Scheduled: "bg-indigo-50 border-indigo-200 text-indigo-700", Pending: "bg-slate-50 border-slate-200 text-slate-500" }[rnd.status] || "bg-slate-50 border-slate-200 text-slate-500";
                return (
                  <div key={i} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${sBg}`}>
                    <span className="font-medium truncate">{rnd.round.split("—")[0].trim()}</span>
                    <span className="font-semibold shrink-0 ml-2">{rnd.status}</span>
                  </div>
                );
              })}
            </div>
          )}

          {riskFlags.length > 0 && (
            <>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-1">Risk Flags</div>
              {riskFlags.map((f, i) => (
                <div key={i} className={`flex items-start gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${f.level === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                  <span className="shrink-0">{f.level === "warning" ? "⚠" : "ℹ"}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   INTERVIEW HUB — top-level page (sidebar nav)
   ============================================================ */
const InterviewHub = ({ candidates, requisitions, onOpenCandidate, setView }) => {
  const [activeReq, setActiveReq] = useState(requisitions[0]?.id);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [kitCandidate, setKitCandidate]       = useState(null);
  const [feedbackCandidate, setFeedbackCandidate] = useState(null);
  const [feedbackRound, setFeedbackRound]     = useState(null);
  const [showSummary, setShowSummary]          = useState(false);

  const reqCandidates = candidates.filter(c => c.reqId === activeReq);

  const openKit      = (cand) => { setKitCandidate(cand); setFeedbackCandidate(null); setShowSummary(false); };
  const openFeedback = (cand, rnd = null) => { setFeedbackCandidate(cand); setFeedbackRound(rnd); setKitCandidate(null); setShowSummary(false); };
  const openSummary  = (cand) => { setFeedbackCandidate(cand); setKitCandidate(null); setShowSummary(true); };
  const closeAll     = () => { setKitCandidate(null); setFeedbackCandidate(null); setShowSummary(false); };

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Activity className="w-3 h-3" />Interview Intelligence
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interviews</h1>
          <p className="text-sm text-slate-500 mt-1">AI-assisted planning, feedback capture, and hiring decisions.</p>
        </div>
        <div className="flex gap-2">
          <select value={activeReq} onChange={e => setActiveReq(e.target.value)}
            className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            {requisitions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[["dashboard", "Dashboard", ClipboardList], ["feedback", "Feedback Summary", BarChart2]].map(([key, label, Icon]) => (
          <button key={key} onClick={() => { setActiveTab(key); closeAll(); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === key && !kitCandidate && !feedbackCandidate ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Content routing */}
      {!kitCandidate && !feedbackCandidate && activeTab === "dashboard" && (
        <InterviewDashboard
          candidates={reqCandidates}
          onOpenKit={openKit}
          onOpenFeedback={openFeedback}
          onOpenCandidate={id => setView({ name: "candidate", candidateId: typeof id === "string" ? id : id.id, from: "interviews" })}
        />
      )}

      {!kitCandidate && !feedbackCandidate && activeTab === "feedback" && (
        <div className="space-y-4">
          {reqCandidates.filter(c => getInterviewRecord(c.id).rounds.some(r => r.feedback)).map(cand => (
            <Card key={cand.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${cand.match >= 90 ? "bg-emerald-500" : "bg-indigo-500"}`}>
                    {cand.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div><div className="font-semibold text-slate-900">{cand.name}</div><div className="text-xs text-slate-400">{cand.stage}</div></div>
                </div>
                <button onClick={() => openSummary(cand)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
                  <BarChart2 className="w-3.5 h-3.5" />Full Summary
                </button>
              </div>
              <AiFeedbackSummary candidate={cand} onBack={closeAll} onAddFeedback={() => openFeedback(cand)} />
            </Card>
          ))}
          {reqCandidates.filter(c => getInterviewRecord(c.id).rounds.some(r => r.feedback)).length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BarChart2 className="w-10 h-10 mx-auto text-slate-200 mb-3" />
              <div className="font-semibold text-slate-600 mb-1">No feedback submitted yet</div>
              <div className="text-sm">Complete an interview round and add feedback to see AI summaries here.</div>
            </div>
          )}
        </div>
      )}

      {kitCandidate && (
        <InterviewKit candidate={kitCandidate} onBack={closeAll} onAddFeedback={() => { openFeedback(kitCandidate); }} />
      )}

      {feedbackCandidate && !showSummary && (
        <FeedbackForm candidate={feedbackCandidate} round={feedbackRound} onSubmit={closeAll} onBack={() => { setShowSummary(true); }} />
      )}

      {feedbackCandidate && showSummary && (
        <AiFeedbackSummary candidate={feedbackCandidate} onBack={closeAll} onAddFeedback={() => { setShowSummary(false); }} />
      )}
    </div>
  );
};

/* ============================================================
   OFFER MANAGEMENT — MOCK DATA
   ============================================================ */

const offerRecords = {
  "c-6": { // Nina Patel — Active offer, ageing
    id: "off-001",
    candidateId: "c-6",
    reqId: "req-1",
    status: "Awaiting Response",        // Draft | Pending Approval | Approved | Sent | Awaiting Response | Accepted | Declined | Expired | Withdrawn
    base: 6200000,                       // ₹62L base
    bonus: 800000,                       // ₹8L joining bonus
    esop: 4500000,                       // ₹45L ESOP over 4 years
    band: { min: 5500000, max: 6500000 },
    aiRecommended: 6000000,
    sentDate: "Apr 28, 2025",
    deadline: "May 5, 2025",
    daysSinceSent: 3,
    daysToDeadline: 4,
    competingOfferRisk: "high",
    competingOfferNote: "LinkedIn activity suggests engagement with Razorpay recruiter. Reference also mentioned a competing fintech offer.",
    approvalChain: [
      { role: "Recruiter",       name: "Riya K",          status: "approved", date: "Apr 27, 2025", time: "2:00 PM" },
      { role: "Hiring Manager",  name: "Sanjay R",        status: "approved", date: "Apr 27, 2025", time: "4:30 PM" },
      { role: "Finance",         name: "Aarti M",         status: "approved", date: "Apr 28, 2025", time: "11:00 AM" },
      { role: "VP Engineering",  name: "Karthik V",       status: "approved", date: "Apr 28, 2025", time: "2:00 PM" },
    ],
    aiNotes: [
      { type: "risk",           text: "Offer pending response 3+ days. Industry benchmark: 67% of accepts happen within 48h. Risk of competing offer increases sharply after day 4." },
      { type: "recommendation", text: "Recommend personal outreach by Hiring Manager today. Increase joining bonus by ₹2L to neutralise comp gap if competing offer is from a higher-band company." },
      { type: "insight",        text: "Nina's reference (ex-CTO at Freshworks) reached out unprompted to recruiter on Apr 29. Strong signal — if we close fast, accept probability >85%." },
    ],
    revisions: [
      { version: 1, date: "Apr 27, 2025", base: 6000000, bonus: 500000, status: "draft", notes: "Initial draft at AI-recommended value" },
      { version: 2, date: "Apr 28, 2025", base: 6200000, bonus: 800000, status: "sent", notes: "Stretched after VP review — leadership signal noted" },
    ]
  },
  "c-1": { // Priya Raman — Approved, awaiting send
    id: "off-002",
    candidateId: "c-1",
    reqId: "req-1",
    status: "Approved",
    base: 5800000,
    bonus: 500000,
    esop: 3500000,
    band: { min: 5500000, max: 6500000 },
    aiRecommended: 5800000,
    sentDate: null,
    deadline: null,
    daysSinceSent: null,
    daysToDeadline: null,
    competingOfferRisk: "medium",
    competingOfferNote: "Candidate mentioned interview process underway with Stripe (current employer's competitor). No formal offer yet.",
    approvalChain: [
      { role: "Recruiter",       name: "Riya K",    status: "approved", date: "Apr 30, 2025", time: "10:00 AM" },
      { role: "Hiring Manager",  name: "Sanjay R",  status: "approved", date: "Apr 30, 2025", time: "1:00 PM" },
      { role: "Finance",         name: "Aarti M",   status: "approved", date: "May 1, 2025",  time: "9:30 AM" },
      { role: "VP Engineering",  name: "Karthik V", status: "approved", date: "May 1, 2025",  time: "11:00 AM" },
    ],
    aiNotes: [
      { type: "recommendation", text: "All approvals secured. Send within 24 hours — Priya completed L3 yesterday and momentum is critical." },
      { type: "insight",        text: "Priya scored 9.0 in system design. Comp at midpoint of band is appropriate. Risk of competing offer: medium." },
    ],
    revisions: [
      { version: 1, date: "Apr 30, 2025", base: 5800000, bonus: 500000, status: "approved", notes: "Approved at AI-recommended value" },
    ]
  },
  "c-8": { // Sara Lindqvist — Accepted (already hired)
    id: "off-003",
    candidateId: "c-8",
    reqId: "req-1",
    status: "Accepted",
    base: 5800000,
    bonus: 600000,
    esop: 3800000,
    band: { min: 5500000, max: 6500000 },
    aiRecommended: 5700000,
    sentDate: "Apr 14, 2025",
    deadline: "Apr 21, 2025",
    daysSinceSent: 18,
    daysToDeadline: 0,
    acceptedDate: "Apr 15, 2025",
    competingOfferRisk: "low",
    competingOfferNote: "No competing offer flagged. Referral source confirmed candidate's interest.",
    approvalChain: [
      { role: "Recruiter",       name: "Riya K",    status: "approved", date: "Apr 13, 2025", time: "9:00 AM"  },
      { role: "Hiring Manager",  name: "Sanjay R",  status: "approved", date: "Apr 13, 2025", time: "11:00 AM" },
      { role: "Finance",         name: "Aarti M",   status: "approved", date: "Apr 14, 2025", time: "9:00 AM"  },
      { role: "VP Engineering",  name: "Karthik V", status: "approved", date: "Apr 14, 2025", time: "10:30 AM" },
    ],
    aiNotes: [
      { type: "insight", text: "Accepted in 18 hours — fastest accept this quarter. No counter-offer or negotiation. Strong cultural fit confirmed." },
    ],
    revisions: [
      { version: 1, date: "Apr 13, 2025", base: 5800000, bonus: 600000, status: "accepted", notes: "Single revision — direct accept" },
    ]
  },
  "c-2": { // Marcus Webb — Pending Approval (still in interview pipeline but offer started)
    id: "off-004",
    candidateId: "c-2",
    reqId: "req-1",
    status: "Pending Approval",
    base: 6800000,
    bonus: 1000000,
    esop: 5000000,
    band: { min: 5500000, max: 6500000 },
    aiRecommended: 6500000,
    sentDate: null,
    deadline: null,
    daysSinceSent: null,
    daysToDeadline: null,
    competingOfferRisk: "high",
    competingOfferNote: "Candidate explicitly mentioned competing offer from Atlassian — confirmed by reference. Negotiation expected.",
    approvalChain: [
      { role: "Recruiter",       name: "Riya K",    status: "approved", date: "May 1, 2025", time: "3:00 PM" },
      { role: "Hiring Manager",  name: "Sanjay R",  status: "approved", date: "May 1, 2025", time: "4:30 PM" },
      { role: "Finance",         name: "Aarti M",   status: "pending",  date: null,          time: null      },
      { role: "VP Engineering",  name: "Karthik V", status: "pending",  date: null,          time: null      },
    ],
    aiNotes: [
      { type: "risk",           text: "Proposed comp ₹3L above band ceiling — Finance approval blocked pending VP Engineering escalation." },
      { type: "recommendation", text: "Marcus has competing Atlassian offer. Accelerate approval today or risk losing him. ROI justifies stretch — Staff-level platform engineering is rare." },
    ],
    revisions: [
      { version: 1, date: "May 1, 2025", base: 6500000, bonus: 800000, status: "draft", notes: "Initial at band ceiling" },
      { version: 2, date: "May 1, 2025", base: 6800000, bonus: 1000000, status: "pending-approval", notes: "Stretched per HM after competing offer disclosure" },
    ]
  },
};

const offerStatusConfig = {
  "Draft":             { tone: "default", icon: FileText,    label: "Draft" },
  "Pending Approval":  { tone: "amber",   icon: Clock,       label: "Pending Approval" },
  "Approved":          { tone: "indigo",  icon: CheckCircle2,label: "Approved — Ready to Send" },
  "Sent":              { tone: "violet",  icon: Send,        label: "Sent" },
  "Awaiting Response": { tone: "amber",   icon: Timer,       label: "Awaiting Response" },
  "Accepted":          { tone: "emerald", icon: UserCheck,   label: "Accepted" },
  "Declined":          { tone: "rose",    icon: XCircle,     label: "Declined" },
  "Expired":           { tone: "rose",    icon: XCircle,     label: "Expired" },
  "Withdrawn":         { tone: "default", icon: XCircle,     label: "Withdrawn" },
};

const formatINR = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const getOfferRecord = (candidateId) => offerRecords[candidateId] || null;
const getAllOffers   = () => Object.values(offerRecords);

/* AI offer recommendation generator — mock */
const generateOfferRecommendation = (candidate, req) => {
  const baseRec = candidate.match >= 95 ? 6300000 : candidate.match >= 90 ? 6000000 : candidate.match >= 85 ? 5700000 : 5500000;
  return {
    base: baseRec,
    bonus: Math.round(baseRec * 0.12),
    esop: Math.round(baseRec * 0.6),
    band: { min: 5500000, max: 6500000 },
    rationale: [
      `Match score ${candidate.match}% places candidate at ${candidate.match >= 90 ? "top quartile" : "mid-band"} of comp range`,
      `${candidate.exp} years experience — ${candidate.exp >= 7 ? "above" : "within"} expected band for ${req?.title || "this role"}`,
      `Communication score ${candidate.commScore}/10 ${candidate.commScore >= 9 ? "supports stretch comp" : "supports market-rate comp"}`,
    ],
    risks: candidate.gaps?.length > 0 ? candidate.gaps.slice(0, 2).map(g => `Gap: ${g} — may justify holding at midpoint`) : [],
  };
};

/* ============================================================
   OFFERS HUB — sidebar entry point
   ============================================================ */
const OffersHub = ({ candidates, requisitions, setView }) => {
  const [filter, setFilter] = useState("all"); // all | active | accepted | declined
  const offers = getAllOffers();

  const filteredOffers = offers.filter(o => {
    if (filter === "all") return true;
    if (filter === "active")   return ["Draft", "Pending Approval", "Approved", "Sent", "Awaiting Response"].includes(o.status);
    if (filter === "accepted") return o.status === "Accepted";
    if (filter === "declined") return ["Declined", "Expired", "Withdrawn"].includes(o.status);
    return true;
  });

  const stats = [
    { label: "Active Offers",      value: offers.filter(o => ["Draft","Pending Approval","Approved","Sent","Awaiting Response"].includes(o.status)).length, color: "from-indigo-500 to-violet-500", icon: FileSignature },
    { label: "Awaiting Response",  value: offers.filter(o => o.status === "Awaiting Response").length, color: "from-amber-500 to-orange-500", icon: Timer },
    { label: "Accepted (30d)",     value: offers.filter(o => o.status === "Accepted").length, color: "from-emerald-500 to-teal-500", icon: UserCheck },
    { label: "Avg Time-to-Accept", value: "2.4d", color: "from-violet-500 to-fuchsia-500", icon: Clock, sub: "↓ 1.1d vs Q3" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <FileSignature className="w-3 h-3" />Offer Management
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Offers</h1>
          <p className="text-sm text-slate-500 mt-1">AI-recommended comp, approval workflow, response tracking, and competing-offer risk.</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${s.color}`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">{s.label}</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{s.value}</div>
                  {s.sub && <div className="text-[10px] text-emerald-600 font-semibold">{s.sub}</div>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[["all", "All"], ["active", "Active"], ["accepted", "Accepted"], ["declined", "Declined / Expired"]].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Offers list */}
      <div className="space-y-3">
        {filteredOffers.length === 0 ? (
          <Card className="p-12 text-center">
            <FileSignature className="w-10 h-10 mx-auto text-slate-200 mb-3" />
            <div className="font-semibold text-slate-600">No offers in this view</div>
            <div className="text-sm text-slate-400 mt-1">Offers are created from candidate profiles after interview rounds complete.</div>
          </Card>
        ) : (
          filteredOffers.map(offer => {
            const candidate = candidates.find(c => c.id === offer.candidateId);
            const req       = requisitions.find(r => r.id === offer.reqId);
            if (!candidate) return null;
            const cfg = offerStatusConfig[offer.status];
            const StatusIcon = cfg.icon;
            const total = offer.base + offer.bonus;
            const inBand = total >= offer.band.min && total <= offer.band.max;
            const overBand = total > offer.band.max;

            // Urgency calculation
            let urgency = null;
            if (offer.status === "Awaiting Response") {
              if (offer.daysToDeadline <= 1) urgency = { level: "high",   text: `${offer.daysToDeadline === 0 ? "Expires today" : "Expires tomorrow"}`, color: "rose" };
              else if (offer.daysToDeadline <= 3) urgency = { level: "medium", text: `${offer.daysToDeadline} days to deadline`, color: "amber" };
            } else if (offer.status === "Pending Approval") {
              urgency = { level: "medium", text: "Approval pending", color: "amber" };
            }

            return (
              <Card key={offer.id} className="overflow-hidden hover:shadow-md transition">
                <button onClick={() => setView({ name: "offer-detail", offerId: offer.id })} className="w-full text-left">
                  <div className="px-5 py-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${candidate.match >= 90 ? "bg-emerald-500" : "bg-indigo-500"}`}>
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">{candidate.name}</span>
                        <Pill tone={cfg.tone}><StatusIcon className="w-3 h-3" />{cfg.label}</Pill>
                        {urgency && (
                          <Pill tone={urgency.color}>
                            <AlertTriangle className="w-3 h-3" />{urgency.text}
                          </Pill>
                        )}
                        {offer.competingOfferRisk === "high" && (
                          <Pill tone="rose"><Flag className="w-3 h-3" />Competing offer risk</Pill>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {req?.title} · {req?.project} · Offer {offer.id.toUpperCase()}
                      </div>
                    </div>

                    {/* Comp */}
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-slate-900 tabular-nums">{formatINR(total)}</div>
                      <div className="text-[10px] text-slate-400">
                        {inBand ? "Within band" : overBand ? "↑ Above band" : "↓ Below band"}
                      </div>
                    </div>

                    {/* Sent/Deadline */}
                    {offer.status === "Awaiting Response" && (
                      <div className="text-right shrink-0 px-3 border-l border-slate-200">
                        <div className="text-xs font-bold text-slate-700 tabular-nums">Day {offer.daysSinceSent}/{offer.daysSinceSent + offer.daysToDeadline}</div>
                        <div className="text-[10px] text-slate-400">since sent</div>
                      </div>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                </button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ============================================================
   OFFER DETAIL — comp breakdown, approval chain, AI notes
   ============================================================ */
const OfferDetail = ({ offer, candidate, req, onBack, onOpenCandidate, onUpdateStatus }) => {
  const [tab, setTab] = useState("overview");
  if (!offer || !candidate) return null;

  const cfg = offerStatusConfig[offer.status];
  const StatusIcon = cfg.icon;
  const total = offer.base + offer.bonus;
  const totalWithEsop = total + offer.esop;
  const inBand = total >= offer.band.min && total <= offer.band.max;
  const overBand = total > offer.band.max;
  const bandPosition = ((total - offer.band.min) / (offer.band.max - offer.band.min)) * 100;

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ChevronRight className="w-4 h-4 rotate-180" />Back to offers
      </button>

      {/* ── Header with status banner ── */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d946ef 0%, transparent 50%)" }} />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 ${candidate.match >= 90 ? "bg-emerald-500" : "bg-indigo-500"}`}>
              {candidate.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileSignature className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Offer · {offer.id.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold leading-tight">{candidate.name}</h2>
              <button onClick={() => onOpenCandidate(candidate.id)} className="text-slate-400 text-sm mt-0.5 hover:text-violet-300 transition">
                {req?.title} · {req?.project} →
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              cfg.tone === "emerald" ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/40" :
              cfg.tone === "amber"   ? "bg-amber-500/30 text-amber-300 border-amber-500/40" :
              cfg.tone === "rose"    ? "bg-rose-500/30 text-rose-300 border-rose-500/40" :
              cfg.tone === "indigo"  ? "bg-indigo-500/30 text-indigo-300 border-indigo-500/40" :
              cfg.tone === "violet"  ? "bg-violet-500/30 text-violet-300 border-violet-500/40" :
                                       "bg-white/10 text-slate-300 border-white/20"
            }`}>
              <StatusIcon className="w-3 h-3" />{cfg.label}
            </div>
            {offer.status === "Awaiting Response" && (
              <div className="text-right">
                <div className="text-xs text-slate-400">Response deadline</div>
                <div className="text-sm font-bold text-amber-300">{offer.deadline} · {offer.daysToDeadline}d remaining</div>
              </div>
            )}
            {offer.status === "Accepted" && offer.acceptedDate && (
              <div className="text-right">
                <div className="text-xs text-slate-400">Accepted</div>
                <div className="text-sm font-bold text-emerald-300">{offer.acceptedDate}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          ["overview",  "Overview",      DollarSign],
          ["approval",  "Approval Chain",UserCheck],
          ["ai-notes",  "AI Insights",   Sparkles],
          ["history",   "Revisions",     Clock],
        ].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* Comp breakdown */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Compensation Breakdown</h3>
              <Pill tone={inBand ? "emerald" : overBand ? "rose" : "amber"}>
                {inBand ? "Within band" : overBand ? `${formatINR(total - offer.band.max)} above band` : `${formatINR(offer.band.min - total)} below band`}
              </Pill>
            </div>

            {/* Comp components */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Base Salary",    val: offer.base,  color: "from-indigo-500 to-violet-500" },
                { label: "Joining Bonus",  val: offer.bonus, color: "from-violet-500 to-fuchsia-500" },
                { label: "ESOP (4 yrs)",   val: offer.esop,  color: "from-amber-500 to-orange-500" },
              ].map(c => (
                <div key={c.label} className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.label}</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{formatINR(c.val)}</div>
                  <div className={`h-1 mt-3 rounded-full bg-gradient-to-r ${c.color}`} />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 border border-indigo-200">
              <div>
                <div className="text-xs text-slate-600 font-semibold">Total Year 1 Cash + ESOP Value</div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums mt-1">{formatINR(totalWithEsop)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">AI Recommended</div>
                <div className="text-lg font-bold text-violet-700 tabular-nums">{formatINR(offer.aiRecommended + Math.round(offer.aiRecommended * 0.12))}</div>
                {Math.abs(total - (offer.aiRecommended + Math.round(offer.aiRecommended * 0.12))) > 100000 && (
                  <div className={`text-[10px] font-semibold ${total > offer.aiRecommended ? "text-rose-600" : "text-emerald-600"}`}>
                    {total > offer.aiRecommended ? "Stretched ↑" : "Conservative ↓"}
                  </div>
                )}
              </div>
            </div>

            {/* Band visualization */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Band Position</span>
                <span className="text-slate-400">{formatINR(offer.band.min)} — {formatINR(offer.band.max)}</span>
              </div>
              <div className="relative h-3 bg-slate-100 rounded-full">
                <div className="absolute h-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 rounded-full" style={{ width: "100%" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-slate-900 rounded-full border-2 border-white shadow-md"
                  style={{ left: `${Math.max(0, Math.min(100, bandPosition))}%`, transform: `translate(-50%, -50%)` }}
                  title={`Total cash: ${formatINR(total)}`} />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>Min</span><span>Mid</span><span>Max</span>
              </div>
            </div>
          </Card>

          {/* Competing offer risk */}
          {offer.competingOfferRisk !== "low" && (
            <Card className={`p-5 border-l-4 ${offer.competingOfferRisk === "high" ? "border-l-rose-500 bg-rose-50/50" : "border-l-amber-500 bg-amber-50/50"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${offer.competingOfferRisk === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${offer.competingOfferRisk === "high" ? "text-rose-700" : "text-amber-700"}`}>
                    {offer.competingOfferRisk === "high" ? "High" : "Medium"} Competing Offer Risk
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{offer.competingOfferNote}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick actions */}
          <div className="flex gap-2 flex-wrap">
            {offer.status === "Approved"          && <GradientButton icon={Send}>Send Offer to Candidate</GradientButton>}
            {offer.status === "Pending Approval"  && <GradientButton icon={Mail}>Nudge Approvers</GradientButton>}
            {offer.status === "Awaiting Response" && <GradientButton icon={Mail}>Send Follow-up</GradientButton>}
            {offer.status === "Awaiting Response" && <GradientButton variant="secondary" icon={DollarSign}>Revise Offer</GradientButton>}
            <GradientButton variant="secondary" icon={FileText}>Download Letter</GradientButton>
          </div>
        </div>
      )}

      {/* APPROVAL CHAIN TAB */}
      {tab === "approval" && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-1">Approval Workflow</h3>
          <p className="text-xs text-slate-500 mb-5">Sequential approval flow — each approver must sign off before next stage activates.</p>

          <div className="relative">
            {offer.approvalChain.map((step, i) => {
              const isLast = i === offer.approvalChain.length - 1;
              const isApproved = step.status === "approved";
              const isPending  = step.status === "pending";
              return (
                <div key={i} className="relative flex items-start gap-4 pb-6">
                  {/* Connector line */}
                  {!isLast && (
                    <div className={`absolute left-4 top-8 w-0.5 h-full ${isApproved ? "bg-emerald-300" : "bg-slate-200"}`} />
                  )}
                  {/* Status icon */}
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isApproved ? "bg-emerald-500" : isPending ? "bg-amber-100 border-2 border-amber-400" : "bg-slate-100 border-2 border-slate-200"
                  }`}>
                    {isApproved && <Check className="w-4 h-4 text-white" />}
                    {isPending  && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {!isApproved && !isPending && <span className="text-[10px] font-bold text-slate-400">{i+1}</span>}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{step.role}</div>
                        <div className="text-xs text-slate-500">{step.name}</div>
                      </div>
                      <div className="text-right">
                        {isApproved && (
                          <>
                            <Pill tone="emerald"><Check className="w-3 h-3" />Approved</Pill>
                            <div className="text-[10px] text-slate-400 mt-1">{step.date} · {step.time}</div>
                          </>
                        )}
                        {isPending && <Pill tone="amber"><Clock className="w-3 h-3" />Awaiting</Pill>}
                        {!isApproved && !isPending && <Pill>Not Started</Pill>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* AI NOTES TAB */}
      {tab === "ai-notes" && (
        <div className="space-y-3">
          {offer.aiNotes.map((note, i) => {
            const styleMap = {
              risk:           { bg: "bg-rose-50",    border: "border-l-rose-500",    icon: "⚠️", label: "Risk",           color: "text-rose-700" },
              recommendation: { bg: "bg-emerald-50", border: "border-l-emerald-500", icon: "✅", label: "Recommendation", color: "text-emerald-700" },
              insight:        { bg: "bg-indigo-50",  border: "border-l-indigo-500",  icon: "💡", label: "Insight",        color: "text-indigo-700" },
            };
            const s = styleMap[note.type];
            return (
              <Card key={i} className={`p-5 ${s.bg} border-l-4 ${s.border}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{s.icon}</span>
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.color}`}>{s.label}</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* REVISIONS TAB */}
      {tab === "history" && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-5">Offer Revisions</h3>
          <div className="space-y-3">
            {offer.revisions.map((rev, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">v{rev.version}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="font-semibold text-sm text-slate-900">Revision {rev.version} — {rev.date}</div>
                    <Pill tone={rev.status === "accepted" ? "emerald" : rev.status === "sent" ? "violet" : rev.status === "approved" ? "indigo" : "default"}>{rev.status}</Pill>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Base {formatINR(rev.base)} · Bonus {formatINR(rev.bonus)}</div>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">{rev.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

/* ============================================================
   NEW OFFER FORM — accessible from candidate profile / Offered stage
   ============================================================ */
const NewOfferForm = ({ candidate, req, onBack, onSubmit }) => {
  const recommended = generateOfferRecommendation(candidate, req);
  const [base, setBase]   = useState(recommended.base);
  const [bonus, setBonus] = useState(recommended.bonus);
  const [esop, setEsop]   = useState(recommended.esop);
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const total = base + bonus;
  const inBand = total >= recommended.band.min && total <= recommended.band.max;
  const overBand = total > recommended.band.max;

  const handleSubmit = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); onSubmit({ base, bonus, esop, notes }); }, 1200);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ChevronRight className="w-4 h-4 rotate-180" />Back
      </button>

      <div>
        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />New Offer
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{candidate.name}</h1>
        <p className="text-sm text-slate-500 mt-1">{req?.title} · {req?.project} · AI-recommended comp pre-filled below</p>
      </div>

      {/* AI rationale */}
      <Card className="p-5 bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 mb-2">AI Compensation Recommendation</div>
            <ul className="space-y-1">
              {recommended.rationale.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{r}</li>
              ))}
              {recommended.risks.map((r, i) => (
                <li key={`r-${i}`} className="text-sm text-slate-700 flex gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Comp inputs */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-5">Compensation Components</h3>
        <div className="space-y-5">
          {[
            { label: "Base Salary",   key: "base",  val: base,  set: setBase,  min: 4000000, max: 8000000, step: 100000 },
            { label: "Joining Bonus", key: "bonus", val: bonus, set: setBonus, min: 0,       max: 2000000, step: 50000 },
            { label: "ESOP (4 years vest)", key: "esop", val: esop, set: setEsop, min: 0, max: 10000000, step: 100000 },
          ].map(f => (
            <div key={f.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">{f.label}</label>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatINR(f.val)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(+e.target.value)}
                className="w-full accent-indigo-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{formatINR(f.min)}</span>
                {f.key === "base" && <span className="text-violet-600 font-semibold">AI: {formatINR(recommended.base)}</span>}
                <span>{formatINR(f.max)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total + band check */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Year 1 Cash</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(total)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Pill tone={inBand ? "emerald" : overBand ? "rose" : "amber"}>
              {inBand ? "Within band" : overBand ? `${formatINR(total - recommended.band.max)} above band — needs VP approval` : `${formatINR(recommended.band.min - total)} below band`}
            </Pill>
            <span className="text-slate-400">Band: {formatINR(recommended.band.min)} — {formatINR(recommended.band.max)}</span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Internal Notes</h3>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Justification, negotiation context, special terms..." rows={3}
          className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" />
      </Card>

      <button onClick={handleSubmit} disabled={generating}
        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
        {generating ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting for approval...</>
        ) : (
          <><FileSignature className="w-4 h-4" />Submit Offer for Approval</>
        )}
      </button>
    </div>
  );
};

/* ============================================================
   OFFER STATUS PANEL — embeds inside RequisitionDetail's Offered stage
   Lightweight summary that links to full offer detail
   ============================================================ */
const OfferStatusPanel = ({ candidate, onOpenOffer }) => {
  const offer = getOfferRecord(candidate.id);
  if (!offer) return null;
  const cfg = offerStatusConfig[offer.status];
  const StatusIcon = cfg.icon;
  const total = offer.base + offer.bonus;

  return (
    <button onClick={() => onOpenOffer(offer.id)}
      className="w-full mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 hover:border-violet-300 transition flex items-center justify-between gap-2 group">
      <div className="flex items-center gap-2 text-xs">
        <FileSignature className="w-3.5 h-3.5 text-violet-600 shrink-0" />
        <span className="font-semibold text-violet-900">{cfg.label}</span>
        <span className="text-violet-600">·</span>
        <span className="font-bold text-slate-900 tabular-nums">{formatINR(total)}</span>
        {offer.status === "Awaiting Response" && offer.daysToDeadline <= 2 && (
          <Pill tone="rose"><AlertTriangle className="w-2.5 h-2.5" />{offer.daysToDeadline}d left</Pill>
        )}
      </div>
      <span className="text-[10px] font-semibold text-violet-700 group-hover:text-violet-900 transition shrink-0 flex items-center gap-0.5">
        Manage Offer<ChevronRight className="w-3 h-3" />
      </span>
    </button>
  );
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
  const { filters } = useOrgFilters();
  const filterCount = countActiveFilters(filters);
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
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
            Welcome back, Riya · Recruiter View
            {filterCount > 0 && <span className="ml-2 text-amber-600">· {filterCount} scope filter{filterCount > 1 ? "s" : ""} active</span>}
          </div>
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
  const { filters } = useOrgFilters();
  const filterCount = countActiveFilters(filters);
  const shortlisted = candidates.filter(c => ["Shortlisted","Interviewed","Offered","Hired"].includes(c.stage));
  const recColor = { Proceed: "emerald", Hold: "amber", Reject: "rose" };
  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">
          Hiring Manager View
          {filterCount > 0 && <span className="ml-2 text-amber-600">· {filterCount} scope filter{filterCount > 1 ? "s" : ""} active</span>}
        </div>
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
  const { filters } = useOrgFilters();
  const filteredProjects = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return projectRiskData;
    return projectRiskData.filter(p =>
      Object.entries(filters).every(([key, vals]) => !vals || vals.length === 0 || vals.includes(p[key]))
    );
  }, [filters]);

  const riskColor = { high: "rose", medium: "amber", low: "emerald" };
  const riskBg    = { high: "bg-rose-50 border-rose-200", medium: "bg-amber-50 border-amber-200", low: "bg-emerald-50 border-emerald-200" };
  const riskLabel = { high: "text-rose-700", medium: "text-amber-700", low: "text-emerald-700" };
  const riskDot   = { high: "bg-rose-500", medium: "bg-amber-500", low: "bg-emerald-500" };

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-fuchsia-600 uppercase tracking-widest mb-1">Delivery Manager View</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project staffing readiness</h1>
        <div className="text-sm text-slate-500 mt-1">
          Time to fill · skill coverage · project risk
          {filteredProjects.length !== projectRiskData.length && <span className="text-fuchsia-600 font-semibold"> · {filteredProjects.length} of {projectRiskData.length} projects in scope</span>}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="w-10 h-10 mx-auto text-slate-200 mb-3" />
          <div className="font-semibold text-slate-600">No projects match current filter</div>
          <div className="text-sm text-slate-400 mt-1">Try clearing one or more filters at the top of the page.</div>
        </Card>
      ) : (
      <>
      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Roles at Risk",         value: filteredProjects.filter(p => p.risk === "high").length,   sub: "Overdue or blocked",     color: "from-rose-500 to-pink-500",       icon: AlertCircle },
          { label: "Avg Days Open",          value: `${Math.round(filteredProjects.reduce((a,p)=>a+p.daysOpen,0)/filteredProjects.length)}d`, sub: "vs 22d target", color: "from-fuchsia-500 to-violet-500", icon: Clock },
          { label: "Skill Coverage Avg",     value: `${Math.round(filteredProjects.reduce((a,p)=>a+p.coverage,0)/filteredProjects.length)}%`, sub: "Across open roles", color: "from-indigo-500 to-blue-500",  icon: Target },
          { label: "Openings Unfilled",      value: filteredProjects.reduce((a,p)=>a+(p.openings-p.filled),0), sub: "Total positions",       color: "from-amber-500 to-orange-500",    icon: Briefcase },
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
        {filteredProjects.map((p, i) => {
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
      </>
      )}
    </div>
  );
};

/* ── HR LEADER DASHBOARD ── */
const HRLeaderDashboard = () => {
  const { filters } = useOrgFilters();
  const filterCount = countActiveFilters(filters);
  const scopeLabel = filterCount === 0 ? "Across the entire organization" : `Filtered scope · ${filterCount} active filter${filterCount > 1 ? "s" : ""}`;

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">HR Leader View</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hiring performance overview</h1>
        <div className="text-sm text-slate-500 mt-1">
          Funnel efficiency · source ROI · hiring health
          <span className={filterCount > 0 ? "text-amber-600 font-semibold" : ""}> · {scopeLabel}</span>
        </div>
      </div>

      {filterCount > 0 && (
        <Card className="p-4 bg-amber-50/40 border-amber-200">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Note:</strong> Funnel benchmarks and source-mix percentages shown below are organization-wide averages. To see scope-specific metrics, use the requisitions and offers views.
            </div>
          </div>
        </Card>
      )}

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
    { key: "interviews",    label: "Interviews",  icon: Activity,      badge: "AI" },
    { key: "offers",        label: "Offers",      icon: FileSignature, badge: "AI" },
    { key: "admin",         label: "Admin",       icon: Settings },
  ];
  const allowed = PERSONAS[persona]?.navItems || ALL_ITEMS.map(i => i.key);
  const items   = ALL_ITEMS.filter(it => allowed.includes(it.key));
  const colorMap = { indigo: "from-indigo-500 to-violet-500", violet: "from-violet-500 to-fuchsia-500", fuchsia: "from-fuchsia-500 to-pink-500", amber: "from-amber-500 to-orange-500", slate: "from-slate-500 to-slate-700" };
  const p = PERSONAS[persona];

  /* ── Hover-expand logic ── */
  const [expanded, setExpanded] = useState(false);
  const leaveTimer = React.useRef(null);
  const sidebarRef = React.useRef(null);

  const handleEnter = () => {
    clearTimeout(leaveTimer.current);
    setExpanded(true);
  };

  // Small delay on leave so the sidebar stays open while user moves
  // between nav items or toward scrollable content inside the panel.
  const handleLeave = (e) => {
    // If the related target is still inside the sidebar, don't collapse
    if (sidebarRef.current?.contains(e.relatedTarget)) return;
    leaveTimer.current = setTimeout(() => setExpanded(false), 200);
  };

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const W_COLLAPSED = 64;   // px — icon rail
  const W_EXPANDED  = 256;  // px — full nav

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: expanded ? W_EXPANDED : W_COLLAPSED,
        minWidth: expanded ? W_EXPANDED : W_COLLAPSED,
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)",
      }}
      className="bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 z-40 overflow-hidden"
    >
      {/* ── Logo ── */}
      <div
        className="border-b border-slate-800/80 flex items-center gap-2.5 overflow-hidden"
        style={{ padding: expanded ? "20px" : "14px", transition: "padding 220ms ease" }}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div
          className="overflow-hidden"
          style={{
            opacity: expanded ? 1 : 0,
            width: expanded ? "auto" : 0,
            transition: "opacity 180ms ease, width 220ms ease",
            whiteSpace: "nowrap",
          }}
        >
          <div className="font-bold text-white tracking-tight text-lg leading-none">HumAIne</div>
          <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">AI Recruitment</div>
        </div>
      </div>

      {/* ── Persona chip ── */}
      <div style={{ padding: expanded ? "12px 12px 0" : "10px 10px 0", transition: "padding 220ms ease" }}>
        <div
          className={`flex items-center rounded-xl border border-white/10 bg-gradient-to-r ${colorMap[p.color]} bg-opacity-10 overflow-hidden`}
          style={{ gap: expanded ? 10 : 0, padding: expanded ? "8px 12px" : "8px", transition: "all 220ms ease" }}
        >
          <div
            className={`rounded-lg bg-gradient-to-br ${colorMap[p.color]} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}
            style={{ width: 24, height: 24 }}
          >
            {p.avatar}
          </div>
          <div
            className="overflow-hidden"
            style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 160 : 0, transition: "opacity 160ms ease, max-width 220ms ease", whiteSpace: "nowrap" }}
          >
            <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Viewing as</div>
            <div className="text-xs font-bold text-white leading-tight">{p.label}</div>
          </div>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden"
        style={{ padding: expanded ? "12px" : "12px 8px", transition: "padding 220ms ease" }}
      >
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onNav(it.key)}
              title={!expanded ? it.label : undefined}
              className={`w-full flex items-center rounded-xl text-sm transition-all group relative
                ${isActive
                  ? "bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/10 text-white border border-indigo-500/30"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"}`}
              style={{
                justifyContent: expanded ? "flex-start" : "center",
                padding: expanded ? "10px 12px" : "10px",
                gap: expanded ? 12 : 0,
                transition: "all 220ms ease",
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {/* Label — fades in when expanded */}
              <span
                className="overflow-hidden font-medium"
                style={{
                  opacity: expanded ? 1 : 0,
                  maxWidth: expanded ? 160 : 0,
                  transition: "opacity 160ms ease 40ms, max-width 220ms ease",
                  whiteSpace: "nowrap",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {it.label}
              </span>

              {/* Badge — only shown when expanded */}
              {it.badge && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white tracking-wider shrink-0"
                  style={{ opacity: expanded ? 1 : 0, transition: "opacity 120ms ease" }}
                >
                  {it.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {!expanded && (
                <span className="pointer-events-none absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                  {it.label}{it.badge ? ` · ${it.badge}` : ""}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Credits footer ── */}
      <div
        className="border-t border-slate-800/80 overflow-hidden"
        style={{ padding: expanded ? "12px" : "10px 8px", transition: "padding 220ms ease" }}
      >
        <div
          className="bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/30 rounded-xl overflow-hidden"
          style={{ padding: expanded ? "12px" : "8px", transition: "padding 220ms ease" }}
        >
          <div className="flex items-center justify-center" style={{ gap: expanded ? 8 : 0, transition: "gap 220ms ease" }}>
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span
              className="text-xs font-semibold text-white overflow-hidden"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 120 : 0, whiteSpace: "nowrap", transition: "opacity 160ms ease, max-width 220ms ease" }}
            >
              AI credits
            </span>
          </div>
          <div
            className="overflow-hidden"
            style={{ maxHeight: expanded ? 40 : 0, opacity: expanded ? 1 : 0, transition: "max-height 220ms ease, opacity 160ms ease" }}
          >
            <div className="text-[11px] text-slate-400 mt-1">2,847 / 5,000 used</div>
            <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: "57%" }} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};


/* ============================================================
   TUTORIAL — interactive walkthrough of the HumAIne prototype
   8 steps, each with an SVG diagram and "Try it now" deep links.
   ============================================================ */

const TutorialIcon = ({ children, className = "" }) => (
  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 ${className}`}>{children}</div>
);

/* SVG diagrams keyed by step */
const TutorialDiagrams = {
  /* Step 1 — Welcome / overview */
  overview: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <defs>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect x="200" y="80" width="200" height="160" rx="20" fill="url(#brandGrad)" />
      <text x="300" y="155" textAnchor="middle" fill="white" fontSize="32" fontWeight="800">HumAIne</text>
      <text x="300" y="180" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.85">AI RECRUITMENT PLATFORM</text>
      {[
        { x: 80,  y: 50,  label: "AI JD" },
        { x: 470, y: 50,  label: "Sourcing" },
        { x: 50,  y: 160, label: "Pipeline" },
        { x: 510, y: 160, label: "Screening" },
        { x: 80,  y: 270, label: "Interview" },
        { x: 470, y: 270, label: "Offers" },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="26" fill="white" stroke="#c7d2fe" strokeWidth="2" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#4338ca">{n.label}</text>
          <line x1={n.x} y1={n.y} x2={300} y2={160} stroke="#c7d2fe" strokeWidth="1" strokeDasharray="3,3" />
        </g>
      ))}
    </svg>
  ),

  /* Step 2 — Personas */
  personas: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">VIEW AS — 5 PERSONAS</text>
      {[
        { x: 60,  label: "Recruiter",       avatar: "RC", c: "#6366f1", desc: "Full pipeline" },
        { x: 175, label: "Hiring Mgr",      avatar: "HM", c: "#8b5cf6", desc: "Shortlist + feedback" },
        { x: 290, label: "Delivery Mgr",    avatar: "DM", c: "#d946ef", desc: "Project risk" },
        { x: 405, label: "HR Leader",       avatar: "HL", c: "#f59e0b", desc: "Org metrics" },
        { x: 520, label: "Admin",           avatar: "AD", c: "#475569", desc: "Configure" },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x - 40} y={70} width="80" height="120" rx="12" fill="white" stroke={p.c} strokeWidth="2" />
          <circle cx={p.x} cy={100} r="20" fill={p.c} />
          <text x={p.x} y={105} textAnchor="middle" fill="white" fontSize="12" fontWeight="800">{p.avatar}</text>
          <text x={p.x} y={140} textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">{p.label}</text>
          <text x={p.x} y={158} textAnchor="middle" fill="#64748b" fontSize="9">{p.desc}</text>
        </g>
      ))}
      <text x="300" y="240" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="600">Each persona sees a different dashboard,</text>
      <text x="300" y="258" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="600">tailored navigation, and prioritized data.</text>
      <text x="300" y="285" textAnchor="middle" fill="#6366f1" fontSize="11" fontWeight="700">Switch personas using the dropdown in the top bar →</text>
    </svg>
  ),

  /* Step 3 — Lifecycle pipeline */
  lifecycle: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">RECRUITMENT LIFECYCLE</text>
      {[
        { stage: "Sourced",     x: 50,  c: "#94a3b8", count: 47 },
        { stage: "Screened",    x: 145, c: "#64748b", count: 28 },
        { stage: "Shortlisted", x: 240, c: "#6366f1", count: 14 },
        { stage: "Interviewed", x: 335, c: "#8b5cf6", count: 7  },
        { stage: "Offered",     x: 430, c: "#f59e0b", count: 2  },
        { stage: "Hired",       x: 525, c: "#10b981", count: 1  },
      ].map((s, i, arr) => (
        <g key={s.stage}>
          {i < arr.length - 1 && (
            <path d={`M ${s.x + 35} 100 L ${arr[i+1].x - 35} 100`} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arr)" />
          )}
          <circle cx={s.x} cy={100} r="24" fill={s.c} />
          <text x={s.x} y={104} textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{s.count}</text>
          <text x={s.x} y={150} textAnchor="middle" fill="#334155" fontSize="10" fontWeight="700">{s.stage}</text>
        </g>
      ))}
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#cbd5e1" />
        </marker>
      </defs>
      <rect x="60" y="200" width="480" height="90" rx="10" fill="#f1f5f9" stroke="#e2e8f0" />
      <text x="80" y="225" fill="#1e293b" fontSize="12" fontWeight="700">Each stage card shows three things:</text>
      <text x="80" y="248" fill="#475569" fontSize="11">• Candidates in stage  • AI signals (Insight / Risk / Action)  • Conversion %</text>
      <text x="80" y="268" fill="#475569" fontSize="11">Drag candidates between stages · click any stage to expand</text>
    </svg>
  ),

  /* Step 4 — AI insights signal types */
  ai: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">3 TYPES OF AI SIGNALS</text>
      {[
        { x: 80,  label: "Insight",        icon: "💡", color: "#6366f1", bg: "#eef2ff",  desc: "Trends, observations,",      desc2: "and patterns in data" },
        { x: 240, label: "Risk",           icon: "⚠️", color: "#e11d48", bg: "#fff1f2",  desc: "Flags requiring",            desc2: "attention or action" },
        { x: 400, label: "Recommendation", icon: "✅", color: "#059669", bg: "#ecfdf5",  desc: "Suggested next",             desc2: "actions to take" },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x - 60} y={60} width="140" height="180" rx="14" fill={s.bg} stroke={s.color} strokeWidth="2" />
          <text x={s.x} y={105} textAnchor="middle" fontSize="36">{s.icon}</text>
          <text x={s.x} y={145} textAnchor="middle" fill={s.color} fontSize="13" fontWeight="800">{s.label}</text>
          <text x={s.x} y={180} textAnchor="middle" fill="#475569" fontSize="10">{s.desc}</text>
          <text x={s.x} y={195} textAnchor="middle" fill="#475569" fontSize="10">{s.desc2}</text>
          <line x1={s.x - 30} y1={215} x2={s.x + 30} y2={215} stroke={s.color} strokeWidth="1" />
          <text x={s.x} y={230} textAnchor="middle" fill={s.color} fontSize="9" fontWeight="700" letterSpacing="1">EXAMPLE</text>
        </g>
      ))}
      <text x="80" y="280" fill="#475569" fontSize="9" fontWeight="600">"Referrals 3.5×</text>
      <text x="80" y="292" fill="#475569" fontSize="9" fontWeight="600">conversion rate"</text>
      <text x="240" y="280" fill="#475569" fontSize="9" fontWeight="600">"Drop-off at</text>
      <text x="240" y="292" fill="#475569" fontSize="9" fontWeight="600">interview stage"</text>
      <text x="400" y="280" fill="#475569" fontSize="9" fontWeight="600">"Compress loop</text>
      <text x="400" y="292" fill="#475569" fontSize="9" fontWeight="600">to 4 rounds"</text>
    </svg>
  ),

  /* Step 5 — Filter scope */
  filter: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">ORG SCOPE FILTERS</text>
      <rect x="200" y="50" width="200" height="38" rx="8" fill="#1e293b" />
      <text x="300" y="73" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Organization</text>
      <line x1="300" y1="88" x2="120" y2="120" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="300" y1="88" x2="300" y2="120" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="300" y1="88" x2="480" y2="120" stroke="#cbd5e1" strokeWidth="2" />
      {[
        { x: 80,  label: "Financial Services", c: "#6366f1" },
        { x: 260, label: "Enterprise Cloud",   c: "#8b5cf6" },
        { x: 440, label: "Data & Analytics",   c: "#10b981" },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={120} width="80" height="32" rx="6" fill="white" stroke={s.c} strokeWidth="2" />
          <text x={s.x + 40} y={140} textAnchor="middle" fill={s.c} fontSize="9" fontWeight="700">{s.label}</text>
          <line x1={s.x + 20} y1={152} x2={s.x + 20} y2={175} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1={s.x + 60} y1={152} x2={s.x + 60} y2={175} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2,2" />
          <rect x={s.x} y={175} width="35" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
          <rect x={s.x + 45} y={175} width="35" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
          <text x={s.x + 17} y={189} textAnchor="middle" fill="#475569" fontSize="7" fontWeight="600">Dept A</text>
          <text x={s.x + 62} y={189} textAnchor="middle" fill="#475569" fontSize="7" fontWeight="600">Dept B</text>
        </g>
      ))}
      <line x1="80" y1="197" x2="80" y2="220" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
      <rect x="60" y="220" width="40" height="18" rx="3" fill="#fef3c7" stroke="#fbbf24" />
      <text x="80" y="232" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="700">Product</text>
      <rect x="60" y="265" width="480" height="40" rx="8" fill="#fffbeb" stroke="#fde68a" />
      <text x="300" y="282" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="700">Filter once at top of page</text>
      <text x="300" y="297" textAnchor="middle" fill="#92400e" fontSize="10">Every dashboard, list, and metric scopes accordingly</text>
    </svg>
  ),

  /* Step 6 — Interview Intelligence */
  interview: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">INTERVIEW INTELLIGENCE</text>
      {[
        { x: 50,  step: "Generate Kit",   icon: "📋", desc: "AI-curated questions" },
        { x: 200, step: "Run Interview",  icon: "🎯", desc: "L1 / L2 / HM rounds" },
        { x: 350, step: "Capture Feedback",icon: "✍️", desc: "Per-round ratings" },
        { x: 500, step: "AI Summary",     icon: "🤖", desc: "Hire / Hold / No Hire" },
      ].map((s, i, arr) => (
        <g key={i}>
          <rect x={s.x - 40} y={70} width="80" height="100" rx="10" fill="white" stroke="#c4b5fd" strokeWidth="2" />
          <text x={s.x} y={108} textAnchor="middle" fontSize="28">{s.icon}</text>
          <text x={s.x} y={138} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="700">{s.step}</text>
          <text x={s.x} y={155} textAnchor="middle" fill="#64748b" fontSize="8">{s.desc}</text>
          {i < arr.length - 1 && <text x={s.x + 75} y={125} textAnchor="middle" fill="#8b5cf6" fontSize="20" fontWeight="800">→</text>}
        </g>
      ))}
      <rect x="60" y="200" width="480" height="100" rx="12" fill="#faf5ff" stroke="#e9d5ff" />
      <text x="80" y="225" fill="#7c3aed" fontSize="11" fontWeight="800">AI cross-checks all rounds and flags inconsistencies</text>
      <text x="80" y="250" fill="#475569" fontSize="10">• Generates focus areas based on candidate gaps + JD</text>
      <text x="80" y="268" fill="#475569" fontSize="10">• Combines feedback from multiple interviewers into one summary</text>
      <text x="80" y="286" fill="#475569" fontSize="10">• Highlights split decisions ("strong in L1, weak in L2")</text>
    </svg>
  ),

  /* Step 7 — Offer Management */
  offers: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">OFFER MANAGEMENT</text>
      <rect x="40" y="60" width="140" height="240" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="110" y="85" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="800">Comp Breakdown</text>
      <line x1="60" y1="95" x2="160" y2="95" stroke="#e2e8f0" />
      <text x="60" y="120" fill="#64748b" fontSize="9">Base</text>
      <text x="160" y="120" textAnchor="end" fill="#1e293b" fontSize="10" fontWeight="700">₹62L</text>
      <text x="60" y="145" fill="#64748b" fontSize="9">Bonus</text>
      <text x="160" y="145" textAnchor="end" fill="#1e293b" fontSize="10" fontWeight="700">₹8L</text>
      <text x="60" y="170" fill="#64748b" fontSize="9">ESOP</text>
      <text x="160" y="170" textAnchor="end" fill="#1e293b" fontSize="10" fontWeight="700">₹45L</text>
      <line x1="60" y1="180" x2="160" y2="180" stroke="#e2e8f0" />
      <text x="60" y="205" fill="#1e293b" fontSize="10" fontWeight="700">Total</text>
      <text x="160" y="205" textAnchor="end" fill="#7c3aed" fontSize="13" fontWeight="800">₹70L</text>
      <rect x="55" y="220" width="110" height="22" rx="4" fill="#ecfdf5" />
      <text x="110" y="234" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="700">✓ Within band</text>
      <text x="110" y="265" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="700">AI Recommended</text>
      <text x="110" y="280" textAnchor="middle" fill="#64748b" fontSize="9">Based on match + tenure</text>

      <rect x="220" y="60" width="160" height="240" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="300" y="85" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="800">Approval Chain</text>
      <line x1="240" y1="95" x2="360" y2="95" stroke="#e2e8f0" />
      {[
        { y: 115, role: "Recruiter",     done: true },
        { y: 145, role: "Hiring Mgr",    done: true },
        { y: 175, role: "Finance",       done: true },
        { y: 205, role: "VP Engineering",done: true },
      ].map((a, i) => (
        <g key={i}>
          <circle cx={245} cy={a.y} r="6" fill={a.done ? "#10b981" : "#cbd5e1"} />
          <text x={258} y={a.y + 3} fill="#475569" fontSize="9">{a.role}</text>
          {a.done && <text x={355} y={a.y + 3} textAnchor="end" fill="#10b981" fontSize="9" fontWeight="700">✓</text>}
        </g>
      ))}
      <rect x="240" y="240" width="120" height="40" rx="6" fill="#fef3c7" stroke="#fbbf24" />
      <text x="300" y="256" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="700">⚠ Awaiting Response</text>
      <text x="300" y="270" textAnchor="middle" fill="#92400e" fontSize="9">Day 3 of 7</text>

      <rect x="420" y="60" width="140" height="240" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="490" y="85" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="800">AI Insights</text>
      <line x1="440" y1="95" x2="540" y2="95" stroke="#e2e8f0" />
      <rect x="430" y="105" width="120" height="55" rx="5" fill="#fff1f2" stroke="#fecdd3" />
      <text x="438" y="121" fill="#be123c" fontSize="9" fontWeight="800">⚠ Risk</text>
      <text x="438" y="138" fill="#475569" fontSize="8">Competing offer</text>
      <text x="438" y="150" fill="#475569" fontSize="8">risk: HIGH</text>
      <rect x="430" y="170" width="120" height="55" rx="5" fill="#ecfdf5" stroke="#a7f3d0" />
      <text x="438" y="186" fill="#065f46" fontSize="9" fontWeight="800">✅ Action</text>
      <text x="438" y="203" fill="#475569" fontSize="8">Personal HM call</text>
      <text x="438" y="215" fill="#475569" fontSize="8">recommended</text>
      <rect x="430" y="235" width="120" height="55" rx="5" fill="#eef2ff" stroke="#c7d2fe" />
      <text x="438" y="251" fill="#4338ca" fontSize="9" fontWeight="800">💡 Insight</text>
      <text x="438" y="268" fill="#475569" fontSize="8">Reference reached</text>
      <text x="438" y="280" fill="#475569" fontSize="8">out unprompted</text>
    </svg>
  ),

  /* Step 8 — Try it map */
  try: () => (
    <svg viewBox="0 0 600 320" className="w-full h-full">
      <text x="300" y="25" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="2">RECOMMENDED DEMO PATH</text>
      {[
        { y: 60,  num: 1, label: "Switch persona to HR Leader", note: "See org-wide funnel metrics" },
        { y: 100, num: 2, label: "Click any Requisition",       note: "Explore the lifecycle view" },
        { y: 140, num: 3, label: "Expand a stage card",         note: "See candidates + AI signals" },
        { y: 180, num: 4, label: "Open a candidate",            note: "Timeline + interview intel" },
        { y: 220, num: 5, label: "Visit Offers tab",            note: "Comp + approval workflow" },
        { y: 260, num: 6, label: "Try the AI Copilot",          note: "Top right · ask anything" },
      ].map((s, i) => (
        <g key={i}>
          <circle cx={70} cy={s.y} r="14" fill="url(#brandGrad)" />
          <text x={70} y={s.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{s.num}</text>
          <text x={100} y={s.y - 2} fill="#1e293b" fontSize="13" fontWeight="700">{s.label}</text>
          <text x={100} y={s.y + 14} fill="#64748b" fontSize="10">{s.note}</text>
          {i < 5 && <line x1={70} y1={s.y + 14} x2={70} y2={s.y + 26} stroke="#c7d2fe" strokeWidth="2" />}
        </g>
      ))}
    </svg>
  ),
};

const TUTORIAL_STEPS = [
  {
    id: "welcome",
    diagram: "overview",
    title: "Welcome to HumAIne",
    subtitle: "AI-powered recruitment for project-driven hiring",
    body: [
      "HumAIne is built for professional services companies — IT services, consultancies, and product builders that hire for specific projects rather than generic roles.",
      "This tutorial walks through the main capabilities in about 3 minutes. You can skip ahead, jump back, or click 'Try it now' on any step to navigate directly to that screen.",
    ],
    bullets: [
      "Seven connected modules covering the full hiring lifecycle",
      "AI signals at every stage — JD generation, candidate matching, interview kits, comp recommendations",
      "Five role-specific views (recruiter, HM, delivery, HR, admin)",
      "Org-wide filtering down to product/department/business unit",
    ],
    cta: null,
  },
  {
    id: "personas",
    diagram: "personas",
    title: "Five personas, one app",
    subtitle: "The same data — but seen through different lenses",
    body: [
      "Different roles need different views of the same hiring data. HumAIne ships with 5 personas, each with its own dashboard, navigation, and prioritised insights.",
      "Use the 'View as' dropdown in the top bar to switch personas any time. Try a few — every screen adapts.",
    ],
    bullets: [
      "Recruiter — full pipeline, alerts, AI scores",
      "Hiring Manager — shortlisted candidates + interview feedback only",
      "Delivery Manager — project staffing risk, time-to-fill, skill gaps",
      "HR Leader — funnel efficiency, source ROI, hiring health metrics",
      "Admin — system configuration, scoring weights, JD templates",
    ],
    cta: { label: "Try Hiring Manager view", action: "persona-hm" },
  },
  {
    id: "lifecycle",
    diagram: "lifecycle",
    title: "Recruitment Lifecycle",
    subtitle: "A unified view of every stage in the funnel",
    body: [
      "Each requisition has its own lifecycle page. Stages are vertically stacked cards — click to expand, drag candidates between stages, or expand all at once.",
      "Each stage card shows three things at a glance: candidate count, AI signals (insights/risks/actions), and conversion rate from the previous stage.",
    ],
    bullets: [
      "Sourced → Screened → Shortlisted → Interviewed → Offered → Hired",
      "Conversion % shows where the funnel breaks down",
      "Pulsing red dots indicate risk-flagged stages",
      "Drag-drop candidates between stages to update status",
    ],
    cta: { label: "Open a Requisition", action: "open-req" },
  },
  {
    id: "ai",
    diagram: "ai",
    title: "AI Insights — three signal types",
    subtitle: "How the AI talks back to you",
    body: [
      "Throughout the app, the AI surfaces three types of signals. Each is colour-coded and contextualised to the screen you're on.",
      "These appear inside stage cards, candidate profiles, offer pages, and the dashboard summary — never as a separate noisy feed.",
    ],
    bullets: [
      "💡 Insight — observations, trends, comparative analysis",
      "⚠️ Risk — flags requiring your attention",
      "✅ Recommendation — suggested next actions, ranked by urgency",
    ],
    cta: null,
  },
  {
    id: "filter",
    diagram: "filter",
    title: "Org-wide filtering",
    subtitle: "Drill from organization to product in one click",
    body: [
      "Real organizations are hierarchical. The filter bar (just below the top navigation) lets any user scope the entire app to a Business Unit, Department, Product, Location, or Cost Center.",
      "Filters are persistent across screens. Active filters show a coloured indicator on every page that's been narrowed.",
    ],
    bullets: [
      "Multi-select per dimension — combine BU + Location for example",
      "Admin can enable/disable each filter dimension globally",
      "Dashboards show 'scope-filtered' badges so users always know what's visible",
      "All metrics, charts, and lists scope automatically",
    ],
    cta: { label: "Try a filter", action: "open-filter-help" },
  },
  {
    id: "interview",
    diagram: "interview",
    title: "Interview Intelligence",
    subtitle: "From kit generation to AI-assisted hire decisions",
    body: [
      "Interview Intelligence runs end-to-end: generate role-specific kits, capture feedback per round, and let AI synthesise the final recommendation.",
      "The AI cross-checks feedback across rounds — if L1 says 'strong hire' and L2 says 'weak technical', the inconsistency is flagged before a decision is made.",
    ],
    bullets: [
      "AI-generated interview kits — questions tailored to the candidate's gaps + JD",
      "Structured feedback forms — Technical / Communication / Problem Solving / Culture",
      "AI summary combines all rounds into Hire / Hold / No Hire with confidence score",
      "Inconsistency detection — flags split decisions automatically",
    ],
    cta: { label: "Open Interviews tab", action: "open-interviews" },
  },
  {
    id: "offers",
    diagram: "offers",
    title: "Offer Management",
    subtitle: "Where most hiring deals quietly break down",
    body: [
      "Once a candidate is shortlisted for an offer, HumAIne handles comp recommendations, multi-stage approval workflows, and competing-offer risk tracking — all in one place.",
      "The lifecycle view shows a small offer status link under each Offered-stage candidate. Click it to deep-link straight into the full offer detail.",
    ],
    bullets: [
      "AI-recommended compensation based on match score + market band",
      "4-step approval chain: Recruiter → HM → Finance → VP",
      "Response deadline tracking with risk callouts",
      "Competing offer detection (LinkedIn signals, reference notes)",
      "Offer revision history with full audit trail",
    ],
    cta: { label: "Open Offers tab", action: "open-offers" },
  },
  {
    id: "try",
    diagram: "try",
    title: "Recommended demo path",
    subtitle: "A 5-minute tour that shows the breadth of the platform",
    body: [
      "If you have just a few minutes to explore, here's the path I'd recommend. Each step shows off a different capability and they connect into a coherent story.",
      "Feedback is welcome — use the AI Copilot button (top right) to ask the app anything, or just click around. Nothing is destructive — refresh the page to reset.",
    ],
    bullets: null,
    cta: { label: "Start exploring", action: "close" },
  },
];

const Tutorial = ({ open, onClose, onAction }) => {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const current = TUTORIAL_STEPS[step];
  const Diagram = TutorialDiagrams[current.diagram];

  // Reset to step 0 when reopened
  useEffect(() => { if (open) setStep(0); }, [open]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && step < total - 1) setStep(step + 1);
      else if (e.key === "ArrowLeft"  && step > 0) setStep(step - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, step, total, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[640px] flex overflow-hidden border border-slate-200">

        {/* LEFT — step navigator */}
        <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col">
          <div className="px-5 py-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-none">Tutorial</div>
                <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">Step {step + 1} of {total}</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {TUTORIAL_STEPS.map((s, i) => {
              const isActive = i === step;
              const isPast = i < step;
              return (
                <button key={s.id} onClick={() => setStep(i)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition ${
                    isActive ? "bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/10 border border-indigo-500/30 text-white"
                    : isPast ? "text-slate-300 hover:bg-slate-800/60"
                    : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
                    : isPast ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-400"
                  }`}>
                    {isPast ? "✓" : i + 1}
                  </span>
                  <span className="font-medium leading-tight pt-0.5">{s.title}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-800/80">
            <div className="flex gap-1 mb-2">
              {TUTORIAL_STEPS.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition ${i <= step ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500" : "bg-slate-800"}`} />
              ))}
            </div>
            <div className="text-[10px] text-slate-500 text-center">Use ← / → to navigate</div>
          </div>
        </aside>

        {/* RIGHT — content */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-slate-50 min-w-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">{current.subtitle}</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{current.title}</div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Diagram */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm" style={{ height: 320 }}>
              <Diagram />
            </div>

            {/* Body */}
            <div className="space-y-3">
              {current.body.map((p, i) => (
                <p key={i} className="text-sm text-slate-700 leading-relaxed">{p}</p>
              ))}
            </div>

            {/* Bullets */}
            {current.bullets && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer — prev / next + CTA */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ChevronRight className="w-4 h-4 rotate-180" />Previous
            </button>

            <div className="flex items-center gap-2">
              {current.cta && (
                <button onClick={() => onAction(current.cta.action)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition">
                  <Zap className="w-3.5 h-3.5" />{current.cta.label}
                </button>
              )}

              {step < total - 1 ? (
                <button onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition">
                  Next<ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition">
                  <Check className="w-4 h-4" />Start Exploring
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PERSONA-AWARE TOPBAR — includes View As toggle
   ============================================================ */
const TopBar = ({ onCopilot, onTutorial, persona, onPersonaChange }) => (
  <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-30">
    <div className="flex items-center gap-3 flex-1 max-w-md">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search candidates, requisitions..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <ViewAsToggle persona={persona} onChange={onPersonaChange} />
      <button onClick={onTutorial} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 text-sm font-semibold transition group">
        <BookOpen className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700" />Tutorial
      </button>
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
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Welcome back, Riya</div>
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
const RequisitionsList = ({ requisitions, onOpen, onNav }) => {
  const { filters } = useOrgFilters();
  const filterCount = countActiveFilters(filters);
  return (
  <div className="p-8 space-y-6">
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Requisitions</h1>
        <div className="text-sm text-slate-500 mt-1">
          {requisitions.length} total · {requisitions.filter(r => r.status === "Active").length} active
          {filterCount > 0 && <span className="text-indigo-600 font-semibold"> · scope-filtered</span>}
        </div>
      </div>
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
};

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

/* ---------- REQUISITION DETAIL — redesigned pipeline view ---------- */

/* ---------- REQUISITION DETAIL — unified stage cards ---------- */
const RequisitionDetail = ({ req, candidates, onBack, onUpdateCandidate, onOpenCandidate, onOpenOffer }) => {
  const reqCandidates = candidates.filter(c => c.reqId === req.id);
  const [openStages, setOpenStages]     = useState(["Interviewed", "Offered"]);
  const [expandedInsights, setExpandedInsights] = useState({});
  const [draggedId, setDraggedId]       = useState(null);
  const [dragOver, setDragOver]         = useState(null);

  const toggleStage  = (s) => setOpenStages(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const expandAll    = () => setOpenStages([...stageOrder]);
  const collapseAll  = () => setOpenStages([]);
  const toggleInsight = (k) => setExpandedInsights(p => ({ ...p, [k]: !p[k] }));

  const convRate = (idx) => {
    if (idx === 0) return null;
    const prev = reqCandidates.filter(c => c.stage === stageOrder[idx - 1]).length;
    const curr = reqCandidates.filter(c => c.stage === stageOrder[idx]).length;
    const tot  = prev + curr;
    return tot === 0 ? 0 : Math.round((curr / tot) * 100);
  };

  /* Left-border accent only — keeps page restrained */
  const accent = {
    Sourced:     { border: "border-l-slate-400",   dot: "bg-slate-400",   candBadge: "bg-slate-100 text-slate-600" },
    Screened:    { border: "border-l-slate-500",   dot: "bg-slate-500",   candBadge: "bg-slate-100 text-slate-600" },
    Shortlisted: { border: "border-l-indigo-400",  dot: "bg-indigo-400",  candBadge: "bg-indigo-50 text-indigo-700" },
    Interviewed: { border: "border-l-violet-500",  dot: "bg-violet-500",  candBadge: "bg-violet-50 text-violet-700" },
    Offered:     { border: "border-l-amber-500",   dot: "bg-amber-500",   candBadge: "bg-amber-50 text-amber-700" },
    Hired:       { border: "border-l-emerald-500", dot: "bg-emerald-500", candBadge: "bg-emerald-50 text-emerald-700" },
  };

  const signalIcon  = { insight: "💡", risk: "⚠️", recommendation: "✅" };
  const signalLabel = { insight: "Insight", risk: "Risk", recommendation: "Action" };
  const signalStyle = {
    insight:        "bg-slate-50 border-slate-200 text-slate-700",
    risk:           "bg-rose-50 border-rose-200 text-rose-700",
    recommendation: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  const signalBadge = {
    insight:        "bg-slate-100 text-slate-600",
    risk:           "bg-rose-100 text-rose-700",
    recommendation: "bg-emerald-100 text-emerald-700",
  };

  const sourced = req.sourced;

  return (
    <div className="p-8 max-w-5xl space-y-8">

      {/* Back */}
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ChevronRight className="w-4 h-4 rotate-180" />Back to requisitions
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone={req.status === "Active" ? "emerald" : "default"}>{req.status}</Pill>
            <Pill tone={req.priority === "Critical" ? "rose" : req.priority === "High" ? "amber" : "default"}>{req.priority}</Pill>
            <span className="text-xs text-slate-400">REQ-{req.id.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{req.title}</h1>
          <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{req.project}</span><span className="text-slate-300">·</span>
            <span>{req.expRange}</span><span className="text-slate-300">·</span>
            <span>{req.budget}</span><span className="text-slate-300">·</span>
            <span>{req.daysOpen} days open</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {req.skills.map(s => (
              <span key={s} className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">{s}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <GradientButton variant="secondary" icon={Edit3}>Edit JD</GradientButton>
          <GradientButton icon={Users}>Source More</GradientButton>
        </div>
      </div>

      {/* AI Hiring Summary */}
      <AiHiringSummary req={req} showInsights onToggle={() => {}} />

      {/* Pipeline section */}
      <div>
        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recruitment Lifecycle</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {reqCandidates.length} candidates across {stageOrder.length} stages · expand any stage to view candidates &amp; AI signals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={expandAll}   className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition">Expand all</button>
            <button onClick={collapseAll} className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">Collapse all</button>
          </div>
        </div>

        {/* Funnel progress bar */}
        <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-5">
          {stageOrder.map((stage, i) => {
            const cnt = reqCandidates.filter(c => c.stage === stage).length;
            const pct = (cnt / Math.max(1, sourced)) * 100;
            const colors = ["bg-slate-300","bg-slate-400","bg-indigo-400","bg-violet-500","bg-amber-400","bg-emerald-500"];
            return pct > 0 ? <div key={stage} className={`h-full ${colors[i]}`} style={{ width: `${pct}%` }} title={`${stage}: ${cnt}`} /> : null;
          })}
        </div>

        {/* Stage cards */}
        <div className="space-y-2">
          {stageOrder.map((stage, stageIdx) => {
            const stageCands   = reqCandidates.filter(c => c.stage === stage);
            const count        = stageCands.length;
            const insights     = stageInsights[stage] || [];
            const riskCount    = insights.filter(i => i.type === "risk").length;
            const totalSignals = insights.length;
            const isOpen       = openStages.includes(stage);
            const acc          = accent[stage];
            const rate         = convRate(stageIdx);
            const hasRisk      = riskCount > 0;

            return (
              <div
                key={stage}
                onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => { if (draggedId) onUpdateCandidate(draggedId, { stage }); setDraggedId(null); setDragOver(null); }}
                className={`rounded-xl border border-slate-200 border-l-4 bg-white transition-all
                  ${acc.border}
                  ${dragOver === stage ? "ring-2 ring-indigo-300 shadow-md" : ""}
                `}
              >
                {/* ── Card header — always visible ── */}
                <button
                  onClick={() => toggleStage(stage)}
                  className="w-full flex items-center gap-0 px-5 py-4 text-left hover:bg-slate-50/60 transition rounded-xl"
                >
                  {/* Dot + stage name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${acc.dot}`} />
                    <span className="font-semibold text-slate-900 text-sm">{stage}</span>
                    {hasRisk && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />}
                  </div>

                  {/* Metrics row */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Candidate count */}
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${count > 0 ? acc.candBadge : "bg-slate-100 text-slate-400"}`}>
                      <Users className="w-3 h-3" />
                      {count} {count === 1 ? "candidate" : "candidates"}
                    </span>

                    {/* Divider */}
                    {totalSignals > 0 && <span className="w-px h-4 bg-slate-200 shrink-0" />}

                    {/* AI signals — breakdown by type */}
                    {totalSignals > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                        <span className="font-medium">{totalSignals} AI signal{totalSignals > 1 ? "s" : ""}</span>
                        {riskCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            {riskCount} risk{riskCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </span>
                    )}

                    {/* Divider */}
                    {rate !== null && <span className="w-px h-4 bg-slate-200 shrink-0" />}

                    {/* Conversion */}
                    {rate !== null && (
                      <span className={`text-xs font-semibold tabular-nums ${rate < 40 ? "text-rose-500" : rate < 70 ? "text-amber-500" : "text-emerald-600"}`}>
                        {rate}% conv.
                      </span>
                    )}

                    <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* ── Expanded body ── */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    <div className="grid grid-cols-2 divide-x divide-slate-100">

                      {/* LEFT — Candidates */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidates</span>
                          {count > 0 && (
                            <span className="text-[10px] text-slate-400">sorted by match</span>
                          )}
                        </div>
                        {count === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">No candidates here yet. Drag a row in from another stage.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {[...stageCands].sort((a, b) => b.match - a.match).map(cand => (
                              <div key={cand.id}>
                                <div
                                  draggable
                                  onDragStart={() => setDraggedId(cand.id)}
                                  onClick={() => onOpenCandidate(cand.id)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition group"
                                >
                                  {/* Avatar */}
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${cand.match >= 90 ? "bg-emerald-500" : cand.match >= 80 ? "bg-indigo-500" : "bg-slate-400"}`}>
                                    {cand.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  {/* Name + meta */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 truncate">{cand.name}</div>
                                    <div className="text-xs text-slate-400 truncate">{cand.exp} yrs · {cand.source}</div>
                                  </div>
                                  {/* Score */}
                                  <div className="shrink-0 flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-700 tabular-nums w-8 text-right">{cand.match}%</span>
                                    <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${cand.match >= 90 ? "bg-emerald-500" : cand.match >= 80 ? "bg-indigo-400" : "bg-slate-400"}`}
                                        style={{ width: `${cand.match}%` }}
                                      />
                                    </div>
                                  </div>
                                  <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                                </div>
                                {/* Inline offer status — only for Offered stage candidates with active offers */}
                                {stage === "Offered" && getOfferRecord(cand.id) && onOpenOffer && (
                                  <OfferStatusPanel candidate={cand} onOpenOffer={onOpenOffer} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* RIGHT — AI Insights */}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Signals</span>
                        </div>

                        {insights.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">No signals for this stage.</p>
                        ) : (
                          <div className="space-y-2">
                            {insights.map((insight, ii) => {
                              const key    = `${stage}-${ii}`;
                              const isExpanded = expandedInsights[key];
                              const sStyle = signalStyle[insight.type] || signalStyle.insight;
                              const sBadge = signalBadge[insight.type] || signalBadge.insight;

                              return (
                                <div key={ii} className={`rounded-lg border ${sStyle} overflow-hidden`}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleInsight(key); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:brightness-95 transition"
                                  >
                                    <span className="text-sm shrink-0">{signalIcon[insight.type]}</span>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${sBadge}`}>
                                        {signalLabel[insight.type]}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-800 truncate">{insight.label}</span>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                  {isExpanded && (
                                    <div className="px-3 pb-3 pt-1 border-t border-current border-opacity-10">
                                      <p className="text-xs text-slate-700 leading-relaxed">{insight.text}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* JD + Source Mix */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Job Description</h2>
          <div className="prose prose-sm max-w-none text-slate-700">
            <p><strong>Role overview:</strong> We're hiring a {req.title} for the {req.project} initiative — a critical multi-year program modernizing core platform infrastructure for an enterprise client.</p>
            <p className="mt-3"><strong>What you'll do:</strong> Own end-to-end feature delivery across the stack. Partner with architects and the client's product team. Contribute to technical design reviews and mentor 1–2 mid-level engineers.</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Required</div>
                <div className="flex flex-wrap gap-1.5">{req.skills.map(s => <Pill key={s} tone="emerald">{s}</Pill>)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Good to have</div>
                <div className="flex flex-wrap gap-1.5">
                  <Pill tone="sky">GraphQL</Pill><Pill tone="sky">Kafka</Pill><Pill tone="sky">Docker</Pill><Pill tone="sky">Domain expertise</Pill>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Source Mix</h2>
          <div className="space-y-3">
            {[
              { name: "LinkedIn",   pct: 48 },
              { name: "Referrals",  pct: 24 },
              { name: "Naukri",     pct: 18 },
              { name: "Internal DB",pct: 10 },
            ].map(s => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="font-bold text-slate-900">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
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
      { stage: "Screened",    status: "completed", date: "Apr 20, 2025", time: "2:30 PM",  actor: "Riya K · Recruiter", aiNote: "30-min intro call. Excellent communication — structured, concise, asked sharp questions about the platform. Confirmed TypeScript comfort and open to Bangalore HQ. Comp expectation within band.", sentiment: "positive", tags: ["Communication: 9.2/10", "Comp aligned"] },
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
      { stage: "Screened",    status: "completed", date: "Apr 17, 2025", time: "4:00 PM",  actor: "Riya K · Recruiter",  aiNote: "Strong screen. Marcus communicates with precision — detailed answers, good at tradeoff reasoning. Raised comp expectation: ₹55L target vs band ceiling of ₹50L. Flagged for HM review before proceeding.", sentiment: "warning", tags: ["Comp gap: ₹5L", "Communication: 8.8/10"] },
      { stage: "Shortlisted", status: "active",    date: "Apr 23, 2025", time: "10:00 AM", actor: "Riya K + HM consensus", aiNote: "HM reviewed profile and approved to proceed despite comp gap — role impact justifies stretching band. Awaiting interview scheduling. Note: Marcus mentioned a competing offer from Atlassian. Prioritise scheduling.", sentiment: "warning", tags: ["Competing offer", "Band stretch approved"] },
      { stage: "Interviewed", status: "upcoming",  date: "May 3, 2025",  time: "3:00 PM",  actor: "Ankit S (scheduled)", aiNote: "System design round booked. HM personally requested to observe. Candidate confirmed availability.", sentiment: "neutral", tags: ["Scheduled: May 3"] },
      { stage: "Offered",     status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "Pending interview outcome. Comp negotiation likely required.", sentiment: "neutral", tags: [] },
      { stage: "Decision",    status: "upcoming",  date: "—", time: "—", actor: "—", aiNote: "No data yet.", sentiment: "neutral", tags: [] },
    ],
  },
  "c-6": { // Nina Patel — Offered (top candidate)
    currentStage: "Offered",
    events: [
      { stage: "Sourced",     status: "completed", date: "Apr 10, 2025", time: "9:45 AM",  actor: "AI — Internal DB",    aiNote: "Surfaced from internal database — Nina applied 8 months ago for a different role and was held. Reactivated for Apex Banking. Match score 96% — highest in the entire pipeline.", sentiment: "positive", tags: ["Internal DB", "96% match — #1 in pipeline"] },
      { stage: "Screened",    status: "completed", date: "Apr 12, 2025", time: "11:00 AM", actor: "Riya K · Recruiter",  aiNote: "Outstanding intro call. Nina had already researched the Apex Banking project context from public sources. Communication score 9.4 — best in this cohort. Confirmed comp alignment and 30-day notice period.", sentiment: "positive", tags: ["Communication: 9.4/10", "Notice: 30 days"] },
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
      { stage: "Screened",    status: "completed", date: "Mar 30, 2025", time: "1:00 PM",  actor: "Riya K · Recruiter",  aiNote: "Excellent screen. Sara communicates as clearly in writing as verbally — sent a follow-up summary email within an hour of the call. Strong on async collaboration signals. Comp fully aligned.", sentiment: "positive", tags: ["Communication: 9.1/10", "Async-strong"] },
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
      { stage: "Screened",    status: "skipped",   date: "—", time: "—", actor: "Riya K · Recruiter",  aiNote: "Recruiter reviewed profile and decided not to screen. Reasons: 4 yrs experience (below 5yr floor), agency-only background, no TypeScript exposure. Marked as 'Reject — experience floor'.", sentiment: "negative", tags: ["Not screened", "Below exp floor"] },
      { stage: "Shortlisted", status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Interviewed", status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Offered",     status: "skipped",   date: "—", time: "—", actor: "—", aiNote: "Not reached.", sentiment: "neutral", tags: [] },
      { stage: "Decision",    status: "completed", date: "Apr 26, 2025", time: "9:00 AM",  actor: "Riya K · Recruiter",  aiNote: "Candidate rejected at sourcing stage. Feedback: experience below floor, stack mismatch (MongoDB vs PostgreSQL), agency-only background doesn't meet enterprise project requirements. Archived.", sentiment: "negative", tags: ["Rejected at source", "Archived"] },
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
      { stage: "Screened",    status: stageIndex >= 1 ? "completed" : stageIndex === 0 ? "upcoming" : "skipped", date: stageIndex >= 1 ? "Apr 5, 2025" : "—", time: stageIndex >= 1 ? "2:00 PM" : "—", actor: "Riya K · Recruiter", aiNote: stageIndex >= 1 ? `Intro screen completed. ${candidate.gaps[0] ? `Note: ${candidate.gaps[0]}.` : "No major concerns."} Communication score: ${candidate.commScore}/10.` : "Not yet reached.", sentiment: stageIndex >= 1 ? (candidate.commScore >= 8.5 ? "positive" : "warning") : "neutral", tags: stageIndex >= 1 ? [`Comm: ${candidate.commScore}/10`] : [] },
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
const CandidateDetail = ({ candidate, onBack, onScreen, onOpenKit, onOpenFeedback }) => {
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

      {/* ═══ INTERVIEW INTELLIGENCE PANEL ═══ */}
      <Card className="p-6">
        <InterviewIntelligencePanel
          candidate={candidate}
          onOpenKit={onOpenKit || (() => {})}
          onOpenFeedback={onOpenFeedback || (() => {})}
        />
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
    { key: "filters", label: "Filter Dimensions", icon: Filter },
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

      {tab === "filters" && <FilterDimensionsAdmin />}
    </div>
  );
};

/* ---------- FILTER DIMENSIONS ADMIN PANEL ---------- */
const FilterDimensionsAdmin = () => {
  const ctx = useContext(OrgFilterContext);
  if (!ctx) return null;
  const { dimensions, setDimensions } = ctx;
  const [editingDim, setEditingDim] = useState(null);
  const [newValue, setNewValue] = useState("");

  const toggleDim = (key) => {
    setDimensions(dimensions.map(d => d.key === key ? { ...d, enabled: !d.enabled } : d));
  };

  const removeValue = (dimKey, val) => {
    setDimensions(dimensions.map(d => d.key === dimKey ? { ...d, values: d.values.filter(v => v !== val) } : d));
  };

  const addValue = (dimKey) => {
    if (!newValue.trim()) return;
    setDimensions(dimensions.map(d => d.key === dimKey ? { ...d, values: [...d.values, newValue.trim()] } : d));
    setNewValue("");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="font-bold text-slate-900">Filter Dimensions</h2>
          <div className="text-xs text-slate-500 mt-0.5">Configure org-level filter dimensions used across dashboards & lifecycles.</div>
        </div>
        <Pill tone="indigo">{dimensions.filter(d => d.enabled).length} of {dimensions.length} active</Pill>
      </div>

      <div className="mt-5 mb-4 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 text-xs text-slate-700">
        <strong>How filters work:</strong> When users set filters in the bar at the top of every page, all data on dashboards, requisition lists, candidate views, and offers will be filtered to match. In production, dimension values would sync from your HRIS / org directory.
      </div>

      <div className="space-y-3">
        {dimensions.map(dim => {
          const Icon = iconMap[dim.icon] || Filter;
          const isEditing = editingDim === dim.key;
          return (
            <div key={dim.key} className={`rounded-xl border ${dim.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/40"}`}>
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${dim.enabled ? "bg-gradient-to-br from-indigo-500 to-violet-500" : "bg-slate-200"}`}>
                  <Icon className={`w-4 h-4 ${dim.enabled ? "text-white" : "text-slate-400"}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${dim.enabled ? "text-slate-900" : "text-slate-500"}`}>{dim.label}</div>
                  <div className="text-[11px] text-slate-400">{dim.values.length} value{dim.values.length !== 1 ? "s" : ""} · key: <code className="bg-slate-100 px-1 rounded">{dim.key}</code></div>
                </div>
                <button
                  onClick={() => setEditingDim(isEditing ? null : dim.key)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded transition"
                >
                  {isEditing ? "Done" : "Edit values"}
                </button>
                <button
                  onClick={() => toggleDim(dim.key)}
                  className={`relative w-11 h-6 rounded-full transition shrink-0 ${dim.enabled ? "bg-indigo-600" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${dim.enabled ? "translate-x-5" : ""}`} />
                </button>
              </div>

              {/* Values editor */}
              {isEditing && (
                <div className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dim.values.map(v => (
                      <span key={v} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {v}
                        <button onClick={() => removeValue(dim.key, v)} className="hover:text-rose-600 transition">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {dim.values.length === 0 && <span className="text-xs text-slate-400 italic">No values yet — add one below.</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addValue(dim.key)}
                      placeholder={`Add a new ${dim.label.toLowerCase()} value...`}
                      className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button onClick={() => addValue(dim.key)} className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-xl border border-dashed border-slate-300 text-center">
        <p className="text-xs text-slate-500">
          <strong>Tip:</strong> Toggle dimensions off here to hide them from the filter bar without deleting their values.
        </p>
      </div>
    </Card>
  );
};

/* ---------- COPILOT DRAWER ---------- */
const CopilotDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi Riya — I'm your recruiting copilot. Ask about candidates, funnels, or sourcing performance." }]);
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
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Auto-open tutorial on first visit
  useEffect(() => {
    try {
      const seen = window.localStorage.getItem("humaine_tutorial_seen");
      if (!seen) setTutorialOpen(true);
    } catch (e) { /* localStorage unavailable — silently skip */ }
  }, []);

  const closeTutorial = () => {
    setTutorialOpen(false);
    try { window.localStorage.setItem("humaine_tutorial_seen", "1"); } catch (e) {}
  };

  // Tutorial CTA actions — deep-link into the matching screen
  const handleTutorialAction = (action) => {
    if (action === "persona-hm")        { setPersona("hiringManager"); setView({ name: "dashboard" }); closeTutorial(); }
    else if (action === "open-req")     { setView({ name: "requisitions" }); closeTutorial(); }
    else if (action === "open-interviews") { setView({ name: "interviews" }); closeTutorial(); }
    else if (action === "open-offers")  { setView({ name: "offers" }); closeTutorial(); }
    else if (action === "open-filter-help") { closeTutorial(); /* filter bar is always visible */ }
    else if (action === "close")        { closeTutorial(); }
  };

  // ── Org filter state ──
  const [filterDimensions, setFilterDimensions] = useState(DEFAULT_FILTER_DIMENSIONS);
  const [orgFilters, setOrgFilters] = useState({}); // { bu: [...], department: [...], ... }

  // Filter dataset based on active org filters — memoised so child screens get stable refs
  const filteredRequisitions = useMemo(
    () => applyOrgFilters(requisitions, orgFilters),
    [requisitions, orgFilters]
  );
  const filteredCandidates = useMemo(
    () => applyOrgFiltersToCandidates(candidates, requisitions, orgFilters),
    [candidates, requisitions, orgFilters]
  );

  const updateCandidate = (id, patch) => setCandidates((prev) => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  const currentCandidate = view.candidateId ? candidates.find(c => c.id === view.candidateId) : null;
  const currentReq = view.reqId ? requisitions.find(r => r.id === view.reqId) : null;

  const nav = (name) => setView({ name });

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    setView({ name: "dashboard" });
  };

  // Interview navigation helpers — open kit or feedback from anywhere
  const openInterviewKit = (cand) => setView({ name: "interview-kit", candidateId: cand.id, from: view.name, reqId: view.reqId });
  const openInterviewFeedback = (cand) => setView({ name: "interview-feedback", candidateId: cand.id, from: view.name, reqId: view.reqId });

  // Offer navigation helpers
  const openOfferDetail = (offerId) => setView({ name: "offer-detail", offerId, from: view.name, reqId: view.reqId, candidateId: view.candidateId });
  const openNewOffer    = (cand)    => setView({ name: "new-offer", candidateId: cand.id, from: view.name, reqId: view.reqId });

  const sidebarActive =
    view.name === "req-detail"   ? "requisitions" :
    view.name === "candidate" && view.from === "interviews" ? "interviews" :
    view.name === "candidate" && view.from === "offers" ? "offers" :
    view.name === "candidate" && view.from !== "screening-hub" ? "sourcing" :
    view.name === "candidate" && view.from === "screening-hub" ? "screening-hub" :
    view.name === "screening"    ? "screening-hub" :
    view.name === "interview-kit" || view.name === "interview-feedback" ? "interviews" :
    view.name === "offer-detail" || view.name === "new-offer" ? "offers" :
    view.name;

  const renderDashboard = () => {
    switch (persona) {
      case "hiringManager":  return <HiringManagerDashboard  candidates={filteredCandidates} onOpenReq={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} onOpenKit={openInterviewKit} onOpenFeedback={openInterviewFeedback} />;
      case "deliveryManager":return <DeliveryManagerDashboard />;
      case "hrLeader":       return <HRLeaderDashboard />;
      case "admin":          return <AdminDashboard onNav={nav} />;
      default:               return <RecruiterDashboard requisitions={filteredRequisitions} candidates={filteredCandidates} onOpenReq={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />;
    }
  };

  return (
    <PersonaContext.Provider value={persona}>
      <OrgFilterContext.Provider value={{ filters: orgFilters, dimensions: filterDimensions, setFilters: setOrgFilters, setDimensions: setFilterDimensions }}>
        <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          <Sidebar active={sidebarActive} onNav={nav} persona={persona} />
          <main className="flex-1 flex flex-col min-w-0" style={{ transition: "margin-left 220ms cubic-bezier(0.4,0,0.2,1)" }}>
            <TopBar onCopilot={() => setCopilotOpen(true)} onTutorial={() => setTutorialOpen(true)} persona={persona} onPersonaChange={handlePersonaChange} />
            <PersonaBanner persona={persona} />
            <OrgFilterBar dimensions={filterDimensions} filters={orgFilters} onChange={setOrgFilters} />
            <div className="flex-1">
              {view.name === "dashboard"    && renderDashboard()}
              {view.name === "requisitions" && <RequisitionsList requisitions={filteredRequisitions} onOpen={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />}
              {view.name === "req-detail"   && currentReq && <RequisitionDetail req={currentReq} candidates={candidates} onBack={() => nav("requisitions")} onUpdateCandidate={updateCandidate} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "req-detail", reqId: view.reqId })} onOpenOffer={openOfferDetail} />}
              {view.name === "jd-generator" && <JDGenerator onCreate={() => nav("requisitions")} />}
              {view.name === "sourcing"     && <Sourcing requisitions={filteredRequisitions} candidates={filteredCandidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "sourcing" })} />}
              {view.name === "interviews"   && <InterviewHub candidates={filteredCandidates} requisitions={filteredRequisitions} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "interviews" })} setView={setView} />}
              {view.name === "offers"       && <OffersHub candidates={filteredCandidates} requisitions={filteredRequisitions} setView={setView} />}
              {view.name === "offer-detail" && (() => {
              const offer = Object.values(offerRecords).find(o => o.id === view.offerId);
              if (!offer) return null;
              const cand = candidates.find(c => c.id === offer.candidateId);
              const req  = requisitions.find(r => r.id === offer.reqId);
              return <OfferDetail offer={offer} candidate={cand} req={req}
                onBack={() => view.from === "req-detail" ? setView({ name: "req-detail", reqId: view.reqId }) : view.from === "candidate" ? setView({ name: "candidate", candidateId: view.candidateId, from: "offers", reqId: view.reqId }) : nav("offers")}
                onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "offers" })}
                onUpdateStatus={() => {}} />;
            })()}
            {view.name === "new-offer"    && currentCandidate && (
              <NewOfferForm
                candidate={currentCandidate}
                req={requisitions.find(r => r.id === currentCandidate.reqId)}
                onBack={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })}
                onSubmit={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })}
              />
            )}
            {view.name === "interview-kit" && currentCandidate && (
              <div className="p-8 max-w-5xl">
                <button onClick={() => view.from ? setView({ name: view.from, candidateId: view.candidateId, reqId: view.reqId }) : nav("interviews")} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-6"><ChevronRight className="w-4 h-4 rotate-180" />Back</button>
                <InterviewKit candidate={currentCandidate} onBack={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} onAddFeedback={() => openInterviewFeedback(currentCandidate)} />
              </div>
            )}
            {view.name === "interview-feedback" && currentCandidate && (
              <div className="p-8 max-w-3xl">
                <button onClick={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-6"><ChevronRight className="w-4 h-4 rotate-180" />Back</button>
                <FeedbackForm candidate={currentCandidate} round={null} onSubmit={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} onBack={() => setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} />
              </div>
            )}
            {view.name === "screening-hub"&& <ScreeningHub candidates={filteredCandidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "screening-hub" })} onStartScreening={(id) => setView({ name: "screening", candidateId: id, from: "screening-hub" })} />}
            {view.name === "candidate"    && currentCandidate && <CandidateDetail candidate={currentCandidate} onBack={() => { if (view.from === "req-detail") setView({ name: "req-detail", reqId: view.reqId }); else if (view.from === "screening-hub") nav("screening-hub"); else if (view.from === "interviews") nav("interviews"); else if (view.from === "offers") nav("offers"); else nav("sourcing"); }} onScreen={() => setView({ name: "screening", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} onOpenKit={openInterviewKit} onOpenFeedback={openInterviewFeedback} />}
            {view.name === "screening"    && currentCandidate && <Screening candidate={currentCandidate} onBack={() => { if (view.from === "screening-hub") nav("screening-hub"); else setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId }); }} />}
            {view.name === "admin"        && <Admin />}
          </div>
        </main>
        <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} />
        <Tutorial open={tutorialOpen} onClose={closeTutorial} onAction={handleTutorialAction} />
      </div>
    </OrgFilterContext.Provider>
    </PersonaContext.Provider>
  );
}

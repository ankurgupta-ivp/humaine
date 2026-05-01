import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, Sparkles, Users, FileSearch, MessageSquare,
  Settings, Search, Bell, ChevronRight, Plus, X, Check, Filter,
  TrendingUp, Target, Zap, Brain, Send, Bot, Star, MapPin,
  ArrowUpRight, Linkedin, Database, UserPlus,
  Award, AlertCircle, ThumbsUp, ThumbsDown, Pause, GripVertical, Trash2,
  Edit3, Save, Sliders, Layers, FileText, Clock
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
const Sidebar = ({ active, onNav }) => {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requisitions", label: "Requisitions", icon: Briefcase },
    { key: "jd-generator", label: "JD Generator", icon: Sparkles, badge: "AI" },
    { key: "sourcing", label: "Sourcing", icon: Users },
    { key: "screening-hub", label: "Screening", icon: MessageSquare, badge: "AI" },
    { key: "admin", label: "Admin", icon: Settings },
  ];
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
      <nav className="flex-1 px-3 py-4 space-y-0.5">
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

/* ---------- TOPBAR ---------- */
const TopBar = ({ onCopilot }) => (
  <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-30">
    <div className="flex items-center gap-3 flex-1 max-w-xl">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search candidates, requisitions, projects..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" />
      </div>
    </div>
    <div className="flex items-center gap-2">
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

/* ---------- REQUISITION DETAIL (kanban + drag-drop pipeline) ---------- */
const RequisitionDetail = ({ req, candidates, onBack, onUpdateCandidate, onOpenCandidate }) => {
  const reqCandidates = candidates.filter(c => c.reqId === req.id);
  const [draggedId, setDraggedId] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const stageColors = {
    Sourced: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500" },
    Screened: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
    Shortlisted: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", dot: "bg-fuchsia-500" },
    Interviewed: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", dot: "bg-pink-500" },
    Offered: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    Hired: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  };

  return (
    <div className="p-8 space-y-6">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" />Back to requisitions</button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2"><Pill tone={req.status === "Active" ? "emerald" : "default"}>{req.status}</Pill><Pill tone={req.priority === "Critical" ? "rose" : req.priority === "High" ? "amber" : "default"}>{req.priority}</Pill><span className="text-xs text-slate-400">REQ-{req.id.toUpperCase()}</span></div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{req.title}</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center gap-3"><span>{req.project}</span><span>·</span><span>{req.expRange}</span><span>·</span><span>{req.budget}</span><span>·</span><span>{req.daysOpen} days open</span></div>
        </div>
        <div className="flex gap-2"><GradientButton variant="secondary" icon={Edit3}>Edit JD</GradientButton><GradientButton icon={Users}>Source More</GradientButton></div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {stageOrder.map((stage) => {
          const count = reqCandidates.filter(c => c.stage === stage).length;
          const c = stageColors[stage];
          return (
            <Card key={stage} className="p-4">
              <div className="flex items-center gap-2 mb-1"><span className={`w-2 h-2 rounded-full ${c.dot}`} /><span className="text-xs font-medium text-slate-600">{stage}</span></div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{count}</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-400" /><h2 className="text-lg font-bold text-slate-900">Pipeline</h2></div>
          <div className="text-xs text-slate-500">Drag candidates across stages</div>
        </div>
        <div className="grid grid-cols-6 gap-3 mt-4">
          {stageOrder.map((stage) => {
            const c = stageColors[stage];
            const stageCandidates = reqCandidates.filter(x => x.stage === stage);
            return (
              <div key={stage} onDragOver={(e) => { e.preventDefault(); setDraggedOver(stage); }} onDragLeave={() => setDraggedOver(null)} onDrop={() => { if (draggedId) onUpdateCandidate(draggedId, { stage }); setDraggedId(null); setDraggedOver(null); }} className={`min-h-[400px] rounded-xl border-2 border-dashed transition-all p-2 ${draggedOver === stage ? "border-indigo-400 bg-indigo-50/50" : `${c.border} ${c.bg}/40`}`}>
                <div className="flex items-center justify-between px-2 py-1.5 mb-2"><span className={`text-xs font-bold ${c.text} uppercase tracking-wider`}>{stage}</span><span className={`text-xs font-bold ${c.text} bg-white px-1.5 rounded`}>{stageCandidates.length}</span></div>
                <div className="space-y-2">
                  {stageCandidates.map((cand) => (
                    <div key={cand.id} draggable onDragStart={() => setDraggedId(cand.id)} onClick={() => onOpenCandidate(cand.id)} className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group">
                      <div className="flex items-start gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-gradient-to-br ${cand.match >= 90 ? "from-emerald-500 to-teal-500" : cand.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"}`}>{cand.name.split(" ").map(n => n[0]).join("")}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">{cand.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{cand.exp} yrs · {cand.source}</div>
                        </div>
                        <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-slate-400 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /><span className="text-[10px] font-bold text-slate-700">{cand.match}%</span></div>
                        <div className="text-[9px] text-slate-400 truncate ml-1">{cand.location}</div>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && <div className="text-[10px] text-slate-400 text-center py-6 italic">drop here</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

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
/* ---------- JD GENERATOR ---------- */
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
const CandidateDetail = ({ candidate, onBack, onScreen }) => {
  if (!candidate) return null;
  const recColors = { Proceed: "emerald", Hold: "amber", Reject: "rose" };

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" />Back</button>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10" />
        <div className="relative flex items-start gap-5">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 bg-gradient-to-br ${candidate.match >= 90 ? "from-emerald-500 to-teal-500" : candidate.match >= 80 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"} shadow-lg`}>{candidate.name.split(" ").map(n => n[0]).join("")}</div>
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

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-violet-600" /><h2 className="font-bold text-slate-900">AI Summary</h2><Pill tone="violet">AI</Pill></div>
          <p className="text-sm text-slate-700 leading-relaxed">{candidate.summary}</p>

          <div className="grid grid-cols-2 gap-5 mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-3"><ThumbsUp className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-slate-900">Strengths</h3></div>
              <ul className="space-y-2">{candidate.strengths.map((s, i) => (<li key={i} className="flex gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{s}</li>))}</ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-amber-600" /><h3 className="font-bold text-sm text-slate-900">Gaps</h3></div>
              <ul className="space-y-2">{candidate.gaps.length > 0 ? candidate.gaps.map((g, i) => (<li key={i} className="flex gap-2 text-sm text-slate-700"><X className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{g}</li>)) : <li className="text-sm text-slate-400 italic">No significant gaps identified</li>}</ul>
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
                  <div className="flex items-center justify-between text-xs mb-1"><span className="font-medium text-slate-700">{s}</span><span className="font-bold text-slate-900 tabular-nums">{score}%</span></div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${score >= 90 ? "bg-emerald-500" : score >= 75 ? "bg-indigo-500" : "bg-amber-500"}`} style={{ width: `${score}%` }} /></div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Communication</span><span className="text-sm font-bold text-slate-900">{candidate.commScore}/10</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Technical</span><span className="text-sm font-bold text-slate-900">{candidate.techScore}/10</span></div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100"><span className="text-xs font-medium text-slate-600">AI Recommendation</span><Pill tone={recColors[candidate.recommendation]}>{candidate.recommendation === "Proceed" && <ThumbsUp className="w-3 h-3" />}{candidate.recommendation === "Hold" && <Pause className="w-3 h-3" />}{candidate.recommendation === "Reject" && <ThumbsDown className="w-3 h-3" />}{candidate.recommendation}</Pill></div>
          </div>

          <button onClick={onScreen} className="w-full mt-5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" />Run AI Screening</button>
        </Card>
      </div>
    </div>
  );
};

/* ---------- SCREENING HUB (sidebar landing page) ---------- */
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
export default function HumAIne() {
  const [view, setView] = useState({ name: "dashboard" });
  const [requisitions] = useState(seedRequisitions);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const updateCandidate = (id, patch) => setCandidates((prev) => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  const currentCandidate = view.candidateId ? candidates.find(c => c.id === view.candidateId) : null;
  const currentReq = view.reqId ? requisitions.find(r => r.id === view.reqId) : null;

  const nav = (name) => setView({ name });

  const sidebarActive =
    view.name === "req-detail" ? "requisitions" :
    view.name === "candidate" && view.from !== "screening-hub" ? "sourcing" :
    view.name === "candidate" && view.from === "screening-hub" ? "screening" :
    view.name === "screening" ? "screening" :
    view.name;

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Sidebar active={sidebarActive} onNav={nav} />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onCopilot={() => setCopilotOpen(true)} />
        <div className="flex-1">
          {view.name === "dashboard" && <Dashboard requisitions={requisitions} onOpenReq={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />}
          {view.name === "requisitions" && <RequisitionsList requisitions={requisitions} onOpen={(id) => setView({ name: "req-detail", reqId: id })} onNav={nav} />}
          {view.name === "req-detail" && currentReq && <RequisitionDetail req={currentReq} candidates={candidates} onBack={() => nav("requisitions")} onUpdateCandidate={updateCandidate} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "req-detail", reqId: view.reqId })} />}
          {view.name === "jd-generator" && <JDGenerator onCreate={() => nav("requisitions")} />}
          {view.name === "sourcing" && <Sourcing requisitions={requisitions} candidates={candidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "sourcing" })} />}
          {view.name === "screening-hub" && <ScreeningHub candidates={candidates} onOpenCandidate={(id) => setView({ name: "candidate", candidateId: id, from: "screening-hub" })} onStartScreening={(id) => setView({ name: "screening", candidateId: id, from: "screening-hub" })} />}
          {view.name === "candidate" && currentCandidate && <CandidateDetail candidate={currentCandidate} onBack={() => { if (view.from === "req-detail") setView({ name: "req-detail", reqId: view.reqId }); else if (view.from === "screening-hub") nav("screening-hub"); else nav("sourcing"); }} onScreen={() => setView({ name: "screening", candidateId: view.candidateId, from: view.from, reqId: view.reqId })} />}
          {view.name === "screening" && currentCandidate && <Screening candidate={currentCandidate} onBack={() => { if (view.from === "screening-hub") nav("screening-hub"); else setView({ name: "candidate", candidateId: view.candidateId, from: view.from, reqId: view.reqId }); }} />}
          {view.name === "admin" && <Admin />}
        </div>
      </main>
      <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}

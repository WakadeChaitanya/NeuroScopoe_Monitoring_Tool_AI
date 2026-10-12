// src/App.jsx
import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell,
  Bot, BrainCircuit, Check, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Command, Cpu, Database, Gauge, GitBranch, Layers3,
  LayoutDashboard, Menu, MoreHorizontal, Play, Plus, Radio,
  Search, Settings2, ShieldCheck, Sparkles, Square, Workflow, X,
  Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis
} from "recharts";
import NeuralScene from "./components/NeuralScene";
import "./App.css";

const chartData = [
  { time: "09:00", latency: 38, requests: 30 },
  { time: "09:05", latency: 31, requests: 36 },
  { time: "09:10", latency: 43, requests: 34 },
  { time: "09:15", latency: 29, requests: 48 },
  { time: "09:20", latency: 35, requests: 42 },
  { time: "09:25", latency: 25, requests: 55 },
  { time: "09:30", latency: 30, requests: 50 },
  { time: "09:35", latency: 22, requests: 62 },
  { time: "09:40", latency: 27, requests: 57 },
];

const initialAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Agent retry threshold exceeded",
    source: "Research Agent / web_search",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "success",
    title: "Inference latency back to baseline",
    source: "Local model runtime",
    time: "14 min ago",
  },
  {
    id: 3,
    type: "info",
    title: "Monitoring session initialized",
    source: "Development workspace",
    time: "32 min ago",
  },
];

const navigation = [
  {
    label: "OBSERVE",
    items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Neural Map", icon: BrainCircuit },
      { name: "AI Agents", icon: Bot, count: "03" },
      { name: "Models", icon: Cpu },
      { name: "Traces", icon: GitBranch },
    ],
  },
  {
    label: "OPERATE",
    items: [
      { name: "Alerts", icon: Activity, count: "01" },
      { name: "Data Sources", icon: Database },
      { name: "Workspace", icon: Settings2 },
    ],
  },
];

function SectionTitle({ icon: Icon, title, description, action }) {
  return (
    <div className="section-title">
      <div className="section-title-left">
        <span className="section-icon"><Icon size={16} /></span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ title, value, unit, change, data, negative = false }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <button className="subtle-icon" aria-label={`More about ${title}`}>
          <MoreHorizontal size={17} />
        </button>
      </div>
      <div className="metric-value">
        {value}<small>{unit}</small>
      </div>
      <div className="metric-bottom">
        <span className={negative ? "change warning-text" : "change"}>
          {negative ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </span>
        <span className="metric-period">vs. previous hour</span>
      </div>
      <div className="metric-sparkline">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || chartData}>
            <defs>
              <linearGradient id={`fill-${title.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={negative ? "#e8ad68" : "#73d8c3"} stopOpacity={0.24} />
                <stop offset="100%" stopColor={negative ? "#e8ad68" : "#73d8c3"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="latency"
              stroke={negative ? "#e8ad68" : "#73d8c3"}
              strokeWidth={1.8}
              fill={`url(#fill-${title.replace(/\W/g, "")})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function StatusDot({ color = "green" }) {
  return <span className={`status-dot ${color}`} />;
}

function Overview({ monitoring, setMonitoring, setPage, alerts }) {
  const [range, setRange] = useState("1h");
  const [selectedSignal, setSelectedSignal] = useState(null);
  const ranges = ["1h", "6h", "24h", "7d"];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> SYSTEM OVERVIEW</div>
          <h1>Everything, <span>in context.</span></h1>
          <p>Understand your models and agents without losing sight of the details.</p>
        </div>
        <div className="heading-actions">
          <button className="button-secondary" onClick={() => setPage("Traces")}>
            <GitBranch size={15} /> Explore traces
          </button>
          <button className={monitoring ? "button-stop" : "button-primary"} onClick={setMonitoring}>
            {monitoring ? <Square size={14} /> : <Radio size={15} />}
            {monitoring ? "Pause monitor" : "Start monitoring"}
          </button>
        </div>
      </div>

      <div className="monitor-strip">
        <div className="monitor-indicator"><StatusDot color={monitoring ? "green" : "grey"} /></div>
        <div className="monitor-copy">
          <strong>{monitoring ? "Monitoring session active" : "Workspace ready for monitoring"}</strong>
          <span>{monitoring ? "Demo telemetry is running. Connect the Python runtime for real measurements." : "Your local workspace is ready. Start a session to explore the interface."}</span>
        </div>
        <div className="monitor-meta"><span>ENVIRONMENT</span><strong><ShieldCheck size={13} /> LOCAL</strong></div>
        <div className="monitor-meta"><span>DATA MODE</span><strong>Illustrative</strong></div>
      </div>

      <div className="metrics-grid">
        <MetricCard title="Inference latency" value="28" unit="ms" change="18.4%" />
        <MetricCard title="Agent success" value="96.8" unit="%" change="4.2%" />
        <MetricCard title="Tool executions" value="1,284" unit="" change="12.1%" />
        <MetricCard title="Open anomalies" value="01" unit="" change="Needs review" negative />
      </div>

      <div className="main-grid">
        <section className="surface neural-panel">
          <SectionTitle
            icon={BrainCircuit}
            title="Neural map"
            description="Explore the signal path through your model"
            action={
              <div className="range-switch">
                {ranges.map((item) => (
                  <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>
                ))}
              </div>
            }
          />
          <div className="neural-canvas-wrap">
            <NeuralScene onSelectNode={setSelectedSignal} />
            <div className="scene-overlay scene-top-left">
              <span className="scene-label"><span className="signal-dot teal" /> INPUT</span>
              <span className="scene-label"><span className="signal-dot violet" /> HIDDEN</span>
              <span className="scene-label"><span className="signal-dot coral" /> ANOMALY</span>
            </div>
            <div className="scene-overlay scene-top-right">
              <span className="scene-live"><StatusDot color={monitoring ? "green" : "grey"} /> {monitoring ? "DEMO STREAM" : "PREVIEW"}</span>
            </div>
            {selectedSignal && (
              <div className="signal-inspector">
                <div className="inspector-heading">
                  <span><Activity size={14} /> Signal inspector</span>
                  <button onClick={() => setSelectedSignal(null)} aria-label="Close inspector"><X size={14} /></button>
                </div>
                <strong>{selectedSignal.label}</strong>
                <span>{selectedSignal.kind}</span>
                <p>Illustrative node. Real activations require a connected model hook.</p>
              </div>
            )}
          </div>
          <div className="neural-footer">
            <span><Layers3 size={14} /> 6 layers</span>
            <span><Workflow size={14} /> 38 illustrative nodes</span>
            <span><Activity size={14} /> {range} window</span>
            <button onClick={() => setPage("Neural Map")}>Open neural map <ChevronRight size={14} /></button>
          </div>
        </section>

        <section className="surface performance-panel">
          <SectionTitle
            icon={Gauge}
            title="Runtime health"
            description="Operational signals at a glance"
            action={<button className="subtle-icon" aria-label="Performance options"><MoreHorizontal size={17} /></button>}
          />
          <div className="health-score">
            <div className="health-ring">
              <svg viewBox="0 0 120 120" aria-label="Illustrative health score 94">
                <circle cx="60" cy="60" r="49" className="ring-track" />
                <circle cx="60" cy="60" r="49" className="ring-value" />
              </svg>
              <div className="ring-copy"><strong>94</strong><span>HEALTH SCORE</span></div>
            </div>
            <div className="health-summary">
              <span className="health-status"><StatusDot /> Within baseline</span>
              <p>Runtime signals appear stable in this demo view.</p>
              <span className="tiny-note">Illustrative score, not computed telemetry</span>
            </div>
          </div>
          <div className="health-checks">
            <div><span><Check size={14} /> Telemetry pipeline</span><b>Ready</b></div>
            <div><span><Check size={14} /> Workspace runtime</span><b>Local</b></div>
            <div><span><AlertTriangle size={14} /> Python monitor</span><b className="warning-text">Not connected</b></div>
          </div>
        </section>

        <section className="surface chart-panel">
          <SectionTitle
            icon={Activity}
            title="Latency over time"
            description="Response latency · milliseconds"
            action={<span className="chart-badge"><span className="signal-dot teal" /> P50 latency</span>}
          />
          <div className="chart-stats"><strong>28 <small>ms</small></strong><span className="change"><ArrowDownRight size={13} /> 18.4%</span><span className="muted-text">average this hour</span></div>
          <div className="latency-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 7, left: -22, bottom: 0 }}>
                <defs><linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#73d8c3" stopOpacity={0.2}/><stop offset="100%" stopColor="#73d8c3" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke="#233647" strokeDasharray="3 5" vertical={false}/>
                <XAxis dataKey="time" tick={{ fill: "#748a9f", fontSize: 9 }} axisLine={false} tickLine={false} interval={1}/>
                <Tooltip contentStyle={{ background: "#111f2c", border: "1px solid #304457", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#dce8f2" }} />
                <Area dataKey="latency" name="Latency" type="monotone" stroke="#73d8c3" strokeWidth={2} fill="url(#latencyFill)" isAnimationActive={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface alerts-panel">
          <SectionTitle
            icon={AlertTriangle}
            title="Attention needed"
            description="Recent events from this workspace"
            action={<button className="text-action" onClick={() => setPage("Alerts")}>All alerts <ChevronRight size={13}/></button>}
          />
          <div className="alert-items">
            {alerts.slice(0, 3).map((alert) => (
              <div className="alert-item" key={alert.id}>
                <span className={`alert-icon ${alert.type}`}>
                  {alert.type === "success" ? <Check size={14}/> : alert.type === "warning" ? <AlertTriangle size={14}/> : <Activity size={14}/>}
                </span>
                <div className="alert-text"><strong>{alert.title}</strong><span>{alert.source}</span></div>
                <time>{alert.time}</time>
              </div>
            ))}
          </div>
          <div className="alert-bottom"><span><StatusDot color="amber" /> 1 item needs review</span><button onClick={() => setPage("Alerts")}>Review queue <ChevronRight size={13}/></button></div>
        </section>

        <section className="surface agents-panel">
          <SectionTitle
            icon={Bot}
            title="Agent activity"
            description="Workflow runs across your workspace"
            action={<button className="text-action" onClick={() => setPage("AI Agents")}>Explore agents <ChevronRight size={13}/></button>}
          />
          <div className="agent-activity-list">
            <div className="agent-activity-row"><span className="agent-avatar purple"><Bot size={16}/></span><span className="agent-name"><strong>Research Agent</strong><small>4 steps · 1 tool retry</small></span><span className="agent-state needs-review">Review</span><time>4.82 s</time></div>
            <div className="agent-activity-row"><span className="agent-avatar green"><Sparkles size={16}/></span><span className="agent-name"><strong>Support Agent</strong><small>2 steps · no retries</small></span><span className="agent-state completed">Completed</span><time>1.36 s</time></div>
            <div className="agent-activity-row"><span className="agent-avatar blue"><Workflow size={16}/></span><span className="agent-name"><strong>Data Assistant</strong><small>2 steps · tool execution</small></span><span className="agent-state running">Running</span><time>0.92 s</time></div>
          </div>
        </section>
      </div>
    </>
  );
}

function AgentsPage() {
  const [expanded, setExpanded] = useState("Research Agent");
  const agents = [
    { name: "Research Agent", kind: "Planning · Search · Summarization", status: "Needs review", duration: "4.82 s", calls: 4, steps: [["Plan task", "Model call", "420 ms"], ["Search web", "Tool call", "1.24 s"], ["Search web", "Retry", "2.01 s"], ["Summarize findings", "Model call", "1.15 s"]] },
    { name: "Support Agent", kind: "Classification · Response", status: "Completed", duration: "1.36 s", calls: 2, steps: [["Classify request", "Model call", "380 ms"], ["Draft response", "Model call", "980 ms"]] },
    { name: "Data Assistant", kind: "Parsing · Data query", status: "Running", duration: "0.92 s", calls: 2, steps: [["Parse request", "Model call", "220 ms"], ["Query dataset", "Tool call", "700 ms"]] },
  ];
  return <div className="subpage">
    <div className="eyebrow"><span className="eyebrow-line"/> AGENT OBSERVABILITY</div>
    <div className="page-heading"><div><h1>AI agents, <span>step by step.</span></h1><p>Follow decisions, tool calls, retries, and execution outcomes.</p></div><button className="button-secondary"><Plus size={15}/> Register agent</button></div>
    <div className="metrics-grid">
      <MetricCard title="Agent runs today" value="248" unit="" change="16.2%"/>
      <MetricCard title="Successful runs" value="96.8" unit="%" change="4.2%"/>
      <MetricCard title="Average duration" value="2.4" unit="s" change="8.1%"/>
      <MetricCard title="Needs review" value="03" unit="" change="Inspect traces" negative/>
    </div>
    <section className="surface agent-traces">
      <SectionTitle icon={GitBranch} title="Recent execution traces" description="Demo traces · connect an agent runtime for real events"/>
      {agents.map((agent) => <div className="trace-card" key={agent.name}>
        <button className="trace-summary" onClick={() => setExpanded(expanded === agent.name ? "" : agent.name)}>
          <span className="agent-avatar purple"><Bot size={17}/></span>
          <span className="trace-name"><strong>{agent.name}</strong><small>{agent.kind}</small></span>
          <span className={`agent-state ${agent.status === "Completed" ? "completed" : agent.status === "Running" ? "running" : "needs-review"}`}>{agent.status}</span>
          <span className="trace-count">{agent.calls} steps</span><span className="trace-duration">{agent.duration}</span>
          {expanded === agent.name ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
        </button>
        {expanded === agent.name && <div className="trace-steps">{agent.steps.map((step, index) => <div className="trace-step" key={step[0] + index}>
          <span className="step-number">{String(index + 1).padStart(2, "0")}</span><span className="step-line"/>
          <div><strong>{step[0]}</strong><small>{step[1]}</small></div><time>{step[2]}</time>
        </div>)}</div>}
      </div>)}
    </section>
    <div className="prototype-note"><CircleHelp size={15}/><span><strong>Prototype data</strong> — agent traces are illustrative. Live trace collection, redaction, and organization access controls are future integration work.</span></div>
  </div>;
}

function GenericPage({ page, setPage }) {
  const [filter, setFilter] = useState("");
  const details = {
    "Neural Map": ["MODEL INTROSPECTION", "See the connections.", "Explore layer structure and signal activity. Connect a model to inspect actual activations."],
    "Models": ["MODEL REGISTRY", "Your models, in one place.", "Keep track of model runtimes, versions, and monitoring status."],
    "Traces": ["EXECUTION TRACES", "Follow the full chain.", "Inspect requests across models, agents, and tools."],
    "Data Sources": ["INTEGRATIONS", "Bring your runtime in.", "Connect local Python hooks, model telemetry, and agent event streams."],
    "Workspace": ["WORKSPACE SETTINGS", "Built for your team.", "Configure monitoring defaults and organization controls."]
  };
  if (page === "Alerts") return <div className="subpage"><div className="eyebrow"><span className="eyebrow-line"/> OPERATIONS</div><div className="page-heading"><div><h1>Alerts & <span>incidents.</span></h1><p>Review unusual behavior and decide what to investigate.</p></div><span className="chart-badge"><StatusDot color="amber"/> 1 needs review</span></div><section className="surface full-alert-list"><SectionTitle icon={AlertTriangle} title="Recent events" description="Illustrative workspace events"/>{initialAlerts.map((alert) => <div className="alert-item" key={alert.id}><span className={`alert-icon ${alert.type}`}><AlertTriangle size={14}/></span><div className="alert-text"><strong>{alert.title}</strong><span>{alert.source}</span></div><time>{alert.time}</time></div>)}</section></div>;
  if (page === "Workspace") return <div className="subpage"><div className="eyebrow"><span className="eyebrow-line"/> WORKSPACE SETTINGS</div><div className="page-heading"><div><h1>Workspace <span>preferences.</span></h1><p>Set up a useful and predictable monitoring environment.</p></div></div><section className="surface settings-surface"><div><strong>Telemetry mode</strong><p>Use illustrative data until a local runtime is connected.</p><span className="agent-state needs-review">Demo mode</span></div><div><strong>Deployment preference</strong><p>NeuroScope currently uses this browser interface only. No telemetry is sent to a server.</p><span className="agent-state completed">Local-first design</span></div><div><strong>Access controls</strong><p>Organization roles and permissions should be implemented before multi-user deployment.</p><span className="agent-state needs-review">Not implemented</span></div></section></div>;
  const item = details[page] || details.Models;
  return <div className="subpage"><div className="eyebrow"><span className="eyebrow-line"/>{item[0]}</div><div className="page-heading"><div><h1>{item[1]}</h1><p>{item[2]}</p></div><button className="button-secondary"><Plus size={15}/> Add source</button></div><section className="surface placeholder-surface"><div className="placeholder-icon"><Layers3 size={25}/></div><h2>{page} workspace</h2><p>This section is scaffolded. Its next step is to connect it to the Python monitor and real telemetry.</p><input value={filter} onChange={e => setFilter(e.target.value)} placeholder={`Filter ${page.toLowerCase()}…`}/>{filter && <small>No connected resources match “{filter}”.</small>}<button className="button-secondary" onClick={() => setPage("Overview")}>Return to overview</button></section></div>;
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [monitoring, setMonitoringState] = useState(false);
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filteredNavigation = useMemo(() => navigation.map(group => ({
    ...group,
    items: group.items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
  })), [search]);

  function toggleMonitoring() {
    const next = !monitoring;
    setMonitoringState(next);
    if (next) {
      setAlerts(previous => [{
        id: Date.now(),
        type: "info",
        title: "Monitoring session started",
        source: "Local workspace · demo mode",
        time: "Just now",
      }, ...previous].slice(0, 8));
    }
  }

  function navigate(name) {
    setPage(name);
    setSidebarOpen(false);
    setShowNotifications(false);
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"/>}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => navigate("Overview")}>
          <span className="brand-logo"><BrainCircuit size={22}/><i/></span>
          <span className="brand-copy"><strong>neuroscope<span>.</span></strong><small>AI SYSTEM OBSERVABILITY</small></span>
        </button>

        <button className="workspace-switch" onClick={() => navigate("Workspace")}>
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy"><strong>Research workspace</strong><small>Local environment</small></span>
          <ChevronDown size={14}/>
        </button>

        <div className="sidebar-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a section…"/><kbd>/</kbd></div>

        <nav className="sidebar-nav">
          {filteredNavigation.map(group => group.items.length > 0 && <div className="nav-group" key={group.label}>
            <span className="nav-label">{group.label}</span>
            {group.items.map(({ name, icon: Icon, count }) => <button key={name} onClick={() => navigate(name)} className={`nav-item ${page === name ? "active" : ""}`}>
              <Icon size={16}/><span>{name}</span>{count && <small>{count}</small>}
            </button>)}
          </div>)}
        </nav>

        <div className="sidebar-bottom">
          <div className="runtime-card"><div className="runtime-card-top"><span><StatusDot color={monitoring ? "green" : "grey"}/> Runtime</span><span>{monitoring ? "DEMO" : "IDLE"}</span></div><p>{monitoring ? "Demo session active" : "Waiting for local monitor"}</p><div className="runtime-track"><span style={{ width: monitoring ? "72%" : "8%" }}/></div><button onClick={() => navigate("Data Sources")}>Configure connection <ChevronRight size={13}/></button></div>
          <button className="profile-button" onClick={() => navigate("Workspace")}><span className="profile-avatar">RA</span><span><strong>Research Admin</strong><small>Workspace owner</small></span><MoreHorizontal size={17}/></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={19}/></button><span className="breadcrumb">Workspace</span><ChevronRight size={13}/><strong>{page}</strong></div>
          <div className="topbar-right">
            <span className="local-badge"><StatusDot color="green"/> LOCAL</span>
            <span className="topbar-divider"/>
            <button className="top-icon-button" aria-label="Keyboard shortcuts"><Command size={16}/></button>
            <div className="notification-wrap"><button className="top-icon-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Bell size={16}/><i/></button>
              {showNotifications && <div className="notification-popover"><div className="popover-title"><strong>Notifications</strong><span>{alerts.length} events</span></div>{alerts.slice(0, 4).map(alert => <div className="popover-event" key={alert.id}><span className={`alert-icon ${alert.type}`}><Activity size={13}/></span><div><strong>{alert.title}</strong><small>{alert.time}</small></div></div>)}</div>}
            </div>
            <button className="top-icon-button" aria-label="Help" onClick={() => navigate("Workspace")}><CircleHelp size={16}/></button>
          </div>
        </header>

        <div className="page-content">
          {page === "Overview"
            ? <Overview monitoring={monitoring} setMonitoring={toggleMonitoring} setPage={navigate} alerts={alerts}/>
            : page === "AI Agents"
              ? <AgentsPage/>
              : <GenericPage page={page} setPage={navigate}/>}
          <footer className="app-footer"><span>NEUROSCOPE <b>EARLY ACCESS</b></span><span>Local-first observability for models and agents</span><span>v0.1.0 · Prototype</span></footer>
        </div>
      </main>
    </div>
  );
}
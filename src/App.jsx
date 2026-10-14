
import { useState } from "react";
import {
  Activity,
  Bot,
  Box,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cpu,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Home,
  Layers3,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
  Workflow,
  X,
} from "lucide-react";
import NeuralScene from "./components/NeuralScene";
import "./App.css";

const systems = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    type: "Model",
    status: "Healthy",
    latency: "142 ms",
    variance: "0.022",
    version: "gpt-4o",
    uptime: "2h 14m",
    color: "#8068ff",
  },
  {
    id: "research-agent",
    name: "Research Agent",
    type: "Agent",
    status: "Attention",
    latency: "486 ms",
    variance: "0.087",
    version: "research-agent-v1",
    uptime: "1h 38m",
    color: "#24a36b",
  },
  {
    id: "data-agent",
    name: "Data Agent",
    type: "Agent",
    status: "Healthy",
    latency: "218 ms",
    variance: "0.034",
    version: "data-agent-v1",
    uptime: "3h 05m",
    color: "#2699df",
  },
];

const modelNodes = [
  { id: "input", label: "Input", kind: "input" },
  { id: "embedding", label: "Embedding", kind: "layer" },
  { id: "attention", label: "Attention", kind: "layer" },
  { id: "mlp", label: "MLP", kind: "layer" },
  { id: "output", label: "Output", kind: "output" },
];

const agentNodes = [
  { id: "request", label: "User Request", kind: "input" },
  { id: "llm", label: "LLM", kind: "layer" },
  { id: "memory", label: "Memory", kind: "database" },
  { id: "tools", label: "Tools", kind: "tool" },
  { id: "result", label: "Final Result", kind: "output" },
];

function Metric({ icon: Icon, label, value, note, tone = "blue" }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="metric-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function Status({ status }) {
  return (
    <span
      className={`status-pill ${
        status === "Healthy" ? "healthy" : "attention"
      }`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState("gpt-4o");
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [detailTab, setDetailTab] = useState("Overview");

  const selected = systems.find((system) => system.id === selectedId);
  const isModel = selected.type === "Model";
  const isAgent = selected.type === "Agent";

  const visibleSystems = systems.filter((system) =>
    `${system.name} ${system.type} ${system.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectSystem = (system) => {
    setSelectedId(system.id);
    setActivePage(system.type === "Model" ? "Models" : "AI Agents");
    setDetailTab("Overview");
  };

  const navigate = (page) => {
    setActivePage(page);

    if (page === "Models") {
      setSelectedId("gpt-4o");
    } else if (page === "AI Agents") {
      setSelectedId("research-agent");
    }
  };

  const nodes = isModel ? modelNodes : agentNodes;

  const title =
    activePage === "Overview"
      ? "Your AI systems at a glance"
      : activePage === "Models"
        ? "Models"
        : activePage === "AI Agents"
          ? "AI Agents"
          : activePage;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          
      <div className="brand-mark">
        <img
        src="/neuroscope-logo.png"
        alt="NeuroScope logo"
        className="brand-logo"
        />
     </div>

          <strong>NeuroScope</strong>
          <span className="local-badge">
            <span className="status-dot" />
            Local
          </span>
        </div>

        <div className="topbar-actions">
          <label className="global-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find models, agents, or signals..."
            />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="connection-indicator">
            <span className="status-dot" />
            Running locally
          </div>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="nav-group">
            <p className="nav-caption">WORKSPACE</p>

            {[
              { name: "Overview", icon: Home },
              { name: "Models", icon: Box },
              { name: "AI Agents", icon: Bot },
              { name: "Signals", icon: Activity },
              { name: "Logs", icon: FileText },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`nav-item ${
                  activePage === name ? "active" : ""
                }`}
                onClick={() => navigate(name)}
              >
                <Icon size={18} />
                <span>{name}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">
              <span>MONITORED SYSTEMS</span>
              <span>{systems.length}</span>
            </div>

            {systems.map((system) => (
              <button
                key={system.id}
                className={`system-nav-item ${
                  selectedId === system.id ? "selected" : ""
                }`}
                onClick={() => selectSystem(system)}
              >
                <span
                  className="system-mini-icon"
                  style={{ color: system.color }}
                >
                  {system.type === "Model" ? (
                    <Cpu size={17} />
                  ) : (
                    <Bot size={17} />
                  )}
                </span>
                <span className="system-nav-copy">
                  <strong>{system.name}</strong>
                  <small>{system.type}</small>
                </span>
                <span
                  className={`mini-status ${
                    system.status === "Healthy" ? "ok" : "warning"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <button
              className={`nav-item ${
                activePage === "Settings" ? "active" : ""
              }`}
              onClick={() => setActivePage("Settings")}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <div className="local-card">
              <ShieldCheck size={19} />
              <div>
                <strong>Local monitoring</strong>
                <small>Your data stays on this machine</small>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">{activePage.toUpperCase()}</span>
              <h1>{title}</h1>
              <p>
                {activePage === "Overview"
                  ? "Monitor model internals and agent execution in one place."
                  : `Inspect and monitor your ${activePage.toLowerCase()}.`}
              </p>
            </div>

            {activePage !== "Overview" && (
              <button
                className="subtle-button"
                onClick={() => setActivePage("Overview")}
              >
                <X size={16} />
                Clear view
              </button>
            )}
          </div>

          <section className="metrics-grid">
            <Metric
              icon={Cpu}
              label="Models"
              value="3"
              note="Monitored systems"
              tone="purple"
            />
            <Metric
              icon={Bot}
              label="AI Agents"
              value="2"
              note="Execution tracked"
              tone="green"
            />
            <Metric
              icon={Gauge}
              label="Avg. latency"
              value="276 ms"
              note="Across demo systems"
              tone="blue"
            />
            <Metric
              icon={CircleAlert}
              label="Needs attention"
              value="1"
              note="Review variance"
              tone="orange"
            />
          </section>

          <section className="visualization-card">
            <div className="card-heading">
              <div>
                <div className="heading-title-row">
                  <h2>
                    {isModel ? "Neural Network" : "Agent Workflow"}
                  </h2>
                  <span className="live-indicator">
                    <span className="status-dot" />
                    {selected.name}
                  </span>
                </div>
                <p>
                  {isModel
                    ? "Explore the selected model's layer structure."
                    : "Follow the agent's execution path and dependencies."}
                </p>
              </div>

              <span className="demo-label">Illustrative preview</span>
            </div>

            <div className="visualization-body">
              <NeuralScene
                key={selected.id}
                type={selected.type.toLowerCase()}
                nodes={nodes}
                selectedName={selected.name}
              />
            </div>

            <div className="visualization-footer">
              <div className="legend-item">
                <span className="legend-dot blue-dot" />
                Input
              </div>
              <div className="legend-item">
                <span className="legend-dot purple-dot" />
                Processing
              </div>
              <div className="legend-item">
                <span className="legend-dot green-dot" />
                Output / Tools
              </div>
              <span className="visualization-hint">
                Select a system to explore its view
              </span>
            </div>
          </section>

          <section className="systems-card">
            <div className="card-heading systems-heading">
              <div>
                <h2>Monitored Systems</h2>
                <p>Select a row to inspect that model or agent.</p>
              </div>
              <span className="system-count">{visibleSystems.length} systems</span>
            </div>

            <div className="systems-table-wrap">
              <table className="systems-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Latency</th>
                    <th>Variance</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibleSystems.map((system) => (
                    <tr
                      key={system.id}
                      onClick={() => selectSystem(system)}
                      className={
                        selectedId === system.id ? "selected-row" : ""
                      }
                    >
                      <td>
                        <div className="table-name">
                          <span style={{ color: system.color }}>
                            {system.type === "Model" ? (
                              <Cpu size={18} />
                            ) : (
                              <Bot size={18} />
                            )}
                          </span>
                          <strong>{system.name}</strong>
                        </div>
                      </td>
                      <td>{system.type}</td>
                      <td>
                        <Status status={system.status} />
                      </td>
                      <td>{system.latency}</td>
                      <td>{system.variance}</td>
                      <td>
                        <ChevronRight size={17} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleSystems.length === 0 && (
                <div className="empty-state">
                  No systems match “{search}”.
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="details-panel">
          <div className="details-header">
            <div
              className="details-avatar"
              style={{ color: selected.color }}
            >
              {isModel ? <Cpu size={22} /> : <Bot size={22} />}
            </div>
            <div className="details-title">
              <h2>{selected.name}</h2>
              <Status status={selected.status} />
            </div>
          </div>

          <div className="details-tabs">
            {["Overview", "Metrics", "Logs", "Config"].map((tab) => (
              <button
                key={tab}
                className={detailTab === tab ? "active" : ""}
                onClick={() => setDetailTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {detailTab === "Overview" && (
            <>
              <div className="detail-fields">
                <div>
                  <span>Type</span>
                  <strong>{selected.type}</strong>
                </div>
                <div>
                  <span>Identifier</span>
                  <strong>{selected.id}</strong>
                </div>
                <div>
                  <span>Version</span>
                  <strong>{selected.version}</strong>
                </div>
                <div>
                  <span>Environment</span>
                  <strong>Local</strong>
                </div>
                <div>
                  <span>Uptime</span>
                  <strong>{selected.uptime}</strong>
                </div>
              </div>

              <div className="detail-divider" />

              <div className="detail-section">
                <h3>Performance</h3>
                <div className="performance-stat">
                  <div className="performance-icon">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <span>Latency</span>
                    <strong>{selected.latency}</strong>
                  </div>
                </div>
                <div className="performance-stat">
                  <div className="performance-icon">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span>Signal variance</span>
                    <strong>{selected.variance}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-divider" />

              <div className="detail-section">
                <h3>Recent activity</h3>
                <div className="activity-item">
                  <span className="activity-dot green-dot" />
                  <span>Request completed</span>
                  <small>2m ago</small>
                </div>
                <div className="activity-item">
                  <span className="activity-dot orange-dot" />
                  <span>
                    {selected.status === "Attention"
                      ? "Variance needs review"
                      : "Signal check completed"}
                  </span>
                  <small>12m ago</small>
                </div>
              </div>
            </>
          )}

          {detailTab === "Metrics" && (
            <div className="tab-content">
              <h3>Current metrics</h3>
              <div className="metric-detail-row">
                <span>Latency</span>
                <strong>{selected.latency}</strong>
              </div>
              <div className="metric-detail-row">
                <span>Signal variance</span>
                <strong>{selected.variance}</strong>
              </div>
              <div className="metric-detail-row">
                <span>Status</span>
                <Status status={selected.status} />
              </div>
              <p className="muted-note">
                Sample values for UI development. Connect your monitor to show
                measured metrics.
              </p>
            </div>
          )}

          {detailTab === "Logs" && (
            <div className="tab-content">
              <h3>Recent logs</h3>
              <div className="log-entry">
                <span className="log-time">18:42:01</span>
                <strong>INFO</strong>
                <p>Monitoring session initialized.</p>
              </div>
              <div className="log-entry">
                <span className="log-time">18:42:12</span>
                <strong className="log-warn">WARN</strong>
                <p>
                  {selected.status === "Attention"
                    ? "Variance crossed the demo threshold."
                    : "Sample signal check completed."}
                </p>
              </div>
              <p className="muted-note">
                These are sample entries, not live backend logs.
              </p>
            </div>
          )}

          {detailTab === "Config" && (
            <div className="tab-content">
              <h3>System configuration</h3>
              <div className="metric-detail-row">
                <span>System ID</span>
                <strong>{selected.id}</strong>
              </div>
              <div className="metric-detail-row">
                <span>System type</span>
                <strong>{selected.type}</strong>
              </div>
              <div className="metric-detail-row">
                <span>Execution</span>
                <strong>Local</strong>
              </div>
              <p className="muted-note">
                Configuration editing can be added when the backend settings
                API is available.
              </p>
            </div>
          )}

          <button
            className="details-action"
            onClick={() => setDetailTab("Logs")}
          >
            <FileText size={17} />
            View system logs
            <ChevronRight size={17} />
          </button>
        </aside>
      </div>
    </div>
  );
}

export default App;

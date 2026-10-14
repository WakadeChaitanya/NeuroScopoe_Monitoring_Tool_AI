import React, { useMemo, useState } from 'react';

const layerDefs = [
  { name: 'Input Layer', count: '512 neurons', x: 82, n: 8, color: '#49d8c0' },
  { name: 'Hidden Layer 1', count: '1,024 neurons', x: 235, n: 10, color: '#45b7f4' },
  { name: 'Hidden Layer 2', count: '1,024 neurons', x: 390, n: 12, color: '#45d8d0' },
  { name: 'Hidden Layer 3', count: '1,024 neurons', x: 545, n: 10, color: '#8e8cff' },
  { name: 'Output Layer', count: '256 neurons', x: 698, n: 8, color: '#49d8c0' },
];
const yFor = (i, n) => 70 + i * (310 / (n - 1));

export default function NeuralScene({ showLabels = true }) {
  const [selected, setSelected] = useState(null);
  const [showAnomaly, setShowAnomaly] = useState(true);
  const nodes = useMemo(() => layerDefs.flatMap((l, li) => Array.from({ length: l.n }, (_, i) => ({
    id: `${li}-${i}`, li, i, x: l.x, y: yFor(i, l.n), color: l.color,
    anomaly: li === 3 && i >= 7 && i <= 8,
  }))), []);
  const links = useMemo(() => {
    const out = [];
    for (let li = 0; li < layerDefs.length - 1; li++) {
      const left = nodes.filter(n => n.li === li), right = nodes.filter(n => n.li === li + 1);
      left.forEach((a, ai) => right.forEach((b, bi) => {
        // A curated subset keeps the diagram legible instead of creating a solid mesh.
        if ((ai * 3 + bi * 5 + li) % 4 !== 0 && Math.abs(ai / left.length - bi / right.length) > 0.56) return;
        const anomaly = showAnomaly && (b.anomaly || (li === 3 && a.anomaly));
        out.push({ id: `${a.id}-${b.id}`, a, b, anomaly, opacity: 0.12 + ((ai * 7 + bi * 3) % 7) * 0.025 });
      }));
    }
    return out;
  }, [nodes, showAnomaly]);

  return <div className="topology-visual">
    <div className="scene-topline"><span className="scene-live"><i /> STATIC ARCHITECTURE VIEW</span><span>GPT-2 · 5 layers shown</span></div>
    <svg className="topology-svg" viewBox="0 0 780 470" role="img" aria-label="Illustrative five-layer neural network topology">
      <defs>
        <radialGradient id="nodeGlow"><stop offset="0" stopColor="#e8fffc"/><stop offset=".28" stopColor="#71f0e0"/><stop offset="1" stopColor="#38bfae" stopOpacity=".08"/></radialGradient>
        <radialGradient id="blueGlow"><stop offset="0" stopColor="#eef9ff"/><stop offset=".35" stopColor="#65caff"/><stop offset="1" stopColor="#2488d8" stopOpacity=".08"/></radialGradient>
        <radialGradient id="purpleGlow"><stop offset="0" stopColor="#fff"/><stop offset=".36" stopColor="#a6a0ff"/><stop offset="1" stopColor="#7771e6" stopOpacity=".08"/></radialGradient>
        <filter id="softGlow" x="-250%" y="-250%" width="600%" height="600%"><feGaussianBlur stdDeviation="3.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="floorFade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#172631" stopOpacity="0"/><stop offset="1" stopColor="#18242d" stopOpacity=".48"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="780" height="470" fill="url(#floorFade)"/>
      {Array.from({length:8},(_,i)=><path key={`gridv${i}`} d={`M ${i*112-8} 408 L ${390+(i-3.5)*28} 300`} stroke="#30404b" strokeWidth=".7" opacity=".26"/>)}
      {Array.from({length:5},(_,i)=><line key={`gridh${i}`} x1="0" y1={340+i*20} x2="780" y2={340+i*20} stroke="#30404b" strokeWidth=".7" opacity=".22"/>)}
      {layerDefs.map((l,i)=><g key={l.name}><line x1={l.x} y1="32" x2={l.x} y2="410" stroke={l.color} strokeDasharray="2 6" strokeWidth=".8" opacity=".22"/><ellipse cx={l.x} cy="225" rx="22" ry="164" fill={l.color} opacity=".025"/></g>)}
      {links.map(link=><path key={link.id} d={`M ${link.a.x} ${link.a.y} C ${link.a.x+54} ${link.a.y+(link.b.y-link.a.y)*.15}, ${link.b.x-54} ${link.b.y-(link.b.y-link.a.y)*.15}, ${link.b.x} ${link.b.y}`} fill="none" stroke={link.anomaly?'#ef657d':link.a.color} strokeWidth={link.anomaly?1.35:.8} opacity={link.anomaly ? 0.64 : link.opacity}/>) }
      {nodes.map(node=><g key={node.id} onClick={()=>setSelected(node)} className="neuron" role="button" tabIndex="0" aria-label={`Select neuron ${node.i+1} in ${layerDefs[node.li].name}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')setSelected(node)}}>
        {(node.anomaly && showAnomaly) && <circle cx={node.x} cy={node.y} r="11" fill="#f05f79" opacity=".13"/>}
        <circle cx={node.x} cy={node.y} r={selected?.id===node.id?8:5.5} fill={node.anomaly&&showAnomaly?'#ed6a80':node.li===1?'url(#blueGlow)':node.li===3?'url(#purpleGlow)':'url(#nodeGlow)'} filter="url(#softGlow)" opacity=".95"/>
        <circle cx={node.x} cy={node.y} r="2" fill={node.anomaly&&showAnomaly?'#fff0f2':'#f1fffe'} opacity=".9"/>
      </g>)}
      {showLabels && layerDefs.map((l,i)=><g key={`label-${l.name}`}><text x={l.x} y="431" textAnchor="middle" className="layer-label">{l.name}</text><text x={l.x} y="448" textAnchor="middle" className="layer-count">{l.count}</text></g>)}
      {showAnomaly && <g className="anomaly-callout"><path d="M 558 314 L 586 284 L 609 284" fill="none" stroke="#ef657d" strokeWidth="1.1"/><circle cx="558" cy="314" r="3" fill="#ef657d"/><rect x="609" y="265" width="144" height="40" rx="8" fill="#211a21" stroke="#78404d"/><circle cx="625" cy="285" r="5" fill="#ed647b"/><text x="638" y="282" className="callout-title">Variance spike</text><text x="638" y="295" className="callout-sub">Layer 4 · illustrative</text></g>}
      {selected && <g><rect x="16" y="15" width="190" height="48" rx="8" fill="#151d24" stroke="#3c555f"/><text x="28" y="34" className="callout-title">Neuron selected</text><text x="28" y="49" className="callout-sub">Layer {selected.li+1} · Node {selected.i+1}</text></g>}
    </svg>
    <div className="topology-legend"><span><i className="legend-dot mint"/> Input / Output</span><span><i className="legend-dot blue"/> Hidden layers</span><span><i className="legend-dot red"/> Anomaly highlight</span><button onClick={()=>setShowAnomaly(v=>!v)} className={showAnomaly?'legend-toggle active':'legend-toggle'}>{showAnomaly?'Hide anomaly':'Show anomaly'}</button></div>
  </div>;
}

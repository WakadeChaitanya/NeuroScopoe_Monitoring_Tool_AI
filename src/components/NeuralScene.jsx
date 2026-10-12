// src/components/NeuralScene.jsx
import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";

const layerConfig = [
  { x: -4.7, count: 5, kind: "Input" },
  { x: -2.9, count: 7, kind: "Hidden" },
  { x: -1.05, count: 8, kind: "Hidden" },
  { x: 0.85, count: 7, kind: "Hidden" },
  { x: 2.75, count: 6, kind: "Hidden" },
  { x: 4.55, count: 4, kind: "Output" },
];

function makeTopology() {
  const nodes = [];
  layerConfig.forEach((layer, layerIndex) => {
    for (let index = 0; index < layer.count; index++) {
      const centered = index - (layer.count - 1) / 2;
      nodes.push({
        id: `${layerIndex}-${index}`,
        layer: layerIndex,
        index,
        kind: layer.kind,
        label: `Layer ${layerIndex + 1} · Node ${index + 1}`,
        position: [
          layer.x,
          -centered * 0.61,
          Math.sin(index * 1.7 + layerIndex) * 0.22,
        ],
        color: layerIndex === 0 || layerIndex === layerConfig.length - 1
          ? "#70d9ca"
          : "#8d9aff",
        anomaly: layerIndex === 3 && index === 2,
      });
    }
  });

  const edges = [];
  for (let layer = 0; layer < layerConfig.length - 1; layer++) {
    const left = nodes.filter(node => node.layer === layer);
    const right = nodes.filter(node => node.layer === layer + 1);
    left.forEach((source, sourceIndex) => {
      right.forEach((target, targetIndex) => {
        if ((sourceIndex * 7 + targetIndex * 3 + layer) % 3 !== 0) {
          edges.push({
            id: `${source.id}-${target.id}`,
            source,
            target,
            anomaly: source.anomaly || target.anomaly,
          });
        }
      });
    });
  }
  return { nodes, edges };
}

function NeuralNode({ node, selected, onSelect }) {
  return (
    <group
      position={node.position}
      onClick={event => {
        event.stopPropagation();
        onSelect(node);
      }}
    >
      {node.anomaly && (
        <mesh>
          <sphereGeometry args={[0.27, 20, 20]} />
          <meshBasicMaterial color="#ff7887" transparent opacity={0.12} />
        </mesh>
      )}
      <mesh>
        <sphereGeometry args={[selected ? 0.17 : 0.115, 20, 20]} />
        <meshStandardMaterial
          color={node.anomaly ? "#ff7887" : node.color}
          emissive={node.anomaly ? "#ff526b" : node.color}
          emissiveIntensity={selected ? 1.25 : 0.45}
          roughness={0.32}
          metalness={0.12}
        />
      </mesh>
      {selected && (
        <mesh>
          <sphereGeometry args={[0.23, 20, 20]} />
          <meshBasicMaterial color="#b8c3ff" transparent opacity={0.16} />
        </mesh>
      )}
    </group>
  );
}

function SceneContents({ selected, onSelect }) {
  const topology = useMemo(makeTopology, []);
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 5]} intensity={10} color="#aabaff" />
      <pointLight position={[-4, 0, 3]} intensity={5} color="#49d9c5" />
      {topology.edges.map(edge => (
        <Line
          key={edge.id}
          points={[edge.source.position, edge.target.position]}
          color={edge.anomaly ? "#ff7887" : edge.source.layer === 0 ? "#53cbbb" : "#6978bd"}
          transparent
          opacity={edge.anomaly ? 0.68 : 0.24}
          lineWidth={edge.anomaly ? 1.2 : 0.65}
        />
      ))}
      {topology.nodes.map(node => (
        <NeuralNode
          key={node.id}
          node={node}
          selected={selected === node.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
    </>
  );
}

export default function NeuralScene({ onSelectNode = () => {} }) {
  const [selected, setSelected] = useState(null);
  function handleSelect(node) {
    setSelected(node.id);
    onSelectNode({
      id: node.id,
      label: node.label,
      kind: node.kind,
      layer: node.layer + 1,
      index: node.index + 1,
    });
  }

  return (
    <div className="neural-scene">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.25, 12.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setSelected(null)}
      >
        <SceneContents selected={selected} onSelect={handleSelect} />
      </Canvas>
      <div className="scene-vignette"/>
    </div>
  );
}
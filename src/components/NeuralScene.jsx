
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const layouts = {
  model: [
    [-3.8, 0, 0],
    [-1.9, 1.05, 0],
    [0, 0, 0],
    [1.9, 1.05, 0],
    [3.8, 0, 0],
  ],
  agent: [
    [-3.8, 0, 0],
    [-1.8, 0, 0],
    [0, 1.15, 0],
    [0, -1.15, 0],
    [2.3, 0, 0],
  ],
};

const palettes = {
  input: "#3988ff",
  layer: "#8b72ff",
  database: "#8a9db5",
  tool: "#36a5ee",
  output: "#32b77b",
};

function Node({ position, label, kind, active }) {
  const color = palettes[kind] || palettes.layer;

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.45 : 0.18}
          roughness={0.35}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.11}
        />
      </mesh>

      <Text
        position={[0, -0.55, 0]}
        fontSize={0.19}
        color="#34435b"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

function Connection({ start, end, warning = false }) {
  return (
    <line>
      <bufferGeometry
        attach="geometry"
        onUpdate={(geometry) => {
          geometry.setFromPoints([
            { x: start[0], y: start[1], z: start[2] },
            { x: end[0], y: end[1], z: end[2] },
          ]);
        }}
      />
      <lineBasicMaterial
        attach="material"
        color={warning ? "#f4a34d" : "#a6c8ff"}
        transparent
        opacity={warning ? 0.9 : 0.7}
      />
    </line>
  );
}

function Network({ type, nodes }) {
  const positions = layouts[type] || layouts.model;

  const connections =
    type === "model"
      ? [
          [0, 1],
          [0, 2],
          [1, 2],
          [1, 3],
          [2, 3],
          [2, 4],
          [3, 4],
        ]
      : [
          [0, 1],
          [1, 2],
          [1, 3],
          [2, 4],
          [3, 4],
          [2, 3],
        ];

  return (
    <group>
      {connections.map(([from, to], index) => (
        <Connection
          key={`${from}-${to}`}
          start={positions[from]}
          end={positions[to]}
          warning={type === "agent" && index === 2}
        />
      ))}

      {nodes.map((node, index) => (
        <Node
          key={node.id}
          position={positions[index]}
          label={node.label}
          kind={node.kind}
          active={index === 2}
        />
      ))}
    </group>
  );
}

export default function NeuralScene({
  type = "model",
  nodes = [],
  selectedName = "",
}) {
  return (
    <div className="neural-scene">
      <div className="scene-label">
        <span>{type === "model" ? "MODEL GRAPH" : "EXECUTION GRAPH"}</span>
        <span>{selectedName}</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 11], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 4, 5]} intensity={0.8} />
        <Network type={type} nodes={nodes} />

        <OrbitControls
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
          enableDamping={false}
        />
      </Canvas>

      <div className="scene-caption">
        {type === "model"
          ? "Simplified layer flow · not a live activation map"
          : "Illustrative agent steps · not a live execution trace"}
      </div>
    </div>
  );
}

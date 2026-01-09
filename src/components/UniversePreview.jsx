import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const Node = ({ position, color, size, label }) => {
    const mesh = useRef();

    useFrame((state) => {
        // Subtle rotation/floating
        if (mesh.current) {
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position}>
                <mesh ref={mesh}>
                    <dodecahedronGeometry args={[size, 0]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                        wireframe
                    />
                </mesh>
                <mesh scale={[0.5, 0.5, 0.5]}>
                    <dodecahedronGeometry args={[size, 0]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                {label && (
                    <Text
                        position={[0, -size * 2, 0]}
                        fontSize={0.5}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {label}
                    </Text>
                )}
            </group>
        </Float>
    );
};

const Connection = ({ start, end, color }) => {
    const points = useMemo(() => [start, end], [start, end]);
    const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p))), [points]);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial color={color} transparent opacity={0.3} />
        </line>
    );
};

const UniverseScene = () => {
    const group = useRef();

    // Generate some random nodes
    const nodes = useMemo(() => {
        const temp = [];
        // Central Core
        temp.push({ id: 0, position: [0, 0, 0], size: 2, color: "#e879f9", label: "MULTIVAC CORE" });

        // Orbiting Universes
        for (let i = 1; i <= 20; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 10 + Math.random() * 15;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            temp.push({
                id: i,
                position: [x, y, z],
                size: 0.5 + Math.random(),
                color: Math.random() > 0.5 ? "#22d3ee" : "#a855f7",
                label: Math.random() > 0.8 ? `UNIVERSE-${i}` : null
            });
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group ref={group}>
            {nodes.map(node => (
                <Node key={node.id} {...node} />
            ))}
            {/* Connections to Core */}
            {nodes.slice(1).map(node => (
                <Connection key={`link-${node.id}`} start={[0, 0, 0]} end={node.position} color={node.color} />
            ))}
        </group>
    );
};

const UniversePreview = () => {
    return (
        <div className="w-full h-full bg-[#050b14] relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 p-4 bg-black/40 backdrop-blur-md rounded-lg border border-[#22d3ee]/30">
                <h2 className="text-xl font-['Rajdhani'] font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#22d3ee] animate-pulse"></span>
                    THE BUILDER'S OASIS
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-1">SIMULATION_ACTIVE // UNIVERSE_COUNT: 21</p>
            </div>

            <Canvas camera={{ position: [0, 0, 35], fov: 60 }}>
                <fog attach="fog" args={['#050b14', 20, 50]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <UniverseScene />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default UniversePreview;

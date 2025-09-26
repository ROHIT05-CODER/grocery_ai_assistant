// src/AvatarScene.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function AvatarModel({ speaking }) {
  const { scene } = useGLTF("/avatar.glb"); // Put your avatar.glb inside public folder
  const mouthRef = useRef();

  useFrame(() => {
    if (mouthRef.current) {
      mouthRef.current.scale.y = speaking
        ? 1 + Math.sin(Date.now() * 0.01) * 0.3 // talking effect
        : 1;
    }
  });

  return (
    <primitive object={scene} scale={2} position={[0, -1, 0]}>
      <mesh ref={mouthRef} />
    </primitive>
  );
}

export default function AvatarScene({ speaking }) {
  return (
    <Canvas style={{ height: 300 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <AvatarModel speaking={speaking} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

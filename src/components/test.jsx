import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Preload,
  OrbitControls,
  Loader,
  Stats,
  Environment,
  Sky,
  AccumulativeShadows,
} from "@react-three/drei";

function Probe({ ...props }) {
  const { scene } = useGLTF(
    "https://images.smartcloudstudio.com/fiber/test2.glb"
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // Escala el objeto raíz
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

export default function Test() {
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        shadows
        gl={{ antialias: true }}
        camera={{ position: [10, 11, 12], fov: 60, near: 0.01 }}
        toneMapped={true}
      >
        <Suspense fallback={null}>
          <Sky />
          <AccumulativeShadows
            position={[0, -0.001, 0]}
            opacity={0.6}
            scale={10}
            blur={2.5}
            far={1}
          />
          {/* DISMINUYE LA LUZ AMBIENTAL */}
          <ambientLight intensity={1} position={[-10, 10, 10]} />
          <directionalLight
            position={[8, 10, -5]}
            intensity={3}
            castShadow
            shadow-bias={-0.001}
            shadow-normalBias={0.05}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={100}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />

          <Probe position={[0, 0, 0]} />

          <Environment
            preset="sunset"
            backgroundIntensity={0.2}
            environmentIntensity={0.2}
          />
        </Suspense>
        <Preload all />
        <OrbitControls minDistance={0.1} enableDamping dampingFactor={0.1} />
      </Canvas>
      <Stats />
      <Loader
        containerStyles={{
          background: "rgba(20, 22, 30, 0.9)",
          backdropFilter: "blur(6px)",
          borderRadius: "20px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.2)",
          padding: "32px",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          transition: "all 0.3s ease-in-out",
        }}
        innerStyles={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "24px 20px",
          boxShadow: "inset 0 0 10px rgba(255,255,255,0.05)",
          width: "100%",
          maxWidth: "320px",
          textAlign: "center",
          backdropFilter: "blur(2px)",
        }}
        barStyles={{
          height: "10px",
          width: "100%",
          borderRadius: "10px",
          background: "linear-gradient(90deg, #22d3ee, #6366f1)",
          animation: "loaderBar 2s linear infinite",
        }}
        dataStyles={{
          color: "#e0e7ff",
          fontSize: "1.2rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif",
          marginTop: "4px",
        }}
        dataInterpolation={(p) => `Cargando escena... ${p.toFixed(0)}%`}
      />
    </>
  );
}

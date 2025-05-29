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
import * as THREE from "three";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-bias={-0.001}
        shadow-normalBias={0.05}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Ejemplo de spotlight funcional */}

      <spotLight
        position={[0, 30, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
        target-position={[0, 0, 0]}
      />
    </>
  );
}

function Probe({ ...props }) {
  const { scene } = useGLTF(
    "https://images.smartcloudstudio.com/fiber/test3.glb"
  );

  useEffect(() => {
    scene.traverse((child) => {
      console.log(child.name);
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Asigna un material estándar para asegurar buenas sombras
        // child.material = new THREE.MeshStandardMaterial({
        //   color: "#cccccc",
        //   metalness: 0.2,
        //   roughness: 0.7,
        // });
      }
      if (child.name === "Plane") {
        child.receiveShadow = true;
        child.castShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#ffffff",
          metalness: 0.2,
          roughness: 0.7,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

export default function Test() {
  return (
    <>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [10, 11, 12], fov: 60, near: 0.01 }}
        toneMapped={true}
      >
        <Suspense fallback={null}>
          <Sky />

          {/* DISMINUYE LA LUZ AMBIENTAL */}
          <Lights />
          <Probe position={[0, 0, 0]} />

          <Environment
            preset="city"
            backgroundIntensity={0.2}
            environmentIntensity={0.2}
          />
          {/* plAno recibidor de sombras */}
          {/* <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
              color="#000000"
              opacity={1}
              side={2}
              depthWrite={false}
            />
          </mesh> */}
        </Suspense>
        <Preload all />
        {/* limitar controles a menor que 0 en y */}
        <OrbitControls
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={1.0}
          minDistance={1}
        />
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

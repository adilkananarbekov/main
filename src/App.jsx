import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import './App.css';

function HouseModel(props) {
  const { scene } = useGLTF('/models/house.glb');
  return <primitive object={scene} {...props} />;
}

function Scene() {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <group ref={group} position={[0, -0.7, 0]} scale={1.1}>
        <HouseModel />
      </group>
      <ContactShadows position={[0, -1.05, 0]} opacity={0.5} blur={2.5} scale={12} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.7} />
    </>
  );
}

useGLTF.preload('/models/house.glb');

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">Portfolio</p>
          <h1>Adilkan Anarbekov</h1>
          <p className="role">Generalist Programmer</p>
          <p className="summary">
            Building reliable mobile and web experiences with clean architecture,
            strong fundamentals, and a focus on real-world impact.
          </p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">View Projects</a>
            <a className="btn ghost" href="#contact">Contact</a>
          </div>
        </div>
        <div className="hero-canvas">
          <Canvas
            shadows
            camera={{ position: [2.8, 1.6, 3.4], fov: 40 }}
            dpr={[1, 2]}
          >
            <Suspense
              fallback={
                <Html center className="loader">
                  Loading 3D...
                </Html>
              }
            >
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      </header>

      <main className="sections">
        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="grid">
            <article className="card">
              <h3>Smart Light Control</h3>
              <p>Flutter + Arduino system for Bluetooth light control.</p>
              <div className="tags">
                <span>Flutter</span>
                <span>Arduino</span>
                <span>Bluetooth</span>
              </div>
            </article>
            <article className="card">
              <h3>Language Learning App</h3>
              <p>Vocabulary app with auth and cloud word database.</p>
              <div className="tags">
                <span>Firebase</span>
                <span>Dart</span>
                <span>Firestore</span>
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="section split">
          <div>
            <h2>Contact</h2>
            <p>Let us build something meaningful together.</p>
          </div>
          <div className="contact-box">
            <p>Email: adilkananarbekov751@gmail.com</p>
            <p>Telegram: @Adilkan_07</p>
            <p>GitHub: github.com/adilkananarbekov</p>
          </div>
        </section>
      </main>
    </div>
  );
}

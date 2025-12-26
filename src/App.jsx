import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import './App.css';

const projects = [
  {
    title: 'Smart Light Control',
    description: 'Bluetooth light control system for Arduino with a Flutter app.',
    meta: 'Hardware + Mobile',
    year: '2024',
    tags: ['Flutter', 'Arduino', 'Bluetooth'],
    link: 'https://github.com/adilkananarbekov/learn_kyrgyz',
    accent: 'var(--accent-1)',
  },
  {
    title: 'Kyrgyz-English Learning',
    description: 'Duolingo-inspired app with auth and cloud vocabulary storage.',
    meta: 'Mobile App',
    year: '2025',
    tags: ['Firebase', 'Dart', 'Firestore'],
    link: 'https://github.com/adilkananarbekov/learn_kyrgyz',
    accent: 'var(--accent-2)',
  },
  {
    title: '3D Portfolio',
    description: 'Interactive landing with GLB assets and cinematic lighting.',
    meta: 'Web Experience',
    year: '2025',
    tags: ['React', 'Three.js', 'Vite'],
    link: '#contact',
    accent: 'var(--accent-3)',
  },
  {
    title: 'Study Planner',
    description: 'Productivity app with streaks, timers, and progress insights.',
    meta: 'Concept',
    year: '2025',
    tags: ['React Native', 'Firebase', 'UX'],
    link: '#projects',
    accent: 'var(--accent-4)',
  },
];

const tickerSkills = [
  'Flutter',
  'React Native',
  'Firebase',
  'Three.js',
  'Arduino',
  'Bluetooth',
  'UI/UX',
  'Git',
  'Dart',
  'Firestore',
  'Vite',
  'Figma',
];

function HouseModel(props) {
  const { scene } = useGLTF('/models/house.glb');
  return <primitive object={scene} {...props} />;
}

function Scene() {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 7, 5]} intensity={1.1} />
      <group ref={group} position={[0, -0.9, 0]} scale={1}>
        <HouseModel />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.45} blur={2.8} scale={14} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

useGLTF.preload('/models/house.glb');

export default function App() {
  const sliderRef = useRef(null);

  const handleSlide = (direction) => {
    if (!sliderRef.current) {
      return;
    }
    sliderRef.current.scrollBy({
      left: direction * 360,
      behavior: 'smooth',
    });
  };

  return (
    <div className="app">
      <div className="bg-glow glow-left" />
      <div className="bg-glow glow-right" />

      <header className="hero container">
        <div className="hero-text">
          <p className="eyebrow">Portfolio / 2025</p>
          <h1>Adilkan Anarbekov</h1>
          <p className="role">Generalist Programmer</p>
          <p className="summary">
            I build clean, reliable apps with strong fundamentals, thoughtful UX,
            and a focus on real-world impact.
          </p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">Explore Projects</a>
            <a className="btn ghost" href="mailto:adilkananarbekov751@gmail.com">Email Me</a>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <p className="stat-label">Hackathons</p>
              <p className="stat-value">2</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Flutter Intensive</p>
              <p className="stat-value">6 months</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Competitive C++</p>
              <p className="stat-value">2 years</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="portrait-card">
            <img src="/images/portrait.png" alt="Adilkan Anarbekov portrait" />
            <div className="portrait-meta">
              <p>Flutter, Firebase, IoT</p>
              <span>Based on strong programming fundamentals</span>
            </div>
          </div>
          <div className="hero-canvas">
            <Canvas
              shadows
              camera={{ position: [4.2, 2.4, 5.8], fov: 36 }}
              dpr={[1, 2]}
            >
              <Suspense
                fallback={(
                  <Html center className="loader">
                    Loading 3D...
                  </Html>
                )}
              >
                <Scene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </header>

      <section className="ticker">
        <div className="ticker-track">
          {tickerSkills.map((skill) => (
            <span key={`skill-${skill}`} className="ticker-pill">{skill}</span>
          ))}
        </div>
        <div className="ticker-track" aria-hidden="true">
          {tickerSkills.map((skill) => (
            <span key={`skill-dup-${skill}`} className="ticker-pill">{skill}</span>
          ))}
        </div>
      </section>

      <main className="sections container">
        <section id="about" className="section about">
          <div className="section-head">
            <div>
              <h2>About</h2>
              <p className="section-subtitle">
                A generalist developer who loves building end-to-end systems,
                from hardware integration to polished user interfaces.
              </p>
            </div>
            <div className="section-actions">
              <a className="text-link" href="https://github.com/adilkananarbekov">GitHub</a>
              <a className="text-link" href="https://www.linkedin.com/in/%D0%B0%D0%B4%D0%B8%D0%BB%D0%BA%D0%B0%D0%BD-%D0%B0%D0%BD%D0%B0%D1%80%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-5b157b303/">LinkedIn</a>
            </div>
          </div>

          <div className="about-grid">
            <div className="panel">
              <h3>Focus</h3>
              <ul className="bullet-list">
                <li>Mobile apps with clean UX and reliable architecture.</li>
                <li>IoT projects that connect hardware to modern interfaces.</li>
                <li>Fast prototyping with real user value.</li>
              </ul>
            </div>
            <div className="panel accent">
              <h3>Stack</h3>
              <div className="tag-cloud">
                {['Flutter', 'Dart', 'Firebase', 'React', 'Three.js', 'Arduino', 'Git'].map((item) => (
                  <span key={`tag-${item}`}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-head">
            <div>
              <h2>Featured Projects</h2>
              <p className="section-subtitle">
                A mix of real products and experimental builds that showcase my range.
              </p>
            </div>
            <div className="slider-controls">
              <button type="button" className="slider-btn" onClick={() => handleSlide(-1)}>
                Prev
              </button>
              <button type="button" className="slider-btn" onClick={() => handleSlide(1)}>
                Next
              </button>
            </div>
          </div>
          <div ref={sliderRef} className="slider">
            {projects.map((project) => (
              <article key={project.title} className="card" style={{ '--accent': project.accent }}>
                <div className="card-top">
                  <span className="card-pill">{project.meta}</span>
                  <span className="card-year">{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={`${project.title}-${tag}`}>{tag}</span>
                  ))}
                </div>
                <a className="card-link" href={project.link}>Open</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section split">
          <div className="panel big">
            <h2>How I Work</h2>
            <p className="section-subtitle">
              I like building fast, testing assumptions early, and polishing the details
              that make a product feel premium.
            </p>
            <div className="process-grid">
              {['Discover', 'Design', 'Build', 'Ship'].map((step, index) => (
                <div key={step} className="process-card">
                  <span className="process-index">0{index + 1}</span>
                  <h4>{step}</h4>
                  <p>Focused iterations with clear outcomes.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel contact-panel" id="contact">
            <h2>Contact</h2>
            <p className="section-subtitle">Open to collaboration and ambitious ideas.</p>
            <div className="contact-list">
              <p>Email: adilkananarbekov751@gmail.com</p>
              <p>Telegram: @Adilkan_07</p>
              <p>GitHub: github.com/adilkananarbekov</p>
              <p>WhatsApp: +996 551 255 272</p>
            </div>
            <a className="btn primary" href="mailto:adilkananarbekov751@gmail.com">
              Start a project
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Designed and built by Adilkan Anarbekov.</p>
      </footer>
    </div>
  );
}

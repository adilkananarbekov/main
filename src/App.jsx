import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import {
  FaGithub,
  FaLinkedinIn,
  FaTelegramPlane,
  FaWhatsapp,
} from 'react-icons/fa';
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
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/house.glb`);
  return <primitive object={scene} {...props} />;
}

function Scene() {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 7, 5]} intensity={1.1} />
      <group ref={group} position={[0, -0.95, 0]} scale={1}>
        <HouseModel />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.45} blur={2.8} scale={14} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/house.glb`);

export default function App() {
  const [roleText, setRoleText] = useState('');
  const [roleMode, setRoleMode] = useState('');

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!parallaxElements.length) {
      return undefined;
    }

    let frame = null;
    const update = () => {
      frame = null;
      const scrollY = window.scrollY || 0;
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.dataset.parallax || '0.08');
        element.style.setProperty('--parallax', `${scrollY * speed}px`);
      });
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const fullTitle = 'Generalist Programmer';

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const updateText = (value) => {
      if (isActive) {
        setRoleText(value);
      }
    };

    const typeText = async (text, speed = 60) => {
      for (let i = 1; i <= text.length; i += 1) {
        updateText(text.slice(0, i));
        await sleep(speed);
      }
    };

    const deleteText = async (text, speed = 40) => {
      for (let i = text.length; i >= 0; i -= 1) {
        updateText(text.slice(0, i));
        await sleep(speed);
      }
    };

    const run = async () => {
      await typeText(fullTitle);
      await sleep(600);
      await deleteText(fullTitle);
      await sleep(250);
      await typeText('Student', 80);
      await sleep(900);
      setRoleMode('glitch');
      updateText('Flutter Developer');
      await sleep(1100);
      setRoleMode('fade');
      await sleep(400);
      setRoleMode('');
      updateText(fullTitle);
    };

    run();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="app">
      <div className="bg-glow glow-left" />
      <div className="bg-glow glow-right" />

      <header className="hero">
        <div className="hero-background" aria-hidden="true">
          <Canvas
            shadows
            camera={{ position: [6.1, 3.2, 8.2], fov: 34 }}
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
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner container">
          <div className="hero-text">
            <p className="eyebrow">Portfolio / 2025</p>
            <h1>Adilkan Anarbekov</h1>
            <p
              className={`role ${roleMode ? `role--${roleMode}` : ''}`}
              data-text={roleText}
              aria-live="polite"
            >
              {roleText}
            </p>
            <p className="summary">
              I build clean, reliable apps with strong fundamentals, thoughtful UX,
              and a focus on real-world impact.
            </p>
            <div className="cta-row">
              <a className="btn primary" href="#projects">Explore Projects</a>
              <a className="btn ghost" href="mailto:adilkananarbekov751@gmail.com">Email Me</a>
            </div>
            <div className="social-buttons">
              <a className="icon-btn" href="https://t.me/Adilkan_07" aria-label="Telegram">
                <FaTelegramPlane />
              </a>
              <a className="icon-btn" href="https://wa.me/996551255272" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a className="icon-btn" href="https://github.com/adilkananarbekov" aria-label="GitHub">
                <FaGithub />
              </a>
              <a
                className="icon-btn"
                href="https://www.linkedin.com/in/%D0%B0%D0%B4%D0%B8%D0%BB%D0%BA%D0%B0%D0%BD-%D0%B0%D0%BD%D0%B0%D1%80%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-5b157b303/"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-card reveal lift" data-parallax="0.04">
                <p className="stat-label">Hackathons</p>
                <p className="stat-value">2</p>
              </div>
              <div className="stat-card reveal lift" data-parallax="0.06">
                <p className="stat-label">Flutter Intensive</p>
                <p className="stat-value">6 months</p>
              </div>
              <div className="stat-card reveal lift" data-parallax="0.05">
                <p className="stat-label">Competitive C++</p>
                <p className="stat-value">2 years</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-card reveal lift" data-parallax="0.08">
              <img
                src={`${import.meta.env.BASE_URL}images/portrait.png`}
                alt="Adilkan Anarbekov portrait"
              />
              <div className="portrait-meta">
                <p>Flutter, Firebase, IoT</p>
                <span>Based on strong programming fundamentals</span>
              </div>
            </div>
            <div className="hero-card reveal lift" data-parallax="0.04">
              <p className="hero-card-title">Currently focused on</p>
              <p className="hero-card-text">React Native + Firebase product builds</p>
              <div className="hero-card-tags">
                <span>Mobile</span>
                <span>Realtime</span>
                <span>UX polish</span>
              </div>
            </div>
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
            <div className="panel reveal lift" data-parallax="0.04">
              <h3>Focus</h3>
              <ul className="bullet-list">
                <li>Mobile apps with clean UX and reliable architecture.</li>
                <li>IoT projects that connect hardware to modern interfaces.</li>
                <li>Fast prototyping with real user value.</li>
              </ul>
            </div>
            <div className="panel accent reveal lift" data-parallax="0.02">
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
          </div>
          <div className="slider">
            {projects.map((project) => (
              <article
                key={project.title}
                className="card reveal lift"
                style={{ '--accent': project.accent }}
                data-parallax="0.03"
              >
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
          <div className="panel big reveal lift" data-parallax="0.03">
            <h2>How I Work</h2>
            <p className="section-subtitle">
              I like building fast, testing assumptions early, and polishing the details
              that make a product feel premium.
            </p>
            <div className="process-grid">
              {['Discover', 'Design', 'Build', 'Ship'].map((step, index) => (
                <div key={step} className="process-card reveal lift" data-parallax="0.02">
                  <span className="process-index">0{index + 1}</span>
                  <h4>{step}</h4>
                  <p>Focused iterations with clear outcomes.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel contact-panel reveal lift" id="contact" data-parallax="0.05">
            <h2>Contact</h2>
            <p className="section-subtitle">Open to collaboration and ambitious ideas.</p>
            <div className="contact-list">
              <p>Email: adilkananarbekov751@gmail.com</p>
              <p>Telegram: @Adilkan_07</p>
              <p>GitHub: github.com/adilkananarbekov</p>
              <p>WhatsApp: +996 551 255 272</p>
            </div>
            <div className="contact-actions">
              <a className="btn ghost" href="https://t.me/Adilkan_07">
                <FaTelegramPlane /> Telegram
              </a>
              <a className="btn ghost" href="https://wa.me/996551255272">
                <FaWhatsapp /> WhatsApp
              </a>
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

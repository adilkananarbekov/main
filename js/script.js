(() => {
  const RESUME_URL = "./resume.i18n.json";
  const LANGS = ["ru", "en"];
  const FALLBACK_MESSAGES = {
    ru: {
      loading: "Загрузка…",
      error:
        "Не удалось загрузить данные. Откройте сайт через локальный сервер или GitHub Pages.",
    },
    en: {
      loading: "Loading…",
      error: "Couldn't load data. Open via a local server or GitHub Pages.",
    },
  };

  const elements = {
    status: document.getElementById("status"),
    content: document.getElementById("content"),
    navList: document.getElementById("navList"),
    brandMark: document.getElementById("brandMark"),
    brandName: document.getElementById("brandName"),
    hero: document.getElementById("about"),
    skills: document.getElementById("skills"),
    projects: document.getElementById("projects"),
    education: document.getElementById("education"),
    experience: document.getElementById("experience"),
    languages: document.getElementById("languages"),
    contact: document.getElementById("contact"),
    footer: document.getElementById("footer"),
    langButtons: Array.from(document.querySelectorAll(".lang__btn")),
  };

  const state = {
    data: null,
    lang: "ru",
    sectionId: null,
  };

  let navObserver = null;
  let pagerBound = false;
  let pagerSectionIds = [];
  let wheelLockUntil = 0;
  let wheelAccumY = 0;
  let wheelResetTimer = null;

  function setStatus(message, visible = true) {
    if (!elements.status) return;
    elements.status.textContent = message ?? "";
    elements.status.classList.toggle("is-visible", Boolean(visible));
  }

  function clearStatus() {
    setStatus("", false);
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    );
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let contentSwapToken = 0;

  async function swapContentWithFade(action) {
    const token = ++contentSwapToken;
    const container = elements.content;
    if (!container || prefersReducedMotion()) {
      action();
      return;
    }

    container.classList.add("is-fading");
    await wait(220);
    if (token !== contentSwapToken) return;
    action();
    requestAnimationFrame(() => {
      if (token !== contentSwapToken) return;
      container.classList.remove("is-fading");
    });
  }

  function template(str, vars) {
    return String(str ?? "").replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{${key}}`,
    );
  }

  function el(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text != null) node.textContent = options.text;
    if (options.attrs) {
      for (const [key, value] of Object.entries(options.attrs)) {
        if (value == null) continue;
        node.setAttribute(key, String(value));
      }
    }
    if (options.children) node.append(...options.children);
    return node;
  }

  function svgToDataUri(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";

  const ICONS = {
    flutter: {
      paths: [
        {
          d: "M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z",
        },
      ],
    },
    firebase: {
      paths: [
        {
          d: "M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z",
        },
      ],
    },
    dart: {
      paths: [
        {
          d: "M4.105 4.105S9.158 1.58 11.684.316a3.079 3.079 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105l3.789-7.895zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263L4.784 4.784zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643-.302-.267-.567-.468-1.07-.462-.37.014-.87.195-.87.195L6.341 4.105l10.498.001z",
        },
      ],
    },
    git: {
      paths: [
        {
          d: "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187",
        },
      ],
    },
    github: {
      paths: [
        {
          d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
        },
      ],
    },
    google: {
      paths: [
        {
          d: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
        },
      ],
    },
    arduino: {
      paths: [
        {
          d: "M18.087 6.146c-.3 0-.607.017-.907.069-2.532.367-4.23 2.239-5.18 3.674-.95-1.435-2.648-3.307-5.18-3.674a6.49 6.49 0 0 0-.907-.069C2.648 6.146 0 8.77 0 12s2.656 5.854 5.913 5.854c.3 0 .607-.017.916-.069 2.531-.376 4.23-2.247 5.18-3.683.949 1.436 2.647 3.307 5.18 3.683.299.043.607.069.915.069C21.344 17.854 24 15.23 24 12s-2.656-5.854-5.913-5.854zM6.53 15.734a3.837 3.837 0 0 1-.625.043c-2.148 0-3.889-1.7-3.889-3.777 0-2.085 1.749-3.777 3.898-3.777.208 0 .416.017.624.043 2.39.35 3.847 2.768 4.347 3.734-.508.974-1.974 3.384-4.355 3.734zm11.558.043c-.208 0-.416-.017-.624-.043-2.39-.35-3.856-2.768-4.347-3.734.491-.966 1.957-3.384 4.347-3.734.208-.026.416-.043.624-.043 2.149 0 3.89 1.7 3.89 3.777 0 2.085-1.75 3.777-3.89 3.777zm1.65-4.404v1.134h-1.205v1.182h-1.156v-1.182H16.17v-1.134h1.206V10.19h1.156v1.183h1.206zM4.246 12.498H7.82v-1.125H4.245v1.125z",
        },
      ],
    },
    cplusplus: {
      paths: [
        {
          d: "M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z",
        },
      ],
    },
    bluetooth: {
      paths: [
        {
          d: "M12 0C6.76 0 3.1484 2.4895 3.1484 12S6.76 24 12 24c5.24 0 8.8516-2.4895 8.8516-12S17.24 0 12 0zm-.7773 1.6816l6.2148 6.2149L13.334 12l4.1035 4.1035-6.2148 6.2149V14.125l-3.418 3.42-1.2422-1.2442L10.8515 12l-4.289-4.3008 1.2422-1.2441 3.418 3.4199V1.6816zm1.748 4.2442v3.9687l1.9844-1.9843-1.9844-1.9844zm0 8.1816v3.9668l1.9844-1.9844-1.9844-1.9824Z",
        },
      ],
    },
    team: {
      paths: [
        {
          d: "M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
        {
          d: "M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z",
        },
      ],
    },
    hackathons: {
      paths: [
        {
          d: "M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    competitive: {
      paths: [
        {
          d: "M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    api: {
      paths: [
        {
          d: "M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z",
        },
      ],
    },
    integration: {
      paths: [
        {
          d: "M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    algorithms: {
      paths: [
        {
          d: "M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    ai: {
      paths: [
        {
          d: "M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    computer: {
      paths: [
        {
          d: "M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    typing: {
      paths: [
        {
          d: "M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    chat: {
      paths: [
        {
          d: "M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z",
        },
        {
          d: "M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z",
        },
      ],
    },
    adaptability: {
      paths: [
        {
          d: "M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    responsibility: {
      paths: [
        {
          d: "M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    organization: {
      paths: [
        {
          d: "M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
        {
          d: "M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    },
    learning: {
      paths: [
        {
          d: "M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
        {
          d: "M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z",
        },
      ],
    },
  };

  function svgIcon(name, extraClass = "") {
    const icon = ICONS[name];
    if (!icon) return null;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute(
      "class",
      `icon icon--${name}${extraClass ? ` ${extraClass}` : ""}`,
    );

    for (const pathSpec of icon.paths) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", pathSpec.d);
      if (pathSpec.fillRule) path.setAttribute("fill-rule", pathSpec.fillRule);
      if (pathSpec.clipRule) path.setAttribute("clip-rule", pathSpec.clipRule);
      svg.append(path);
    }

    return svg;
  }

  function iconKeysForLabel(label) {
    const text = String(label ?? "").trim();
    const value = text.toLowerCase();

    if (!value) return [];

    if (value === "flutter") return ["flutter"];
    if (value === "dart") return ["dart"];
    if (value.startsWith("firebase")) return ["firebase"];
    if (value.startsWith("google")) return ["google"];
    if (value === "github") return ["github"];
    if (value === "git") return ["git"];
    if (value.includes("rest api")) return ["api"];
    if (value.includes("интеграция") || value.includes("integration")) {
      return ["integration"];
    }
    if (value.includes("алгоритм") || value.includes("algorithm")) {
      return ["algorithms"];
    }
    if (value.includes("c++")) return ["cplusplus"];
    if (value.includes("arduino")) return ["arduino"];
    if (value.includes("bluetooth")) return ["bluetooth"];
    if (
      value.includes("ai tools") ||
      value.includes("ai-инстру") ||
      value.includes("ai tools usage")
    ) {
      return ["ai"];
    }
    if (value.includes("пк") || value.includes("pc user")) return ["computer"];
    if (
      value.includes("слепая печать") ||
      value.includes("blind typing") ||
      value.includes("wpm") ||
      value.includes("qwerty")
    ) {
      return ["typing"];
    }
    if (value.includes("communication") || value.includes("коммуника")) {
      return ["chat"];
    }
    if (value.includes("team") || value.includes("команд")) return ["team"];
    if (value.includes("fast learner") || value.includes("быстро обуч")) {
      return ["learning"];
    }
    if (value.includes("adaptability") || value.includes("адаптив")) {
      return ["adaptability"];
    }
    if (value.includes("responsibility") || value.includes("ответствен")) {
      return ["responsibility"];
    }
    if (value.includes("self-organization") || value.includes("самоорган")) {
      return ["organization"];
    }

    return [];
  }

  function groupTechLabels(items) {
    const source = (items ?? [])
      .map((i) => String(i ?? "").trim())
      .filter(Boolean);
    const entries = [];

    const firebase = { index: Infinity, parts: new Set() };
    const google = { index: Infinity, parts: new Set() };
    const git = { index: Infinity, present: false };
    const github = { index: Infinity, present: false };

    for (const [idx, item] of source.entries()) {
      const value = item.toLowerCase();
      if (value.startsWith("firebase")) {
        firebase.index = Math.min(firebase.index, idx);
        const part = item.replace(/^firebase\s*/i, "").trim();
        if (part) firebase.parts.add(part);
        continue;
      }
      if (value.startsWith("google")) {
        google.index = Math.min(google.index, idx);
        const part = item.replace(/^google\s*/i, "").trim();
        if (part) google.parts.add(part);
        continue;
      }
      if (value === "git") {
        git.present = true;
        git.index = Math.min(git.index, idx);
        continue;
      }
      if (value === "github") {
        github.present = true;
        github.index = Math.min(github.index, idx);
        continue;
      }

      entries.push({ index: idx, label: item });
    }

    if (firebase.index !== Infinity) {
      const meta = firebase.parts.size
        ? Array.from(firebase.parts).join(" • ")
        : null;
      entries.push({
        index: firebase.index,
        label: "Firebase",
        meta,
        iconKeys: ["firebase"],
      });
    }

    if (google.index !== Infinity) {
      const meta = google.parts.size ? Array.from(google.parts).join(" • ") : null;
      entries.push({
        index: google.index,
        label: "Google",
        meta,
        iconKeys: ["google"],
      });
    }

    if (git.present && github.present) {
      entries.push({
        index: Math.min(git.index, github.index),
        label: "Git + GitHub",
        iconKeys: ["git", "github"],
      });
    } else if (git.present) {
      entries.push({ index: git.index, label: "Git", iconKeys: ["git"] });
    } else if (github.present) {
      entries.push({ index: github.index, label: "GitHub", iconKeys: ["github"] });
    }

    entries.sort((a, b) => a.index - b.index);

    const unique = new Set();
    return entries.filter((e) => {
      const key = `${e.label}::${e.meta ?? ""}::${(e.iconKeys ?? []).join(",")}`;
      if (unique.has(key)) return false;
      unique.add(key);
      return true;
    });
  }

  function makeChip(label, { strong = false, meta = null, iconKeys = null } = {}) {
    const text = String(label ?? "").trim();
    const className = strong ? "chip chip--strong" : "chip";
    const resolvedKeys = iconKeys ?? iconKeysForLabel(text);
    const icons = (resolvedKeys ?? [])
      .map((k) => svgIcon(k, "chip__icon"))
      .filter(Boolean);

    const content = meta
      ? el("span", {
          className: "chip__stack",
          children: [
            el("span", { className: "chip__label", text }),
            el("span", { className: "chip__meta", text: meta }),
          ],
        })
      : el("span", { className: "chip__label", text });

    return el("span", {
      className,
      children: [...icons, content],
    });
  }

  function initialsFromName(name) {
    const parts = String(name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  function avatarPlaceholder(name) {
    const initials = initialsFromName(name) || "AA";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22c55e"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
    <filter id="n" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"/>
    </filter>
  </defs>
  <rect width="900" height="900" rx="90" fill="url(#g)"/>
  <circle cx="720" cy="160" r="260" fill="rgba(255,255,255,0.14)"/>
  <circle cx="160" cy="780" r="330" fill="rgba(0,0,0,0.10)"/>
  <rect width="900" height="900" rx="90" filter="url(#n)" opacity="0.7"/>
  <text x="50%" y="54%" text-anchor="middle" font-family="Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        font-size="168" font-weight="750" fill="rgba(255,255,255,0.92)" letter-spacing="-6">${initials}</text>
</svg>`;
    return svgToDataUri(svg);
  }

  function screenshotPlaceholder(title, subtitle) {
    const safeTitle = String(title ?? "").slice(0, 42);
    const safeSubtitle = String(subtitle ?? "").slice(0, 42);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="rgba(34,197,94,0.22)"/>
      <stop offset="1" stop-color="rgba(59,130,246,0.18)"/>
    </linearGradient>
    <linearGradient id="fg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22c55e"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" rx="48" fill="rgba(255,255,255,0.02)"/>
  <rect x="36" y="36" width="1128" height="678" rx="42" fill="url(#bg)" stroke="rgba(255,255,255,0.18)"/>
  <circle cx="980" cy="210" r="220" fill="rgba(255,255,255,0.12)"/>
  <circle cx="230" cy="600" r="280" fill="rgba(0,0,0,0.10)"/>
  <rect x="96" y="96" width="110" height="10" rx="999" fill="url(#fg)" opacity="0.9"/>
  <text x="96" y="220" font-family="Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        font-size="44" font-weight="720" fill="rgba(255,255,255,0.92)">${safeTitle}</text>
  <text x="96" y="276" font-family="Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        font-size="26" font-weight="560" fill="rgba(255,255,255,0.78)">${safeSubtitle}</text>
</svg>`;
    return svgToDataUri(svg);
  }

  function normalizePhone(phone) {
    return String(phone ?? "").replace(/[^\d+]/g, "");
  }

  function githubHandle(url) {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts[0] ? `@${parts[0]}` : url;
    } catch {
      return url;
    }
  }

  function setActiveLanguageUI() {
    for (const btn of elements.langButtons) {
      const isActive = btn.dataset.lang === state.lang;
      btn.setAttribute("aria-pressed", String(isActive));
    }
  }

  function headerOffsetPx() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-h")
      .trim();
    const match = raw.match(/^(\d+(?:\.\d+)?)px$/);
    const headerHeight = match ? Number(match[1]) : 72;
    return headerHeight + 16;
  }

  function setNavCurrent(sectionId) {
    const links = Array.from(elements.navList.querySelectorAll(".nav__link"));
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      if (id && id === sectionId) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  function sectionIdFromHash(ids) {
    const raw = location.hash?.startsWith("#") ? location.hash.slice(1) : "";
    return raw && (ids ?? []).includes(raw) ? raw : null;
  }

  function applyActiveSection(sectionId) {
    if (!sectionId) return;

    for (const id of pagerSectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;
      const active = id === sectionId;
      section.classList.toggle("is-active", active);
      section.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) {
        section.scrollTop = 0;
        const cards = Array.from(section.querySelectorAll(".card"));
        for (const [idx, card] of cards.entries()) {
          card.style.setProperty("--enter-delay", `${idx * 70}ms`);
        }
      }
    }

    setNavCurrent(sectionId);
    state.sectionId = sectionId;
  }

  function setActiveSection(sectionId, options = {}) {
    const { animate = true, updateHistory = true, replace = false } = options;
    if (!pagerSectionIds.includes(sectionId)) return;
    if (sectionId === state.sectionId) return;

    if (updateHistory) {
      const url = `#${sectionId}`;
      if (replace) history.replaceState({ sectionId }, "", url);
      else history.pushState({ sectionId }, "", url);
    }

    const action = () => applyActiveSection(sectionId);
    if (animate) swapContentWithFade(action);
    else action();
  }

  function adjacentSectionId(direction) {
    const current = state.sectionId ?? pagerSectionIds[0];
    const idx = pagerSectionIds.indexOf(current);
    if (idx === -1) return null;

    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= pagerSectionIds.length) return null;
    return pagerSectionIds[nextIdx];
  }

  function bindPager() {
    if (pagerBound) return;
    pagerBound = true;

    document.addEventListener("click", (e) => {
      const link = e.target?.closest?.('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      if (!id || !pagerSectionIds.includes(id)) return;
      e.preventDefault();
      setActiveSection(id, { animate: true, updateHistory: true });
    });

    window.addEventListener("popstate", () => {
      const next = sectionIdFromHash(pagerSectionIds) ?? pagerSectionIds[0];
      if (next) setActiveSection(next, { animate: false, updateHistory: false });
    });

    document.addEventListener(
      "wheel",
      (e) => {
        if (!pagerSectionIds.length) return;
        if (e.ctrlKey) return;
        if (e.shiftKey) return;

        const target = e.target;
        if (target?.closest?.("textarea, input, select")) return;

        const absX = Math.abs(e.deltaX ?? 0);
        const absY = Math.abs(e.deltaY ?? 0);
        if (absY <= absX) return;

        let deltaY = e.deltaY ?? 0;
        if (!deltaY) return;
        if (e.deltaMode === 1) deltaY *= 40;
        if (e.deltaMode === 2) deltaY *= 800;

        const direction = deltaY > 0 ? 1 : -1;

        const activeSection = state.sectionId
          ? document.getElementById(state.sectionId)
          : null;

        if (activeSection) {
          const canScroll =
            activeSection.scrollHeight > activeSection.clientHeight + 1;

          if (canScroll) {
            const atTop = activeSection.scrollTop <= 0;
            const atBottom =
              activeSection.scrollTop + activeSection.clientHeight >=
              activeSection.scrollHeight - 2;
            const atEdge = direction > 0 ? atBottom : atTop;

            if (!atEdge) {
              wheelAccumY = 0;
              if (wheelResetTimer) {
                clearTimeout(wheelResetTimer);
                wheelResetTimer = null;
              }
              return;
            }
          }
        }

        e.preventDefault();

        const now = Date.now();
        if (now < wheelLockUntil) return;

        wheelAccumY += deltaY;
        if (wheelResetTimer) clearTimeout(wheelResetTimer);
        wheelResetTimer = setTimeout(() => {
          wheelAccumY = 0;
          wheelResetTimer = null;
        }, 120);

        if (Math.abs(wheelAccumY) < 60) return;

        const navDirection = wheelAccumY > 0 ? 1 : -1;
        wheelAccumY = 0;
        if (wheelResetTimer) {
          clearTimeout(wheelResetTimer);
          wheelResetTimer = null;
        }

        const next = adjacentSectionId(navDirection);
        if (!next) return;

        wheelLockUntil = now + 520;
        setActiveSection(next, {
          animate: !prefersReducedMotion(),
          updateHistory: true,
        });
      },
      { passive: false },
    );

    document.addEventListener("keydown", (e) => {
      if (!pagerSectionIds.length) return;

      const target = e.target;
      if (
        target &&
        (target.isContentEditable ||
          target.closest?.("textarea, input, select, [contenteditable='true']"))
      ) {
        return;
      }

      const key = e.key;
      let direction = null;
      if (key === "ArrowDown" || key === "PageDown") direction = 1;
      if (key === "ArrowUp" || key === "PageUp") direction = -1;
      if (direction == null) return;

      const next = adjacentSectionId(direction);
      if (!next) return;

      e.preventDefault();
      setActiveSection(next, {
        animate: !prefersReducedMotion(),
        updateHistory: true,
      });
    });
  }

  function setupPager(ui) {
    pagerSectionIds = (ui?.nav ?? []).map((i) => i.id).filter(Boolean);
    if (!pagerSectionIds.length) return;

    bindPager();

    const desired =
      sectionIdFromHash(pagerSectionIds) ?? state.sectionId ?? pagerSectionIds[0];
    applyActiveSection(desired);
    history.replaceState({ sectionId: desired }, "", `#${desired}`);
  }

  function bindNavCurrent(items) {
    navObserver?.disconnect();
    navObserver = null;

    const ids = (items ?? []).map((i) => i.id).filter(Boolean);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const initial = location.hash?.startsWith("#")
      ? location.hash.slice(1)
      : null;
    setNavCurrent(initial && ids.includes(initial) ? initial : sections[0].id);

    const rootMarginTop = headerOffsetPx();
    navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        setNavCurrent(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: `-${rootMarginTop}px 0px -65% 0px`,
        threshold: [0.12, 0.25, 0.4, 0.55, 0.7],
      },
    );

    for (const section of sections) navObserver.observe(section);
  }

  function renderNav(ui) {
    elements.navList.replaceChildren();
    const items = ui?.nav ?? [];

    for (const item of items) {
      const href = `#${item.id}`;
      const link = el("a", {
        className: "nav__link",
        text: item.label,
        attrs: { href },
      });
      elements.navList.append(el("li", { children: [link] }));
    }
  }

  function sectionTitle(id, text) {
    return el("h2", { className: "section__title", attrs: { id }, text });
  }

  function renderHero(data) {
    const { profile, summary, ui } = data;

    const avatar = el("div", {
      className: "avatar",
      children: [
        el("img", {
          attrs: {
            src: avatarPlaceholder(profile.fullName),
            alt: profile.fullName,
            loading: "lazy",
          },
        }),
      ],
    });

    const badges = el("div", {
      className: "hero__meta",
      children: [
        el("span", {
          className: "badge",
          children: [
            el("span", { className: "badge__dot", attrs: { "aria-hidden": "true" } }),
            el("span", { text: profile.location }),
          ],
        }),
        el("span", {
          className: "badge",
          children: [
            el("span", { className: "badge__dot", attrs: { "aria-hidden": "true" } }),
            el("span", { text: profile.availability }),
          ],
        }),
      ],
    });

    const contacts = el("div", {
      className: "hero__contacts",
      children: [
        el("a", {
          className: "btn btn--primary",
          attrs: { href: `mailto:${profile.contacts.email}` },
          children: [
            el("span", { text: ui.buttons.email }),
            el("span", { className: "btn__meta", text: profile.contacts.email }),
          ],
        }),
        el("a", {
          className: "btn",
          attrs: { href: `tel:${normalizePhone(profile.contacts.phone)}` },
          children: [
            el("span", { text: ui.buttons.phone }),
            el("span", { className: "btn__meta", text: profile.contacts.phone }),
          ],
        }),
        el("a", {
          className: "btn",
          attrs: {
            href: profile.contacts.github,
            target: "_blank",
            rel: "noreferrer",
          },
          children: [
            el("span", { text: ui.buttons.github }),
            el("span", { className: "btn__meta", text: githubHandle(profile.contacts.github) }),
          ],
        }),
      ],
    });

    const left = el("div", {
      children: [
        el("h1", { className: "hero__name", text: profile.fullName }),
        el("p", { className: "hero__role", text: profile.role }),
        badges,
        el("div", {
          className: "hero__summary",
          children: [
            sectionTitle("aboutTitle", ui.sections.hero.summaryTitle),
            el("p", { text: summary.goal }),
            el("p", { text: summary.about }),
          ],
        }),
        contacts,
      ],
    });

    const card = el("div", {
      className: "card card--padded",
      children: [el("div", { className: "hero__grid", children: [left, avatar] })],
    });

    elements.hero.replaceChildren(card);
  }

  function renderSkills(data) {
    const { skills, ui } = data;

    const makeCard = (title, items) =>
      el("div", {
        className: "card card--padded",
        children: [
          el("h3", { className: "card__title", text: title }),
          el("div", {
            className: "stack",
            children: (items ?? []).map((item) => {
              if (typeof item === "string") return makeChip(item, { strong: true });
              return makeChip(item.label, {
                strong: true,
                meta: item.meta ?? null,
                iconKeys: item.iconKeys ?? null,
              });
            }),
          }),
        ],
      });

    const wrapper = el("div", {
      children: [
        sectionTitle("skillsTitle", ui.sections.skills.title),
        el("div", {
          className: "grid-3",
          children: [
            makeCard(ui.sections.skills.technical, groupTechLabels(skills.technical)),
            makeCard(ui.sections.skills.soft, skills.soft),
            makeCard(ui.sections.skills.additional, skills.additional),
          ],
        }),
      ],
    });

    elements.skills.replaceChildren(wrapper);
  }

  function renderProjects(data) {
    const { projects, ui } = data;
    const root = el("div", { children: [sectionTitle("projectsTitle", ui.sections.projects.title)] });

    for (const project of projects) {
      const badges = el("div", {
        className: "project__badges",
        children: [
          el("span", { className: "chip chip--strong", text: `${ui.sections.projects.type}: ${project.type}` }),
          el("span", { className: "chip chip--strong", text: `${ui.sections.projects.status}: ${project.status}` }),
        ],
      });

      const info = el("div", {
        children: [
          el("div", {
            className: "project__head",
            children: [el("h3", { className: "project__name", text: project.name }), badges],
          }),
          el("p", { className: "project__desc", text: project.description }),
          el("div", {
            className: "project__block",
            children: [
              el("div", { className: "project__block-title", text: ui.sections.projects.stack }),
              el("div", {
                className: "stack",
                children: groupTechLabels(project.technologies).map((entry) =>
                  makeChip(entry.label, {
                    strong: true,
                    meta: entry.meta ?? null,
                    iconKeys: entry.iconKeys ?? null,
                  }),
                ),
              }),
            ],
          }),
          el("div", {
            className: "project__block",
            children: [
              el("div", { className: "project__block-title", text: ui.sections.projects.features }),
              el("ul", {
                className: "list",
                children: project.features.map((f) => el("li", { text: f })),
              }),
            ],
          }),
          el("div", {
            className: "project__block",
            children: [
              el("div", { className: "project__block-title", text: ui.sections.projects.repository }),
              el("a", {
                className: "btn",
                text: ui.buttons.openRepo,
                attrs: { href: project.repository, target: "_blank", rel: "noreferrer" },
              }),
            ],
          }),
        ],
      });

      const card = el("div", {
        className: "card card--padded",
        children: [el("article", { className: "project", children: [info] })],
      });

      root.append(card);
    }

    elements.projects.replaceChildren(root);
  }

  function renderEducation(data) {
    const { education, ui } = data;

    const main = el("div", {
      className: "card card--padded",
      children: [
        el("h3", { className: "card__title", text: ui.sections.education.main }),
        el("div", {
          className: "stack",
          children: [
            el("span", { className: "chip chip--strong", text: education.main.institution }),
            el("span", { className: "chip", text: education.main.course }),
            el("span", { className: "chip", text: education.main.status }),
          ],
        }),
      ],
    });

    const courses = el("div", {
      className: "card card--padded",
      children: [
        el("h3", { className: "card__title", text: ui.sections.education.courses }),
        el("ul", {
          className: "list",
          children: (education.additional ?? []).map((c) =>
            el("li", {
              children: [
                el("span", { text: c.title }),
                el("span", { className: "muted", text: ` - ${c.provider} | ${c.duration}` }),
              ],
            }),
          ),
        }),
      ],
    });

    elements.education.replaceChildren(
      el("div", {
        children: [
          sectionTitle("educationTitle", ui.sections.education.title),
          el("div", { className: "grid-2", children: [main, courses] }),
        ],
      }),
    );
  }

  function renderExperience(data) {
    const { experience, ui } = data;

    const make = (variant, iconKey, title, value) => {
      const icon = iconKey ? svgIcon(iconKey, "card__title-icon") : null;

      return el("div", {
        className: "card card--padded experience-card",
        attrs: { "data-variant": variant },
        children: [
          el("h3", {
            className: "card__title card__title--icon",
            children: [
              ...(icon ? [icon] : []),
              el("span", { text: title }),
            ],
          }),
          el("p", { className: "muted", text: value }),
        ],
      });
    };

    elements.experience.replaceChildren(
      el("div", {
        children: [
          sectionTitle("experienceTitle", ui.sections.experience.title),
          el("div", {
            className: "grid-3",
            children: [
              make("team", "team", ui.sections.experience.teamProjects, experience.teamProjects),
              make("hackathons", "hackathons", ui.sections.experience.hackathons, experience.hackathons),
              make(
                "competitive",
                "competitive",
                ui.sections.experience.competitiveProgramming,
                experience.competitiveProgramming,
              ),
            ],
          }),
        ],
      }),
    );
  }

  function renderLanguages(data) {
    const { languages, ui } = data;

    const rows = el("div", {
      className: "rows",
      children: (languages ?? []).map((l) =>
        el("div", {
          className: "row",
          children: [
            el("span", { className: "chip chip--strong", text: l.name }),
            el("span", { className: "chip", text: l.level }),
          ],
        }),
      ),
    });

    elements.languages.replaceChildren(
      el("div", {
        children: [
          sectionTitle("languagesTitle", ui.sections.languages.title),
          el("div", { className: "card card--padded", children: [rows] }),
        ],
      }),
    );
  }

  function renderContact(data) {
    const { profile, ui } = data;
    const section = ui.sections.contact;

    const contactLinks = el("div", {
      className: "stack",
      children: [
        el("a", {
          className: "btn btn--primary",
          attrs: { href: `mailto:${profile.contacts.email}` },
          children: [
            el("span", { text: ui.buttons.email }),
            el("span", { className: "btn__meta", text: profile.contacts.email }),
          ],
        }),
        el("a", {
          className: "btn",
          attrs: { href: `tel:${normalizePhone(profile.contacts.phone)}` },
          children: [
            el("span", { text: ui.buttons.phone }),
            el("span", { className: "btn__meta", text: profile.contacts.phone }),
          ],
        }),
        el("a", {
          className: "btn",
          attrs: {
            href: profile.contacts.github,
            target: "_blank",
            rel: "noreferrer",
          },
          children: [
            el("span", { text: ui.buttons.github }),
            el("span", { className: "btn__meta", text: githubHandle(profile.contacts.github) }),
          ],
        }),
      ],
    });

    const form = el("form", {
      className: "form",
      attrs: { novalidate: "true" },
      children: [
        el("h3", { className: "card__title", text: section.formTitle }),
        el("div", {
          className: "field",
          children: [
            el("label", { className: "label", attrs: { for: "contactName" }, text: section.nameLabel }),
            el("input", {
              className: "input",
              attrs: {
                id: "contactName",
                name: "name",
                type: "text",
                autocomplete: "name",
                placeholder: section.placeholders.name,
              },
            }),
          ],
        }),
        el("div", {
          className: "field",
          children: [
            el("label", { className: "label", attrs: { for: "contactEmail" }, text: section.emailLabel }),
            el("input", {
              className: "input",
              attrs: {
                id: "contactEmail",
                name: "email",
                type: "email",
                autocomplete: "email",
                required: "true",
                placeholder: section.placeholders.email,
              },
            }),
          ],
        }),
        el("div", {
          className: "field",
          children: [
            el("label", { className: "label", attrs: { for: "contactMessage" }, text: section.messageLabel }),
            el("textarea", {
              className: "input textarea",
              attrs: {
                id: "contactMessage",
                name: "message",
                rows: "5",
                required: "true",
                placeholder: section.placeholders.message,
              },
            }),
          ],
        }),
        el("div", {
          className: "form__actions",
          children: [
            el("button", { className: "btn btn--primary", attrs: { type: "submit" }, text: section.sendLabel }),
            el("p", { className: "muted form__note", text: section.note }),
          ],
        }),
      ],
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") ?? "").trim();
      const fromEmail = String(data.get("email") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();
      if (!fromEmail || !message) return;

      const subjectBase = `${profile.fullName} - ${section.formTitle}`;
      const subject = name ? `${subjectBase} (${name})` : subjectBase;
      const bodyLines = [
        name ? `${section.nameLabel}: ${name}` : null,
        `${section.emailLabel}: ${fromEmail}`,
        "",
        message,
      ].filter(Boolean);
      const body = bodyLines.join("\n");

      const href = `mailto:${profile.contacts.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    });

    elements.contact.replaceChildren(
      el("div", {
        children: [
          sectionTitle("contactTitle", section.title),
          el("p", { className: "muted", text: section.subtitle }),
          el("div", {
            className: "grid-2",
            children: [
              el("div", { className: "card card--padded", children: [contactLinks] }),
              el("div", { className: "card card--padded", children: [form] }),
            ],
          }),
        ],
      }),
    );
  }

  function renderFooter(data) {
    const { profile, ui } = data;
    const year = new Date().getFullYear();

    const copyright = template(ui.footer.copyright, {
      year,
      name: profile.fullName,
    });

    elements.footer.replaceChildren(
      el("div", {
        className: "container footer__inner",
        children: [
          el("div", { text: copyright }),
          el("a", {
            className: "btn",
            attrs: {
              href: profile.contacts.github,
              target: "_blank",
              rel: "noreferrer",
            },
            text: ui.footer.github,
          }),
        ],
      }),
    );
  }

  function render() {
    const data = state.data?.[state.lang];
    if (!data) return;

    document.documentElement.lang = state.lang;
    if (data.ui?.meta?.siteTitle) document.title = data.ui.meta.siteTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && data.ui?.meta?.siteDescription) {
      desc.setAttribute("content", data.ui.meta.siteDescription);
    }

    if (elements.brandName) elements.brandName.textContent = data.profile.fullName;
    if (elements.brandMark) {
      elements.brandMark.textContent =
        initialsFromName(data.profile.fullName) || "AA";
    }

    setActiveLanguageUI();
    renderNav(data.ui);
    renderHero(data);
    renderSkills(data);
    renderProjects(data);
    renderEducation(data);
    renderExperience(data);
    renderLanguages(data);
    renderContact(data);
    renderFooter(data);
    setupPager(data.ui);

    clearStatus();
  }

  function setLanguage(nextLang) {
    if (!LANGS.includes(nextLang)) return;
    if (nextLang === state.lang) return;
    state.lang = nextLang;
    try {
      localStorage.setItem("lang", nextLang);
    } catch {}
    setActiveLanguageUI();
    swapContentWithFade(render);
  }

  function getInitialLanguage() {
    try {
      const saved = localStorage.getItem("lang");
      if (LANGS.includes(saved)) return saved;
    } catch {}
    return "ru";
  }

  function bindLanguageSwitcher() {
    for (const btn of elements.langButtons) {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    }
  }

  async function boot() {
    state.lang = getInitialLanguage();
    setActiveLanguageUI();
    bindLanguageSwitcher();
    setStatus(FALLBACK_MESSAGES[state.lang]?.loading ?? "Loading…", true);

    try {
      const res = await fetch(RESUME_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      state.data = json;
      state.lang = getInitialLanguage();

      const ui = state.data?.[state.lang]?.ui;
      setStatus(
        ui?.messages?.loading ??
          FALLBACK_MESSAGES[state.lang]?.loading ??
          "Loading…",
        true,
      );

      render();
    } catch (err) {
      console.error(err);
      setStatus(
        FALLBACK_MESSAGES[state.lang]?.error ?? FALLBACK_MESSAGES.en.error,
        true,
      );
    }
  }

  boot();
})();

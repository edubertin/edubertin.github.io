const modalMap = {
  projects: document.getElementById("projects-modal"),
  contact: document.getElementById("contact-modal"),
};

const projectsList = document.getElementById("projects-list");
const githubUser =
  document.body?.dataset.githubUser?.trim() || "edubertin";

const translations = {
  en: {
    "nav.home": "Home",
    "nav.articles": "Articles",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.eyebrow": "AI applied to product, data, and software",
    "hero.title": "Artificial Intelligence Engineer",
    "hero.lead":
      "Code, models, architecture, and critical thinking about AI. From prototype to deployment, focused on performance and experience.",
    "hero.cta.projects": "View projects",
    "hero.cta.contact": "Talk to me",
    "hero.tag.ml": "Machine Learning",
    "hero.tag.arch": "Architecture",
    "hero.tag.product": "Product",
    "hero.tag.automation": "Automation",
    "footer.tagline": "AI applied with clarity, speed, and results.",
    "footer.rights": "© 2026 Eduardo Bertin",
    "footer.reserved": "All rights reserved",
    "projects.title": "Featured projects",
    "projects.subtitle": "Repositories updated directly from GitHub.",
    "contact.title": "Contact",
    "contact.email": "Email",
    "project.fallbackDesc": "Featured repository.",
    "project.fallbackLang": "Stack",
    "project.updated": "Updated",
    "project.openLabel": "Open repository on GitHub",
  },
  pt: {
    "nav.home": "Home",
    "nav.articles": "Artigos",
    "nav.projects": "Projetos",
    "nav.contact": "Contato",
    "hero.eyebrow": "IA aplicada a produto, dados e software",
    "hero.title": "Programador de Inteligência Artificial",
    "hero.lead":
      "Código, modelos, arquitetura e pensamento crítico sobre IA. Do protótipo ao deploy, com foco em performance e experiência.",
    "hero.cta.projects": "Ver projetos",
    "hero.cta.contact": "Falar comigo",
    "hero.tag.ml": "Machine Learning",
    "hero.tag.arch": "Arquitetura",
    "hero.tag.product": "Produto",
    "hero.tag.automation": "Automação",
    "footer.tagline": "IA aplicada com clareza, velocidade e resultado.",
    "footer.rights": "© 2026 Eduardo Bertin",
    "footer.reserved": "Todos os direitos reservados",
    "projects.title": "Projetos em destaque",
    "projects.subtitle": "Repositórios atualizados diretamente do GitHub.",
    "contact.title": "Contato",
    "contact.email": "Email",
    "project.fallbackDesc": "Repositório em destaque.",
    "project.fallbackLang": "Stack",
    "project.updated": "Atualizado",
    "project.openLabel": "Abrir repositório no GitHub",
  },
};

const fallbackReposByLang = {
  en: [
    {
      name: "AI Assistant",
      description: "Smart assistant demo.",
      language: "Python",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "Products API",
      description: "Scalable backend with data.",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "Vision Dashboard",
      description: "Interface with visual insights.",
      language: "React",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
  ],
  pt: [
    {
      name: "Projeto IA",
      description: "Demonstração de assistente inteligente.",
      language: "Python",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "API Produtos",
      description: "Backend escalável com dados.",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
    {
      name: "Dashboard Vision",
      description: "Interface com insights visuais.",
      language: "React",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
    },
  ],
};

let currentLang = "en";

const setLanguage = (lang) => {
  currentLang = translations[lang] ? lang : "en";
  const dict = translations[currentLang];
  document.documentElement.lang = currentLang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === currentLang);
  });
  try {
    localStorage.setItem("siteLang", currentLang);
  } catch (error) {
    // ignore storage errors (private mode / file://)
  }
  if (projectsLoaded) {
    projectsLoaded = false;
    loadProjects();
  }
};

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    setLanguage(lang);
  });
});

const openModal = (key) => {
  const modal = modalMap[key];
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = (key) => {
  const modal = modalMap[key];
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-open");
    openModal(key);
    if (key === "projects") {
      loadProjects();
    }
  });
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-close");
    closeModal(key);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal("projects");
    closeModal("contact");
  }
});

let projectsLoaded = false;

const createProjectCard = (repo) => {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = repo.html_url || "#";
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("aria-label", translations[currentLang]["project.openLabel"]);
  const title = document.createElement("h4");
  title.textContent = repo.name;
  const desc = document.createElement("p");
  desc.textContent =
    repo.description || translations[currentLang]["project.fallbackDesc"];
  const meta = document.createElement("div");
  meta.className = "meta";
  const lang = document.createElement("span");
  lang.textContent =
    repo.language || translations[currentLang]["project.fallbackLang"];
  const stars = document.createElement("span");
  stars.textContent = `★ ${repo.stargazers_count ?? 0}`;
  const updated = document.createElement("span");
  const date = new Date(repo.updated_at);
  const locale = currentLang === "pt" ? "pt-BR" : "en-US";
  updated.textContent = `${translations[currentLang]["project.updated"]} ${date.toLocaleDateString(
    locale
  )}`;
  meta.append(lang, stars, updated);
  card.append(title, desc, meta);
  return card;
};

const renderProjects = (repos) => {
  if (!projectsList) return;
  projectsList.innerHTML = "";
  repos.slice(0, 6).forEach((repo) => {
    projectsList.appendChild(createProjectCard(repo));
  });
};

const loadProjects = async () => {
  if (projectsLoaded) return;
  projectsLoaded = true;
  if (!projectsList) return;
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!response.ok) throw new Error("API error");
    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error("Unexpected API response");
    if (repos.length === 0) throw new Error("No repositories found");
    const filtered = repos.filter((repo) => !repo.fork && !repo.archived);
    renderProjects(filtered.length ? filtered : repos);
  } catch (error) {
    console.error("Failed to load GitHub projects:", error);
    const fallback = fallbackReposByLang[currentLang] || fallbackReposByLang.en;
    renderProjects(fallback);
  }
};

let storedLang = null;
try {
  storedLang = localStorage.getItem("siteLang");
} catch (error) {
  storedLang = null;
}
setLanguage(storedLang || "en");

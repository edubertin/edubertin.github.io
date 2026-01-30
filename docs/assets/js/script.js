const modalMap = {
  projects: document.getElementById("projects-modal"),
  contact: document.getElementById("contact-modal"),
};

const projectsList = document.getElementById("projects-list");
const articlesList = document.getElementById("articles-list");
const githubUser =
  document.body?.dataset.githubUser?.trim() || "edubertin";
const wpSite = document.body?.dataset.wpSite?.trim() || "edubertin.wordpress.com";

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
    "articles.eyebrow": "Writing & insights",
    "articles.title": "Articles",
    "articles.subtitle": "Latest posts from my WordPress blog.",
    "articles.more": "View all posts",
    "articles.empty": "No articles found right now.",
    "articles.loadError": "Unable to load articles. Please try again later.",
    "articles.openLabel": "Open article on WordPress",
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
    "articles.eyebrow": "Escrita & insights",
    "articles.title": "Artigos",
    "articles.subtitle": "Últimos posts do meu blog no WordPress.",
    "articles.more": "Ver todos os posts",
    "articles.empty": "Nenhum artigo encontrado no momento.",
    "articles.loadError": "Não foi possível carregar os artigos. Tente novamente mais tarde.",
    "articles.openLabel": "Abrir artigo no WordPress",
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
    "project.openLabel": "Abrir Repositório no GitHub",
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
  if (articlesLoaded && articlesCache.length) {
    renderArticles(articlesCache);
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
let articlesLoaded = false;
let articlesCache = [];

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

const stripHtml = (html) => {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || "").trim();
};

const extractImageUrl = (html) => {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const img = temp.querySelector("img");
  return img?.getAttribute("src") || "";
};

const normalizePost = (post) => {
  if (!post) return null;
  if (post.URL || post.title) {
    return {
      title: typeof post.title === "string" ? post.title : post.title?.rendered || "",
      URL: post.URL || post.link || "#",
      date: post.date || "",
      excerpt:
        typeof post.excerpt === "string"
          ? post.excerpt
          : post.excerpt?.rendered || "",
      content:
        typeof post.content === "string"
          ? post.content
          : post.content?.rendered || "",
      featured_image:
        post.featured_image ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "",
    };
  }
  return null;
};

const createArticleCard = (post) => {
  const card = document.createElement("a");
  card.className = "article-card";
  card.href = post.URL || "#";
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("aria-label", translations[currentLang]["articles.openLabel"]);

  const media = document.createElement("div");
  media.className = "article-media";
  const imageUrl =
    post.featured_image || extractImageUrl(post.content) || "";
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = stripHtml(post.title) || "Article image";
    img.loading = "lazy";
    media.appendChild(img);
  }

  const body = document.createElement("div");
  body.className = "article-body";

  const meta = document.createElement("div");
  meta.className = "article-meta";
  const date = new Date(post.date || Date.now());
  const locale = currentLang === "pt" ? "pt-BR" : "en-US";
  const dateEl = document.createElement("span");
  dateEl.textContent = date.toLocaleDateString(locale);
  meta.appendChild(dateEl);

  const title = document.createElement("h3");
  title.className = "article-title";
  title.textContent = stripHtml(post.title) || "Untitled";

  const excerpt = document.createElement("p");
  excerpt.className = "article-excerpt";
  excerpt.textContent = stripHtml(post.excerpt).slice(0, 160);

  body.append(meta, title, excerpt);
  card.append(media, body);
  return card;
};

const renderArticles = (posts) => {
  if (!articlesList) return;
  articlesList.innerHTML = "";
  if (!posts.length) {
    const empty = document.createElement("div");
    empty.className = "articles-empty";
    empty.textContent = translations[currentLang]["articles.empty"];
    articlesList.appendChild(empty);
    return;
  }
  posts.slice(0, 6).forEach((post) => {
    articlesList.appendChild(createArticleCard(post));
  });
};

const loadArticles = async () => {
  if (articlesLoaded) return;
  articlesLoaded = true;
  if (!articlesList) return;
  try {
    const response = await fetch(
      `https://public-api.wordpress.com/rest/v1.1/sites/${wpSite}/posts/?number=6&fields=ID,title,URL,date,excerpt,content,featured_image`
    );
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    let posts = Array.isArray(data?.posts) ? data.posts : [];
    posts = posts.map(normalizePost).filter(Boolean);
    if (!posts.length) throw new Error("No posts found");
    articlesCache = posts;
    renderArticles(posts);
  } catch (error) {
    try {
      const response = await fetch(
        `https://public-api.wordpress.com/wp/v2/sites/${wpSite}/posts?per_page=6&_embed`
      );
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const posts = Array.isArray(data) ? data.map(normalizePost).filter(Boolean) : [];
      if (!posts.length) throw new Error("No posts found");
      articlesCache = posts;
      renderArticles(posts);
      return;
    } catch (fallbackError) {
      console.error("Failed to load WordPress articles:", fallbackError);
    }
    articlesList.innerHTML = "";
    const empty = document.createElement("div");
    empty.className = "articles-empty";
    empty.textContent = translations[currentLang]["articles.loadError"];
    articlesList.appendChild(empty);
  }
};

let storedLang = null;
try {
  storedLang = localStorage.getItem("siteLang");
} catch (error) {
  storedLang = null;
}
setLanguage(storedLang || "en");
loadArticles();




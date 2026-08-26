const STORAGE_KEY = 'digitalMarketingProjects';
let pendingProjectImages = [];
let pendingImageReplacementIndex = null;

const defaultProjects = [
  {
    id: crypto.randomUUID(),
    title: 'SEO Website Audit',
    category: 'SEO',
    description: 'Reviewed a sample business website and identified improvements in metadata, heading structure, internal linking, page speed, and on-page optimization.',
    tools: 'Google Search Console, PageSpeed Insights, Excel, Ubersuggest',
    skills: 'SEO Audit, On-Page SEO, Keyword Review',
    date: '2025-04-12',
    url: 'https://example.com',
    results: 'Improved SEO structure recommendations and identified 12 optimization opportunities.',
    images: [
      'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520"><rect fill="#0d2340" width="800" height="520"/><circle cx="120" cy="110" r="60" fill="#4cc9f0" opacity="0.8"/><rect x="95" y="220" width="610" height="210" rx="18" fill="#14395c"/><text x="100" y="120" font-size="36" fill="#ecf6ff" font-family="Arial">SEO Audit</text><text x="120" y="285" font-size="26" fill="#bfd5eb" font-family="Arial">Keyword • Meta • Speed</text></svg>')
    ]
  },
  {
    id: crypto.randomUUID(),
    title: 'Keyword Research Campaign',
    category: 'SEO',
    description: 'Created a keyword plan for a digital marketing niche by grouping search intent, competition, and commercial value for content and ad targeting.',
    tools: 'Google Trends, Excel, Keyword Tools, Search Console',
    skills: 'Keyword Research, Search Intent, Competitor Analysis',
    date: '2025-06-08',
    url: 'https://example.com/keywords',
    results: 'Mapped 30+ keywords into primary, secondary, and long-tail groups for campaign planning.',
    images: [
      'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520"><rect fill="#071a2d" width="800" height="520"/><rect x="80" y="115" width="640" height="290" rx="18" fill="#112d4c"/><path d="M120 325 L220 270 L320 300 L420 210 L500 230 L620 140" stroke="#4cc9f0" stroke-width="6" fill="none"/><rect x="125" y="150" width="130" height="90" rx="12" fill="#4ade80" opacity="0.45"/><text x="120" y="110" font-size="30" fill="#ecf6ff" font-family="Arial">Keyword Map</text></svg>')
    ]
  },
  {
    id: crypto.randomUUID(),
    title: 'Google Ads Practice Campaign',
    category: 'Google Ads',
    description: 'Designed a sample PPC campaign for a digital marketing course with keyword groups, targeting logic, and ad copy strategy for search campaigns.',
    tools: 'Google Ads, Keyword Planner, Canva, Excel',
    skills: 'Google Ads, Ad Copy, Campaign Structure',
    date: '2025-02-18',
    url: 'https://example.com/google-ads',
    results: 'Built a structured campaign plan with ad variations and core targeting strategy based on search intent.',
    images: [
      'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520"><rect fill="#09233a" width="800" height="520"/><rect x="120" y="110" width="560" height="220" rx="18" fill="#14395c"/><text x="160" y="170" font-size="28" fill="#ecf6ff" font-family="Arial">Campaign Setup</text><text x="160" y="220" font-size="22" fill="#bfd5eb" font-family="Arial">Search • Display • Remarketing</text><rect x="170" y="260" width="200" height="28" rx="10" fill="#4cc9f0"/><rect x="400" y="260" width="180" height="28" rx="10" fill="#4ade80"/></svg>')
    ]
  }
];

function getProjectsFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    return [...defaultProjects];
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    return [...defaultProjects];
  }
}

function saveProjectsToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function generateImageDataUrls(files) {
  return Promise.all(Array.from(files).map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

function renderProjectImagePreviews() {
  const preview = document.getElementById('imagePreview');
  if (!preview) return;

  preview.innerHTML = '';

  if (!pendingProjectImages.length) {
    preview.innerHTML = '<p class="muted">No images selected yet</p>';
    return;
  }

  pendingProjectImages.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
      <img src="${src}" alt="Project preview ${index + 1}" />
      <div class="preview-actions">
        <button type="button" class="replace-image-btn" data-index="${index}">Replace</button>
        <button type="button" class="delete-image-btn" data-index="${index}">Delete</button>
      </div>
    `;

    item.querySelector('.replace-image-btn').addEventListener('click', () => {
      pendingImageReplacementIndex = index;
      document.getElementById('projectImages').click();
    });

    item.querySelector('.delete-image-btn').addEventListener('click', () => {
      pendingProjectImages = pendingProjectImages.filter((_, imageIndex) => imageIndex !== index);
      renderProjectImagePreviews();
    });

    preview.appendChild(item);
  });
}

async function handleImageUpload(fileList) {
  const images = await generateImageDataUrls(fileList);

  if (pendingImageReplacementIndex !== null) {
    pendingProjectImages[pendingImageReplacementIndex] = images[0];
    pendingImageReplacementIndex = null;
  } else {
    pendingProjectImages = [...pendingProjectImages, ...images];
  }

  renderProjectImagePreviews();
}

function resetProjectForm() {
  const form = document.getElementById('projectForm');
  if (form) {
    form.reset();
  }

  const projectId = document.getElementById('projectId');
  if (projectId) projectId.value = '';

  pendingProjectImages = [];
  pendingImageReplacementIndex = null;
  renderProjectImagePreviews();
}

function openProjectModal(projectId = null) {
  const modal = document.getElementById('projectModal');
  const title = document.getElementById('projectModalTitle');
  const projectIdField = document.getElementById('projectId');
  const imageInput = document.getElementById('projectImages');

  if (!modal || !title || !projectIdField || !imageInput) return;

  pendingProjectImages = [];
  pendingImageReplacementIndex = null;

  if (projectId) {
    const projects = getProjectsFromStorage();
    const project = projects.find((item) => item.id === projectId);

    if (!project) return;

    title.textContent = 'Edit Project';
    projectIdField.value = project.id;
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectCategory').value = project.category || 'SEO';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectDate').value = project.date || '';
    document.getElementById('projectUrl').value = project.url || '';
    document.getElementById('projectTools').value = project.tools || '';
    document.getElementById('projectSkills').value = project.skills || '';
    document.getElementById('projectResults').value = project.results || '';
    pendingProjectImages = Array.isArray(project.images) ? [...project.images] : [];
  } else {
    title.textContent = 'Add Project';
    document.getElementById('projectForm').reset();
    projectIdField.value = '';
  }

  imageInput.value = '';
  renderProjectImagePreviews();
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  resetProjectForm();
}

function createProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const gallery = project.images && project.images.length ? project.images.slice(0, 2).map((image) => `
    <img src="${image}" alt="${project.title} preview" />
  `).join('') : `
    <img src="data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420"><rect fill="#0d2340" width="800" height="420"/><text x="400" y="215" text-anchor="middle" font-size="34" fill="#ecf6ff" font-family="Arial">Project Preview</text></svg>')}" alt="${project.title}" />
  `;

  const skills = (project.skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((skill) => `<span class="tag">${skill}</span>`)
    .join('');

  const resultText = project.results ? `<p><strong>Results:</strong> ${project.results}</p>` : '';
  const projectUrl = project.url ? `<a href="${project.url}" class="btn btn-secondary" target="_blank" rel="noreferrer">Open Project</a>` : '';

  article.innerHTML = `
    <div class="project-icon">${project.category === 'SEO' ? '🔍' : project.category === 'Google Ads' ? '📢' : project.category === 'Social Media' ? '📱' : '📊'}</div>
    <div class="project-meta-row">
      <div class="project-meta">${project.category}</div>
      <span class="project-date">${project.date || 'Date not set'}</span>
    </div>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="project-image-gallery">${gallery}</div>
    <div class="tag-list">${skills || '<span class="tag">Portfolio</span>'}</div>
    <p style="margin-top: 1rem; color: var(--muted);"><strong>Tools:</strong> ${project.tools || 'Not specified'}</p>
    ${resultText}
    <div class="project-actions">
      <button class="btn btn-secondary edit-project" type="button" data-id="${project.id}">Edit</button>
      <button class="btn btn-danger delete-project" type="button" data-id="${project.id}">Delete</button>
      ${projectUrl}
    </div>
  `;

  return article;
}

function renderProjects() {
  const projectGrid = document.getElementById('projectGrid');
  if (!projectGrid) return;

  const projects = getProjectsFromStorage();
  projectGrid.innerHTML = '';

  if (!projects.length) {
    projectGrid.innerHTML = '<div class="project-card"><h3>No projects added yet</h3><p>Add a new project to showcase your work.</p></div>';
    return;
  }

  projects.forEach((project) => {
    projectGrid.appendChild(createProjectCard(project));
  });

  attachProjectActionHandlers();
}

function attachProjectActionHandlers() {
  document.querySelectorAll('.edit-project').forEach((button) => {
    button.addEventListener('click', () => openProjectModal(button.dataset.id));
  });

  document.querySelectorAll('.delete-project').forEach((button) => {
    button.addEventListener('click', () => {
      const confirmed = window.confirm('Are you sure you want to remove this project?');
      if (!confirmed) return;

      const projects = getProjectsFromStorage();
      const filtered = projects.filter((project) => project.id !== button.dataset.id);
      saveProjectsToStorage(filtered);
      renderProjects();
    });
  });
}

function handleProjectSubmit(event) {
  event.preventDefault();

  const projectId = document.getElementById('projectId').value;
  const title = document.getElementById('projectTitle').value.trim();
  const category = document.getElementById('projectCategory').value;
  const description = document.getElementById('projectDescription').value.trim();
  const date = document.getElementById('projectDate').value;
  const url = document.getElementById('projectUrl').value.trim();
  const tools = document.getElementById('projectTools').value.trim();
  const skills = document.getElementById('projectSkills').value.trim();
  const results = document.getElementById('projectResults').value.trim();

  if (!title || !description || !category) {
    return;
  }

  const projects = getProjectsFromStorage();

  if (projectId) {
    const existingProject = projects.find((project) => project.id === projectId);
    if (!existingProject) return;

    existingProject.title = title;
    existingProject.category = category;
    existingProject.description = description;
    existingProject.date = date;
    existingProject.url = url;
    existingProject.tools = tools;
    existingProject.skills = skills;
    existingProject.results = results;
    existingProject.images = pendingProjectImages;

    saveProjectsToStorage(projects);
    renderProjects();
    closeProjectModal();
    return;
  }

  const payload = {
    id: crypto.randomUUID(),
    title,
    category,
    description,
    date,
    url,
    tools,
    skills,
    results,
    images: [...pendingProjectImages]
  };

  projects.unshift(payload);
  saveProjectsToStorage(projects);
  renderProjects();
  closeProjectModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    });
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const status = document.getElementById('formStatus');
      const accessKey = form.querySelector('[name="access_key"]')?.value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (status) {
          status.textContent = 'Please add your Web3Forms access key before sending messages.';
        }
        return;
      }

      if (submitButton) {
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            Accept: 'application/json'
          }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to send the message.');
        }

        if (status) {
          status.textContent = 'Thanks for reaching out. I will get back to you soon.';
        }
        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = 'Message could not be sent. Please try again or email me directly.';
        }
      } finally {
        if (submitButton) {
          submitButton.textContent = 'Send Message';
          submitButton.disabled = false;
        }
      }
    });
  }

  const addProjectBtn = document.getElementById('addProjectBtn');
  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => openProjectModal());
  }

  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', handleProjectSubmit);
  }

  const projectModal = document.getElementById('projectModal');
  if (projectModal) {
    projectModal.addEventListener('click', (event) => {
      const shouldClose = event.target instanceof Element && event.target.dataset.close === 'true';
      if (shouldClose) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !projectModal.classList.contains('hidden')) {
        closeProjectModal();
      }
    });
  }

  const projectImagesInput = document.getElementById('projectImages');
  if (projectImagesInput) {
    projectImagesInput.addEventListener('change', async (event) => {
      const files = event.target.files;
      if (!files || !files.length) return;

      await handleImageUpload(files);
      projectImagesInput.value = '';
    });
  }

  renderProjects();
});

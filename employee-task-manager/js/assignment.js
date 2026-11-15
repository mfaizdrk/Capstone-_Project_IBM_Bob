/**
 * assignment.js — Employee Task Manager
 * Logic for the Assignment page:
 *   - Render task cards
 *   - Search by title/description
 *   - Filter by status and priority
 *   - Sort by deadline (asc / desc)
 *   - Task detail modal
 */

// ============================================================
// State
// ============================================================

let currentSearch   = '';
let currentStatus   = 'all';
let currentPriority = 'all';
let currentSort     = 'deadline-asc'; // 'deadline-asc' | 'deadline-desc'

// ============================================================
// Filter & Sort Pipeline
// ============================================================

/**
 * Returns the filtered + sorted subset of TASK_DATA.
 * @returns {Array<Object>}
 */
function getFilteredTasks() {
  let tasks = [...window.TASK_DATA];

  // 1. Search
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }

  // 2. Status filter
  if (currentStatus !== 'all') {
    tasks = tasks.filter(t => t.status === currentStatus);
  }

  // 3. Priority filter
  if (currentPriority !== 'all') {
    tasks = tasks.filter(t => t.priority === currentPriority);
  }

  // 4. Sort by deadline
  tasks.sort((a, b) => {
    const diff = new Date(a.deadline) - new Date(b.deadline);
    return currentSort === 'deadline-asc' ? diff : -diff;
  });

  return tasks;
}

// ============================================================
// Render Task Cards
// ============================================================

/** Renders all visible task cards into #task-grid. */
function renderTaskCards() {
  const grid  = document.getElementById('task-grid');
  const count = document.getElementById('task-count');
  if (!grid) return;

  const tasks = getFilteredTasks();

  if (count) count.textContent = `${tasks.length} tugas ditemukan`;

  if (!tasks.length) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-16 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        <p class="font-medium">Tidak ada tugas yang cocok.</p>
        <p class="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
      </div>`;
    return;
  }

  grid.innerHTML = tasks.map(t => `
    <div
      class="stat-card cursor-pointer hover:border-cyan-300 border border-transparent"
      data-task-id="${t.id}"
      onclick="openTaskModal('${t.id}')"
      role="button"
      tabindex="0"
      aria-label="Lihat detail tugas ${t.title}"
    >
      <!-- Header row -->
      <div class="flex items-start justify-between mb-3 gap-2">
        <div class="flex-1 min-w-0">
          <p class="text-xs text-slate-400 mb-1">${t.id}</p>
          <h3 class="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">${t.title}</h3>
        </div>
        ${priorityBadge(t.priority)}
      </div>

      <!-- Description -->
      <p class="text-xs text-slate-500 mb-4 line-clamp-2">${t.description}</p>

      <!-- Footer row -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        ${statusBadge(t.status)}
        <div class="text-right">
          <p class="text-xs font-medium ${deadlineColor(t.deadline)}">${formatDate(t.deadline)}</p>
          <p class="text-xs text-slate-400">${deadlineLabel(t.deadline)}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Keyboard accessibility: Enter key on card
  grid.querySelectorAll('[data-task-id]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') openTaskModal(card.dataset.taskId);
    });
  });
}

// ============================================================
// Task Detail Modal
// ============================================================

/**
 * Opens the task detail modal for a given task ID.
 * @param {string} taskId
 */
function openTaskModal(taskId) {
  const task = window.TASK_DATA.find(t => t.id === taskId);
  if (!task) return;

  const modal   = document.getElementById('task-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Modal header -->
    <div class="flex items-start justify-between mb-5">
      <div>
        <p class="text-xs text-slate-400 mb-1">${task.id}</p>
        <h2 class="text-lg font-bold text-slate-800">${task.title}</h2>
      </div>
      <button
        id="close-modal-btn"
        class="p-1 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Tutup modal"
      >
        <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Badges row -->
    <div class="flex flex-wrap gap-2 mb-5">
      ${statusBadge(task.status)}
      ${priorityBadge(task.priority)}
    </div>

    <!-- Description -->
    <div class="mb-5">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Deskripsi</p>
      <p class="text-sm text-slate-700 leading-relaxed">${task.description}</p>
    </div>

    <!-- Metadata grid -->
    <div class="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 text-sm">
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
        <p class="font-semibold ${deadlineColor(task.deadline)}">${formatDate(task.deadline)}</p>
        <p class="text-xs text-slate-400">${deadlineLabel(task.deadline)}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Dibuat</p>
        <p class="font-semibold text-slate-700">${formatDate(task.createdAt)}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Assignee</p>
        <p class="font-semibold text-slate-700">${task.assignee}</p>
      </div>
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Prioritas</p>
        ${priorityBadge(task.priority)}
      </div>
    </div>
  `;

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  // Wire up close button (freshly rendered)
  document.getElementById('close-modal-btn')
    .addEventListener('click', closeTaskModal);
}

/** Closes the task detail modal. */
function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// ============================================================
// Controls: Search, Filter, Sort
// ============================================================

function initControls() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentSearch = e.target.value;
      renderTaskCards();
    });
  }

  // Status filter
  const statusSelect = document.getElementById('filter-status');
  if (statusSelect) {
    statusSelect.addEventListener('change', e => {
      currentStatus = e.target.value;
      renderTaskCards();
    });
  }

  // Priority filter
  const prioritySelect = document.getElementById('filter-priority');
  if (prioritySelect) {
    prioritySelect.addEventListener('change', e => {
      currentPriority = e.target.value;
      renderTaskCards();
    });
  }

  // Sort buttons
  const sortBtns = document.querySelectorAll('.sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      sortBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-white');
        b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-cyan-500', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      renderTaskCards();
    });
  });

  // Modal backdrop click to close
  const modal = document.getElementById('task-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeTaskModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTaskModal();
  });
}

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderTaskCards();
  initControls();
});

/**
 * dashboard.js — Employee Task Manager
 * Logic for the Dashboard page:
 *   - Summary status cards
 *   - XP & rank widget
 *   - Period filter (daily / weekly / monthly)
 *   - Recent tasks table
 */

// ============================================================
// Mock Data (shared with other pages via window.TASK_DATA)
// ============================================================

/** @type {Array<Object>} Master task list */
window.TASK_DATA = [
  {
    id: 'T-001',
    title: 'Revisi desain landing page',
    description: 'Update hero section dan warna brand sesuai feedback klien.',
    priority: 'high',
    status: 'revision',
    deadline: '2026-11-15',
    createdAt: '2026-11-01',
    assignee: 'Anda',
  },
  {
    id: 'T-002',
    title: 'Integrasi API pembayaran',
    description: 'Hubungkan Midtrans gateway ke checkout flow.',
    priority: 'high',
    status: 'todo',
    deadline: '2026-11-18',
    createdAt: '2026-11-03',
    assignee: 'Anda',
  },
  {
    id: 'T-003',
    title: 'Unit test modul autentikasi',
    description: 'Tulis test untuk login, register, dan forgot password.',
    priority: 'medium',
    status: 'review',
    deadline: '2026-11-20',
    createdAt: '2026-11-05',
    assignee: 'Anda',
  },
  {
    id: 'T-004',
    title: 'Dokumentasi API endpoint',
    description: 'Buat Swagger docs untuk semua REST endpoints.',
    priority: 'low',
    status: 'approved',
    deadline: '2026-11-10',
    createdAt: '2026-11-01',
    assignee: 'Anda',
  },
  {
    id: 'T-005',
    title: 'Setup CI/CD pipeline',
    description: 'Konfigurasi GitHub Actions untuk auto-deploy ke staging.',
    priority: 'medium',
    status: 'approved',
    deadline: '2026-11-08',
    createdAt: '2026-10-28',
    assignee: 'Anda',
  },
  {
    id: 'T-006',
    title: 'Optimasi query database',
    description: 'Tambahkan index dan refactor N+1 queries pada modul laporan.',
    priority: 'high',
    status: 'todo',
    deadline: '2026-11-25',
    createdAt: '2026-11-10',
    assignee: 'Anda',
  },
  {
    id: 'T-007',
    title: 'Perbaiki bug pagination',
    description: 'Halaman terakhir menampilkan item ganda pada mobile.',
    priority: 'medium',
    status: 'review',
    deadline: '2026-11-16',
    createdAt: '2026-11-12',
    assignee: 'Anda',
  },
  {
    id: 'T-008',
    title: 'Mobile responsiveness audit',
    description: 'Periksa seluruh halaman di viewport 375px dan 414px.',
    priority: 'low',
    status: 'todo',
    deadline: '2026-11-30',
    createdAt: '2026-11-14',
    assignee: 'Anda',
  },
];

// ============================================================
// Current User Profile
// ============================================================

/** Simulated logged-in user data */
window.CURRENT_USER = {
  name: 'Muhammad Faiz',
  role: 'Frontend Engineer',
  avatar: 'AF',
  xp: 1240,
  xpNext: 1500,  // XP needed for next level
  level: 7,
  rank: 3,
  division: 'Engineering',
};

// ============================================================
// Summary Cards
// ============================================================

/**
 * Counts tasks by status for the given period.
 * @param {string} period  'daily' | 'weekly' | 'monthly'
 * @returns {{ todo: number, review: number, approved: number, revision: number, total: number }}
 */
function countByStatus(period) {
  const tasks = window.TASK_DATA.filter(t => isInPeriod(t.createdAt, period));
  return {
    todo:     tasks.filter(t => t.status === 'todo').length,
    review:   tasks.filter(t => t.status === 'review').length,
    approved: tasks.filter(t => t.status === 'approved').length,
    revision: tasks.filter(t => t.status === 'revision').length,
    total:    tasks.length,
  };
}

/**
 * Renders the four summary stat cards.
 * @param {string} period
 */
function renderSummaryCards(period) {
  const counts = countByStatus(period);

  const cards = [
    {
      id: 'card-todo',
      label: 'To-Do',
      value: counts.todo,
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
      iconBg: 'bg-blue-100 text-blue-600',
      border: 'border-l-blue-500',
    },
    {
      id: 'card-review',
      label: 'Waiting Review',
      value: counts.review,
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      iconBg: 'bg-yellow-100 text-yellow-600',
      border: 'border-l-yellow-500',
    },
    {
      id: 'card-approved',
      label: 'Approved',
      value: counts.approved,
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      iconBg: 'bg-green-100 text-green-600',
      border: 'border-l-green-500',
    },
    {
      id: 'card-revision',
      label: 'Revision',
      value: counts.revision,
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
      iconBg: 'bg-red-100 text-red-600',
      border: 'border-l-red-500',
    },
  ];

  const container = document.getElementById('summary-cards');
  if (!container) return;

  container.innerHTML = cards.map(c => `
    <div class="stat-card border-l-4 ${c.border}">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-slate-500">${c.label}</span>
        <span class="p-2 rounded-lg ${c.iconBg}">${c.icon}</span>
      </div>
      <p class="text-3xl font-bold text-slate-800">${c.value}</p>
      <p class="text-xs text-slate-400 mt-1">dari ${counts.total} total tugas</p>
    </div>
  `).join('');
}

// ============================================================
// XP & Rank Widget
// ============================================================

/** Renders the XP progress bar and rank info. */
function renderXpWidget() {
  const user    = window.CURRENT_USER;
  const percent = Math.round((user.xp / user.xpNext) * 100);

  const el = document.getElementById('xp-widget');
  if (!el) return;

  el.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider">Level ${user.level}</p>
        <p class="text-2xl font-bold text-slate-800">${user.xp.toLocaleString()} XP</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-400 uppercase tracking-wider">Ranking</p>
        <p class="text-2xl font-bold text-cyan-500">#${user.rank}</p>
      </div>
    </div>
    <div class="xp-bar-track">
      <div class="xp-bar-fill" style="width: ${percent}%"></div>
    </div>
    <div class="flex justify-between mt-1">
      <span class="text-xs text-slate-400">${user.xp} / ${user.xpNext} XP</span>
      <span class="text-xs text-cyan-500 font-medium">${percent}%</span>
    </div>
    <p class="text-xs text-slate-400 mt-2">${user.xpNext - user.xp} XP lagi untuk Level ${user.level + 1}</p>
  `;
}

// ============================================================
// Period Filter
// ============================================================

/** Wires up the daily/weekly/monthly filter buttons. */
function initPeriodFilter() {
  const buttons = document.querySelectorAll('.period-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active style
      buttons.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-white');
        b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-cyan-500', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');

      // Re-render cards and table with selected period
      const period = btn.dataset.period;
      renderSummaryCards(period);
      renderRecentTasks(period);
    });
  });
}

// ============================================================
// Recent Tasks Table
// ============================================================

/**
 * Renders the recent tasks table, filtered by period.
 * Shows the 5 most recent tasks for readability.
 * @param {string} period
 */
function renderRecentTasks(period) {
  const tbody = document.getElementById('recent-tasks-body');
  if (!tbody) return;

  const tasks = window.TASK_DATA
    .filter(t => isInPeriod(t.createdAt, period))
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (!tasks.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-8 text-slate-400 text-sm">
          Tidak ada tugas pada periode ini.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = tasks.map(t => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="py-3 px-4">
        <p class="font-medium text-slate-700 text-sm">${t.title}</p>
        <p class="text-xs text-slate-400">${t.id}</p>
      </td>
      <td class="py-3 px-4">${priorityBadge(t.priority)}</td>
      <td class="py-3 px-4">${statusBadge(t.status)}</td>
      <td class="py-3 px-4">
        <span class="text-sm ${deadlineColor(t.deadline)}">${formatDate(t.deadline)}</span>
        <br><span class="text-xs text-slate-400">${deadlineLabel(t.deadline)}</span>
      </td>
      <td class="py-3 px-4">
        <a href="assignment.html" class="text-xs text-cyan-600 hover:underline font-medium">Lihat →</a>
      </td>
    </tr>
  `).join('');
}

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderSummaryCards('monthly');
  renderXpWidget();
  initPeriodFilter();
  renderRecentTasks('monthly');

  // Set default active filter button
  const defaultBtn = document.querySelector('.period-btn[data-period="monthly"]');
  if (defaultBtn) {
    defaultBtn.classList.add('bg-cyan-500', 'text-white');
    defaultBtn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
  }
});

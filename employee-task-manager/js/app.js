/**
 * app.js — Employee Task Manager
 * Shared utilities: sidebar toggle, active nav, date helpers.
 * Loaded on every page before page-specific scripts.
 */

// ============================================================
// Sidebar Toggle
// ============================================================

/**
 * Initialises the sidebar collapse/expand behaviour.
 * On desktop: collapses sidebar to icon-only width.
 * On mobile:  slides sidebar in/out with an overlay.
 */
function initSidebar() {
  const sidebar        = document.getElementById('sidebar');
  const mainContent    = document.getElementById('main-content');
  const toggleBtn      = document.getElementById('sidebar-toggle');
  const overlay        = document.getElementById('sidebar-overlay');

  if (!sidebar || !toggleBtn) return;

  const isMobile = () => window.innerWidth < 768;

  toggleBtn.addEventListener('click', () => {
    if (isMobile()) {
      // Mobile: slide in/out
      sidebar.classList.toggle('mobile-open');
      overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
    } else {
      // Desktop: collapse/expand
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    }
  });

  // Close sidebar on overlay click (mobile)
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.style.display = 'none';
  });

  // On resize reset mobile state
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      sidebar.classList.remove('mobile-open');
      overlay.style.display = 'none';
    }
  });
}

// ============================================================
// Active Navigation
// ============================================================

/**
 * Marks the nav-item that matches the current page as active.
 */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems    = document.querySelectorAll('.nav-item[data-page]');

  navItems.forEach(item => {
    if (item.dataset.page === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ============================================================
// Date & Time Utilities
// ============================================================

/**
 * Formats a Date object or ISO string to "DD Mon YYYY".
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Returns "X days left", "Due today", or "Overdue" relative to today.
 * @param {string} isoDeadline  ISO date string
 * @returns {string}
 */
function deadlineLabel(isoDeadline) {
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDeadline); deadline.setHours(0, 0, 0, 0);
  const diff     = Math.round((deadline - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return `Overdue ${Math.abs(diff)}d`;
  if (diff === 0) return 'Due today';
  return `${diff}d left`;
}

/**
 * Returns true if isoDate falls within the given period relative to today.
 * @param {string} isoDate
 * @param {'daily'|'weekly'|'monthly'} period
 */
function isInPeriod(isoDate, period) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d     = new Date(isoDate); d.setHours(0, 0, 0, 0);

  if (period === 'daily') {
    return d.getTime() === today.getTime();
  }
  if (period === 'weekly') {
    const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 6);
    return d >= weekAgo && d <= today;
  }
  if (period === 'monthly') {
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  }
  return true;
}

// ============================================================
// Badge HTML helpers
// ============================================================

/**
 * Returns the HTML string for a status badge.
 * @param {'todo'|'review'|'approved'|'revision'} status
 */
function statusBadge(status) {
  const map = {
    todo:     ['badge-todo',     'To-Do'],
    review:   ['badge-review',   'Waiting Review'],
    approved: ['badge-approved', 'Approved'],
    revision: ['badge-revision', 'Revision'],
  };
  const [cls, label] = map[status] || ['badge-todo', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

/**
 * Returns the HTML string for a priority badge.
 * @param {'high'|'medium'|'low'} priority
 */
function priorityBadge(priority) {
  const map = {
    high:   ['badge-high',   'High'],
    medium: ['badge-medium', 'Medium'],
    low:    ['badge-low',    'Low'],
  };
  const [cls, label] = map[priority] || ['badge-low', priority];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ============================================================
// Deadline colour helper
// ============================================================

/**
 * Returns a Tailwind text-colour class based on days remaining.
 * @param {string} isoDeadline
 */
function deadlineColor(isoDeadline) {
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDeadline); deadline.setHours(0, 0, 0, 0);
  const diff     = Math.round((deadline - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return 'text-red-600 font-semibold';
  if (diff <= 2) return 'text-orange-500 font-semibold';
  return 'text-slate-500';
}

// ============================================================
// Bootstrap on DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initActiveNav();
});

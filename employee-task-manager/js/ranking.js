/**
 * ranking.js — Employee Task Manager
 * Logic for the Ranking page:
 *   - Top-3 Podium cards
 *   - Full leaderboard table
 *   - Current user highlight
 */

// ============================================================
// Mock Leaderboard Data
// ============================================================

/** Full ranking data for the Engineering division */
window.RANKING_DATA = [
  { rank: 1,  name: 'Siti Rahma',    role: 'Backend Engineer',   avatar: 'SR', xp: 2850, tasksCompleted: 34 },
  { rank: 2,  name: 'Budi Santoso',  role: 'DevOps Engineer',    avatar: 'BS', xp: 2410, tasksCompleted: 29 },
  { rank: 3,  name: 'Muhammad Faiz',    role: 'Frontend Engineer',  avatar: 'AF', xp: 1240, tasksCompleted: 18, isMe: true },
  { rank: 4,  name: 'Dewi Lestari',  role: 'UI/UX Designer',     avatar: 'DL', xp: 1180, tasksCompleted: 17 },
  { rank: 5,  name: 'Rizky Pratama', role: 'Mobile Engineer',    avatar: 'RP', xp: 980,  tasksCompleted: 14 },
  { rank: 6,  name: 'Nurul Aini',    role: 'QA Engineer',        avatar: 'NA', xp: 870,  tasksCompleted: 13 },
  { rank: 7,  name: 'Hendra Wijaya', role: 'Backend Engineer',   avatar: 'HW', xp: 760,  tasksCompleted: 11 },
  { rank: 8,  name: 'Maya Putri',    role: 'Frontend Engineer',  avatar: 'MP', xp: 650,  tasksCompleted: 10 },
  { rank: 9,  name: 'Dian Kusuma',   role: 'Data Engineer',      avatar: 'DK', xp: 540,  tasksCompleted: 8  },
  { rank: 10, name: 'Eko Saputra',   role: 'DevOps Engineer',    avatar: 'ES', xp: 420,  tasksCompleted: 6  },
];

// ============================================================
// XP Bar utility
// ============================================================

/**
 * Returns a normalised XP bar width (%) relative to rank-1 max XP.
 * @param {number} xp
 * @returns {number}
 */
function xpPercent(xp) {
  const maxXp = window.RANKING_DATA[0].xp;
  return Math.round((xp / maxXp) * 100);
}

// ============================================================
// Medal / Crown icons for top 3
// ============================================================

const MEDAL_ICONS = {
  1: `<svg class="w-7 h-7 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 17l-6.18 3.02L7 13.14 2 8.27l6.91-1.01L12 1z"/>
      </svg>`,
  2: `<svg class="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>`,
  3: `<svg class="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
      </svg>`,
};

// ============================================================
// Podium (Top 3)
// ============================================================

/** Renders the top-3 podium section. */
function renderPodium() {
  const container = document.getElementById('podium');
  if (!container) return;

  // Podium order: 2nd, 1st, 3rd
  const orderedRanks = [2, 1, 3];

  container.innerHTML = orderedRanks.map(rank => {
    const person = window.RANKING_DATA.find(p => p.rank === rank);
    if (!person) return '';

    const rankClass = `rank-${rank}`;
    const isMe      = person.isMe;

    const heightMap = { 1: 'pt-4', 2: 'pt-10', 3: 'pt-10' };
    const avatarSize = rank === 1 ? 'w-16 h-16 text-lg' : 'w-12 h-12 text-sm';

    return `
      <div class="podium-card ${rankClass} ${heightMap[rank]} p-5 text-center flex flex-col items-center flex-1 max-w-xs relative">
        ${isMe ? '<span class="absolute top-2 right-2 text-xs bg-cyan-500 text-white rounded-full px-2 py-0.5 font-medium">You</span>' : ''}
        <div class="mb-2">${MEDAL_ICONS[rank] || ''}</div>
        <!-- Avatar -->
        <div class="rounded-full ${avatarSize} bg-slate-700 flex items-center justify-center text-white font-bold mb-3 ${rank === 1 ? 'ring-4 ring-amber-400' : ''}">
          ${person.avatar}
        </div>
        <!-- Info -->
        <p class="font-bold text-slate-800 text-sm">${person.name}</p>
        <p class="text-xs text-slate-500 mb-3">${person.role}</p>
        <!-- XP -->
        <div class="bg-slate-100 rounded-lg px-3 py-1 mb-2">
          <span class="text-sm font-bold text-slate-800">${person.xp.toLocaleString()}</span>
          <span class="text-xs text-slate-400 ml-1">XP</span>
        </div>
        <!-- Rank number badge -->
        <span class="text-2xl font-black ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-400' : 'text-amber-700'}">#${rank}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// Leaderboard Table
// ============================================================

/** Renders the full leaderboard table. */
function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;

  const myRank = window.RANKING_DATA.find(p => p.isMe)?.rank;

  tbody.innerHTML = window.RANKING_DATA.map(person => {
    const isMe   = person.isMe;
    const rowCls = isMe ? 'leaderboard-row is-me' : 'leaderboard-row border-b border-slate-100 hover:bg-slate-50 transition-colors';

    // Rank number badge styling
    let rankDisplay;
    if (person.rank === 1)      rankDisplay = `<span class="text-amber-400 font-black text-lg">🥇</span>`;
    else if (person.rank === 2) rankDisplay = `<span class="text-slate-400 font-black text-lg">🥈</span>`;
    else if (person.rank === 3) rankDisplay = `<span class="text-amber-700 font-black text-lg">🥉</span>`;
    else                        rankDisplay = `<span class="text-slate-500 font-semibold">${person.rank}</span>`;

    const percent = xpPercent(person.xp);

    return `
      <tr class="${rowCls}">
        <td class="py-3 px-4 text-center w-12">${rankDisplay}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              ${person.avatar}
            </div>
            <div>
              <p class="font-semibold text-slate-800 text-sm flex items-center gap-1">
                ${person.name}
                ${isMe ? '<span class="text-xs bg-cyan-500 text-white rounded-full px-2 py-0.5">Anda</span>' : ''}
              </p>
              <p class="text-xs text-slate-400">${person.role}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <div class="xp-bar-track w-24">
              <div class="xp-bar-fill" style="width: ${percent}%"></div>
            </div>
            <span class="text-sm font-semibold text-slate-700">${person.xp.toLocaleString()}</span>
            <span class="text-xs text-slate-400">XP</span>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-slate-600 text-center">
          ${person.tasksCompleted}
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// Render user position banner
// ============================================================

/** Renders the "Your Position" banner below the leaderboard. */
function renderMyPosition() {
  const banner = document.getElementById('my-position-banner');
  if (!banner) return;

  const me = window.RANKING_DATA.find(p => p.isMe);
  if (!me) return;

  const total   = window.RANKING_DATA.length;
  const percent = xpPercent(me.xp);

  banner.innerHTML = `
    <div class="flex items-center gap-4 flex-wrap">
      <div class="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
        ${me.avatar}
      </div>
      <div class="flex-1">
        <p class="font-semibold text-slate-800">${me.name} <span class="text-xs bg-cyan-500 text-white rounded-full px-2 py-0.5 ml-1">Anda</span></p>
        <p class="text-xs text-slate-500">${me.role}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-black text-cyan-500">#${me.rank} <span class="text-sm font-normal text-slate-400">/ ${total}</span></p>
        <p class="text-xs text-slate-400">${me.xp.toLocaleString()} XP (${percent}% dari leader)</p>
      </div>
    </div>
  `;
}

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderPodium();
  renderLeaderboard();
  renderMyPosition();
});

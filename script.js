/**
 * Smart Finance Dashboard — script.js
 * Vanilla JS | Chart.js v4 | No frameworks
 * -------------------------------------------------------
 * Sections:
 *   1. DATA STORE   — all mock financial data per period
 *   2. STATE        — current active period / filters
 *   3. KPI          — render KPI cards
 *   4. HEALTH       — financial health indicator
 *   5. CHARTS       — trend, doughnut, budget bar
 *   6. TRANSACTIONS — table render, search, filter
 *   7. NAVIGATION   — sidebar page switching
 *   8. EVENTS       — all event listeners
 *   9. INIT         — bootstrap on DOM ready
 */

/* ============================================================
   1. DATA STORE
   ============================================================ */
const DATA = {
  all: {
    balance:  12450,
    income:   4800,
    expense:  2150,
    savings:  78,
    healthScore: 78,
    trend: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      income:  [3800,4100,3950,4300,4600,4200,4800,5100,4700,4900,4800,5200],
      expense: [1800,2100,1950,2300,2050,2200,2150,2400,1900,2100,2150,2300]
    },
    donut: {
      labels: ['Food','Housing','Transport','Entertainment','Utilities'],
      data:   [520, 750, 280, 350, 250],
      colors: ['#f59e0b','#6366f1','#38bdf8','#f43f5e','#94a3b8']
    },
    budget: {
      labels:    ['Food','Housing','Transport','Entertainment','Utilities'],
      allocated: [600,  800,  350,  400,  280],
      spent:     [520,  750,  280,  350,  250]
    }
  },
  month: {
    balance:  10200,
    income:   4800,
    expense:  2150,
    savings:  65,
    healthScore: 65,
    trend: {
      labels: ['Week 1','Week 2','Week 3','Week 4'],
      income:  [1200, 1200, 1200, 1200],
      expense: [580,  540,  490,  540]
    },
    donut: {
      labels: ['Food','Housing','Transport','Entertainment','Utilities'],
      data:   [520, 750, 280, 350, 250],
      colors: ['#f59e0b','#6366f1','#38bdf8','#f43f5e','#94a3b8']
    },
    budget: {
      labels:    ['Food','Housing','Transport','Entertainment','Utilities'],
      allocated: [600,  800,  350,  400,  280],
      spent:     [520,  750,  280,  350,  250]
    }
  },
  last: {
    balance:  9800,
    income:   4560,
    expense:  2310,
    savings:  55,
    healthScore: 55,
    trend: {
      labels: ['Week 1','Week 2','Week 3','Week 4'],
      income:  [1140, 1140, 1140, 1140],
      expense: [600,  560,  580,  570]
    },
    donut: {
      labels: ['Food','Housing','Transport','Entertainment','Utilities'],
      data:   [600, 740, 310, 380, 280],
      colors: ['#f59e0b','#6366f1','#38bdf8','#f43f5e','#94a3b8']
    },
    budget: {
      labels:    ['Food','Housing','Transport','Entertainment','Utilities'],
      allocated: [600,  800,  350,  400,  280],
      spent:     [600,  740,  310,  380,  280]
    }
  },
  year: {
    balance:  12450,
    income:   57600,
    expense:  25800,
    savings:  78,
    healthScore: 82,
    trend: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      income:  [3800,4100,3950,4300,4600,4200,4800,5100,4700,4900,4800,5200],
      expense: [1800,2100,1950,2300,2050,2200,2150,2400,1900,2100,2150,2300]
    },
    donut: {
      labels: ['Food','Housing','Transport','Entertainment','Utilities'],
      data:   [6400,9000,3360,4200,3000],
      colors: ['#f59e0b','#6366f1','#38bdf8','#f43f5e','#94a3b8']
    },
    budget: {
      labels:    ['Food','Housing','Transport','Entertainment','Utilities'],
      allocated: [7200, 9600, 4200, 4800, 3360],
      spent:     [6400, 9000, 3360, 4200, 3000]
    }
  }
};

/* All transactions pool — filtered by period on render */
const ALL_TRANSACTIONS = [
  { id:1,  emoji:'🛒', name:'Grocery Store',     desc:'Supermarket',          cat:'Food',          date:'2024-10-28', amount:-85.50,  status:'Completed' },
  { id:2,  emoji:'💼', name:'Salary Deposit',     desc:'October paycheck',     cat:'Income',        date:'2024-10-27', amount:4800.00, status:'Completed' },
  { id:3,  emoji:'🏠', name:'Rent Payment',        desc:'Monthly rent',         cat:'Housing',       date:'2024-10-26', amount:-750.00, status:'Completed' },
  { id:4,  emoji:'⚡', name:'Electricity Bill',    desc:'October utility',      cat:'Utilities',     date:'2024-10-25', amount:-92.30,  status:'Completed' },
  { id:5,  emoji:'🚗', name:'Fuel Station',        desc:'Gas fill-up',          cat:'Transport',     date:'2024-10-24', amount:-55.00,  status:'Completed' },
  { id:6,  emoji:'🎬', name:'Netflix',             desc:'Streaming sub',        cat:'Entertainment', date:'2024-10-23', amount:-15.99,  status:'Completed' },
  { id:7,  emoji:'🍕', name:'Pizza Palace',        desc:'Dinner out',           cat:'Food',          date:'2024-10-22', amount:-42.00,  status:'Completed' },
  { id:8,  emoji:'💰', name:'Freelance Project',   desc:'Web design project',   cat:'Income',        date:'2024-10-21', amount:650.00,  status:'Completed' },
  { id:9,  emoji:'🚇', name:'Metro Card',          desc:'Monthly transit pass', cat:'Transport',     date:'2024-10-20', amount:-90.00,  status:'Pending'   },
  { id:10, emoji:'☕', name:'Coffee Shop',         desc:'Daily coffee',         cat:'Food',          date:'2024-10-19', amount:-12.50,  status:'Completed' },
  { id:11, emoji:'📱', name:'Phone Bill',          desc:'Monthly plan',         cat:'Utilities',     date:'2024-10-18', amount:-45.00,  status:'Completed' },
  { id:12, emoji:'🎮', name:'Steam Game Purchase', desc:'New release',          cat:'Entertainment', date:'2024-10-17', amount:-29.99,  status:'Completed' },
  { id:13, emoji:'🏦', name:'Savings Transfer',    desc:'Auto-save rule',       cat:'Savings',       date:'2024-10-16', amount:-500.00, status:'Completed' },
  { id:14, emoji:'🍜', name:'Restaurant Lunch',    desc:'Team lunch',           cat:'Food',          date:'2024-10-15', amount:-38.00,  status:'Failed'    },
  { id:15, emoji:'🚘', name:'Uber Ride',           desc:'Airport trip',         cat:'Transport',     date:'2024-10-14', amount:-22.50,  status:'Completed' }
];

/* ============================================================
   2. STATE
   ============================================================ */
const state = {
  period:    'all',
  searchQ:   '',
  catFilter: ''
};

/* ============================================================
   3. KPI CARDS
   ============================================================ */
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function renderKPI(d) {
  document.getElementById('val-balance').textContent = `$${fmt(d.balance)}`;
  document.getElementById('val-income').textContent  = `$${fmt(d.income)}`;
  document.getElementById('val-expense').textContent = `$${fmt(d.expense)}`;
  document.getElementById('val-savings').textContent = `${d.savings}%`;

  /* Savings bar + value animate */
  const bar = document.getElementById('savingsBar');
  bar.style.width = d.savings + '%';
}

/* ============================================================
   4. FINANCIAL HEALTH INDICATOR
   ============================================================ */
function renderHealth(d) {
  const ratio = d.expense / d.income * 100;
  const card  = document.getElementById('healthCard');
  const icon  = document.getElementById('healthIcon');
  const title = document.getElementById('healthTitle');
  const msg   = document.getElementById('healthMsg');
  const ring  = document.getElementById('ringFill');
  const num   = document.getElementById('scoreNum');
  const score = d.healthScore;

  /* Score ring: circumference = 2π×24 ≈ 150.8 */
  const offset = 150.8 - (150.8 * score / 100);
  ring.style.strokeDashoffset = offset;
  num.textContent = score;

  /* Reset classes */
  card.classList.remove('warn', 'alert');

  if (ratio < 50) {
    ring.style.stroke = '#10b981'; /* green */
    icon.textContent  = '✅';
    title.textContent = 'Financial Health: Good';
    msg.textContent   = `Your expense ratio is ${ratio.toFixed(1)}% of income. Great job keeping it under 50%!`;
  } else if (ratio < 75) {
    ring.style.stroke = '#f59e0b'; /* amber */
    card.classList.add('warn');
    icon.textContent  = '⚠️';
    title.textContent = 'Financial Health: Caution';
    msg.textContent   = `Your expense ratio is ${ratio.toFixed(1)}% of income. Try to reduce non-essential spending.`;
  } else {
    ring.style.stroke = '#f43f5e'; /* red */
    card.classList.add('alert');
    icon.textContent  = '🔴';
    title.textContent = 'Financial Health: At Risk';
    msg.textContent   = `Your expense ratio is ${ratio.toFixed(1)}% of income. Immediate budget review recommended.`;
  }
}

/* ============================================================
   5. CHARTS
   ============================================================ */
/* Keep chart instances so we can destroy & recreate on update */
let chartTrend    = null;
let chartDoughnut = null;
let chartBudget   = null;

/* --- Shared Chart.js defaults -------------------------------- */
Chart.defaults.color          = '#94a3b8';
Chart.defaults.borderColor    = '#334155';
Chart.defaults.font.family    = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size      = 12;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b';
Chart.defaults.plugins.tooltip.borderColor     = '#334155';
Chart.defaults.plugins.tooltip.borderWidth     = 1;
Chart.defaults.plugins.tooltip.titleColor      = '#f1f5f9';
Chart.defaults.plugins.tooltip.bodyColor       = '#94a3b8';
Chart.defaults.plugins.tooltip.padding         = 10;
Chart.defaults.plugins.tooltip.cornerRadius    = 8;

/* Helper to destroy an existing chart before recreating */
function destroyChart(instance) {
  if (instance) { instance.destroy(); }
  return null;
}

/* ── 5a. Trend Line/Area Chart ─────────────────────────────── */
function renderTrendChart(d) {
  chartTrend = destroyChart(chartTrend);
  const ctx = document.getElementById('trendChart').getContext('2d');

  /* Create gradient fills */
  const gIncome = ctx.createLinearGradient(0, 0, 0, 240);
  gIncome.addColorStop(0, 'rgba(56,189,248,.35)');
  gIncome.addColorStop(1, 'rgba(56,189,248,.01)');

  const gExpense = ctx.createLinearGradient(0, 0, 0, 240);
  gExpense.addColorStop(0, 'rgba(244,63,94,.25)');
  gExpense.addColorStop(1, 'rgba(244,63,94,.01)');

  chartTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.trend.labels,
      datasets: [
        {
          label: 'Income',
          data:  d.trend.income,
          borderColor: '#38bdf8',
          backgroundColor: gIncome,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8',
          pointHoverRadius: 6
        },
        {
          label: 'Expense',
          data:  d.trend.expense,
          borderColor: '#f43f5e',
          backgroundColor: gExpense,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#f43f5e',
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: $${fmt(ctx.raw)}`
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(51,65,85,.5)' }, ticks: { maxRotation: 0 } },
        y: {
          grid: { color: 'rgba(51,65,85,.5)' },
          ticks: { callback: (v) => '$' + v.toLocaleString() }
        }
      }
    }
  });
}

/* ── 5b. Doughnut Chart ────────────────────────────────────── */
function renderDoughnutChart(d) {
  chartDoughnut = destroyChart(chartDoughnut);
  const ctx = document.getElementById('doughnutChart').getContext('2d');

  chartDoughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.donut.labels,
      datasets: [{
        data:            d.donut.data,
        backgroundColor: d.donut.colors,
        borderColor:     '#1e293b',
        borderWidth:     3,
        hoverBorderWidth: 0,
        hoverOffset:     8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: $${fmt(ctx.raw)}`
          }
        }
      }
    }
  });

  /* Build custom legend */
  const ul = document.getElementById('donutLegend');
  ul.innerHTML = '';
  const total = d.donut.data.reduce((a,b) => a+b, 0);
  d.donut.labels.forEach((lbl, i) => {
    const pct = ((d.donut.data[i] / total) * 100).toFixed(1);
    ul.innerHTML += `
      <li>
        <span class="dot" style="background:${d.donut.colors[i]}"></span>
        ${lbl} <strong>$${fmt(d.donut.data[i])}</strong> <span style="color:#64748b">(${pct}%)</span>
      </li>`;
  });
}

/* ── 5c. Budget Bar Chart ──────────────────────────────────── */
function renderBudgetChart(d) {
  chartBudget = destroyChart(chartBudget);
  const ctx = document.getElementById('budgetChart').getContext('2d');

  chartBudget = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.budget.labels,
      datasets: [
        {
          label: 'Budget Allocated',
          data:  d.budget.allocated,
          backgroundColor: 'rgba(56,189,248,.55)',
          borderColor:     '#38bdf8',
          borderWidth:     1,
          borderRadius:    6
        },
        {
          label: 'Actual Spent',
          data:  d.budget.spent,
          backgroundColor: 'rgba(16,185,129,.55)',
          borderColor:     '#10b981',
          borderWidth:     1,
          borderRadius:    6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { boxWidth: 12, padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: $${fmt(ctx.raw)}`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(51,65,85,.5)' },
          ticks: { callback: (v) => '$' + v.toLocaleString() }
        }
      }
    }
  });
}

/* ── Render all charts together ─────────────────────────────── */
function renderCharts(d) {
  renderTrendChart(d);
  renderDoughnutChart(d);
  renderBudgetChart(d);
}

/* ============================================================
   6. TRANSACTIONS TABLE
   ============================================================ */
const CAT_BADGE = {
  Food:          'badge-food',
  Housing:       'badge-housing',
  Transport:     'badge-transport',
  Entertainment: 'badge-entertainment',
  Utilities:     'badge-utilities',
  Income:        'badge-income',
  Savings:       'badge-savings'
};
const STATUS_CLASS = {
  Completed: 'status-completed',
  Pending:   'status-pending',
  Failed:    'status-failed'
};

function renderTransactions() {
  const q   = state.searchQ.toLowerCase();
  const cat = state.catFilter;

  let rows = ALL_TRANSACTIONS;

  /* Period filter — simple heuristic: show last N transactions by id */
  if (state.period === 'month')  rows = rows.slice(0, 10);
  if (state.period === 'last')   rows = rows.slice(4, 15);
  if (state.period === 'year')   rows = rows.slice(0, 15);
  if (state.period === 'all')    rows = rows.slice(0, 15);

  /* Search filter */
  if (q) rows = rows.filter(r =>
    r.name.toLowerCase().includes(q)  ||
    r.desc.toLowerCase().includes(q)  ||
    r.cat.toLowerCase().includes(q)
  );

  /* Category filter */
  if (cat) rows = rows.filter(r => r.cat === cat);

  const tbody = document.getElementById('txTableBody');
  const empty = document.getElementById('txEmpty');
  tbody.innerHTML = '';

  if (!rows.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  rows.forEach(r => {
    const isPos  = r.amount > 0;
    const amtStr = isPos ? `+$${fmt(r.amount)}` : `-$${fmt(Math.abs(r.amount))}`;
    const dateStr = new Date(r.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="tx-name-cell">
          <span class="tx-emoji">${r.emoji}</span>
          <div>
            <div class="tx-name">${r.name}</div>
            <div class="tx-desc">${r.desc}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${CAT_BADGE[r.cat] || ''}">${r.cat}</span></td>
      <td style="color:var(--muted)">${dateStr}</td>
      <td class="${isPos ? 'amount-pos' : 'amount-neg'}">${amtStr}</td>
      <td><span class="status-pill ${STATUS_CLASS[r.status]}">${r.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ============================================================
   7. NAVIGATION (Sidebar page links)
   ============================================================ */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pageTitle    = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const page = item.dataset.page;
      const labels = {
        dashboard:    ['Dashboard',    'Welcome back, Alex 👋'],
        analytics:    ['Analytics',    'Detailed financial insights'],
        transactions: ['Transactions', 'Full transaction history'],
        settings:     ['Settings',     'Account & preferences']
      };
      const [title, sub] = labels[page] || ['Dashboard', ''];
      pageTitle.textContent    = title;
      pageSubtitle.textContent = sub;

      /* Close mobile sidebar */
      closeSidebar();
    });
  });
}

/* ============================================================
   8. EVENTS
   ============================================================ */

/* -- Time filter buttons ------------------------------------ */
function setupFilterButtons() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.period = btn.dataset.period;
      refreshDashboard();
    });
  });
}

/* -- Search -------------------------------------------------- */
function setupSearch() {
  document.getElementById('txSearch').addEventListener('input', (e) => {
    state.searchQ = e.target.value;
    renderTransactions();
  });
}

/* -- Category filter ---------------------------------------- */
function setupCatFilter() {
  document.getElementById('txCatFilter').addEventListener('change', (e) => {
    state.catFilter = e.target.value;
    renderTransactions();
  });
}

/* -- Mobile sidebar ----------------------------------------- */
const sidebar        = document.getElementById('sidebar');
const overlay        = document.getElementById('sidebarOverlay');

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

function setupMobileMenu() {
  document.getElementById('menuToggle').addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('active', isOpen);
  });
  overlay.addEventListener('click', closeSidebar);
}

/* ============================================================
   9. MASTER REFRESH — called when period changes
   ============================================================ */
function refreshDashboard() {
  const d = DATA[state.period];
  renderKPI(d);
  renderHealth(d);
  renderCharts(d);
  renderTransactions();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFilterButtons();
  setupSearch();
  setupCatFilter();
  setupMobileMenu();

  /* Initial render with default period */
  refreshDashboard();
});

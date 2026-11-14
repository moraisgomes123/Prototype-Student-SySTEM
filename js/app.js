'use strict';

const DEMO_USERS = [
  { studentNumber: 'ST10467009', password: 'Student123!', name: 'Morais Adao' },
  { studentNumber: 'ST10467010', password: 'Student123!', name: 'Alex Student' }
];

const DEMO_RECORDS = {
  ST10467009: [
    { id: 'R1001', date: '2026-09-10', module: 'Web Development', status: 'Present' },
    { id: 'R1002', date: '2026-09-12', module: 'Database Systems', status: 'Present' },
    { id: 'R1003', date: '2026-09-15', module: 'Human Computer Interaction', status: 'Absent' },
    { id: 'R1004', date: '2026-09-17', module: 'Web Development', status: 'Present' },
    { id: 'R1005', date: '2026-09-19', module: 'Database Systems', status: 'Present' },
    { id: 'R1006', date: '2026-09-22', module: 'Human Computer Interaction', status: 'Present' },
    { id: 'R1007', date: '2026-09-24', module: 'Web Development', status: 'Present' },
    { id: 'R1008', date: '2026-09-26', module: 'Database Systems', status: 'Absent' },
    { id: 'R1009', date: '2026-09-29', module: 'Human Computer Interaction', status: 'Present' },
    { id: 'R1010', date: '2026-10-01', module: 'Web Development', status: 'Present' }
  ],
  ST10467010: [
    { id: 'R2001', date: '2026-09-11', module: 'Programming Fundamentals', status: 'Present' },
    { id: 'R2002', date: '2026-09-14', module: 'Database Systems', status: 'Absent' },
    { id: 'R2003', date: '2026-09-18', module: 'Programming Fundamentals', status: 'Present' },
    { id: 'R2004', date: '2026-09-23', module: 'Database Systems', status: 'Present' }
  ]
};

function currentUser() {
  const number = sessionStorage.getItem('sasStudentNumber');
  return DEMO_USERS.find(user => user.studentNumber === number) || null;
}
function requireLogin() {
  const user = currentUser();
  if (!user) { window.location.replace('index.html'); return null; }
  return user;
}
function recordsFor(user) {
  return DEMO_RECORDS[user.studentNumber] || [];
}
function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}
function statusMarkup(status) {
  const cls = status === 'Present' ? 'status-present' : 'status-absent';
  return `<span class="status ${cls}">${status}</span>`;
}
function tableMarkup(records, caption) {
  if (!records.length) return '<div class="empty-state">No attendance records match your selection.</div>';
  const rows = records.map(record => `
    <tr>
      <th scope="row">${formatDate(record.date)}</th>
      <td>${escapeHtml(record.module)}</td>
      <td>${statusMarkup(record.status)}</td>
    </tr>`).join('');
  return `<table><caption>${caption}</caption>
    <thead><tr><th scope="col">Date</th><th scope="col">Module</th><th scope="col">Attendance status</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
function renderShell(user, activePage) {
  const header = document.getElementById('app-header');
  if (header) {
    header.innerHTML = `
      <header class="site-header"><div class="container header-inner">
        <a class="brand" href="dashboard.html"><span class="brand-symbol" aria-hidden="true">SA</span><span class="brand-name">Student Attendance System</span></a>
        <div class="header-right"><span class="student-label">Signed in as <strong>${escapeHtml(user.name)}</strong></span>
          <a class="logout-link" href="index.html" id="logout-link">Logout</a></div>
      </div></header>
      <nav class="main-nav" aria-label="Main navigation"><div class="container nav-inner">
        <a class="nav-link" ${activePage === 'dashboard' ? 'aria-current="page"' : ''} href="dashboard.html">Dashboard</a>
        <a class="nav-link" ${activePage === 'attendance' ? 'aria-current="page"' : ''} href="attendance.html">My Attendance</a>
        <a class="nav-link" ${activePage === 'history' ? 'aria-current="page"' : ''} href="history.html">Attendance History</a>
      </div></nav>`;
    document.getElementById('logout-link').addEventListener('click', () => sessionStorage.removeItem('sasStudentNumber'));
  }
  const footer = document.getElementById('app-footer');
  if (footer) footer.innerHTML = '<footer class="site-footer">Student Attendance System · Student records are private and read-only</footer>';
}
function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const number = document.getElementById('student-number').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    const error = document.getElementById('login-error');
    const user = DEMO_USERS.find(item => item.studentNumber === number && item.password === password);
    if (!number || !password) {
      error.textContent = 'Please enter both your student number and password.';
      return;
    }
    if (!user) {
      error.textContent = 'Your login details are incorrect. Please check them and try again.';
      document.getElementById('password').value = '';
      document.getElementById('password').focus();
      return;
    }
    sessionStorage.setItem('sasStudentNumber', user.studentNumber);
    window.location.href = 'dashboard.html';
  });
}
function initDashboard(user) {
  const records = recordsFor(user);
  const present = records.filter(record => record.status === 'Present').length;
  document.getElementById('welcome-heading').textContent = `Welcome, ${user.name}`;
  document.getElementById('total-classes').textContent = records.length;
  document.getElementById('present-count').textContent = present;
  document.getElementById('attendance-rate').textContent = records.length ? `${Math.round(present / records.length * 100)}%` : '0%';
  document.getElementById('recent-records').innerHTML = tableMarkup(records.slice(-4).reverse(), 'Your four most recent sessions');
}
function initAttendance(user) {
  const records = recordsFor(user).slice().reverse();
  document.getElementById('attendance-table').innerHTML = tableMarkup(records, 'Attendance records for your student account');
  document.getElementById('attendance-total').textContent = `${records.length} records`;
  document.getElementById('last-updated').textContent = '10 November 2026';
  document.getElementById('last-updated').dateTime = '2026-11-10';
  initReport(user, records);
}
function initReport(user, records) {
  const dialog = document.getElementById('report-dialog');
  const confirmation = document.getElementById('confirmation-dialog');
  const select = document.getElementById('report-record');
  select.innerHTML = records.map(record => `<option value="${record.id}">${formatDate(record.date)} · ${escapeHtml(record.module)} · ${record.status}</option>`).join('');
  document.querySelectorAll('[data-open-report]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog.close()));
  document.querySelector('[data-close-confirmation]').addEventListener('click', () => confirmation.close());
  document.getElementById('report-form').addEventListener('submit', event => {
    event.preventDefault();
    const description = document.getElementById('report-description').value.trim();
    const error = document.getElementById('report-error');
    if (description.length < 10) {
      error.textContent = 'Please provide at least 10 characters so the issue can be understood.';
      return;
    }
    const selectedRecord = records.find(record => record.id === select.value);
    const reports = JSON.parse(sessionStorage.getItem('sasReports') || '[]');
    reports.push({
      studentNumber: user.studentNumber,
      recordId: select.value,
      description,
      submittedAt: new Date().toISOString()
    });
    sessionStorage.setItem('sasReports', JSON.stringify(reports));
    document.getElementById('confirmation-message').textContent =
      `Your report about ${selectedRecord ? formatDate(selectedRecord.date) : 'the selected record'} has been submitted in this prototype. The official attendance record has not been changed.`;
    dialog.close();
    confirmation.showModal();
    event.target.reset();
    error.textContent = '';
  });
}
function initHistory(user) {
  const allRecords = recordsFor(user).slice().sort((a, b) => b.date.localeCompare(a.date));
  const moduleSelect = document.getElementById('module-filter');
  [...new Set(allRecords.map(record => record.module))].sort().forEach(module => {
    const option = document.createElement('option');
    option.value = module;
    option.textContent = module;
    moduleSelect.appendChild(option);
  });
  const render = () => {
    const module = moduleSelect.value;
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    const feedback = document.getElementById('filter-feedback');
    if (start && end && start > end) {
      feedback.textContent = 'The start date must be earlier than or equal to the end date.';
      feedback.className = 'form-message error';
      document.getElementById('history-table').innerHTML = '';
      document.getElementById('history-total').textContent = '0 records';
      return;
    }
    const filtered = allRecords.filter(record =>
      (!module || record.module === module) &&
      (!start || record.date >= start) &&
      (!end || record.date <= end)
    );
    document.getElementById('history-table').innerHTML = tableMarkup(filtered, 'Filtered attendance history for your student account');
    document.getElementById('history-total').textContent = `${filtered.length} records`;
    feedback.textContent = `Showing ${filtered.length} of ${allRecords.length} records.`;
    feedback.className = 'form-message';
  };
  document.getElementById('filter-form').addEventListener('submit', event => { event.preventDefault(); render(); });
  document.getElementById('clear-filters').addEventListener('click', () => setTimeout(render, 0));
  render();
}
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'login') { initLogin(); return; }
  const user = requireLogin();
  if (!user) return;
  renderShell(user, page);
  if (page === 'dashboard') initDashboard(user);
  if (page === 'attendance') initAttendance(user);
  if (page === 'history') initHistory(user);
});

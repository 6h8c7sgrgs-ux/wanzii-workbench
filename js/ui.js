/* ===== 通用 UI 组件 ===== */

const UI = {

  /* ---------- Toast 提示 ---------- */
  toast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  /* ---------- 模态框 ---------- */
  modal({ title, content, actions }) {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', () => this.closeModal());

    const box = document.createElement('div');
    box.className = 'modal-box';
    box.addEventListener('click', e => e.stopPropagation());

    let html = `<div class="modal-title">${title}</div>`;
    html += `<div class="modal-body">${content}</div>`;

    if (actions && actions.length) {
      html += '<div class="modal-actions">';
      actions.forEach((a, i) => {
        const cls = a.style === 'primary' ? 'btn-primary' : (a.style === 'danger' ? 'btn-danger' : 'btn-secondary');
        html += `<button class="btn ${cls}" data-action="${i}">${a.label}</button>`;
      });
      html += '</div>';
    }

    box.innerHTML = html;

    if (actions) {
      box.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = actions[parseInt(btn.dataset.action)];
          if (action.onClick) action.onClick();
          if (action.closeOnClick !== false) this.closeModal();
        });
      });
    }

    overlay.appendChild(box);
    container.appendChild(overlay);
    container.classList.add('show');
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    container.classList.remove('show');
    container.innerHTML = '';
  },

  /* ---------- 确认弹框 ---------- */
  confirm(message, onConfirm) {
    this.modal({
      title: '确认一下',
      content: `<p style="font-size:14px;color:var(--text-secondary);line-height:1.7;">${message}</p>`,
      actions: [
        { label: '再想想', style: 'secondary' },
        { label: '确定', style: 'primary', onClick: onConfirm }
      ]
    });
  },

  /* ---------- 空状态 ---------- */
  emptyState(icon, text) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <div class="empty-text">${text}</div>
      </div>
    `;
  },

  /* ---------- 获取星期几 ---------- */
  getWeekday(dateStr) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  },

  /* ---------- 格式化日期 ---------- */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  formatDateFull(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  },

  /* ---------- 计算天数差 ---------- */
  daysBetween(dateStr) {
    const target = new Date(dateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = target - now;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  },

  /* ---------- 转义 HTML ---------- */
  escape(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /* ---------- 生成日历数据 ---------- */
  getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];
    // 上月填充
    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, otherMonth: true, month: month - 1 });
    }
    // 本月
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, otherMonth: false, month: month });
    }
    // 下月填充到42格
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, otherMonth: true, month: month + 1 });
    }
    return days;
  },

  /* ---------- 渲染日历组件 ---------- */
  renderCalendar(year, month, recordsByDate, onSelect) {
    const days = this.getCalendarDays(year, month);
    const todayStr = StorageManager.todayStr();
    let html = `
      <div class="calendar-header">
        <button class="calendar-nav-btn" data-nav="prev">‹</button>
        <span class="calendar-title">${year}年${month + 1}月</span>
        <button class="calendar-nav-btn" data-nav="next">›</button>
      </div>
      <div class="calendar-grid">
    `;
    ['日', '一', '二', '三', '四', '五', '六'].forEach(w => {
      html += `<div class="calendar-weekday">${w}</div>`;
    });
    days.forEach(d => {
      const dateStr = `${year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
      const hasRecord = recordsByDate[dateStr];
      const classes = ['calendar-day'];
      if (d.otherMonth) classes.push('other-month');
      if (dateStr === todayStr) classes.push('today');
      if (hasRecord) classes.push('has-record');
      html += `<div class="${classes.join(' ')}" data-date="${dateStr}">${d.day}</div>`;
    });
    html += '</div>';
    return html;
  }
};

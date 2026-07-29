/* ===== 打卡模块 ===== */

const CheckinModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">✅ 每日打卡</div>
        <div class="module-subtitle">坚持是一件很酷的事，每一天都在变得更好</div>
      </div>

      <!-- Tab 切换 -->
      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active" data-tab="day" style="background:var(--primary);color:white">日打卡</div>
        <div class="subnav-item" data-tab="week" style="border:1px solid var(--border)">周打卡</div>
        <div class="subnav-item" data-tab="month" style="border:1px solid var(--border)">月打卡</div>
        <div class="subnav-item" data-tab="photo" style="border:1px solid var(--border)">摄影素材</div>
      </div>

      <div id="checkin-day" class="tab-content active"></div>
      <div id="checkin-week" class="tab-content"></div>
      <div id="checkin-month" class="tab-content"></div>
      <div id="checkin-photo" class="tab-content"></div>
    `;

    this.renderDay(container);
    this.renderWeek(container);
    this.renderMonth(container);
    this.renderPhoto(container);

    // Tab 切换
    container.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('[data-tab]').forEach(t => {
          t.classList.remove('active');
          t.style.background = '';
          t.style.color = '';
          t.style.border = '1px solid var(--border)';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--primary)';
        tab.style.color = 'white';
        tab.style.border = 'none';

        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        container.querySelector(`#checkin-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* ---------- 日打卡 ---------- */
  renderDay(container) {
    const today = StorageManager.todayStr();
    const checkins = StorageManager.get('checkins') || [];
    const todayCheckins = checkins.filter(c => c.date === today);

    const target = container.querySelector('#checkin-day');
    let html = `
      <div class="section-title">${this.formatToday(today)} 打卡</div>
      <div class="grid grid-3" style="margin-bottom:20px">
    `;

    CheckinProjects.forEach(proj => {
      const record = todayCheckins.find(c => c.project === proj.id);
      const status = record ? record.status : 'pending';
      const statusText = status === 'done' ? '已完成 ✓' : (status === 'missed' ? '今天算了' : '待打卡');
      html += `
        <div class="checkin-card ${status}" data-project="${proj.id}">
          <div class="checkin-emoji">${proj.emoji}</div>
          <div class="checkin-name">${proj.name}</div>
          <div class="checkin-status">${statusText}</div>
        </div>
      `;
    });

    html += '</div>';

    // 今日打卡统计
    const doneCount = todayCheckins.filter(c => c.status === 'done').length;
    const totalCount = CheckinProjects.length;
    const percent = Math.round((doneCount / totalCount) * 100);
    html += `
      <div class="card">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">今日完成度</span>
          <span class="text-primary font-bold">${doneCount}/${totalCount}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${percent === 100 ? 'success' : ''}" style="width:${percent}%"></div>
        </div>
        ${percent === 100 ? '<p class="mt-2 text-sm" style="color:var(--success)">三项全打卡完成啦，今天也是元气满满的一天！🎉</p>' :
          percent > 0 ? '<p class="mt-2 text-sm text-muted">继续加油，离全勤就差一点点了～</p>' :
          '<p class="mt-2 text-sm text-muted">新的一天，准备好开始打卡了吗？</p>'}
      </div>
    `;

    target.innerHTML = html;

    // 点击打卡卡片
    target.querySelectorAll('.checkin-card').forEach(card => {
      card.addEventListener('click', () => {
        this.toggleCheckin(card.dataset.project);
      });
    });
  },

  toggleCheckin(projectId) {
    const today = StorageManager.todayStr();
    const checkins = StorageManager.get('checkins') || [];
    const idx = checkins.findIndex(c => c.date === today && c.project === projectId);

    if (idx > -1) {
      const current = checkins[idx].status;
      // pending -> done -> missed -> pending
      const next = current === 'pending' ? 'done' : (current === 'done' ? 'missed' : 'pending');
      checkins[idx].status = next;
      StorageManager.set('checkins', checkins);

      const proj = CheckinProjects.find(p => p.id === projectId);
      if (next === 'done') {
        UI.toast(`今天的${proj.name}完成啦，做得真棒！`);
      } else if (next === 'missed') {
        UI.toast(`没关系，明天继续就好`);
      }
    } else {
      StorageManager.add('checkins', { date: today, project: projectId, status: 'done' });
      const proj = CheckinProjects.find(p => p.id === projectId);
      UI.toast(`今天的${proj.name}完成啦，做得真棒！`);
    }

    // 重新渲染
    const container = document.getElementById('module-container');
    this.renderDay(container);
  },

  /* ---------- 周打卡 ---------- */
  renderWeek(container) {
    const target = container.querySelector('#checkin-week');
    const checkins = StorageManager.get('checkins') || [];

    // 最近7天
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ dateStr, weekday: UI.getWeekday(dateStr), label: `${d.getMonth() + 1}/${d.getDate()}` });
    }

    let html = `<div class="section-title">本周打卡一览</div>`;
    html += `<div class="week-grid">`;
    html += `<div class="week-grid-header"></div>`;
    CheckinProjects.forEach(p => {
      html += `<div class="week-grid-header">${p.emoji} ${p.name}</div>`;
    });

    days.forEach(day => {
      html += `<div class="week-grid-day">${day.label}<br><span style="font-size:10px;color:var(--text-hint)">${day.weekday}</span></div>`;
      CheckinProjects.forEach(proj => {
        const record = checkins.find(c => c.date === day.dateStr && c.project === proj.id);
        const status = record ? record.status : 'pending';
        const symbol = status === 'done' ? '✓' : (status === 'missed' ? '×' : '–');
        html += `<div class="week-grid-cell ${status}">${symbol}</div>`;
      });
    });

    html += `</div>`;

    // 本周统计
    const weekStart = days[0].dateStr;
    const weekEnd = days[6].dateStr;
    const weekCheckins = checkins.filter(c => c.date >= weekStart && c.date <= weekEnd);
    const doneCount = weekCheckins.filter(c => c.status === 'done').length;
    const totalPossible = 7 * CheckinProjects.length;
    const percent = Math.round((doneCount / totalPossible) * 100);

    html += `
      <div class="card mt-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">本周完成率</span>
          <span class="text-primary font-bold">${doneCount}/${totalPossible} (${percent}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${percent >= 80 ? 'success' : percent >= 50 ? '' : 'warning'}" style="width:${percent}%"></div>
        </div>
        <p class="mt-2 text-sm text-muted">
          ${percent >= 80 ? '本周表现非常棒，坚持就是胜利！💪' :
            percent >= 50 ? '已经过半了，后半周继续加油～' :
            '这周才开始起步，不着急，慢慢来比较快'}
        </p>
      </div>
    `;

    target.innerHTML = html;
  },

  /* ---------- 月打卡 ---------- */
  renderMonth(container) {
    const target = container.querySelector('#checkin-month');
    const checkins = StorageManager.get('checkins') || [];
    const now = new Date();
    let viewYear = now.getFullYear();
    let viewMonth = now.getMonth();

    const renderHeatmap = () => {
      const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

      let html = `
        <div class="section-title">${viewYear}年${viewMonth + 1}月 打卡热力图</div>
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <div class="flex gap-2 items-center">
              <button class="calendar-nav-btn" id="month-prev">‹</button>
              <span class="font-bold">${viewYear}年${viewMonth + 1}月</span>
              <button class="calendar-nav-btn" id="month-next">›</button>
            </div>
            <div class="flex gap-2 items-center text-sm text-muted">
              <span>少</span>
              <div style="width:14px;height:14px;border-radius:3px;background:var(--primary-pale)"></div>
              <div style="width:14px;height:14px;border-radius:3px;background:var(--primary-light)"></div>
              <div style="width:14px;height:14px;border-radius:3px;background:var(--primary)"></div>
              <span>多</span>
            </div>
          </div>
      `;

      // 星期表头
      html += `<div class="heatmap" style="grid-template-columns:repeat(7,1fr)">`;
      ['日', '一', '二', '三', '四', '五', '六'].forEach(w => {
        html += `<div class="week-grid-header">${w}</div>`;
      });

      // 填充前置空格
      for (let i = 0; i < firstWeekday; i++) {
        html += `<div style="aspect-ratio:1"></div>`;
      }

      // 每一天
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
        const dayCheckins = checkins.filter(c => c.date === dateStr && c.status === 'done');
        const doneCount = dayCheckins.length;
        const level = doneCount === 0 ? 0 : (doneCount === 1 ? 1 : (doneCount === 2 ? 2 : 3));
        const cls = level > 0 ? `level-${level}` : '';
        const todayMark = dateStr === StorageManager.todayStr() ? 'border:2px solid var(--primary-dark)' : '';

        const tooltipText = doneCount > 0
          ? `${day}日：完成${doneCount}项（${dayCheckins.map(c => CheckinProjects.find(p => p.id === c.project)?.name).join('、')}）`
          : `${day}日：还没打卡`;

        html += `
          <div class="heatmap-cell ${cls}" style="${todayMark}">
            ${day}
            <span class="heatmap-tooltip">${tooltipText}</span>
          </div>
        `;
      }

      html += `</div>`;

      // 月度统计
      const monthCheckins = checkins.filter(c => c.date.startsWith(monthStr) && c.status === 'done');
      const totalDone = monthCheckins.length;
      const possibleDays = Math.min(daysInMonth, Math.max(0, now.getMonth() === viewMonth ? now.getDate() : daysInMonth));
      const totalPossible = possibleDays * CheckinProjects.length;
      const monthPercent = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

      html += `
        <div class="grid grid-3 mt-4">
          <div class="stat-card">
            <div class="stat-value">${totalDone}</div>
            <div class="stat-label">本月打卡次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${monthPercent}%</div>
            <div class="stat-label">完成率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.getStreakDays(checkins)}</div>
            <div class="stat-label">连续打卡天数</div>
          </div>
        </div>
      `;

      html += `</div>`;
      target.innerHTML = html;

      // 绑定月份切换
      target.querySelector('#month-prev')?.addEventListener('click', () => {
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderHeatmap();
      });
      target.querySelector('#month-next')?.addEventListener('click', () => {
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderHeatmap();
      });
    };

    renderHeatmap();
  },

  getStreakDays(checkins) {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const hasDone = checkins.some(c => c.date === dateStr && c.status === 'done');
      if (hasDone) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  /* ---------- 摄影素材推荐 ---------- */
  renderPhoto(container) {
    const target = container.querySelector('#checkin-photo');
    let html = `<div class="section-title">摄影素材推荐</div>`;
    html += `<p class="text-sm text-muted mb-4">打卡的同时记录美好瞬间，每一张照片都是成长的见证</p>`;

    html += `<div class="grid grid-3">`;
    CheckinProjects.forEach(proj => {
      html += `
        <div>
          <div class="card">
            <div class="flex items-center gap-2 mb-4">
              <span style="font-size:28px">${proj.emoji}</span>
              <div>
                <div class="font-bold">${proj.name}</div>
                <div class="text-sm text-muted">${proj.desc}</div>
              </div>
            </div>

            <div class="photo-tip-card" style="border:none;padding:0;margin:0">
              <h4>📸 拍摄主题</h4>
              <ul>
                ${proj.photo.themes.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>

            <div class="photo-tip-card" style="border:none;padding:0;margin-top:12px">
              <h4>💡 构图技巧</h4>
              <ul>
                ${proj.photo.tips.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    target.innerHTML = html;
  },

  formatToday(dateStr) {
    const d = new Date(dateStr);
    const weekday = UI.getWeekday(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekday}`;
  }
};

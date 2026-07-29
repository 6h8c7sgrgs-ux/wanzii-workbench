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
        <div class="subnav-item" data-tab="practice" style="border:1px solid var(--border)">🎯 专项练习</div>
        <div class="subnav-item" data-tab="photo" style="border:1px solid var(--border)">摄影素材</div>
      </div>

      <div id="checkin-day" class="tab-content active"></div>
      <div id="checkin-week" class="tab-content"></div>
      <div id="checkin-month" class="tab-content"></div>
      <div id="checkin-practice" class="tab-content"></div>
      <div id="checkin-photo" class="tab-content"></div>
    `;

    this.renderDay(container);
    this.renderWeek(container);
    this.renderMonth(container);
    this.renderPractice(container);
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

  /* ---------- 专项练习 ---------- */
  renderPractice(container) {
    const target = container.querySelector('#checkin-practice');
    target.innerHTML = `
      <div class="section-title">🗣️ 英语口语练习</div>
      <div id="english-practice"></div>
      <div class="section-title" style="margin-top:28px">🖌️ 书法笔法讲解</div>
      <div id="calligraphy-guide"></div>
    `;
    this.renderEnglishPractice(target.querySelector('#english-practice'));
    this.renderCalligraphyGuide(target.querySelector('#calligraphy-guide'));
  },

  /* ---- 英语口语练习面板 ---- */
  renderEnglishPractice(target) {
    // 按日期取每日推荐，也可随机
    const today = StorageManager.todayStr();
    const dayIdx = new Date(today).getDate() % EnglishPracticeSnippets.length;
    let currentIdx = dayIdx;

    const render = () => {
      const snippet = EnglishPracticeSnippets[currentIdx];
      const levelColor = snippet.level === '基础' ? 'tag-green' : snippet.level === '进阶' ? 'tag-blue' : 'tag-orange';

      target.innerHTML = `
        <div class="card" style="margin-bottom:16px">
          <div class="flex justify-between items-center mb-2">
            <div class="flex gap-2 items-center">
              <span class="tag ${levelColor}">${snippet.level}</span>
              <span class="tag tag-purple">${snippet.topic}</span>
            </div>
            <button class="btn btn-secondary btn-sm" id="next-snippet">换一个 →</button>
          </div>

          <div style="font-size:18px;line-height:1.8;color:var(--text-primary);margin:16px 0 8px;font-weight:500">
            ${UI.escape(snippet.text)}
          </div>
          <div class="text-sm text-muted" style="margin-bottom:16px">${UI.escape(snippet.translation)}</div>

          <div class="flex gap-2" style="flex-wrap:wrap">
            <button class="btn btn-primary" id="start-speak">🎙️ 开始朗读</button>
            <button class="btn btn-secondary" id="stop-speak" style="display:none">⏹️ 停止</button>
            <button class="btn btn-secondary" id="goto-chengla">📚 去橙啦练习</button>
          </div>

          <div id="speak-result" style="margin-top:16px"></div>
          <div id="speak-status" class="text-sm text-muted" style="margin-top:8px"></div>
        </div>
      `;

      const startBtn = target.querySelector('#start-speak');
      const stopBtn = target.querySelector('#stop-speak');
      const statusEl = target.querySelector('#speak-status');
      const resultEl = target.querySelector('#speak-result');

      // 检查浏览器支持
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        statusEl.innerHTML = '<span style="color:var(--warning)">⚠️ 当前浏览器不支持语音识别，建议用 Chrome 或 Safari 打开。也可以直接点击「去橙啦练习」使用橙啦的发音评估功能。</span>';
        startBtn.style.opacity = '0.5';
        startBtn.style.cursor = 'not-allowed';
      }

      let recognition = null;
      let finalTranscript = '';

      startBtn.addEventListener('click', () => {
        if (!SpeechRecognition) return;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        finalTranscript = '';

        recognition.onstart = () => {
          startBtn.style.display = 'none';
          stopBtn.style.display = 'inline-flex';
          statusEl.innerHTML = '🔴 正在聆听... 请大声朗读上面的英文片段';
          resultEl.innerHTML = '';
        };

        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (interim) {
            statusEl.innerHTML = `<span class="text-muted">识别中: ${UI.escape(interim)}</span>`;
          }
        };

        recognition.onerror = (event) => {
          if (event.error === 'not-allowed') {
            statusEl.innerHTML = '<span style="color:var(--danger)">需要允许麦克风权限才能朗读评估哦</span>';
          } else if (event.error === 'no-speech') {
            statusEl.innerHTML = '<span class="text-muted">没听到声音，再试一次？</span>';
          } else {
            statusEl.innerHTML = `<span style="color:var(--warning)">识别出了点小问题: ${event.error}</span>`;
          }
          startBtn.style.display = 'inline-flex';
          stopBtn.style.display = 'none';
        };

        recognition.onend = () => {
          startBtn.style.display = 'inline-flex';
          stopBtn.style.display = 'none';
          if (finalTranscript.trim()) {
            this.showSpeakResult(resultEl, finalTranscript.trim(), snippet.text);
          } else {
            statusEl.innerHTML = '<span class="text-muted">没有识别到内容，点击「开始朗读」再试一次吧</span>';
          }
        };

        try {
          recognition.start();
        } catch (e) {
          statusEl.innerHTML = '<span style="color:var(--warning)">启动失败，请稍后再试</span>';
        }
      });

      stopBtn.addEventListener('click', () => {
        if (recognition) recognition.stop();
      });

      target.querySelector('#next-snippet').addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % EnglishPracticeSnippets.length;
        render();
      });

      target.querySelector('#goto-chengla').addEventListener('click', () => {
        window.open('https://sc.orangevip.com/', '_blank');
        UI.toast('正在打开橙啦英语，登录后可以使用更多练习功能~');
      });
    };

    render();
  },

  /* ---- 发音评估结果展示 ---- */
  showSpeakResult(container, spoken, original) {
    const result = this.evaluatePronunciation(spoken, original);
    const scoreColor = result.score >= 80 ? 'var(--success)' : result.score >= 60 ? 'var(--warning)' : 'var(--danger)';
    const scoreText = result.score >= 90 ? '太棒了！发音很标准 🌟' :
                      result.score >= 75 ? '不错哦，继续保持 💪' :
                      result.score >= 60 ? '还行，多练几遍会更好的' :
                      '别灰心，慢慢来，多读几遍就熟了';

    let wordsHtml = '';
    result.details.forEach(d => {
      const color = d.matched ? 'var(--success)' : 'var(--danger)';
      const deco = d.matched ? 'none' : 'line-through';
      wordsHtml += `<span style="color:${color};text-decoration:${deco};margin:0 2px">${d.word}</span>`;
    });

    // 识别到的多余词
    let extraHtml = '';
    if (result.extra.length > 0) {
      extraHtml = `<div class="text-sm" style="color:var(--warning);margin-top:6px">多读了的词: ${result.extra.map(w => `<span style="margin:0 2px">${w}</span>`).join('')}</div>`;
    }

    container.innerHTML = `
      <div style="background:var(--primary-pale);border-radius:10px;padding:16px">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">朗读评估</span>
          <span class="font-bold" style="font-size:24px;color:${scoreColor}">${result.score}<span style="font-size:14px">分</span></span>
        </div>
        <div class="text-sm mb-2" style="color:${scoreColor}">${scoreText}</div>
        <div style="font-size:15px;line-height:2;margin:8px 0">${wordsHtml}</div>
        ${extraHtml}
        <div class="text-sm text-muted" style="margin-top:8px">
          📊 正确 ${result.matchedCount}/${result.totalWords} 词
          ${result.missed.length > 0 ? `| 漏读: ${result.missed.join(', ')}` : ''}
        </div>
        <div class="text-sm text-hint" style="margin-top:6px">
          💡 这只是基于语音识别的参考评分，想更精准的发音评估可以去橙啦练习哦
        </div>
      </div>
    `;
  },

  /* ---- 发音评估核心逻辑 ---- */
  evaluatePronunciation(spoken, original) {
    // 标准化：转小写、去标点
    const normalize = (text) => text.toLowerCase().replace(/[.,!?;:'"()]/g, '').replace(/\s+/g, ' ').trim();
    const spokenWords = normalize(spoken).split(' ').filter(w => w);
    const originalWords = normalize(original).split(' ').filter(w => w);

    const spokenSet = [...spokenWords];
    const originalSet = [...originalWords];
    const details = [];
    const missed = [];
    let matchedCount = 0;

    originalSet.forEach(word => {
      const idx = spokenSet.indexOf(word);
      if (idx > -1) {
        details.push({ word, matched: true });
        spokenSet.splice(idx, 1);
        matchedCount++;
      } else {
        details.push({ word, matched: false });
        missed.push(word);
      }
    });

    const extra = spokenSet;
    const totalWords = originalSet.length;
    const score = Math.round((matchedCount / totalWords) * 100);

    return { score, details, matchedCount, totalWords, missed, extra };
  },

  /* ---- 书法笔法讲解面板 ---- */
  renderCalligraphyGuide(target) {
    const today = StorageManager.todayStr();
    const dayIdx = new Date(today).getDate() % CalligraphyTechniques.length;
    let currentStart = dayIdx;

    const render = () => {
      // 每次展示4条
      const items = [];
      for (let i = 0; i < 4; i++) {
        items.push(CalligraphyTechniques[(currentStart + i) % CalligraphyTechniques.length]);
      }

      let html = `
        <div class="card" style="margin-bottom:16px">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold">今日推荐笔法</span>
            <button class="btn btn-secondary btn-sm" id="refresh-technique">换一批 →</button>
          </div>
          <p class="text-sm text-muted mb-4">点击任意主题，自动跳转 B站 搜索相关讲解视频</p>

          <div class="grid grid-2">
      `;

      items.forEach(t => {
        const levelColor = t.level === '入门' ? 'tag-green' : t.level === '进阶' ? 'tag-blue' : t.level === '提升' ? 'tag-orange' : 'tag-purple';
        html += `
          <div class="card" style="cursor:pointer;border:1px solid var(--border-light)" data-keyword="${UI.escape(t.keyword)}">
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold" style="font-size:14px">${t.name}</span>
              <span class="tag ${levelColor}">${t.level}</span>
            </div>
            <div class="text-sm text-muted">${t.desc}</div>
            <div class="text-sm text-hint" style="margin-top:6px">🔍 点击搜索讲解视频</div>
          </div>
        `;
      });

      html += `
          </div>

          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-light)">
            <div class="text-sm text-muted mb-2">🔎 自定义搜索笔法：</div>
            <div class="flex gap-2">
              <input type="text" class="input" id="custom-calligraphy" placeholder="比如：颜体 横画 起笔" style="flex:1">
              <button class="btn btn-primary btn-sm" id="search-calligraphy-b">B站搜索</button>
              <button class="btn btn-secondary btn-sm" id="search-calligraphy-y">YouTube</button>
            </div>
          </div>
        </div>
      `;

      target.innerHTML = html;

      // 点击推荐主题跳转B站
      target.querySelectorAll('[data-keyword]').forEach(card => {
        card.addEventListener('click', () => {
          const kw = card.dataset.keyword;
          const url = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(kw);
          window.open(url, '_blank');
          UI.toast(`正在B站搜索「${kw}」`);
        });
      });

      // 刷新
      target.querySelector('#refresh-technique').addEventListener('click', () => {
        currentStart = (currentStart + 4) % CalligraphyTechniques.length;
        render();
      });

      // 自定义搜索
      const customInput = target.querySelector('#custom-calligraphy');
      const doSearch = (platform) => {
        const kw = customInput.value.trim();
        if (!kw) { UI.toast('输入要搜索的笔法关键词'); return; }
        const fullKw = '颜真卿 ' + kw;
        const url = platform === 'bilibili'
          ? 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(fullKw)
          : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(fullKw);
        window.open(url, '_blank');
        UI.toast(`正在搜索「${fullKw}」`);
      };

      target.querySelector('#search-calligraphy-b').addEventListener('click', () => doSearch('bilibili'));
      target.querySelector('#search-calligraphy-y').addEventListener('click', () => doSearch('youtube'));
      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch('bilibili');
      });
    };

    render();
  },

  formatToday(dateStr) {
    const d = new Date(dateStr);
    const weekday = UI.getWeekday(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekday}`;
  }
};

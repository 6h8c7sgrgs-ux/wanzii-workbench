/* ===== 技能模块：冥想引导/进阶规划/情绪疏导 ===== */

const SkillsModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">🌟 技能提升</div>
        <div class="module-subtitle">照顾好内心，才能走得更远</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active sk-tab" data-tab="meditation" style="background:var(--primary);color:white">🧘 冥想引导</div>
        <div class="subnav-item sk-tab" data-tab="plan" style="border:1px solid var(--border)">📈 进阶规划</div>
        <div class="subnav-item sk-tab" data-tab="emotion" style="border:1px solid var(--border)">💝 情绪疏导</div>
      </div>

      <div id="sk-meditation" class="tab-content active"></div>
      <div id="sk-plan" class="tab-content"></div>
      <div id="sk-emotion" class="tab-content"></div>
    `;

    this.renderMeditation(container.querySelector('#sk-meditation'));
    this.renderPlan(container.querySelector('#sk-plan'));
    this.renderEmotion(container.querySelector('#sk-emotion'));

    container.querySelectorAll('.sk-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.sk-tab').forEach(t => {
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
        container.querySelector(`#sk-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* ---------- 冥想引导 ---------- */
  renderMeditation(target) {
    let html = `
      <div class="card mb-4" style="background:linear-gradient(135deg,var(--primary-pale),var(--bg-card))">
        <p class="card-desc" style="font-size:14px">
          🌅 早晨冥想帮你开启清醒的一天，🌙 晚间冥想帮你放下疲惫安然入睡。
          选一个适合当下的引导，跟着步骤慢慢来就好。
        </p>
      </div>
    `;

    // 早晨冥想
    html += `<div class="section-title">🌅 晨间冥想</div>`;
    html += `<div class="grid grid-2 mb-4">`;
    MeditationGuides.morning.forEach((g, i) => {
      html += `
        <div class="meditation-card">
          <div class="flex justify-between items-start mb-2">
            <h4 class="meditation-title">${g.title}</h4>
            <span class="tag tag-blue">${g.duration}</span>
          </div>
          <p class="text-sm text-muted mb-2">${g.desc}</p>
          <ol class="meditation-steps" id="morning-steps-${i}" style="display:none">
            ${g.steps.map((s, idx) => `
              <li class="meditation-step">
                <span class="meditation-step-num">${idx + 1}</span>
                <span>${s}</span>
              </li>
            `).join('')}
          </ol>
          <button class="btn btn-secondary btn-sm mt-2 toggle-steps" data-target="morning-steps-${i}">
            展开步骤
          </button>
        </div>
      `;
    });
    html += `</div>`;

    // 晚间冥想
    html += `<div class="section-title">🌙 夜间冥想</div>`;
    html += `<div class="grid grid-2">`;
    MeditationGuides.evening.forEach((g, i) => {
      html += `
        <div class="meditation-card">
          <div class="flex justify-between items-start mb-2">
            <h4 class="meditation-title">${g.title}</h4>
            <span class="tag tag-purple">${g.duration}</span>
          </div>
          <p class="text-sm text-muted mb-2">${g.desc}</p>
          <ol class="meditation-steps" id="evening-steps-${i}" style="display:none">
            ${g.steps.map((s, idx) => `
              <li class="meditation-step">
                <span class="meditation-step-num">${idx + 1}</span>
                <span>${s}</span>
              </li>
            `).join('')}
          </ol>
          <button class="btn btn-secondary btn-sm mt-2 toggle-steps" data-target="evening-steps-${i}">
            展开步骤
          </button>
        </div>
      `;
    });
    html += `</div>`;

    target.innerHTML = html;

    // 展开收起
    target.querySelectorAll('.toggle-steps').forEach(btn => {
      btn.addEventListener('click', () => {
        const steps = target.querySelector(`#${btn.dataset.target}`);
        if (steps.style.display === 'none') {
          steps.style.display = 'block';
          btn.textContent = '收起步骤';
        } else {
          steps.style.display = 'none';
          btn.textContent = '展开步骤';
        }
      });
    });
  },

  /* ---------- 进阶规划 ---------- */
  renderPlan(target) {
    let html = `
      <div class="card mb-4">
        <p class="card-desc" style="font-size:14px">
          每一项打卡都有从入门到精通的路径。不用着急，按自己的节奏来，
          每个阶段完成了就给自己一个小奖励。
        </p>
      </div>
    `;

    CheckinProjects.forEach(proj => {
      const plan = AdvancementPlans[proj.id];
      if (!plan) return;

      html += `
        <div class="section-title">${proj.emoji} ${proj.name}进阶规划</div>
        <div class="grid grid-4 mb-4">
      `;

      plan.forEach((phase, idx) => {
        const progress = this.calcPhaseProgress(proj.id, idx, plan.length);
        html += `
          <div class="card" style="position:relative;overflow:hidden">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--primary)">
              <div style="height:100%;width:${progress}%;background:var(--success);transition:width 0.5s"></div>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="tag ${idx === 0 ? 'tag-blue' : idx === 1 ? 'tag-green' : idx === 2 ? 'tag-orange' : 'tag-purple'}">${phase.phase}</span>
              <span class="text-sm text-muted">${phase.time}</span>
            </div>
            <p class="text-sm font-bold mb-2" style="color:var(--primary-darker)">${phase.goal}</p>
            <ul style="list-style:none;padding:0">
              ${phase.tasks.map(t => `<li class="text-sm text-muted" style="padding:2px 0;padding-left:12px;position:relative">
                <span style="position:absolute;left:0;color:var(--primary)">·</span>${t}
              </li>`).join('')}
            </ul>
          </div>
        `;
      });

      html += `</div>`;
    });

    target.innerHTML = html;
  },

  calcPhaseProgress(projectId, phaseIdx, totalPhases) {
    // 根据打卡记录估算当前进度
    const checkins = StorageManager.get('checkins') || [];
    const projectCheckins = checkins.filter(c => c.project === projectId && c.status === 'done');
    const totalDone = projectCheckins.length;

    // 每个阶段大约需要 14 天打卡
    const daysPerPhase = 14;
    const currentPhase = Math.floor(totalDone / daysPerPhase);
    const phaseProgress = (totalDone % daysPerPhase) / daysPerPhase * 100;

    if (phaseIdx < currentPhase) return 100;
    if (phaseIdx === currentPhase) return Math.round(phaseProgress);
    return 0;
  },

  /* ---------- 情绪疏导 ---------- */
  renderEmotion(target) {
    const emotions = StorageManager.get('emotions') || [];
    const today = StorageManager.todayStr();
    const todayEmotion = emotions.find(e => e.date === today);

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">今天感觉怎么样？</span>
          ${todayEmotion ? '<span class="tag tag-green">已记录</span>' : ''}
        </div>
        <p class="text-sm text-muted mb-4">了解自己的情绪是一件很勇敢的事，先识别它，才能和它好好相处</p>

        <div class="form-group">
          <label class="form-label">选择当下的情绪</label>
          <div class="emotion-picker" id="emotion-picker">
            ${Object.entries(EmotionGuidance).map(([key, val]) => `
              <div class="emotion-option ${todayEmotion?.emotion === key ? 'selected' : ''}" data-emotion="${key}">
                ${val.emoji} ${val.label}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">情绪强度</label>
          <div class="flex items-center gap-2">
            <input type="range" id="emotion-intensity" min="1" max="5" value="${todayEmotion?.intensity || 3}" style="flex:1">
            <span id="intensity-label" class="tag tag-blue">${todayEmotion?.intensity || 3}/5</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">是什么触发了这种情绪？（可选）</label>
          <input type="text" class="input" id="emotion-trigger" placeholder="比如：工作压力、和TA吵架、睡不好..." value="${UI.escape(todayEmotion?.trigger || '')}">
        </div>

        <div class="form-group">
          <label class="form-label">想多说几句吗？</label>
          <textarea class="textarea" id="emotion-note" placeholder="把心里的感受写下来，写出来会好一些...">${UI.escape(todayEmotion?.note || '')}</textarea>
        </div>

        <button class="btn btn-primary" id="save-emotion">${todayEmotion ? '更新记录' : '记录情绪'}</button>
      </div>

      <div id="emotion-guidance"></div>
    `;

    // 情绪历史
    if (emotions.length > 0) {
      const recent = emotions.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 7);
      html += `<div class="section-title">最近的情绪记录</div>`;
      recent.forEach(e => {
        const guide = EmotionGuidance[e.emotion] || EmotionGuidance.calm;
        html += `
          <div class="list-item">
            <span style="font-size:20px">${guide.emoji}</span>
            <div class="list-item-content">
              <div class="list-item-title">${guide.label} <span class="text-muted text-sm">· 强度 ${e.intensity}/5</span></div>
              <div class="list-item-desc">
                ${UI.formatDateFull(e.date)} ${UI.getWeekday(e.date)}
                ${e.trigger ? ` · ${UI.escape(e.trigger)}` : ''}
              </div>
            </div>
          </div>
        `;
      });
    }

    target.innerHTML = html;

    let selectedEmotion = todayEmotion?.emotion || null;
    const picker = target.querySelector('#emotion-picker');
    picker.querySelectorAll('.emotion-option').forEach(opt => {
      opt.addEventListener('click', () => {
        picker.querySelectorAll('.emotion-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedEmotion = opt.dataset.emotion;
        this.showGuidance(target.querySelector('#emotion-guidance'), selectedEmotion);
      });
    });

    // 强度滑块
    const slider = target.querySelector('#emotion-intensity');
    const label = target.querySelector('#intensity-label');
    slider.addEventListener('input', () => {
      label.textContent = `${slider.value}/5`;
    });

    // 保存
    target.querySelector('#save-emotion')?.addEventListener('click', () => {
      if (!selectedEmotion) {
        UI.toast('选一个情绪再保存吧');
        return;
      }
      const data = {
        emotion: selectedEmotion,
        intensity: parseInt(slider.value),
        trigger: target.querySelector('#emotion-trigger').value.trim(),
        note: target.querySelector('#emotion-note').value.trim(),
        date: today
      };

      if (todayEmotion) {
        StorageManager.update('emotions', todayEmotion.id, data);
        UI.toast('更新了，你在好好了解自己');
      } else {
        StorageManager.add('emotions', data);
        UI.toast('记下来了，了解自己的情绪是一件很勇敢的事');
      }
      this.renderEmotion(target);
    });

    // 如果已有今日记录，展示疏导建议
    if (todayEmotion?.emotion) {
      this.showGuidance(target.querySelector('#emotion-guidance'), todayEmotion.emotion);
    }
  },

  showGuidance(container, emotionKey) {
    const guide = EmotionGuidance[emotionKey];
    if (!guide) return;

    // 随机选一条建议
    const advice = guide.advice[Math.floor(Math.random() * guide.advice.length)];

    container.innerHTML = `
      <div class="meditation-card" style="background:linear-gradient(135deg,var(--primary-pale),var(--bg-card))">
        <div class="flex items-center gap-2 mb-2">
          <span style="font-size:24px">${guide.emoji}</span>
          <h4 style="font-size:16px;color:var(--primary-darker)">${guide.label}的时候</h4>
        </div>
        <p style="font-size:15px;color:var(--text-primary);line-height:1.8">${advice}</p>
        <div class="mt-2">
          <button class="btn btn-secondary btn-sm" id="more-advice">换一条建议</button>
        </div>
      </div>
    `;

    container.querySelector('#more-advice')?.addEventListener('click', () => {
      this.showGuidance(container, emotionKey);
    });
  }
};

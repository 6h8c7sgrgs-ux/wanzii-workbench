/* ===== 个人模块：记账/备忘/随笔/异地恋/求职 ===== */

/* ========== 记账台账 ========== */
const AccountingModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">📒 记账台账</div>
        <div class="module-subtitle">每一笔都是生活的痕迹，记账让日子更有底气</div>
      </div>
      <div id="accounting-content"></div>
    `;
    this.renderContent(container.querySelector('#accounting-content'));
  },

  renderContent(target) {
    const records = StorageManager.get('accounting') || [];
    const now = new Date();
    const monthRecords = StorageManager.getByMonth('accounting', now.getFullYear(), now.getMonth() + 1);

    const income = monthRecords.filter(r => r.type === 'income').reduce((s, r) => s + parseFloat(r.amount), 0);
    const expense = monthRecords.filter(r => r.type === 'expense').reduce((s, r) => s + parseFloat(r.amount), 0);
    const balance = income - expense;

    let html = `
      <div class="grid grid-3 mb-4">
        <div class="stat-card income">
          <div class="stat-value">+¥${income.toFixed(2)}</div>
          <div class="stat-label">本月收入</div>
        </div>
        <div class="stat-card expense">
          <div class="stat-value">-¥${expense.toFixed(2)}</div>
          <div class="stat-label">本月支出</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:${balance >= 0 ? 'var(--success)' : 'var(--danger)'}">${balance >= 0 ? '+' : ''}¥${balance.toFixed(2)}</div>
          <div class="stat-label">本月结余</div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">记一笔</span>
          <button class="btn btn-primary btn-sm" id="add-record-btn">+ 新增记录</button>
        </div>
      </div>

      <div class="section-title">本月明细</div>
    `;

    if (monthRecords.length === 0) {
      html += UI.emptyState('💸', '还没记过账呢，开始记录你的第一笔吧');
    } else {
      const sorted = monthRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      sorted.forEach(r => {
        const isIncome = r.type === 'income';
        html += `
          <div class="list-item">
            <span style="font-size:20px">${isIncome ? '💰' : '🧾'}</span>
            <div class="list-item-content">
              <div class="list-item-title">${UI.escape(r.category)} <span class="text-sm text-muted">· ${UI.escape(r.note || '')}</span></div>
              <div class="list-item-desc">${UI.formatDate(r.date)}</div>
            </div>
            <span class="font-bold" style="color:${isIncome ? 'var(--success)' : 'var(--danger)'}">${isIncome ? '+' : '-'}¥${parseFloat(r.amount).toFixed(2)}</span>
            <button class="btn btn-danger btn-sm" data-delete="${r.id}">删除</button>
          </div>
        `;
      });
    }

    target.innerHTML = html;

    target.querySelector('#add-record-btn')?.addEventListener('click', () => this.showAddForm(target));
    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.confirm('删掉这笔记录吗？', () => {
          StorageManager.remove('accounting', btn.dataset.delete);
          UI.toast('已删除');
          this.renderContent(target);
        });
      });
    });
  },

  showAddForm(target) {
    const today = StorageManager.todayStr();
    const cats = AccountingCategories;
    UI.modal({
      title: '记一笔',
      content: `
        <div class="form-group">
          <label class="form-label">类型</label>
          <div class="flex gap-2">
            <label style="cursor:pointer"><input type="radio" name="type" value="expense" checked> 支出</label>
            <label style="cursor:pointer"><input type="radio" name="type" value="income"> 收入</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">金额</label>
            <input type="number" class="input" id="acc-amount" placeholder="0.00" step="0.01" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">日期</label>
            <input type="date" class="input" id="acc-date" value="${today}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">分类</label>
          <select class="select" id="acc-category">
            <optgroup label="支出">
              ${cats.expense.map(c => `<option value="${c}">${c}</option>`).join('')}
            </optgroup>
            <optgroup label="收入">
              ${cats.income.map(c => `<option value="${c}">${c}</option>`).join('')}
            </optgroup>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input type="text" class="input" id="acc-note" placeholder="简单写点什么（可选）">
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: '记下来', style: 'primary', onClick: () => {
            const type = document.querySelector('input[name="type"]:checked').value;
            const amount = document.getElementById('acc-amount').value;
            const date = document.getElementById('acc-date').value;
            const category = document.getElementById('acc-category').value;
            const note = document.getElementById('acc-note').value;

            if (!amount || parseFloat(amount) <= 0) {
              UI.toast('金额不能为空哦');
              return;
            }
            if (!date) {
              UI.toast('选个日期吧');
              return;
            }

            StorageManager.add('accounting', { type, amount: parseFloat(amount), date, category, note });
            UI.toast('记下了，每一笔都是生活的痕迹');
            this.renderContent(target);
          }
        }
      ]
    });
  }
};

/* ========== 生活备忘 ========== */
const MemoModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">📝 生活备忘</div>
        <div class="module-subtitle">把脑子里的事写下来，心里就轻松了</div>
      </div>
      <div id="memo-content"></div>
    `;
    this.renderContent(container.querySelector('#memo-content'));
  },

  renderContent(target) {
    const memos = (StorageManager.get('memos') || []).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    const pending = memos.filter(m => m.status !== 'done');
    const done = memos.filter(m => m.status === 'done');

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">添加备忘</span>
          <button class="btn btn-primary btn-sm" id="add-memo-btn">+ 写一条</button>
        </div>
      </div>
    `;

    // 未完成
    html += `<div class="section-title">待办（${pending.length}）</div>`;
    if (pending.length === 0) {
      html += UI.emptyState('🎯', '暂时没有待办，心里是不是挺轻松的~');
    } else {
      pending.forEach(m => {
        html += this.renderMemoItem(m);
      });
    }

    // 已完成
    if (done.length > 0) {
      html += `<div class="section-title" style="margin-top:24px">已完成（${done.length}）</div>`;
      done.slice(0, 10).forEach(m => {
        html += this.renderMemoItem(m);
      });
    }

    target.innerHTML = html;

    target.querySelector('#add-memo-btn')?.addEventListener('click', () => this.showAddForm(target));
    target.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = memos.find(x => x.id === btn.dataset.toggle);
        StorageManager.update('memos', m.id, { status: m.status === 'done' ? 'pending' : 'done' });
        if (m.status !== 'done') UI.toast('搞定一项，真棒！');
        this.renderContent(target);
      });
    });
    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        StorageManager.remove('memos', btn.dataset.delete);
        UI.toast('已删除');
        this.renderContent(target);
      });
    });
  },

  renderMemoItem(m) {
    const isDone = m.status === 'done';
    return `
      <div class="list-item" style="${isDone ? 'opacity:0.6' : ''}">
        <button class="btn btn-icon ${isDone ? 'btn-primary' : 'btn-secondary'}" data-toggle="${m.id}" style="width:28px;height:28px;font-size:14px">
          ${isDone ? '✓' : ''}
        </button>
        <div class="list-item-content">
          <div class="list-item-title" style="${isDone ? 'text-decoration:line-through' : ''}">${UI.escape(m.title)}</div>
          ${m.content ? `<div class="list-item-desc">${UI.escape(m.content)}</div>` : ''}
          ${m.dueDate ? `<div class="text-sm text-hint">📅 ${UI.formatDate(m.dueDate)}</div>` : ''}
        </div>
        <button class="btn btn-danger btn-sm" data-delete="${m.id}">删除</button>
      </div>
    `;
  },

  showAddForm(target) {
    UI.modal({
      title: '写一条备忘',
      content: `
        <div class="form-group">
          <label class="form-label">标题</label>
          <input type="text" class="input" id="memo-title" placeholder="要做什么？" autofocus>
        </div>
        <div class="form-group">
          <label class="form-label">详情（可选）</label>
          <textarea class="textarea" id="memo-content" placeholder="写详细一点..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">截止日期（可选）</label>
          <input type="date" class="input" id="memo-due">
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: '记下来', style: 'primary', onClick: () => {
            const title = document.getElementById('memo-title').value.trim();
            if (!title) { UI.toast('标题不能为空呀'); return; }
            StorageManager.add('memos', {
              title,
              content: document.getElementById('memo-content').value.trim(),
              dueDate: document.getElementById('memo-due').value,
              status: 'pending'
            });
            UI.toast('记下来了，安心去做吧');
            this.renderContent(target);
          }
        }
      ]
    });
  }
};

/* ========== 心情随笔 ========== */
const JournalModule = {
  init() {},
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
  selectedDate: null,

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">💖 心情随笔</div>
        <div class="module-subtitle">开心的事、烦心的事，都可以写下来</div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px">
        <div id="journal-calendar"></div>
        <div id="journal-editor"></div>
      </div>
    `;
    this.renderCalendar(container.querySelector('#journal-calendar'));
    this.renderEditor(container.querySelector('#journal-editor'));
  },

  renderCalendar(target) {
    const journals = StorageManager.get('journals') || [];
    const recordsByDate = {};
    journals.forEach(j => {
      if (j.date) recordsByDate[j.date] = true;
    });

    target.innerHTML = UI.renderCalendar(this.viewYear, this.viewMonth, recordsByDate);

    target.querySelectorAll('.calendar-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.nav === 'prev') {
          this.viewMonth--;
          if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; }
        } else {
          this.viewMonth++;
          if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
        }
        this.renderCalendar(target);
      });
    });

    target.querySelectorAll('.calendar-day').forEach(day => {
      day.addEventListener('click', () => {
        this.selectedDate = day.dataset.date;
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
        this.renderEditor(document.getElementById('journal-editor'));
      });
    });
  },

  renderEditor(target) {
    const date = this.selectedDate || StorageManager.todayStr();
    const journals = StorageManager.get('journals') || [];
    const todayJournal = journals.find(j => j.date === date);

    const moodOptions = [
      { value: 'happy', emoji: '😄', label: '开心' },
      { value: 'calm', emoji: '😌', label: '平静' },
      { value: 'excited', emoji: '🤩', label: '兴奋' },
      { value: 'sad', emoji: '😢', label: '难过' },
      { value: 'anxious', emoji: '😰', label: '焦虑' },
      { value: 'tired', emoji: '🥱', label: '疲惫' },
      { value: 'angry', emoji: '😤', label: '生气' }
    ];

    let html = `
      <div class="card">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">${UI.formatDateFull(date)} ${UI.getWeekday(date)}</span>
          ${todayJournal ? `<span class="tag tag-green">已记录</span>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label">今天的心情</label>
          <div class="emotion-picker" id="mood-picker">
            ${moodOptions.map(m => `
              <div class="emotion-option ${todayJournal?.mood === m.value ? 'selected' : ''}" data-mood="${m.value}">
                ${m.emoji} ${m.label}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">想写点什么</label>
          <textarea class="textarea" id="journal-text" placeholder="今天有什么想说的吗？开心的事、烦心的事、突然冒出来的念头..." style="min-height:120px">${UI.escape(todayJournal?.content || '')}</textarea>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-primary" id="save-journal">保存随笔</button>
          ${todayJournal ? `<button class="btn btn-danger" id="delete-journal">删除</button>` : ''}
        </div>
      </div>
    `;

    // 最近随笔列表
    const recent = journals.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);
    if (recent.length > 0) {
      html += `<div class="section-title">最近的随笔</div>`;
      recent.forEach(j => {
        const mood = moodOptions.find(m => m.value === j.mood);
        html += `
          <div class="list-item" style="cursor:pointer" data-date="${j.date}">
            <span style="font-size:20px">${mood?.emoji || '📝'}</span>
            <div class="list-item-content">
              <div class="list-item-title">${UI.formatDateFull(j.date)} ${UI.getWeekday(j.date)}</div>
              <div class="list-item-desc">${UI.escape((j.content || '').slice(0, 50))}${(j.content || '').length > 50 ? '...' : ''}</div>
            </div>
          </div>
        `;
      });
    }

    target.innerHTML = html;

    // 心情选择
    let selectedMood = todayJournal?.mood || null;
    target.querySelectorAll('.emotion-option').forEach(opt => {
      opt.addEventListener('click', () => {
        target.querySelectorAll('.emotion-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedMood = opt.dataset.mood;
      });
    });

    // 保存
    target.querySelector('#save-journal')?.addEventListener('click', () => {
      const text = target.querySelector('#journal-text').value.trim();
      if (!text && !selectedMood) {
        UI.toast('写点什么再保存吧');
        return;
      }

      if (todayJournal) {
        StorageManager.update('journals', todayJournal.id, { content: text, mood: selectedMood, date });
        UI.toast('更新了，回头看看会很珍贵');
      } else {
        StorageManager.add('journals', { content: text, mood: selectedMood, date });
        UI.toast('写下来了，回头看看会很珍贵吧');
      }
      this.renderCalendar(document.getElementById('journal-calendar'));
      this.renderEditor(target);
    });

    // 删除
    target.querySelector('#delete-journal')?.addEventListener('click', () => {
      UI.confirm('真的要删掉吗？有些回忆删了就找不回来了', () => {
        StorageManager.remove('journals', todayJournal.id);
        UI.toast('已删除');
        this.renderCalendar(document.getElementById('journal-calendar'));
        this.renderEditor(target);
      });
    });

    // 点击最近随笔跳转
    target.querySelectorAll('[data-date]').forEach(item => {
      if (item.classList.contains('list-item')) {
        item.addEventListener('click', () => {
          this.selectedDate = item.dataset.date;
          this.renderEditor(target);
        });
      }
    });
  }
};

/* ========== 异地恋模块 ========== */
const LongDistanceModule = {
  init() {
    StorageManager.initIfEmpty('ld_phrases', PhrasePresets.categories.map(c => ({...c, phrases: [...c.phrases]})));
  },

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">💕 异地恋</div>
        <div class="module-subtitle">距离很远，但心很近</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active ld-tab" data-tab="travel" style="background:var(--primary);color:white">🌍 旅行推荐</div>
        <div class="subnav-item ld-tab" data-tab="phrases" style="border:1px solid var(--border)">💬 相处话术</div>
        <div class="subnav-item ld-tab" data-tab="anniversary" style="border:1px solid var(--border)">📅 纪念日</div>
      </div>

      <div id="ld-travel" class="tab-content active"></div>
      <div id="ld-phrases" class="tab-content"></div>
      <div id="ld-anniversary" class="tab-content"></div>
    `;

    this.renderTravel(container.querySelector('#ld-travel'));
    this.renderPhrases(container.querySelector('#ld-phrases'));
    this.renderAnniversary(container.querySelector('#ld-anniversary'));

    container.querySelectorAll('.ld-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.ld-tab').forEach(t => {
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
        container.querySelector(`#ld-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* 旅行推荐 */
  renderTravel(target) {
    let html = `<div class="section-title">情侣旅行地推荐</div>`;
    html += `<p class="text-sm text-muted mb-4">下次见面去哪儿？挑一个一起出发吧</p>`;

    // 筛选
    html += `<div class="flex gap-2 mb-4" style="flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm ld-filter" data-filter="all" style="background:var(--primary);color:white;border:none">全部</button>
      <button class="btn btn-secondary btn-sm ld-filter" data-filter="海边">🌊 海边</button>
      <button class="btn btn-secondary btn-sm ld-filter" data-filter="古镇">🏘️ 古镇</button>
      <button class="btn btn-secondary btn-sm ld-filter" data-filter="美食">🍜 美食</button>
      <button class="btn btn-secondary btn-sm ld-filter" data-filter="自然">🏔️ 自然</button>
    </div>`;

    html += `<div class="grid grid-3" id="travel-grid">`;
    TravelDestinations.forEach(d => {
      html += `
        <div class="travel-card" data-tags="${d.tags.join(',')}">
          <div class="travel-card-header">
            <span class="travel-card-name">${d.name}</span>
            <span class="tag ${d.budget === '低' ? 'tag-green' : d.budget === '高' ? 'tag-red' : 'tag-orange'}">${d.budget}</span>
          </div>
          <div class="travel-card-desc">${d.desc}</div>
          <div class="travel-card-tags">
            ${d.tags.map(t => `<span class="tag tag-blue">${t}</span>`).join('')}
            <span class="tag tag-purple">⏰ ${d.days}</span>
            <span class="tag tag-green">🌤️ ${d.season}</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    target.innerHTML = html;

    // 筛选
    target.querySelectorAll('.ld-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        target.querySelectorAll('.ld-filter').forEach(b => {
          b.style.background = '';
          b.style.color = '';
          b.style.border = '1px solid var(--primary-light)';
        });
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.border = 'none';

        const filter = btn.dataset.filter;
        target.querySelectorAll('.travel-card').forEach(card => {
          if (filter === 'all' || card.dataset.tags.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  },

  /* 话术库 */
  renderPhrases(target) {
    const categories = StorageManager.get('ld_phrases') || [];

    let html = `<div class="section-title">相处话术库</div>`;
    html += `<p class="text-sm text-muted mb-4">有时候不知道说什么，这里或许有灵感</p>`;

    categories.forEach(cat => {
      html += `
        <div class="card mb-4">
          <div class="flex justify-between items-center mb-2">
            <h4 style="font-size:15px;color:var(--primary-darker)">${cat.icon} ${cat.name}</h4>
          </div>
          <div class="grid grid-2">
            ${cat.phrases.map((p, i) => `
              <div class="list-item" style="margin-bottom:6px">
                <div class="list-item-content">
                  <div class="list-item-desc" style="font-size:13px">${UI.escape(p)}</div>
                </div>
                <button class="btn btn-secondary btn-sm" data-copy="${UI.escape(p)}">复制</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    // 添加自定义话术
    html += `
      <div class="card">
        <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:10px">✏️ 添加自己的话术</h4>
        <div class="form-row">
          <select class="select" id="phrase-cat" style="max-width:120px">
            ${categories.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('')}
          </select>
          <input type="text" class="input" id="phrase-input" placeholder="写下你想说的话...">
          <button class="btn btn-primary" id="add-phrase">添加</button>
        </div>
      </div>
    `;

    target.innerHTML = html;

    target.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(btn.dataset.copy);
        UI.toast('复制好了，去发给TA吧~');
      });
    });

    target.querySelector('#add-phrase')?.addEventListener('click', () => {
      const cat = target.querySelector('#phrase-cat').value;
      const text = target.querySelector('#phrase-input').value.trim();
      if (!text) { UI.toast('写点什么再添加呀'); return; }

      const cats = StorageManager.get('ld_phrases') || [];
      const idx = cats.findIndex(c => c.name === cat);
      if (idx > -1) {
        cats[idx].phrases.push(text);
        StorageManager.set('ld_phrases', cats);
        UI.toast('加好了，你的话术库又丰富了');
        this.renderPhrases(target);
      }
    });
  },

  /* 纪念日 */
  renderAnniversary(target) {
    const milestones = StorageManager.get('ld_milestones') || [];

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">重要的日子</span>
          <button class="btn btn-primary btn-sm" id="add-milestone">+ 记一个日子</button>
        </div>
      </div>
    `;

    if (milestones.length === 0) {
      html += UI.emptyState('💌', '重要的日子要记下来哦，比如第一次见面、第一次旅行、在一起的那天...');
    } else {
      // 按日期排序，未来的在前
      const sorted = milestones.sort((a, b) => {
        const da = UI.daysBetween(a.date);
        const db = UI.daysBetween(b.date);
        return da - db;
      });

      sorted.forEach(m => {
        const days = UI.daysBetween(m.date);
        const isFuture = days > 0;
        const isToday = days === 0;

        html += `
          <div class="anniversary-card">
            <div class="anniversary-count">
              <div class="anniversary-days" style="color:${isToday ? 'var(--success)' : isFuture ? 'var(--primary-darker)' : 'var(--purple)'}">
                ${isToday ? '今天' : Math.abs(days)}
              </div>
              <div class="anniversary-unit">${isToday ? '就是今天' : isFuture ? '天后' : '天前'}</div>
            </div>
            <div class="anniversary-info">
              <div class="anniversary-title">${UI.escape(m.title)}</div>
              <div class="anniversary-date">${UI.formatDateFull(m.date)}</div>
            </div>
            <button class="btn btn-danger btn-sm" data-delete="${m.id}">删除</button>
          </div>
        `;
      });
    }

    target.innerHTML = html;

    target.querySelector('#add-milestone')?.addEventListener('click', () => {
      UI.modal({
        title: '记一个重要的日子',
        content: `
          <div class="form-group">
            <label class="form-label">名称</label>
            <input type="text" class="input" id="ms-title" placeholder="比如：第一次见面" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">日期</label>
            <input type="date" class="input" id="ms-date">
          </div>
        `,
        actions: [
          { label: '取消', style: 'secondary' },
          {
            label: '记下来', style: 'primary', onClick: () => {
              const title = document.getElementById('ms-title').value.trim();
              const date = document.getElementById('ms-date').value;
              if (!title) { UI.toast('给这个日子起个名字吧'); return; }
              if (!date) { UI.toast('选个日期'); return; }
              StorageManager.add('ld_milestones', { title, date });
              UI.toast('记下来了，重要的日子不会被忘记');
              this.renderAnniversary(target);
            }
          }
        ]
      });
    });

    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.confirm('确定要删掉这个纪念日吗？', () => {
          StorageManager.remove('ld_milestones', btn.dataset.delete);
          UI.toast('已删除');
          this.renderAnniversary(target);
        });
      });
    });
  }
};

/* ========== 求职归档 ========== */
const JobTrackerModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">📋 求职归档</div>
        <div class="module-subtitle">慢慢来，找到合适的才重要</div>
      </div>
      <div id="job-content"></div>
    `;
    this.renderContent(container.querySelector('#job-content'));
  },

  renderContent(target) {
    const jobs = (StorageManager.get('job_applications') || []).sort((a, b) => (b.applyDate || '').localeCompare(a.applyDate || ''));

    const stats = {
      applied: jobs.filter(j => j.status === 'applied').length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offer: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length
    };

    let html = `
      <div class="grid grid-4 mb-4">
        <div class="stat-card"><div class="stat-value" style="color:var(--info)">${stats.applied}</div><div class="stat-label">已投递</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--warning)">${stats.interview}</div><div class="stat-label">面试中</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--success)">${stats.offer}</div><div class="stat-label">已拿Offer</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--danger)">${stats.rejected}</div><div class="stat-label">未通过</div></div>
      </div>

      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">投递记录</span>
          <button class="btn btn-primary btn-sm" id="add-job">+ 记一条投递</button>
        </div>
      </div>
    `;

    if (jobs.length === 0) {
      html += UI.emptyState('📎', '还没开始投简历呀，慢慢来，找到合适的才重要');
    } else {
      const statusMap = {
        applied: { label: '已投递', cls: 'tag-blue' },
        interview: { label: '面试中', cls: 'tag-orange' },
        offer: { label: '已拿Offer', cls: 'tag-green' },
        rejected: { label: '未通过', cls: 'tag-red' }
      };

      jobs.forEach(j => {
        const st = statusMap[j.status] || statusMap.applied;
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">
                ${UI.escape(j.position)} <span class="text-muted">@ ${UI.escape(j.company)}</span>
                <span class="tag ${st.cls}" style="margin-left:8px">${st.label}</span>
              </div>
              <div class="list-item-desc">
                投递：${UI.formatDate(j.applyDate) || '未记录'}
                ${j.interviewDate ? ` | 面试：${UI.formatDate(j.interviewDate)}` : ''}
                ${j.note ? ` | ${UI.escape(j.note)}` : ''}
              </div>
            </div>
            <select class="select" style="max-width:100px" data-status="${j.id}">
              <option value="applied" ${j.status === 'applied' ? 'selected' : ''}>已投递</option>
              <option value="interview" ${j.status === 'interview' ? 'selected' : ''}>面试中</option>
              <option value="offer" ${j.status === 'offer' ? 'selected' : ''}>已拿Offer</option>
              <option value="rejected" ${j.status === 'rejected' ? 'selected' : ''}>未通过</option>
            </select>
            <button class="btn btn-danger btn-sm" data-delete="${j.id}">删除</button>
          </div>
        `;
      });
    }

    target.innerHTML = html;

    target.querySelector('#add-job')?.addEventListener('click', () => this.showAddForm(target));
    target.querySelectorAll('[data-status]').forEach(sel => {
      sel.addEventListener('change', () => {
        StorageManager.update('job_applications', sel.dataset.status, { status: sel.value });
        const labels = { applied: '已投递', interview: '面试中', offer: '已拿Offer', rejected: '未通过' };
        UI.toast(`状态更新为「${labels[sel.value]}」`);
        this.renderContent(target);
      });
    });
    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.confirm('删掉这条记录吗？', () => {
          StorageManager.remove('job_applications', btn.dataset.delete);
          UI.toast('已删除');
          this.renderContent(target);
        });
      });
    });
  },

  showAddForm(target) {
    const today = StorageManager.todayStr();
    UI.modal({
      title: '记一条投递',
      content: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">公司</label>
            <input type="text" class="input" id="job-company" placeholder="公司名称" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">职位</label>
            <input type="text" class="input" id="job-position" placeholder="应聘职位">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">投递日期</label>
            <input type="date" class="input" id="job-apply-date" value="${today}">
          </div>
          <div class="form-group">
            <label class="form-label">面试日期（可选）</label>
            <input type="date" class="input" id="job-interview-date">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input type="text" class="input" id="job-note" placeholder="渠道、薪资期望等">
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: '记下来', style: 'primary', onClick: () => {
            const company = document.getElementById('job-company').value.trim();
            const position = document.getElementById('job-position').value.trim();
            if (!company || !position) { UI.toast('公司和职位都要填哦'); return; }
            StorageManager.add('job_applications', {
              company,
              position,
              applyDate: document.getElementById('job-apply-date').value,
              interviewDate: document.getElementById('job-interview-date').value,
              note: document.getElementById('job-note').value,
              status: 'applied'
            });
            UI.toast('记下来了，祝你好运！');
            this.renderContent(target);
          }
        }
      ]
    });
  }
};

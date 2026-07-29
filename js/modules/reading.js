/* ===== 读书学习模块：诗词推荐 + 所思所想 ===== */

const ReadingModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">📖 读书学习</div>
        <div class="module-subtitle">在诗词中遇见千年前的自己，在所思所想中遇见当下的自己</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active rd-tab" data-tab="poetry" style="background:var(--primary);color:white">🌸 诗词推荐</div>
        <div class="subnav-item rd-tab" data-tab="books" style="border:1px solid var(--border)">📚 推荐书单</div>
        <div class="subnav-item rd-tab" data-tab="thoughts" style="border:1px solid var(--border)">💭 所思所想</div>
      </div>

      <div id="rd-poetry" class="tab-content active"></div>
      <div id="rd-books" class="tab-content"></div>
      <div id="rd-thoughts" class="tab-content"></div>
    `;

    this.renderPoetry(container.querySelector('#rd-poetry'));
    this.renderBooks(container.querySelector('#rd-books'));
    this.renderThoughts(container.querySelector('#rd-thoughts'));

    container.querySelectorAll('.rd-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.rd-tab').forEach(t => {
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
        container.querySelector(`#rd-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* ---------- 诗词推荐 ---------- */
  renderPoetry(target) {
    // 每日推荐一首
    const allPoems = PoetryCollection.categories.flatMap(c => c.poems);
    const today = StorageManager.todayStr();
    const dayIdx = new Date(today).getDate() % allPoems.length;
    const dailyPoem = allPoems[dayIdx];

    let html = `
      <div class="meditation-card" style="background:linear-gradient(135deg,var(--primary-pale),var(--bg-card));margin-bottom:20px">
        <div class="flex justify-between items-center mb-2">
          <span class="tag tag-purple">🌸 今日一诗</span>
          <span class="text-sm text-hint">${dailyPoem.dynasty} · ${dailyPoem.author}</span>
        </div>
        <h3 style="font-size:20px;color:var(--primary-darker);margin-bottom:8px;font-weight:600">${dailyPoem.title}</h3>
        <div style="font-size:17px;line-height:2;color:var(--text-primary);margin:12px 0;letter-spacing:1px">
          ${UI.escape(dailyPoem.text)}
        </div>
        <div class="text-sm" style="color:var(--text-secondary);line-height:1.8;background:rgba(255,255,255,0.5);border-radius:8px;padding:10px 14px">
          💬 ${UI.escape(dailyPoem.appreciation)}
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-secondary btn-sm" id="poetry-search">🔍 搜索更多赏析</button>
          <button class="btn btn-secondary btn-sm" id="poetry-copy">📋 复制全诗</button>
        </div>
      </div>
    `;

    // 分类浏览
    html += `<div class="section-title">按主题浏览</div>`;
    html += `<div class="flex gap-2 mb-4" style="flex-wrap:wrap">`;
    PoetryCollection.categories.forEach((cat, i) => {
      html += `<button class="btn btn-secondary btn-sm rd-poetry-cat" data-cat="${i}" style="${i === 0 ? 'background:var(--primary);color:white;border:none' : 'border:1px solid var(--border)'}">${cat.icon} ${cat.name}</button>`;
    });
    html += `</div>`;
    html += `<div id="rd-poetry-list"></div>`;

    target.innerHTML = html;

    // 默认显示第一个分类
    this.renderPoetryList(target.querySelector('#rd-poetry-list'), PoetryCollection.categories[0]);

    // 分类切换
    target.querySelectorAll('.rd-poetry-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        target.querySelectorAll('.rd-poetry-cat').forEach(b => {
          b.style.background = '';
          b.style.color = '';
          b.style.border = '1px solid var(--border)';
        });
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.border = 'none';

        const cat = PoetryCollection.categories[parseInt(btn.dataset.cat)];
        this.renderPoetryList(target.querySelector('#rd-poetry-list'), cat);
      });
    });

    // 搜索赏析
    target.querySelector('#poetry-search').addEventListener('click', () => {
      const kw = `${dailyPoem.title} ${dailyPoem.author} 赏析`;
      window.open('https://www.douyin.com/search/' + encodeURIComponent(kw), '_blank');
      UI.toast(`正在抖音搜索「${dailyPoem.title}」的赏析`);
    });

    // 复制全诗
    target.querySelector('#poetry-copy').addEventListener('click', () => {
      const text = `《${dailyPoem.title}》\n${dailyPoem.dynasty} · ${dailyPoem.author}\n\n${dailyPoem.text}`;
      navigator.clipboard?.writeText(text);
      UI.toast('诗词已复制，去分享给朋友吧~');
    });
  },

  renderPoetryList(container, category) {
    let html = `<div class="grid grid-2">`;
    category.poems.forEach(p => {
      html += `
        <div class="card" style="cursor:pointer" data-poem="${UI.escape(p.title)}">
          <div class="flex justify-between items-start mb-1">
            <h4 style="font-size:15px;color:var(--primary-darker)">${p.title}</h4>
            <span class="text-sm text-hint">${p.dynasty}·${p.author}</span>
          </div>
          <div style="font-size:14px;line-height:1.9;color:var(--text-primary);margin:8px 0;letter-spacing:0.5px">
            ${UI.escape(p.text)}
          </div>
          <div class="text-sm text-muted" style="line-height:1.7">💬 ${UI.escape(p.appreciation)}</div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('[data-poem]').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.poem;
        window.open('https://www.douyin.com/search/' + encodeURIComponent(title + ' 赏析 朗诵'), '_blank');
        UI.toast(`正在抖音搜索「${title}」的朗诵和赏析`);
      });
    });
  },

  /* ---------- 推荐书单 ---------- */
  renderBooks(target) {
    let html = `<div class="section-title">传统文化推荐书单</div>`;
    html += `<p class="text-sm text-muted mb-4">从诗词到散文，从古典到现代，慢慢读，不着急</p>`;

    html += `<div class="grid grid-2">`;
    ReadingList.forEach(book => {
      html += `
        <div class="card" style="cursor:pointer" data-book="${UI.escape(book.title)}">
          <div class="flex justify-between items-start mb-1">
            <h4 style="font-size:15px;color:var(--primary-darker)">📕 ${book.title}</h4>
            <span class="tag tag-blue">${book.category}</span>
          </div>
          <p class="text-sm text-muted" style="line-height:1.7;margin:6px 0">${book.desc}</p>
          <div class="flex gap-2" style="flex-wrap:wrap">
            ${book.tags.map(t => `<span class="tag tag-purple" style="font-size:10px">${t}</span>`).join('')}
          </div>
          <div class="text-sm text-hint" style="margin-top:8px">✍️ ${book.author} · 🔍 点击搜索</div>
        </div>
      `;
    });
    html += `</div>`;

    target.innerHTML = html;

    target.querySelectorAll('[data-book]').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.book;
        window.open('https://www.douyin.com/search/' + encodeURIComponent(title + ' 书评 解读'), '_blank');
        UI.toast(`正在抖音搜索「${title}」的书评和解读`);
      });
    });
  },

  /* ---------- 所思所想 ---------- */
  renderThoughts(target) {
    const thoughts = StorageManager.get('reading_thoughts') || [];
    const today = StorageManager.todayStr();
    const todayThought = thoughts.find(t => t.date === today);

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">今天的所思所想</span>
          ${todayThought ? '<span class="tag tag-green">已记录</span>' : ''}
        </div>
        <p class="text-sm text-muted mb-4">读到一句话、听到一首诗、或者突然冒出来的念头——写下来，别让它跑了</p>

        <div class="form-group">
          <label class="form-label">标题（可选）</label>
          <input type="text" class="input" id="thought-title" placeholder="给这段想法起个名字..." value="${UI.escape(todayThought?.title || '')}">
        </div>

        <div class="form-group">
          <label class="form-label">想到什么就写什么</label>
          <textarea class="textarea" id="thought-content" placeholder="此刻心里在想什么？可能是读到的某句诗触发的，也可能是生活中的一个瞬间..." style="min-height:160px;line-height:1.8">${UI.escape(todayThought?.content || '')}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">关联的诗词或书（可选）</label>
          <input type="text" class="input" id="thought-ref" placeholder="比如：苏轼《定风波》" value="${UI.escape(todayThought?.ref || '')}">
        </div>

        <div class="flex gap-2">
          <button class="btn btn-primary" id="save-thought">${todayThought ? '更新' : '记录下来'}</button>
          ${todayThought ? '<button class="btn btn-danger" id="delete-thought">删除</button>' : ''}
        </div>
      </div>
    `;

    // 历史记录
    if (thoughts.length > 0) {
      const sorted = thoughts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      html += `<div class="section-title">所思所想 · 归档</div>`;
      html += `<p class="text-sm text-muted mb-4">回头看看，那些一闪而过的念头都值得被记住</p>`;

      // 按月份分组
      const byMonth = {};
      sorted.forEach(t => {
        const monthKey = (t.date || '').slice(0, 7);
        if (!byMonth[monthKey]) byMonth[monthKey] = [];
        byMonth[monthKey].push(t);
      });

      Object.entries(byMonth).forEach(([month, items]) => {
        const [y, m] = month.split('-');
        html += `<div class="text-sm font-bold" style="color:var(--primary-darker);margin:16px 0 8px;padding-left:4px">📅 ${y}年${parseInt(m)}月</div>`;
        items.forEach(t => {
          const preview = (t.content || '').slice(0, 80);
          html += `
            <div class="list-item" style="cursor:pointer;align-items:flex-start" data-thought="${t.id}">
              <span style="font-size:18px;margin-top:2px">💭</span>
              <div class="list-item-content">
                <div class="list-item-title">
                  ${t.title ? UI.escape(t.title) : '<span class="text-muted">无标题</span>'}
                  <span class="text-sm text-hint" style="margin-left:6px">${UI.formatDate(t.date)} ${UI.getWeekday(t.date)}</span>
                </div>
                <div class="list-item-desc" style="margin-top:4px;line-height:1.6">${UI.escape(preview)}${(t.content || '').length > 80 ? '...' : ''}</div>
                ${t.ref ? `<div class="text-sm" style="color:var(--primary-darker);margin-top:4px">📖 ${UI.escape(t.ref)}</div>` : ''}
              </div>
            </div>
          `;
        });
      });
    }

    target.innerHTML = html;

    // 保存
    target.querySelector('#save-thought')?.addEventListener('click', () => {
      const title = target.querySelector('#thought-title').value.trim();
      const content = target.querySelector('#thought-content').value.trim();
      const ref = target.querySelector('#thought-ref').value.trim();

      if (!content) { UI.toast('写点什么再保存吧'); return; }

      const data = { title, content, ref, date: today };
      if (todayThought) {
        StorageManager.update('reading_thoughts', todayThought.id, data);
        UI.toast('更新了，留住当下的想法真好');
      } else {
        StorageManager.add('reading_thoughts', data);
        UI.toast('记下来了，这个念头被留住了');
      }
      this.renderThoughts(target);
    });

    // 删除
    target.querySelector('#delete-thought')?.addEventListener('click', () => {
      UI.confirm('确定要删掉今天的所思所想吗？', () => {
        StorageManager.remove('reading_thoughts', todayThought.id);
        UI.toast('已删除');
        this.renderThoughts(target);
      });
    });

    // 点击历史记录查看详情
    target.querySelectorAll('[data-thought]').forEach(item => {
      item.addEventListener('click', () => {
        const t = thoughts.find(x => x.id === item.dataset.thought);
        if (!t) return;
        let content = `
          <div class="text-sm text-muted mb-2">${UI.formatDateFull(t.date)} ${UI.getWeekday(t.date)}</div>
          ${t.title ? `<h4 style="font-size:17px;color:var(--primary-darker);margin-bottom:10px">${UI.escape(t.title)}</h4>` : ''}
          <div style="font-size:15px;line-height:2;color:var(--text-primary);white-space:pre-wrap">${UI.escape(t.content)}</div>
          ${t.ref ? `<div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border-light);color:var(--primary-darker);font-size:13px">📖 关联：${UI.escape(t.ref)}</div>` : ''}
        `;
        UI.modal({ title: '💭 所思所想', content, actions: [{ label: '关闭', style: 'primary' }] });
      });
    });
  }
};

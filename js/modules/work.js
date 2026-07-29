/* ===== 工作模块：寿山石/茶叶/自媒体 ===== */

/* ========== 寿山石专区 ========== */
const ShoushanModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">🪨 寿山石专区</div>
        <div class="module-subtitle">石之美者，温润如玉——记录每一方藏石的故事</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active ss-tab" data-tab="collection" style="background:var(--primary);color:white">藏品记录</div>
        <div class="subnav-item ss-tab" data-tab="knowledge" style="border:1px solid var(--border)">品类知识</div>
      </div>

      <div id="ss-collection" class="tab-content active"></div>
      <div id="ss-knowledge" class="tab-content"></div>
    `;

    this.renderCollection(container.querySelector('#ss-collection'));
    this.renderKnowledge(container.querySelector('#ss-knowledge'));

    container.querySelectorAll('.ss-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.ss-tab').forEach(t => {
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
        container.querySelector(`#ss-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  renderCollection(target) {
    const items = StorageManager.get('shoushan') || [];

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">我的藏品（${items.length}）</span>
          <button class="btn btn-primary btn-sm" id="add-shoushan">+ 添加藏品</button>
        </div>
      </div>
    `;

    if (items.length === 0) {
      html += UI.emptyState('🪨', '还没有藏品记录呢，把你的第一方藏石记下来吧');
    } else {
      html += `<div class="grid grid-3">`;
      items.forEach(item => {
        html += `
          <div class="card">
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold">${UI.escape(item.name)}</span>
              <span class="tag tag-blue">${UI.escape(item.type)}</span>
            </div>
            ${item.desc ? `<p class="card-desc mb-2">${UI.escape(item.desc)}</p>` : ''}
            ${item.notes ? `<p class="text-sm text-muted mb-2">📝 ${UI.escape(item.notes)}</p>` : ''}
            <div class="text-sm text-hint">
              ${item.acquiredDate ? `入手：${UI.formatDate(item.acquiredDate)}` : ''}
            </div>
            <div class="flex gap-2 mt-2">
              <button class="btn btn-secondary btn-sm" data-edit="${item.id}">编辑</button>
              <button class="btn btn-danger btn-sm" data-delete="${item.id}">删除</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    target.innerHTML = html;

    target.querySelector('#add-shoushan')?.addEventListener('click', () => this.showForm(target));
    target.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => this.showForm(target, items.find(i => i.id === btn.dataset.edit)));
    });
    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.confirm('确定要删掉这方藏石的记录吗？', () => {
          StorageManager.remove('shoushan', btn.dataset.delete);
          UI.toast('已删除');
          this.renderCollection(target);
        });
      });
    });
  },

  renderKnowledge(target) {
    let html = `<div class="section-title">寿山石品类知识</div>`;
    html += `<p class="text-sm text-muted mb-4">了解每一类石种的特性，做个明白的藏家</p>`;
    html += `<div class="grid grid-2">`;
    ShoushanTypes.forEach(t => {
      html += `
        <div class="card">
          <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:6px">${t.name}</h4>
          <p class="card-desc">${t.desc}</p>
        </div>
      `;
    });
    html += `</div>`;
    target.innerHTML = html;
  },

  showForm(target, item) {
    const isEdit = !!item;
    UI.modal({
      title: isEdit ? '编辑藏品' : '添加藏品',
      content: `
        <div class="form-group">
          <label class="form-label">名称</label>
          <input type="text" class="input" id="ss-name" placeholder="给这方石头起个名" value="${UI.escape(item?.name || '')}" autofocus>
        </div>
        <div class="form-group">
          <label class="form-label">品类</label>
          <select class="select" id="ss-type">
            ${ShoushanTypes.map(t => `<option value="${t.name}" ${item?.type === t.name ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea class="textarea" id="ss-desc" placeholder="尺寸、色泽、质地特征...">${UI.escape(item?.desc || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">鉴赏笔记</label>
          <textarea class="textarea" id="ss-notes" placeholder="入手故事、鉴赏心得...">${UI.escape(item?.notes || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">入手日期</label>
          <input type="date" class="input" id="ss-date" value="${item?.acquiredDate || ''}">
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: isEdit ? '保存' : '记下来', style: 'primary', onClick: () => {
            const name = document.getElementById('ss-name').value.trim();
            if (!name) { UI.toast('给石头起个名字吧'); return; }
            const data = {
              name,
              type: document.getElementById('ss-type').value,
              desc: document.getElementById('ss-desc').value.trim(),
              notes: document.getElementById('ss-notes').value.trim(),
              acquiredDate: document.getElementById('ss-date').value
            };
            if (isEdit) {
              StorageManager.update('shoushan', item.id, data);
              UI.toast('更新好了');
            } else {
              StorageManager.add('shoushan', data);
              UI.toast('记下来了，又多了一方好石');
            }
            this.renderCollection(target);
          }
        }
      ]
    });
  }
};

/* ========== 茶叶专区 ========== */
const TeaModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">🍵 茶叶专区</div>
        <div class="module-subtitle">一茶一时节，记录每一泡的滋味</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active tea-tab" data-tab="inventory" style="background:var(--primary);color:white">茶品记录</div>
        <div class="subnav-item tea-tab" data-tab="types" style="border:1px solid var(--border)">茶类知识</div>
      </div>

      <div id="tea-inventory" class="tab-content active"></div>
      <div id="tea-types" class="tab-content"></div>
    `;

    this.renderInventory(container.querySelector('#tea-inventory'));
    this.renderTypes(container.querySelector('#tea-types'));

    container.querySelectorAll('.tea-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tea-tab').forEach(t => {
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
        container.querySelector(`#tea-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  renderInventory(target) {
    const items = StorageManager.get('tea') || [];

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">茶品清单（${items.length}）</span>
          <button class="btn btn-primary btn-sm" id="add-tea">+ 添加茶品</button>
        </div>
      </div>
    `;

    if (items.length === 0) {
      html += UI.emptyState('🍵', '还没有茶品记录，把你手头的茶记一记吧');
    } else {
      html += `<div class="grid grid-3">`;
      items.forEach(item => {
        const qtyColor = item.quantity !== undefined && item.quantity <= 50 ? 'var(--danger)' : 'var(--success)';
        html += `
          <div class="card">
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold">${UI.escape(item.name)}</span>
              <span class="tag tag-green">${UI.escape(item.type)}</span>
            </div>
            ${item.origin ? `<p class="text-sm text-muted mb-2">📍 ${UI.escape(item.origin)}</p>` : ''}
            ${item.notes ? `<p class="card-desc mb-2">🍵 ${UI.escape(item.notes)}</p>` : ''}
            ${item.quantity !== undefined ? `<div class="flex justify-between items-center"><span class="text-sm text-muted">库存</span><span class="font-bold" style="color:${qtyColor}">${item.quantity}g</span></div>` : ''}
            <div class="flex gap-2 mt-2">
              <button class="btn btn-secondary btn-sm" data-edit="${item.id}">编辑</button>
              <button class="btn btn-danger btn-sm" data-delete="${item.id}">删除</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    target.innerHTML = html;

    target.querySelector('#add-tea')?.addEventListener('click', () => this.showForm(target));
    target.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => this.showForm(target, items.find(i => i.id === btn.dataset.edit)));
    });
    target.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.confirm('确定要删掉这泡茶的记录吗？', () => {
          StorageManager.remove('tea', btn.dataset.delete);
          UI.toast('已删除');
          this.renderInventory(target);
        });
      });
    });
  },

  renderTypes(target) {
    let html = `<div class="section-title">六大茶类速查</div>`;
    html += `<p class="text-sm text-muted mb-4">按发酵程度分类，找到适合当下的那一杯</p>`;
    html += `<div class="grid grid-2">`;
    TeaTypes.forEach(t => {
      html += `
        <div class="card">
          <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:8px">${t.name}</h4>
          <div class="flex gap-2" style="flex-wrap:wrap">
            ${t.subtypes.map(s => `<span class="tag tag-blue">${s}</span>`).join('')}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    target.innerHTML = html;
  },

  showForm(target, item) {
    const isEdit = !!item;
    UI.modal({
      title: isEdit ? '编辑茶品' : '添加茶品',
      content: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">名称</label>
            <input type="text" class="input" id="tea-name" placeholder="茶名" value="${UI.escape(item?.name || '')}" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">茶类</label>
            <select class="select" id="tea-type">
              ${TeaTypes.map(t => `<option value="${t.name}" ${item?.type === t.name ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">产地</label>
            <input type="text" class="input" id="tea-origin" placeholder="如：福建福鼎" value="${UI.escape(item?.origin || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">库存（克）</label>
            <input type="number" class="input" id="tea-qty" placeholder="如：100" value="${item?.quantity || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">品鉴笔记</label>
          <textarea class="textarea" id="tea-notes" placeholder="口感、香气、冲泡心得...">${UI.escape(item?.notes || '')}</textarea>
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: isEdit ? '保存' : '记下来', style: 'primary', onClick: () => {
            const name = document.getElementById('tea-name').value.trim();
            if (!name) { UI.toast('给这泡茶起个名字吧'); return; }
            const data = {
              name,
              type: document.getElementById('tea-type').value,
              origin: document.getElementById('tea-origin').value.trim(),
              quantity: document.getElementById('tea-qty').value ? parseInt(document.getElementById('tea-qty').value) : undefined,
              notes: document.getElementById('tea-notes').value.trim()
            };
            if (isEdit) {
              StorageManager.update('tea', item.id, data);
              UI.toast('更新好了');
            } else {
              StorageManager.add('tea', data);
              UI.toast('记下来了，又多了一泡好茶');
            }
            this.renderInventory(target);
          }
        }
      ]
    });
  }
};

/* ========== 自媒体专区 ========== */
const MediaModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">🎬 自媒体专区</div>
        <div class="module-subtitle">做内容不孤单，这里有技巧和灵感</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active md-tab" data-tab="editing" style="background:var(--primary);color:white">✂️ 剪辑技巧</div>
        <div class="subnav-item md-tab" data-tab="learning" style="border:1px solid var(--border)">📚 学习技巧</div>
        <div class="subnav-item md-tab" data-tab="keywords" style="border:1px solid var(--border)">🔑 关键词推荐</div>
      </div>

      <div id="md-editing" class="tab-content active"></div>
      <div id="md-learning" class="tab-content"></div>
      <div id="md-keywords" class="tab-content"></div>
    `;

    this.renderEditing(container.querySelector('#md-editing'));
    this.renderLearning(container.querySelector('#md-learning'));
    this.renderKeywords(container.querySelector('#md-keywords'));

    container.querySelectorAll('.md-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.md-tab').forEach(t => {
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
        container.querySelector(`#md-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* 剪辑技巧检索 */
  renderEditing(target) {
    let html = `
      <div class="card mb-4">
        <div class="form-group" style="margin:0">
          <label class="form-label">搜索剪辑技巧</label>
          <input type="text" class="input" id="edit-search" placeholder="输入关键词，如：转场、调色、卡点...">
        </div>
        <div class="keyword-cloud mt-2" id="edit-chips">
          ${MediaPresets.editingTips.map(t => `<span class="keyword-chip" data-kw="${t.keyword}">${t.keyword}</span>`).join('')}
        </div>
      </div>
      <div id="edit-results"></div>
    `;
    target.innerHTML = html;

    const search = target.querySelector('#edit-search');
    search.addEventListener('input', () => this.filterEditing(target, search.value));
    target.querySelectorAll('#edit-chips .keyword-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        search.value = chip.dataset.kw;
        this.filterEditing(target, chip.dataset.kw);
      });
    });

    this.renderEditingResults(target.querySelector('#edit-results'), MediaPresets.editingTips);
  },

  filterEditing(target, kw) {
    const filtered = kw
      ? MediaPresets.editingTips.filter(t => t.keyword.includes(kw) || t.desc.includes(kw))
      : MediaPresets.editingTips;

    target.querySelectorAll('#edit-chips .keyword-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.kw === kw);
    });

    this.renderEditingResults(target.querySelector('#edit-results'), filtered);
  },

  renderEditingResults(container, tips) {
    if (tips.length === 0) {
      container.innerHTML = UI.emptyState('🔍', '没找到相关技巧，换个关键词试试？');
      return;
    }
    let html = `<div class="grid grid-2">`;
    tips.forEach(t => {
      html += `
        <div class="card">
          <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:6px">${t.keyword}</h4>
          <p class="card-desc mb-2">${t.desc}</p>
          <div class="text-sm text-muted mb-2">💡 推荐搜索：</div>
          <div class="flex gap-2" style="flex-wrap:wrap">
            ${t.searchTerms.map(s => `<span class="keyword-chip" data-search="${s}">${s}</span>`).join('')}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('[data-search]').forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.dataset.search;
        const url = MediaPresets.keywordTemplates.platforms.bilibili + encodeURIComponent(term);
        window.open(url, '_blank');
        UI.toast(`正在B站搜索「${term}」`);
      });
    });
  },

  /* 学习技巧检索 */
  renderLearning(target) {
    let html = `
      <div class="card mb-4">
        <div class="form-group" style="margin:0">
          <label class="form-label">搜索学习技巧</label>
          <input type="text" class="input" id="learn-search" placeholder="输入关键词，如：选题、标题、完播率...">
        </div>
        <div class="keyword-cloud mt-2" id="learn-chips">
          ${MediaPresets.learningTips.map(t => `<span class="keyword-chip" data-kw="${t.keyword}">${t.keyword}</span>`).join('')}
        </div>
      </div>
      <div id="learn-results"></div>
    `;
    target.innerHTML = html;

    const search = target.querySelector('#learn-search');
    search.addEventListener('input', () => this.filterLearning(target, search.value));
    target.querySelectorAll('#learn-chips .keyword-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        search.value = chip.dataset.kw;
        this.filterLearning(target, chip.dataset.kw);
      });
    });

    this.renderLearningResults(target.querySelector('#learn-results'), MediaPresets.learningTips);
  },

  filterLearning(target, kw) {
    const filtered = kw
      ? MediaPresets.learningTips.filter(t => t.keyword.includes(kw) || t.desc.includes(kw))
      : MediaPresets.learningTips;

    target.querySelectorAll('#learn-chips .keyword-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.kw === kw);
    });

    this.renderLearningResults(target.querySelector('#learn-results'), filtered);
  },

  renderLearningResults(container, tips) {
    if (tips.length === 0) {
      container.innerHTML = UI.emptyState('🔍', '没找到相关技巧，换个关键词试试？');
      return;
    }
    let html = `<div class="grid grid-2">`;
    tips.forEach(t => {
      html += `
        <div class="card">
          <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:6px">${t.keyword}</h4>
          <p class="card-desc mb-2">${t.desc}</p>
          <div class="text-sm text-muted mb-2">💡 推荐搜索：</div>
          <div class="flex gap-2" style="flex-wrap:wrap">
            ${t.searchTerms.map(s => `<span class="keyword-chip" data-search="${s}">${s}</span>`).join('')}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('[data-search]').forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.dataset.search;
        const url = MediaPresets.keywordTemplates.platforms.bilibili + encodeURIComponent(term);
        window.open(url, '_blank');
        UI.toast(`正在B站搜索「${term}」`);
      });
    });
  },

  /* 关键词推荐生成 */
  renderKeywords(target) {
    let html = `
      <div class="card mb-4">
        <label class="form-label">输入你的视频主题</label>
        <input type="text" class="input mb-2" id="kw-topic" placeholder="比如：vlog日常、美食探店、知识科普...">
        <div class="text-sm text-muted mb-2">选择推荐风格：</div>
        <div class="flex gap-2 mb-4" style="flex-wrap:wrap" id="kw-style">
          <button class="btn btn-secondary btn-sm kw-style-btn active" data-style="all" style="background:var(--primary);color:white;border:none">全部推荐</button>
          <button class="btn btn-secondary btn-sm kw-style-btn" data-style="tutorial" style="border:1px solid var(--border)">教程向</button>
          <button class="btn btn-secondary btn-sm kw-style-btn" data-style="click" style="border:1px solid var(--border)">吸睛向</button>
        </div>
        <button class="btn btn-primary" id="kw-generate">🔥 生成关键词推荐</button>
      </div>
      <div id="kw-results"></div>
    `;
    target.innerHTML = html;

    let selectedStyle = 'all';
    target.querySelectorAll('.kw-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        target.querySelectorAll('.kw-style-btn').forEach(b => {
          b.style.background = '';
          b.style.color = '';
          b.style.border = '1px solid var(--border)';
        });
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        selectedStyle = btn.dataset.style;
      });
    });

    target.querySelector('#kw-generate').addEventListener('click', () => {
      const topic = target.querySelector('#kw-topic').value.trim();
      if (!topic) { UI.toast('先输入一个视频主题吧'); return; }
      this.generateKeywords(target.querySelector('#kw-results'), topic, selectedStyle);
    });

    // 回车也触发
    target.querySelector('#kw-topic').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const topic = target.querySelector('#kw-topic').value.trim();
        if (topic) this.generateKeywords(target.querySelector('#kw-results'), topic, selectedStyle);
      }
    });
  },

  generateKeywords(container, topic, style) {
    const templates = MediaPresets.keywordTemplates;
    let keywords = [];

    if (style === 'all' || style === 'tutorial') {
      templates.suffixes.forEach(s => keywords.push(`${topic} ${s}`));
      templates.prefixes.forEach(p => keywords.push(`${p} ${topic}`));
    }
    if (style === 'all' || style === 'click') {
      keywords.push(`${topic} 2024最新`);
      keywords.push(`${topic} 少走弯路`);
      keywords.push(`${topic} 新手必看`);
      keywords.push(`为什么做${topic}`);
      keywords.push(`${topic}踩坑经验`);
      keywords.push(`从零开始做${topic}`);
    }

    // 去重
    keywords = [...new Set(keywords)];

    let html = `
      <div class="card">
        <h4 style="font-size:15px;color:var(--primary-darker);margin-bottom:10px">
          📋 「${UI.escape(topic)}」的关键词推荐
        </h4>
        <p class="text-sm text-muted mb-4">点击关键词直接跳转到对应平台搜索</p>

        <div class="section-title" style="font-size:13px">B站</div>
        <div class="keyword-cloud mb-4">
          ${keywords.map(k => `<span class="keyword-chip" data-platform="bilibili" data-kw="${UI.escape(k)}">${UI.escape(k)}</span>`).join('')}
        </div>

        <div class="section-title" style="font-size:13px">抖音</div>
        <div class="keyword-cloud mb-4">
          ${keywords.map(k => `<span class="keyword-chip" data-platform="douyin" data-kw="${UI.escape(k)}">${UI.escape(k)}</span>`).join('')}
        </div>

        <div class="section-title" style="font-size:13px">YouTube</div>
        <div class="keyword-cloud mb-4">
          ${keywords.map(k => `<span class="keyword-chip" data-platform="youtube" data-kw="${UI.escape(k)}">${UI.escape(k)}</span>`).join('')}
        </div>

        <button class="btn btn-secondary btn-sm" id="copy-keywords">复制全部关键词</button>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('[data-platform]').forEach(chip => {
      chip.addEventListener('click', () => {
        const platform = chip.dataset.platform;
        const kw = chip.dataset.kw;
        const url = templates.platforms[platform] + encodeURIComponent(kw);
        window.open(url, '_blank');
        const platformName = { bilibili: 'B站', douyin: '抖音', youtube: 'YouTube' }[platform];
        UI.toast(`正在${platformName}搜索「${kw}」`);
      });
    });

    container.querySelector('#copy-keywords')?.addEventListener('click', () => {
      const text = keywords.join('\n');
      navigator.clipboard?.writeText(text);
      UI.toast('关键词已复制到剪贴板');
    });

    UI.toast(`为「${topic}」生成了${keywords.length}个关键词推荐`);
  }
};

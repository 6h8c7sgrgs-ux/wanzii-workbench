/* ===== 销售记录模块 ===== */

const SalesModule = {
  init() {},

  render(container) {
    container.innerHTML = `
      <div class="module-header">
        <div class="module-title">💰 销售记录</div>
        <div class="module-subtitle">茶叶与寿山石的销售台账，每一笔都清清楚楚</div>
      </div>

      <div class="subnav" style="margin:-8px 0 20px;padding:0;border:none;overflow:visible">
        <div class="subnav-item active sl-tab" data-tab="overview" style="background:var(--primary);color:white">📊 销售总览</div>
        <div class="subnav-item sl-tab" data-tab="records" style="border:1px solid var(--border)">📋 销售明细</div>
        <div class="subnav-item sl-tab" data-tab="clients" style="border:1px solid var(--border)">👥 客户档案</div>
      </div>

      <div id="sl-overview" class="tab-content active"></div>
      <div id="sl-records" class="tab-content"></div>
      <div id="sl-clients" class="tab-content"></div>
    `;

    this.renderOverview(container.querySelector('#sl-overview'));
    this.renderRecords(container.querySelector('#sl-records'));
    this.renderClients(container.querySelector('#sl-clients'));

    container.querySelectorAll('.sl-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.sl-tab').forEach(t => {
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
        container.querySelector(`#sl-${tab.dataset.tab}`).classList.add('active');
      });
    });
  },

  /* ---------- 销售总览 ---------- */
  renderOverview(target) {
    const records = StorageManager.get('sales') || [];
    const now = new Date();
    const monthRecords = StorageManager.getByMonth('sales', now.getFullYear(), now.getMonth() + 1);

    const monthRevenue = monthRecords.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const monthCost = monthRecords.reduce((s, r) => s + parseFloat(r.cost || 0), 0);
    const monthProfit = monthRevenue - monthCost;

    const totalRevenue = records.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const totalProfit = records.reduce((s, r) => s + parseFloat(r.amount || 0) - parseFloat(r.cost || 0), 0);

    // 按品类统计
    const teaRecords = records.filter(r => r.category === 'tea');
    const stoneRecords = records.filter(r => r.category === 'stone');
    const teaRevenue = teaRecords.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const stoneRevenue = stoneRecords.reduce((s, r) => s + parseFloat(r.amount || 0), 0);

    let html = `
      <div class="grid grid-4 mb-4">
        <div class="stat-card">
          <div class="stat-value" style="color:var(--success)">¥${monthRevenue.toFixed(0)}</div>
          <div class="stat-label">本月销售额</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:${monthProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">¥${monthProfit.toFixed(0)}</div>
          <div class="stat-label">本月利润</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${monthRecords.length}</div>
          <div class="stat-label">本月成交笔数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${records.length}</div>
          <div class="stat-label">累计总笔数</div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold">🍵 茶叶销售</span>
            <span class="text-sm text-muted">${teaRecords.length}笔</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-muted">累计销售额</span>
            <span class="font-bold" style="color:var(--success)">¥${teaRevenue.toFixed(0)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill success" style="width:${totalRevenue > 0 ? (teaRevenue / totalRevenue * 100) : 0}%"></div>
          </div>
          <div class="text-sm text-hint mt-2">${totalRevenue > 0 ? Math.round(teaRevenue / totalRevenue * 100) : 0}% 占比</div>
        </div>
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold">🪨 寿山石销售</span>
            <span class="text-sm text-muted">${stoneRecords.length}笔</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-muted">累计销售额</span>
            <span class="font-bold" style="color:var(--success)">¥${stoneRevenue.toFixed(0)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${totalRevenue > 0 ? (stoneRevenue / totalRevenue * 100) : 0}%"></div>
          </div>
          <div class="text-sm text-hint mt-2">${totalRevenue > 0 ? Math.round(stoneRevenue / totalRevenue * 100) : 0}% 占比</div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">累计统计</span>
          <button class="btn btn-primary btn-sm" id="add-sale-btn">+ 记一笔销售</button>
        </div>
        <div class="grid grid-3 mt-4">
          <div class="text-center">
            <div class="text-lg font-bold" style="color:var(--success)">¥${totalRevenue.toFixed(0)}</div>
            <div class="text-sm text-muted">累计销售额</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold" style="color:${totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">¥${totalProfit.toFixed(0)}</div>
            <div class="text-sm text-muted">累计利润</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold">${records.length > 0 ? (totalRevenue / records.length).toFixed(0) : 0}</div>
            <div class="text-sm text-muted">客单价</div>
          </div>
        </div>
      </div>

      <div class="section-title">本月销售明细</div>
    `;

    if (monthRecords.length === 0) {
      html += UI.emptyState('💰', '这个月还没开张呢，加油呀~');
    } else {
      const sorted = monthRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      sorted.forEach(r => {
        html += this.renderRecordItem(r);
      });
    }

    target.innerHTML = html;

    target.querySelector('#add-sale-btn')?.addEventListener('click', () => this.showSaleForm(target));
    target.querySelectorAll('[data-edit-sale]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sale = (StorageManager.get('sales') || []).find(r => r.id === btn.dataset.editSale);
        if (sale) this.showSaleForm(target, sale);
      });
    });
    target.querySelectorAll('[data-del-sale]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        UI.confirm('确定删除这笔销售记录吗？', () => {
          StorageManager.remove('sales', btn.dataset.delSale);
          UI.toast('已删除');
          this.renderOverview(target);
        });
      });
    });
  },

  renderRecordItem(r) {
    const isTea = r.category === 'tea';
    const profit = parseFloat(r.amount || 0) - parseFloat(r.cost || 0);
    return `
      <div class="list-item">
        <span style="font-size:20px">${isTea ? '🍵' : '🪨'}</span>
        <div class="list-item-content">
          <div class="list-item-title">
            ${UI.escape(r.productName)}
            <span class="tag ${isTea ? 'tag-green' : 'tag-blue'}" style="margin-left:4px">${isTea ? '茶叶' : '寿山石'}</span>
          </div>
          <div class="list-item-desc">
            ${UI.formatDate(r.date)} · ${UI.escape(r.clientName || '散客')}
            ${r.channel ? ` · ${UI.escape(r.channel)}` : ''}
            ${r.note ? ` · ${UI.escape(r.note)}` : ''}
          </div>
        </div>
        <div style="text-align:right">
          <div class="font-bold" style="color:var(--success)">+¥${parseFloat(r.amount || 0).toFixed(0)}</div>
          ${r.cost ? `<div class="text-sm" style="color:${profit >= 0 ? 'var(--text-secondary)' : 'var(--danger)'}">利润 ¥${profit.toFixed(0)}</div>` : ''}
        </div>
        <button class="btn btn-secondary btn-sm" data-edit-sale="${r.id}">编辑</button>
        <button class="btn btn-danger btn-sm" data-del-sale="${r.id}">删除</button>
      </div>
    `;
  },

  showSaleForm(target, item) {
    const isEdit = !!item;
    const today = StorageManager.todayStr();
    UI.modal({
      title: isEdit ? '编辑销售记录' : '记一笔销售',
      content: `
        <div class="form-group">
          <label class="form-label">商品类别</label>
          <div class="flex gap-2">
            <label style="cursor:pointer"><input type="radio" name="sale-cat" value="tea" ${(!item || item.category === 'tea') ? 'checked' : ''}> 🍵 茶叶</label>
            <label style="cursor:pointer"><input type="radio" name="sale-cat" value="stone" ${item?.category === 'stone' ? 'checked' : ''}> 🪨 寿山石</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">商品名称</label>
            <input type="text" class="input" id="sale-product" placeholder="${item?.category === 'stone' ? '如：田黄印章' : '如：白毫银针 50g'}" value="${UI.escape(item?.productName || '')}" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">客户名称</label>
            <input type="text" class="input" id="sale-client" placeholder="客户名（可选）" value="${UI.escape(item?.clientName || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">售价（元）</label>
            <input type="number" class="input" id="sale-amount" placeholder="卖出价格" step="0.01" value="${item?.amount || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">成本（元，可选）</label>
            <input type="number" class="input" id="sale-cost" placeholder="进货价" step="0.01" value="${item?.cost || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">日期</label>
            <input type="date" class="input" id="sale-date" value="${item?.date || today}">
          </div>
          <div class="form-group">
            <label class="form-label">销售渠道</label>
            <select class="select" id="sale-channel">
              <option value="">请选择</option>
              <option value="微信" ${item?.channel === '微信' ? 'selected' : ''}>微信</option>
              <option value="抖音" ${item?.channel === '抖音' ? 'selected' : ''}>抖音</option>
              <option value="淘宝" ${item?.channel === '淘宝' ? 'selected' : ''}>淘宝</option>
              <option value="线下" ${item?.channel === '线下' ? 'selected' : ''}>线下</option>
              <option value="朋友圈" ${item?.channel === '朋友圈' ? 'selected' : ''}>朋友圈</option>
              <option value="小红书" ${item?.channel === '小红书' ? 'selected' : ''}>小红书</option>
              <option value="其他" ${item?.channel === '其他' ? 'selected' : ''}>其他</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input type="text" class="input" id="sale-note" placeholder="比如：老客户回购、包邮等" value="${UI.escape(item?.note || '')}">
        </div>
      `,
      actions: [
        { label: '取消', style: 'secondary' },
        {
          label: isEdit ? '保存' : '记下来', style: 'primary', onClick: () => {
            const category = document.querySelector('input[name="sale-cat"]:checked').value;
            const productName = document.getElementById('sale-product').value.trim();
            const amount = document.getElementById('sale-amount').value;

            if (!productName) { UI.toast('商品名称要填一下'); return; }
            if (!amount || parseFloat(amount) <= 0) { UI.toast('售价不能为空哦'); return; }

            const data = {
              category,
              productName,
              clientName: document.getElementById('sale-client').value.trim(),
              amount: parseFloat(amount),
              cost: parseFloat(document.getElementById('sale-cost').value) || 0,
              date: document.getElementById('sale-date').value,
              channel: document.getElementById('sale-channel').value,
              note: document.getElementById('sale-note').value.trim()
            };

            if (isEdit) {
              StorageManager.update('sales', item.id, data);
              UI.toast('更新好了');
            } else {
              StorageManager.add('sales', data);
              UI.toast('记下了，又成交一单！🎉');
            }
            this.renderOverview(target);
          }
        }
      ]
    });
  },

  /* ---------- 销售明细 ---------- */
  renderRecords(target) {
    const records = (StorageManager.get('sales') || []).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    let html = `
      <div class="card mb-4">
        <div class="flex gap-2" style="flex-wrap:wrap;align-items:center">
          <span class="font-bold" style="margin-right:8px">筛选：</span>
          <button class="btn btn-secondary btn-sm sl-filter" data-filter="all" style="background:var(--primary);color:white;border:none">全部</button>
          <button class="btn btn-secondary btn-sm sl-filter" data-filter="tea" style="border:1px solid var(--border)">🍵 茶叶</button>
          <button class="btn btn-secondary btn-sm sl-filter" data-filter="stone" style="border:1px solid var(--border)">🪨 寿山石</button>
          <div style="margin-left:auto">
            <input type="month" class="input" id="sl-month-filter" style="max-width:150px">
          </div>
        </div>
      </div>
      <div id="sl-records-list"></div>
    `;

    target.innerHTML = html;

    const listEl = target.querySelector('#sl-records-list');
    let currentFilter = 'all';
    let currentMonth = '';

    const renderList = () => {
      let filtered = records;
      if (currentFilter !== 'all') {
        filtered = filtered.filter(r => r.category === currentFilter);
      }
      if (currentMonth) {
        filtered = filtered.filter(r => (r.date || '').startsWith(currentMonth));
      }

      if (filtered.length === 0) {
        listEl.innerHTML = UI.emptyState('📭', '没有符合条件的销售记录');
        return;
      }

      let html = '';
      const totalAmount = filtered.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
      const totalProfit = filtered.reduce((s, r) => s + parseFloat(r.amount || 0) - parseFloat(r.cost || 0), 0);

      html += `
        <div class="card mb-4" style="background:var(--primary-pale)">
          <div class="flex justify-between">
            <span class="text-sm text-muted">共 ${filtered.length} 笔</span>
            <div class="flex gap-4">
              <span class="text-sm">销售额: <span class="font-bold" style="color:var(--success)">¥${totalAmount.toFixed(0)}</span></span>
              <span class="text-sm">利润: <span class="font-bold" style="color:${totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">¥${totalProfit.toFixed(0)}</span></span>
            </div>
          </div>
        </div>
      `;

      filtered.forEach(r => {
        html += this.renderRecordItem(r);
      });

      listEl.innerHTML = html;

      listEl.querySelectorAll('[data-edit-sale]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sale = records.find(r => r.id === btn.dataset.editSale);
          if (sale) this.showSaleForm(target, sale);
        });
      });
      listEl.querySelectorAll('[data-del-sale]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          UI.confirm('确定删除这笔销售记录吗？', () => {
            StorageManager.remove('sales', btn.dataset.delSale);
            UI.toast('已删除');
            this.renderRecords(target);
          });
        });
      });
    };

    renderList();

    target.querySelectorAll('.sl-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        target.querySelectorAll('.sl-filter').forEach(b => {
          b.style.background = '';
          b.style.color = '';
          b.style.border = '1px solid var(--border)';
        });
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        currentFilter = btn.dataset.filter;
        renderList();
      });
    });

    target.querySelector('#sl-month-filter').addEventListener('change', (e) => {
      currentMonth = e.target.value;
      renderList();
    });
  },

  /* ---------- 客户档案 ---------- */
  renderClients(target) {
    const records = StorageManager.get('sales') || [];
    const clientMap = {};

    records.forEach(r => {
      const name = r.clientName || '散客';
      if (!clientMap[name]) {
        clientMap[name] = { name, count: 0, total: 0, category: r.category, lastDate: r.date, channels: new Set() };
      }
      clientMap[name].count++;
      clientMap[name].total += parseFloat(r.amount || 0);
      if (r.date > clientMap[name].lastDate) clientMap[name].lastDate = r.date;
      if (r.channel) clientMap[name].channels.add(r.channel);
    });

    const clients = Object.values(clientMap).sort((a, b) => b.total - a.total);

    let html = `
      <div class="card mb-4">
        <div class="flex justify-between items-center">
          <span class="font-bold">客户档案（${clients.length}）</span>
          <span class="text-sm text-muted">按累计消费排序</span>
        </div>
      </div>
    `;

    if (clients.length === 0) {
      html += UI.emptyState('👥', '还没有客户数据，记几笔销售就能自动生成客户档案了');
    } else {
      clients.forEach(c => {
        const isVip = c.total >= 5000;
        html += `
          <div class="list-item">
            <span style="font-size:20px">${isVip ? '👑' : '👤'}</span>
            <div class="list-item-content">
              <div class="list-item-title">
                ${UI.escape(c.name)}
                ${isVip ? '<span class="tag tag-orange" style="margin-left:4px">VIP</span>' : ''}
                <span class="tag ${c.category === 'tea' ? 'tag-green' : 'tag-blue'}" style="margin-left:4px">${c.category === 'tea' ? '🍵 茶叶' : '🪨 寿山石'}</span>
              </div>
              <div class="list-item-desc">
                ${c.count}笔成交 · 最近：${UI.formatDate(c.lastDate)}
                ${c.channels.size > 0 ? ` · ${Array.from(c.channels).join('/')}` : ''}
              </div>
            </div>
            <div style="text-align:right">
              <div class="font-bold" style="color:var(--success)">¥${c.total.toFixed(0)}</div>
              <div class="text-sm text-muted">累计消费</div>
            </div>
          </div>
        `;
      });
    }

    target.innerHTML = html;
  }
};

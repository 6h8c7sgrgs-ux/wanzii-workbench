/* ===== 应用主入口：路由/导航/口令/全局状态 ===== */

const AppState = {
  currentNav: 'work',
  currentModule: 'shoushan-stone'
};

/* ---------- 渲染左侧导航 ---------- */
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  let html = '<div class="nav-group-label">导航</div>';
  NavGroups.forEach(group => {
    const count = ModuleRegistry.getByNav(group.id).length;
    html += `
      <div class="nav-item ${group.id === AppState.currentNav ? 'active' : ''}" data-nav="${group.id}">
        <span class="nav-icon">${group.icon}</span>
        <span>${group.name}</span>
        ${count > 1 ? `<span class="nav-badge">${count}</span>` : ''}
      </div>
    `;
  });

  // 底部信息
  html += `
    <div style="margin-top:auto;padding:16px 20px;font-size:11px;color:var(--text-hint);border-top:1px solid var(--border-light);">
      <div style="margin-bottom:4px;">💡 口令快速跳转</div>
      <div style="line-height:1.6;">#记账 #打卡 #寿山石<br>#自媒体 #随笔 #冥想</div>
    </div>
  `;
  sidebar.innerHTML = html;

  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.nav);
    });
  });
}

/* ---------- 渲染子模块 Tab ---------- */
function renderSubNav(navId) {
  const subnav = document.getElementById('subnav');
  const modules = ModuleRegistry.getByNav(navId);

  if (modules.length <= 1) {
    subnav.innerHTML = '';
    subnav.style.display = 'none';
    return;
  }

  subnav.style.display = 'flex';
  let html = '';
  modules.forEach(m => {
    html += `
      <div class="subnav-item ${m.id === AppState.currentModule ? 'active' : ''}" data-module="${m.id}">
        ${m.icon} ${m.name}
      </div>
    `;
  });
  subnav.innerHTML = html;

  subnav.querySelectorAll('.subnav-item').forEach(item => {
    item.addEventListener('click', () => {
      AppState.currentModule = item.dataset.module;
      renderSubNav(navId);
      renderModule(item.dataset.module);
    });
  });
}

/* ---------- 渲染模块内容 ---------- */
function renderModule(moduleId) {
  const mod = ModuleRegistry.getModule(moduleId);
  if (!mod) return;
  const container = document.getElementById('module-container');
  container.innerHTML = '';
  try {
    mod.render(container);
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">😵</div><div class="empty-text">这个模块出了点小问题，刷新试试？</div></div>`;
    console.error(`渲染模块 ${moduleId} 失败:`, e);
  }
}

/* ---------- 导航切换 ---------- */
function navigateTo(navId, moduleId) {
  AppState.currentNav = navId;

  // 更新导航高亮
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === navId);
  });

  // 渲染子导航
  const subModules = ModuleRegistry.getByNav(navId);
  const targetModule = moduleId || (subModules.length > 0 ? subModules[0].id : null);

  if (targetModule) {
    AppState.currentModule = targetModule;
  }

  renderSubNav(navId);

  if (targetModule) {
    renderModule(targetModule);
  }
}

/* ---------- 口令处理 ---------- */
function handleCommand(input) {
  const keyword = input.trim();
  if (!keyword) return;

  if (!keyword.startsWith('#')) {
    UI.toast('口令要以 # 开头哦，比如 #记账');
    return;
  }

  const mod = ModuleRegistry.findByKeyword(keyword);
  if (mod) {
    navigateTo(mod.navId, mod.id);
    UI.toast(`已经带你到「${mod.name}」了～`);
  } else {
    UI.toast('没找到对应的模块呢，试试 #记账 #打卡 #寿山石？');
  }
}

/* ---------- 显示当前日期 ---------- */
function updateDate() {
  const now = new Date();
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`;
  document.getElementById('current-date').textContent = dateStr;
}

/* ---------- 应用初始化 ---------- */
function initApp() {
  // 初始化所有模块
  ModuleRegistry.initAll();

  // 渲染界面
  renderSidebar();
  updateDate();
  navigateTo(AppState.currentNav, AppState.currentModule);

  // 搜索框口令
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(e.target.value);
      e.target.value = '';
    }
  });

  // ESC 关闭模态框
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') UI.closeModal();
  });

  console.log('%c🌊 玩子的工作台已启动', 'color:#7EB8DA;font-size:14px;font-weight:bold;');
}

// 启动
document.addEventListener('DOMContentLoaded', initApp);

/* ===== 模块注册中心 - 配置驱动 ===== */
/*
 * 核心设计：所有模块通过统一配置注册
 * 新增/修改/删除模块只需改配置，导航/路由/口令自动同步
 */

const NavGroups = [
  { id: 'work', name: '工作', icon: '💼' },
  { id: 'reading', name: '读书', icon: '📖' },
  { id: 'personal', name: '个人', icon: '🌿' },
  { id: 'checkin', name: '打卡', icon: '✅' },
  { id: 'skills', name: '技能', icon: '🌟' }
];

const ModuleRegistry = {
  modules: [
    // ---------- 工作 ----------
    {
      id: 'shoushan-stone',
      name: '寿山石专区',
      navId: 'work',
      icon: '🪨',
      keywords: ['寿山石', '田黄', '芙蓉石', '奇石', '石头'],
      render: (c) => ShoushanModule.render(c),
      init: () => ShoushanModule.init()
    },
    {
      id: 'tea',
      name: '茶叶专区',
      navId: 'work',
      icon: '🍵',
      keywords: ['茶叶', '茶品', '品鉴', '茶', '库存'],
      render: (c) => TeaModule.render(c),
      init: () => TeaModule.init()
    },
    {
      id: 'media',
      name: '自媒体专区',
      navId: 'work',
      icon: '🎬',
      keywords: ['自媒体', '剪辑', '视频', 'B站', '抖音', '关键词'],
      render: (c) => MediaModule.render(c),
      init: () => MediaModule.init()
    },
    {
      id: 'douyin-hot',
      name: '抖音爆款',
      navId: 'work',
      icon: '🔥',
      keywords: ['抖音', '爆款', '拆解', '热门', '流量', '案例'],
      render: (c) => DouyinHotModule.render(c),
      init: () => DouyinHotModule.init()
    },

    // ---------- 读书 ----------
    {
      id: 'reading',
      name: '读书学习',
      navId: 'reading',
      icon: '📖',
      keywords: ['读书', '诗词', '传统文化', '阅读', '书单', '所思所想', '笔记'],
      render: (c) => ReadingModule.render(c),
      init: () => ReadingModule.init()
    },

    // ---------- 个人 ----------
    {
      id: 'accounting',
      name: '记账台账',
      navId: 'personal',
      icon: '📒',
      keywords: ['记账', '收支', '账单', '财务', '钱'],
      render: (c) => AccountingModule.render(c),
      init: () => AccountingModule.init()
    },
    {
      id: 'memo',
      name: '生活备忘',
      navId: 'personal',
      icon: '📝',
      keywords: ['备忘', '待办', '提醒', 'todo', '备忘录'],
      render: (c) => MemoModule.render(c),
      init: () => MemoModule.init()
    },
    {
      id: 'journal',
      name: '心情随笔',
      navId: 'personal',
      icon: '💖',
      keywords: ['随笔', '心情', '日记', '记录', '心得'],
      render: (c) => JournalModule.render(c),
      init: () => JournalModule.init()
    },
    {
      id: 'long-distance',
      name: '异地恋',
      navId: 'personal',
      icon: '💕',
      keywords: ['异地', '情侣', '旅行', '纪念日', '恋爱', '话术'],
      render: (c) => LongDistanceModule.render(c),
      init: () => LongDistanceModule.init()
    },
    {
      id: 'job-tracker',
      name: '求职归档',
      navId: 'personal',
      icon: '📋',
      keywords: ['求职', '面试', '投递', '简历', '找工作'],
      render: (c) => JobTrackerModule.render(c),
      init: () => JobTrackerModule.init()
    },

    // ---------- 打卡 ----------
    {
      id: 'checkin',
      name: '每日打卡',
      navId: 'checkin',
      icon: '✅',
      keywords: ['打卡', '书法', '英语', '形体', '天鹅臂', '沙漏腰'],
      render: (c) => CheckinModule.render(c),
      init: () => CheckinModule.init()
    },

    // ---------- 技能 ----------
    {
      id: 'skills',
      name: '技能提升',
      navId: 'skills',
      icon: '🌟',
      keywords: ['冥想', '进阶', '情绪', '疏导', '心理', '规划'],
      render: (c) => SkillsModule.render(c),
      init: () => SkillsModule.init()
    }
  ],

  getModule(id) {
    return this.modules.find(m => m.id === id);
  },

  getByNav(navId) {
    return this.modules.filter(m => m.navId === navId);
  },

  findByKeyword(keyword) {
    const kw = keyword.replace('#', '').trim().toLowerCase();
    if (!kw) return null;
    // 精确匹配优先
    let match = this.modules.find(m =>
      m.keywords.some(k => k.toLowerCase() === kw)
    );
    if (match) return match;
    // 模糊匹配
    return this.modules.find(m =>
      m.keywords.some(k => k.toLowerCase().includes(kw) || kw.includes(k.toLowerCase()))
    );
  },

  initAll() {
    this.modules.forEach(m => {
      if (m.init) {
        try { m.init(); } catch (e) { console.error(`模块 ${m.id} 初始化失败:`, e); }
      }
    });
  }
};

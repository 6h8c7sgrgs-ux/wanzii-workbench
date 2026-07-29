/* ===== 预设数据库 - 所有静态内容 ===== */

/* ---------- 自媒体关键词库 ---------- */
const MediaPresets = {
  // 剪辑技巧关键词
  editingTips: [
    { keyword: '转场', desc: '场景切换的过渡技巧，让画面流畅自然', searchTerms: ['转场教程', '无缝转场', '转场技巧合集'] },
    { keyword: '调色', desc: '统一画面色调，营造氛围感', searchTerms: ['调色教程', 'LUT调色', '电影感调色'] },
    { keyword: '卡点', desc: '画面节奏与音乐节拍同步', searchTerms: ['卡点剪辑', '音乐卡点教程', '节奏感剪辑'] },
    { keyword: '字幕', desc: '文字排版与动效设计', searchTerms: ['字幕设计', '动态字幕', '字幕排版技巧'] },
    { keyword: '关键帧', desc: '控制属性变化的动画核心', searchTerms: ['关键帧动画', '关键帧教程', '关键帧进阶'] },
    { keyword: '蒙版', desc: '局部显示与遮挡控制', searchTerms: ['蒙版教程', '蒙版创意', '蒙版转场'] },
    { keyword: '曲线变速', desc: '平滑的快慢节奏变化', searchTerms: ['曲线变速', '变速剪辑', '速度渐变教程'] },
    { keyword: '音效', desc: '环境音与特效音的运用', searchTerms: ['音效素材', '音效运用技巧', '环境音添加'] },
    { keyword: '绿幕抠像', desc: '替换背景的常用技法', searchTerms: ['绿幕教程', '抠像技巧', '绿幕素材'] },
    { keyword: '画面缩放', desc: '推拉镜头感的营造', searchTerms: ['画面缩放', '推拉镜头', '运镜效果'] }
  ],

  // 学习技巧关键词
  learningTips: [
    { keyword: '选题', desc: '找到观众感兴趣的内容方向', searchTerms: ['选题方法', '爆款选题', '选题技巧'] },
    { keyword: '脚本', desc: '视频内容的骨架结构', searchTerms: ['脚本模板', '脚本写作', '分镜头脚本'] },
    { keyword: '标题', desc: '吸引点击的第一要素', searchTerms: ['标题技巧', '爆款标题', '标题公式'] },
    { keyword: '完播率', desc: '视频被看完的比例指标', searchTerms: ['提升完播率', '完播率技巧', '前3秒钩子'] },
    { keyword: '封面设计', desc: '视频的第一视觉印象', searchTerms: ['封面设计', '封面模板', '缩略图制作'] },
    { keyword: '粉丝画像', desc: '了解你的受众群体', searchTerms: ['粉丝分析', '受众画像', '粉丝运营'] },
    { keyword: '流量密码', desc: '平台推荐算法的偏好', searchTerms: ['流量密码', '推荐算法', '涨粉技巧'] },
    { keyword: '对标账号', desc: '学习同领域优秀创作者', searchTerms: ['对标账号', '竞品分析', '拆解同行'] },
    { keyword: '蹭热点', desc: '借势热门话题获取流量', searchTerms: ['蹭热点技巧', '热点追踪', '热门话题'] },
    { keyword: '剪辑节奏', desc: '控制视频的快慢张弛', searchTerms: ['剪辑节奏', '节奏控制', '叙事节奏'] },
    { keyword: '变现路径', desc: '从流量到收益的转化', searchTerms: ['自媒体变现', '变现方式', '带货技巧'] },
    { keyword: '人设打造', desc: '建立独特的个人品牌', searchTerms: ['人设打造', '个人IP', '人设定位'] }
  ],

  // 视频关键词推荐模板
  keywordTemplates: {
    suffixes: ['教程', '入门', '进阶', '合集', '干货', '实操', '避坑', '零基础', '保姆级', '2024最新'],
    prefixes: ['新手必看', '保姆级', '一学就会', '从小白到大神'],
    platforms: {
      bilibili: 'https://search.bilibili.com/all?keyword=',
      douyin: 'https://www.douyin.com/search/',
      youtube: 'https://www.youtube.com/results?search_query='
    }
  }
};

/* ---------- 寿山石分类 ---------- */
const ShoushanTypes = [
  { name: '田黄石', desc: '寿山石中的王者，温润如玉，有萝卜丝纹' },
  { name: '芙蓉石', desc: '质地温润细腻，色彩丰富，有"石后"之称' },
  { name: '善伯洞', desc: '晶莹凝润，有善伯晶、善伯尾等细分' },
  { name: '水洞石', desc: '通灵凝腻，有红、黄、白多色' },
  { name: '高山石', desc: '产量较大，色彩多样，质地温润' },
  { name: '荔枝洞', desc: '质地通灵，有萝卜丝纹，近年备受追捧' },
  { name: '旗降石', desc: '坚韧凝腻，色泽深沉，适合把玩' },
  { name: '汶洋石', desc: '质地细腻，色泽淡雅，有冰纹' }
];

/* ---------- 茶叶分类 ---------- */
const TeaTypes = [
  { name: '白茶', subtypes: ['白毫银针', '白牡丹', '寿眉', '贡眉'] },
  { name: '普洱', subtypes: ['生普', '熟普', '老茶头', '古树茶'] },
  { name: '乌龙', subtypes: ['铁观音', '大红袍', '单丛', '冻顶乌龙'] },
  { name: '红茶', subtypes: ['正山小种', '金骏眉', '滇红', '祁红'] },
  { name: '绿茶', subtypes: ['龙井', '碧螺春', '毛峰', '瓜片'] },
  { name: '黑茶', subtypes: ['安化黑茶', '六堡茶', '茯砖'] },
  { name: '黄茶', subtypes: ['君山银针', '霍山黄芽'] },
  { name: '花茶', subtypes: ['茉莉花茶', '玫瑰红茶', '桂花乌龙'] }
];

/* ---------- 情侣旅行地推荐库 ---------- */
const TravelDestinations = [
  { name: '厦门', desc: '海风鼓浪屿，文艺小清新的浪漫', tags: ['海边', '文艺', '美食'], budget: '中等', season: '春秋', days: '3-4天' },
  { name: '大理', desc: '苍山洱海，风花雪月的慢生活', tags: ['自然', '慢生活', '摄影'], budget: '中等', season: '春秋', days: '4-5天' },
  { name: '苏州', desc: '小桥流水人家，江南园林的温婉', tags: ['园林', '古镇', '文化'], budget: '中等', season: '春秋', days: '2-3天' },
  { name: '成都', desc: '美食天堂，悠闲巴适的烟火气', tags: ['美食', '慢生活', '熊猫'], budget: '低', season: '四季', days: '3-4天' },
  { name: '三亚', desc: '椰风海韵，热带海岛的甜蜜', tags: ['海边', '度假', '阳光'], budget: '高', season: '冬', days: '4-5天' },
  { name: '丽江', desc: '古城漫步，雪山下的浪漫时光', tags: ['古镇', '自然', '雪山'], budget: '中等', season: '春秋', days: '3-4天' },
  { name: '杭州', desc: '西湖月色，断桥不断情不断', tags: ['湖泊', '文艺', '茶'], budget: '中等', season: '春秋', days: '2-3天' },
  { name: '青岛', desc: '红瓦绿树碧海蓝天，啤酒与海风', tags: ['海边', '啤酒', '建筑'], budget: '中等', season: '夏', days: '2-3天' },
  { name: '西安', desc: '千年古都，一起穿越历史长河', tags: ['历史', '美食', '文化'], budget: '低', season: '春秋', days: '3-4天' },
  { name: '拉萨', desc: '离天空最近的地方，心灵的净化', tags: ['高原', '信仰', '自然'], budget: '高', season: '夏秋', days: '5-7天' },
  { name: '重庆', desc: '山城夜景洪崖洞，麻辣火锅的浪漫', tags: ['美食', '夜景', '山城'], budget: '低', season: '春秋冬', days: '3-4天' },
  { name: '北海', desc: '银滩落日，小众安静的海边时光', tags: ['海边', '小众', '安静'], budget: '低', season: '夏秋', days: '3天' }
];

/* ---------- 相处话术库 ---------- */
const PhrasePresets = {
  categories: [
    {
      name: '日常关心',
      icon: '☀️',
      phrases: [
        '今天辛苦啦，记得按时吃饭哦',
        '有没有好好休息？别太拼了',
        '天气变凉了，多穿一件',
        '今天开心吗？跟我说说',
        '别忘了喝水，你总是忘'
      ]
    },
    {
      name: '想念表达',
      icon: '🌙',
      phrases: [
        '突然好想你，你在做什么呢',
        '今天看到一样东西就想到你了',
        '数着日子等下次见面',
        '昨晚梦到你了，醒来有点失落',
        '好想抱抱你呀'
      ]
    },
    {
      name: '鼓励打气',
      icon: '💪',
      phrases: [
        '你可以的，我一直相信你',
        '别灰心，你已经很棒了',
        '累了就歇歇，有我在呢',
        '失败了也没关系，大不了重新来',
        '你的努力我都看在眼里'
      ]
    },
    {
      name: '化解矛盾',
      icon: '🤝',
      phrases: [
        '我们先冷静一下，然后再聊好吗',
        '我不想吵架，因为我在乎你',
        '是我不好，没有考虑到你的感受',
        '我们各退一步好不好',
        '比起对错，我更不想失去你'
      ]
    },
    {
      name: '甜蜜日常',
      icon: '🍯',
      phrases: [
        '今天的你也一样可爱',
        '和你在一起的每一天都很珍贵',
        '你笑起来的样子真好看',
        '遇见你是最幸运的事',
        '想和你一起吃好多好多顿饭'
      ]
    }
  ]
};

/* ---------- 打卡项目配置 ---------- */
const CheckinProjects = [
  {
    id: 'calligraphy',
    name: '颜真卿书法',
    emoji: '🖌️',
    icon: '🖌️',
    desc: '临摹颜体楷书，感受笔画的浑厚大气',
    photo: {
      themes: ['毛笔特写', '墨迹纹理', '书法作品全景', '习字过程', '纸墨光影', '文房四宝摆拍'],
      tips: ['侧光拍摄突出笔触质感', '俯拍构图展现整体布局', '微距拍摄墨迹渗透效果', '暖色调灯光营造书卷气']
    }
  },
  {
    id: 'english',
    name: '英语口语',
    emoji: '🗣️',
    icon: '🗣️',
    desc: '每日跟读练习，打破开口恐惧',
    photo: {
      themes: ['口语练习场景', '学习笔记排版', '英语书籍摆拍', 'APP学习界面', '跟读口型特写', '学习桌面'],
      tips: ['自然光下拍摄学习场景', '加入绿植或咖啡增加生活感', '用三分法构图突出主体', '俯拍桌面铺排更有层次']
    }
  },
  {
    id: 'fitness',
    name: '沙漏腰天鹅臂',
    emoji: '💪',
    icon: '💪',
    desc: '形体训练，雕刻优雅身姿',
    photo: {
      themes: ['形体对比照', '训练动作分解', '瑜伽垫场景', '运动装备', '饮食搭配', '训练打卡记录'],
      tips: ['对镜自拍注意光线均匀', '同一角度方便前后对比', '暖色调增加温馨感', '侧面剪影更突显线条']
    }
  }
];

/* ---------- 冥想引导文案 ---------- */
const MeditationGuides = {
  morning: [
    {
      title: '晨光呼吸',
      duration: '约5分钟',
      desc: '用几次深呼吸唤醒身体，迎接新的一天',
      steps: [
        '找个舒服的地方坐好，轻轻闭上眼睛',
        '深吸一口气，感受清晨的空气慢慢填满胸腔',
        '缓缓呼出，想象把一夜的浊气都带走了',
        '再来一次，吸气时告诉自己"新的一天开始了"',
        '呼气时放松肩膀，感受身体一点一点醒过来',
        '重复5次，然后慢慢睁开眼睛，微笑着开始今天'
      ]
    },
    {
      title: '正念启动',
      duration: '约8分钟',
      desc: '设定今天的意图，带着觉察生活',
      steps: [
        '坐直身体，双手放在膝盖上，感受坐姿的稳定',
        '做三次深呼吸，每次都比上一次更慢一些',
        '把注意力放在当下，感受此刻的安静',
        '问问自己：今天我想成为什么样的人？',
        '不需要答案，让这个念头在心里自然浮现',
        '带着这份觉察，慢慢开始今天的第一个动作'
      ]
    },
    {
      title: '感恩晨练',
      duration: '约6分钟',
      desc: '从感恩开始，让一天充满暖意',
      steps: [
        '闭上眼睛，做几次自然的呼吸',
        '想一想今天有什么值得感恩的事',
        '哪怕是很小的事——阳光很好、睡了个好觉',
        '让感恩的感觉在胸口蔓延开来',
        '深吸一口气，把这份温暖吸进身体里',
        '呼气时带着微笑，准备好迎接今天了'
      ]
    }
  ],
  evening: [
    {
      title: '静夜放松',
      duration: '约8分钟',
      desc: '放下一天的疲惫，让身心归于平静',
      steps: [
        '躺在床上或靠在枕头上，全身放松',
        '从脚趾开始，一点一点向上放松每个部位',
        '感受脚、小腿、大腿逐渐变得沉重',
        '放松腹部、胸口、肩膀——肩膀最容易紧绷',
        '放松手臂、脖子、脸部肌肉',
        '想象自己躺在一片柔软的云朵上，慢慢飘'
      ]
    },
    {
      title: '今日回顾',
      duration: '约10分钟',
      desc: '温柔地回望今天，不带评判地接受一切',
      steps: [
        '闭上眼睛，做几次缓慢的呼吸',
        '像放电影一样回顾今天发生的事',
        '不需要判断好坏，只是观察',
        '有什么让你开心的事？在心里感谢它',
        '有什么让你烦心的事？告诉自己"已经过去了"',
        '深呼吸，把今天轻轻放下，给自己一个拥抱'
      ]
    },
    {
      title: '身体扫描',
      duration: '约12分钟',
      desc: '从头到脚感受身体，释放每一处紧张',
      steps: [
        '平躺好，双手放在身体两侧，掌心朝上',
        '把注意力放在头顶，感受头皮的触感',
        '慢慢移到额头、眼睛、嘴巴，放松每一块面部肌肉',
        '感受脖子后方是否紧绷，让它沉入枕头',
        '移到肩膀、手臂、手指，感觉手指微微发热',
        '注意胸腔的起伏，跟着呼吸的节奏',
        '感受腹部、腰部是否贴着床面',
        '移到臀部、大腿、小腿，最后到脚趾',
        '全身扫描完毕，享受此刻的松弛感'
      ]
    }
  ]
};

/* ---------- 打卡进阶规划 ---------- */
const AdvancementPlans = {
  calligraphy: [
    {
      phase: '入门期',
      time: '第1-2周',
      goal: '建立手感，掌握基本笔画',
      tasks: ['每天临摹2页基本笔画', '掌握横竖撇捺的运笔', '了解颜体楷书的基本特征', '选一本合适的字帖']
    },
    {
      phase: '进阶期',
      time: '第3-6周',
      goal: '从笔画到结构，尝试完整字形',
      tasks: ['开始临写单字', '注意字形结构和比例', '研究颜体的"外拓"特征', '尝试不同宣纸的感受']
    },
    {
      phase: '提升期',
      time: '第7-12周',
      goal: '章法布局，形成个人理解',
      tasks: ['临写经典碑帖段落', '注意整幅作品的章法', '尝试集字创作', '多看展览和名家作品']
    },
    {
      phase: '创作期',
      time: '第13周+',
      goal: '独立创作，融入个人风格',
      tasks: ['尝试完整作品创作', '参加书法交流活动', '研究不同书体的借鉴', '形成自己的书写节奏']
    }
  ],
  english: [
    {
      phase: '入门期',
      time: '第1-2周',
      goal: '建立开口习惯，纠正基础发音',
      tasks: ['每天跟读15分钟', '用配音APP练习简单片段', '纠正最常错的音标', '积累50个日常句型']
    },
    {
      phase: '进阶期',
      time: '第3-6周',
      goal: '从跟读到复述，提升流畅度',
      tasks: ['开始影子跟读训练', '尝试复述短文和视频', '练习即兴表达1分钟', '每天录音自评']
    },
    {
      phase: '提升期',
      time: '第7-12周',
      goal: '真实场景对话，拓展话题',
      tasks: ['找语伴或外教练习', '准备5个话题的深度表达', '看英文视频尝试总结', '模拟面试场景']
    },
    {
      phase: '应用期',
      time: '第13周+',
      goal: '自然交流，融入生活',
      tasks: ['日常用英语自言自语', '参加英语角或线上社群', '尝试用英语写日记', '看英文原版影视']
    }
  ],
  fitness: [
    {
      phase: '适应期',
      time: '第1-2周',
      goal: '建立运动习惯，不追求强度',
      tasks: ['每天15分钟天鹅臂', '动作不求标准求连贯', '建立固定时间运动的习惯', '拍照记录初始状态']
    },
    {
      phase: '强化期',
      time: '第3-6周',
      goal: '提升动作质量，加入沙漏腰训练',
      tasks: ['每天25分钟综合训练', '追求动作标准到位', '配合呼吸节奏', '加入核心力量训练']
    },
    {
      phase: '巩固期',
      time: '第7-12周',
      goal: '稳定训练量，看到体型变化',
      tasks: ['每天30分钟系统训练', '加入弹力带辅助', '记录三围变化', '调整饮食配合']
    },
    {
      phase: '精进期',
      time: '第13周+',
      goal: '精雕细琢，保持长期习惯',
      tasks: ['设计个人训练方案', '加入普拉提进阶', '每月对比照记录', '把运动变成生活方式']
    }
  ]
};

/* ---------- 情绪疏导建议库 ---------- */
const EmotionGuidance = {
  happy: {
    label: '开心',
    emoji: '😄',
    color: 'tag-green',
    advice: [
      '开心的时候好好享受，这就是生活的礼物呀',
      '把这份快乐记下来，不开心的时候翻出来看看',
      '开心的时候别忘了和重要的人分享',
      '今天的你闪闪发光，继续保持这个状态'
    ]
  },
  calm: {
    label: '平静',
    emoji: '😌',
    color: 'tag-blue',
    advice: [
      '平静是一种很棒的状态，说明你和自己相处得很好',
      '趁这会儿做点需要专注的事，效率会很高',
      '享受这份安宁，不是每天都有这样的时刻',
      '把这种平和的感觉记住，下次烦躁时可以找回来'
    ]
  },
  sad: {
    label: '难过',
    emoji: '😢',
    color: 'tag-blue',
    advice: [
      '难过的时候就允许自己难过，情绪来了也会走的',
      '听一首喜欢的歌，或者翻翻以前开心的照片',
      '如果想哭就哭出来，眼泪是一种释放',
      '给自己写一封信，把心里的话都说出来',
      '记得你不是一个人，有人在乎你'
    ]
  },
  anxious: {
    label: '焦虑',
    emoji: '😰',
    color: 'tag-orange',
    advice: [
      '试试478呼吸法：吸气4秒、屏气7秒、呼气8秒，重复几次',
      '把焦虑的事写下来，你会发现它其实没那么可怕',
      '去做一件小事，哪怕是整理桌面，动起来心就静了',
      '问问自己：这件事一周后还重要吗？一个月后呢？',
      '把注意力拉回当下，感受此刻你正在呼吸'
    ]
  },
  excited: {
    label: '兴奋',
    emoji: '🤩',
    color: 'tag-purple',
    advice: [
      '好好享受这份激动，但别急着做重大决定',
      '把让你兴奋的事记下来，这是一个好的能量',
      '用这份热情去做点有创造力的事吧',
      '分享给你信任的人，快乐会加倍'
    ]
  },
  angry: {
    label: '生气',
    emoji: '😤',
    color: 'tag-red',
    advice: [
      '先做10次深呼吸，让身体从"战斗模式"退出来',
      '离开让你生气的场景，去走走或喝杯水',
      '把愤怒写下来，写完撕掉，情绪就释放了一大半',
      '等冷静下来再沟通，人在生气时说的话往往后悔',
      '问问自己：真正让你生气的是这件事，还是别的事？'
    ]
  },
  tired: {
    label: '疲惫',
    emoji: '🥱',
    color: 'tag-blue',
    advice: [
      '累了就休息，这不是偷懒，是对自己负责',
      '放下手机，闭眼躺10分钟，世界不会塌',
      '今天的你已经在很努力了，允许自己慢下来',
      '想想有什么是可以明天再做的，给今晚留点空间',
      '泡个脚或洗个热水澡，让身体知道可以放松了'
    ]
  },
  lonely: {
    label: '孤独',
    emoji: '🥺',
    color: 'tag-purple',
    advice: [
      '孤独不可怕，它是和自己对话的机会',
      '给自己泡杯茶，看本好书，独处也可以很温暖',
      '翻翻通讯录，找个想聊的人发条消息',
      '出门走走，哪怕只是去便利店，接触人气也好',
      '记住：一个人的时光也是生活的一部分，值得被善待'
    ]
  }
};

/* ---------- 记账分类预设 ---------- */
const AccountingCategories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '社交', '其他'],
  income: ['工资', '兼职', '理财', '红包', '其他']
};

/* ---------- 英语口语练习片段库 ---------- */
const EnglishPracticeSnippets = [
  // 基础
  { level: '基础', topic: '日常问候', text: "Hi, how are you doing today? I hope everything goes well.", translation: "嗨，你今天怎么样？希望一切顺利。" },
  { level: '基础', topic: '点餐', text: "I'd like a cup of coffee with milk, please. And a sandwich.", translation: "请给我一杯加奶的咖啡，再来一个三明治。" },
  { level: '基础', topic: '问路', text: "Excuse me, could you tell me how to get to the nearest subway station?", translation: "打扰一下，请问最近的地铁站怎么走？" },
  { level: '基础', topic: '购物', text: "How much is this? Can I pay by credit card?", translation: "这个多少钱？可以刷信用卡吗？" },
  { level: '基础', topic: '天气', text: "The weather is nice today. Let's go for a walk in the park.", translation: "今天天气不错，我们去公园散散步吧。" },
  { level: '基础', topic: '自我介绍', text: "My name is Lisa. I'm from China and I love reading books.", translation: "我叫丽莎，来自中国，我喜欢读书。" },
  // 进阶
  { level: '进阶', topic: '工作交流', text: "I think we should schedule a meeting to discuss the project timeline.", translation: "我觉得我们应该安排一个会议来讨论项目时间线。" },
  { level: '进阶', topic: '表达观点', text: "In my opinion, the key to success is consistency and patience.", translation: "在我看来，成功的关键是坚持和耐心。" },
  { level: '进阶', topic: '旅行', text: "I'm planning to visit Japan next spring. Do you have any recommendations?", translation: "我打算明年春天去日本旅行，你有什么推荐吗？" },
  { level: '进阶', topic: '社交', text: "It's been a while! We should catch up over coffee sometime.", translation: "好久不见了！我们应该找个时间喝杯咖啡叙叙旧。" },
  { level: '进阶', topic: '健康', text: "I've been trying to exercise more and eat healthier food lately.", translation: "我最近一直在努力多运动、吃更健康的食物。" },
  { level: '进阶', topic: '情感', text: "I really appreciate your help. You've been so supportive.", translation: "真的很感谢你的帮助，你一直这么支持我。" },
  // 挑战
  { level: '挑战', topic: '职场演讲', text: "Today I'd like to share with you our team's achievements over the past quarter.", translation: "今天我想和大家分享我们团队过去一个季度的成果。" },
  { level: '挑战', topic: '深度讨论', text: "What fascinates me most about this topic is how it connects to our daily lives in unexpected ways.", translation: "这个话题最吸引我的地方在于，它以意想不到的方式与我们的日常生活相连。" },
  { level: '挑战', topic: '讲故事', text: "When I was young, my grandmother used to tell me stories that shaped who I am today.", translation: "小时候，奶奶常给我讲故事，那些故事塑造了今天的我。" },
  { level: '挑战', topic: '表达复杂观点', text: "While I understand your perspective, I believe there's another angle we should consider.", translation: "虽然我理解你的观点，但我认为还有另一个角度值得我们考虑。" },
  { level: '挑战', topic: '面试', text: "My greatest strength is my ability to learn quickly and adapt to new challenges.", translation: "我最大的优势是快速学习和适应新挑战的能力。" },
  { level: '挑战', topic: '日常复述', text: "So what you're saying is that we need to finish the report before Friday, right?", translation: "所以你的意思是我们需要在周五之前完成报告，对吗？" }
];

/* ---------- 颜真卿书法笔法讲解关键词库 ---------- */
const CalligraphyTechniques = [
  { keyword: '颜真卿 基本笔画 横竖撇捺', name: '基本笔画', desc: '横竖撇捺的运笔方法与起收笔技巧', level: '入门' },
  { keyword: '颜真卿 永字八法 讲解', name: '永字八法', desc: '一字含八法，楷书笔法的经典入门', level: '入门' },
  { keyword: '颜真卿 多宝塔碑 临摹教程', name: '多宝塔碑', desc: '颜体楷书入门第一碑，结构严谨', level: '入门' },
  { keyword: '颜真卿 颜勤礼碑 讲解', name: '颜勤礼碑', desc: '颜体晚年代表作，雄浑大气', level: '进阶' },
  { keyword: '颜体楷书 结构规律', name: '结构规律', desc: '字形结构、布白与比例关系', level: '进阶' },
  { keyword: '颜真卿 提按运笔 技法', name: '提按运笔', desc: '笔画的粗细变化与节奏控制', level: '进阶' },
  { keyword: '颜真卿 藏锋露锋 用笔', name: '藏锋与露锋', desc: '起笔收笔的锋芒处理', level: '进阶' },
  { keyword: '颜体 中宫宽绰 特点', name: '中宫宽绰', desc: '颜体字形外拓、中宫宽松的特征', level: '提升' },
  { keyword: '颜真卿 行书 祭侄文稿', name: '祭侄文稿', desc: '天下第二行书，情感与笔法的融合', level: '提升' },
  { keyword: '颜体 顿笔 折笔 技巧', name: '顿笔与折笔', desc: '转折处的笔法处理与力量控制', level: '提升' },
  { keyword: '颜真卿 争座位帖 赏析', name: '争座位帖', desc: '颜体行书代表作，笔意纵横', level: '高阶' },
  { keyword: '颜体 虚实结合 章法', name: '虚实与章法', desc: '整幅作品的疏密、虚实、节奏布局', level: '高阶' }
];


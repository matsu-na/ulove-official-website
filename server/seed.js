export const EVENT = {
  name: '有谷漫展',
  nameEn: 'YOUGU EXPO',
  edition: 'VOL. 04',
  dates: '2026.12.19 — 12.21',
  dateShort: '12.19—12.21',
  venue: '上海 · 国家会展中心',
  hall: '5.2H / 6.2H',
  target: '2026-12-19T09:00:00+08:00',
}

export const NEWS_CATEGORIES = ['全部', '官方公告', '票务', '活动', '市集', '联动', '招募']

export const news = [
  {
    id: 'full-lineup-2026',
    title: '有谷漫展 2026 全阵容公开：在冬天，造一座热爱的山谷',
    category: '官方公告',
    date: '2026.11.20',
    readTime: '6 min',
    author: '有谷组委会',
    featured: true,
    excerpt:
      '第四届有谷漫展正式定档 12 月 19 日至 21 日。三大展馆、两块主舞台、六个主题区域，以及一份写给所有同好者的冬日邀请。',
    cover: { variant: 'eye', label: 'ALL STARS', accent: 'lime' },
    tags: ['全阵容', '定档', '山谷计划'],
    content: [
      {
        type: 'p',
        text: '我们花了十一个月，把「山谷」从一个模糊的念头，变成一张可以走进去的地图。第四届有谷漫展将于 2026 年 12 月 19 日至 21 日，在上海国家会展中心 5.2H / 6.2H 举办。',
      },
      { type: 'h2', text: '三天，三种抵达热爱的路径' },
      {
        type: 'p',
        text: '今年的主题是「山谷回响」。我们把展会分成原画展、同人市集、声优与创作者舞台、痛车与谷子交换、独立游戏、夜场 Live 六个区域。你可以一整天只待在同人区，也可以从早到晚像通关一样跑完所有舞台。',
      },
      {
        type: 'quote',
        text: '山谷不是一个地方，而是一群人决定为同一件小事认真一次。',
      },
      { type: 'h2', text: '我们为第一次来的人准备了什么' },
      {
        type: 'list',
        items: [
          '清晰的动线地图与「社恐友好」休息区，随时可以停下来喘口气。',
          '每日 200 份新手导览包，含集章册、场刊与限定贴纸。',
          '无障碍通道、母婴室与行李寄存，让抵达本身不成为门槛。',
          '散场后的夜间接驳车，覆盖主要地铁站与市区三个方向。',
        ],
      },
      {
        type: 'p',
        text: '完整嘉宾阵容、舞台日程、票务信息将在接下来的三周内陆续公布。把 12 月的第三个周末留给我们，也留给那个仍然愿意为热爱排队的自己。',
      },
    ],
  },
  {
    id: 'early-bird-ticket',
    title: '早鸟票 11.28 开售｜这一次，把入场券做成收藏品',
    category: '票务',
    date: '2026.11.18',
    readTime: '4 min',
    author: '票务组',
    featured: false,
    excerpt:
      '限量 2026 套早鸟票，附赠主视觉烫银票根与三周年纪念镭射贴纸。11 月 28 日 20:00，山谷见。',
    cover: { variant: 'ticket', label: 'EARLY BIRD', accent: 'coral' },
    tags: ['早鸟票', '限量', '票根'],
    content: [
      {
        type: 'p',
        text: '每一届有谷的票根，都会被很多人留到最后。今年我们干脆把它做成了一件值得收藏的小东西：烫银编号、可撕票根、背面印着第四届主视觉的线稿。',
      },
      { type: 'h2', text: '开票信息' },
      {
        type: 'list',
        items: [
          '早鸟单日票：¥128（限量 2026 套）',
          '早鸟三日通票：¥328（含限定票夹）',
          '开售时间：2026 年 11 月 28 日 20:00',
          '购票渠道：有谷漫展官方小程序 / 大麦 / 哔哩哔哩会员购',
        ],
      },
      {
        type: 'p',
        text: '早鸟票售罄后将开放常规票。所有票种均为实名制，入场时请携带购票时填写的有效证件。',
      },
      {
        type: 'quote',
        text: '请通过官方渠道购票。不要从陌生人手里购买转赠票，山谷不希望你带着风险来见面。',
      },
    ],
  },
  {
    id: 'stage-schedule',
    title: '舞台日程首曝：从清晨到深夜的热爱接力',
    category: '活动',
    date: '2026.11.15',
    readTime: '5 min',
    author: '内容组',
    featured: false,
    excerpt:
      '主舞台、次舞台与夜场 Live 三日日程公开。声优对谈、创作者分享、随机舞蹈与「星屑回响」特别演出。',
    cover: { variant: 'sun', label: 'MAIN STAGE', accent: 'violet' },
    tags: ['舞台', '日程', 'Live'],
    content: [
      {
        type: 'p',
        text: '从 12 月 19 日早上十点的开场，到最后一天晚上九点的谢幕，两块舞台会持续运转。我们把日程做成了一份可以随身携带的「热爱时刻表」。',
      },
      { type: 'h2', text: '主舞台看点' },
      {
        type: 'list',
        items: [
          '12.19 11:00｜开幕式 & 主视觉创作者对谈',
          '12.19 15:30｜「声音的形状」声优主题分享',
          '12.20 13:00｜有谷创作者大会：从热爱到职业',
          '12.20 19:00｜夜场 Live「星屑回响」',
          '12.21 16:00｜随机舞蹈年度总决赛 & 闭幕式',
        ],
      },
      { type: 'h2', text: '观演提示' },
      {
        type: 'p',
        text: '主舞台区域自由入场，坐席有限，先到先得。夜场 Live 需单独购买夜场票。所有舞台活动将在官方直播间同步播出。',
      },
    ],
  },
  {
    id: 'doujin-market-list',
    title: '同人市集入选名单公布，320 个摊位等你逛',
    category: '市集',
    date: '2026.11.11',
    readTime: '3 min',
    author: '市集组',
    featured: false,
    excerpt:
      '本届共收到 1,186 份摊位申请，最终入选 320 个摊位。原创插画、手作、独立出版与同人志，一次逛够。',
    cover: { variant: 'grid', label: 'DOUJIN 320', accent: 'yellow' },
    tags: ['同人市集', '摊主名单', '原创'],
    content: [
      {
        type: 'p',
        text: '感谢每一份认真填写的申请表。我们最终选出 320 个摊位，其中 46% 是第一次参加有谷的新摊主。原创与同人比例约为 6:4，也保留了大家很喜欢的「手作与独立出版」专区。',
      },
      { type: 'h2', text: '摊主查询' },
      {
        type: 'p',
        text: '完整名单与摊位分布图将在 11 月 25 日上线。入选邮件已陆续发出，请注意查收垃圾邮件箱。未入选的申请者将自动进入候补名单，如有退摊会第一时间联系你。',
      },
      {
        type: 'list',
        items: [
          'A 区｜原创插画与画集',
          'B 区｜同人志与独立出版',
          'C 区｜手作、谷子与生活杂货',
          'D 区｜新摊主实验区 & 创作者驻场',
        ],
      },
      { type: 'quote', text: '请尊重每一位创作者的劳动。拍照前先问一句，不购买也请温柔地说谢谢。' },
    ],
  },
  {
    id: 'metro-collab',
    title: '有谷 × 城市地铁：把喜欢的角色带上通勤路',
    category: '联动',
    date: '2026.11.06',
    readTime: '4 min',
    author: '品牌组',
    featured: false,
    excerpt:
      '11 月 30 日起，主题列车将在地铁 2 号线与 17 号线限时运行，还有 6 座「山谷车站」等待打卡。',
    cover: { variant: 'train', label: 'CITY LINE', accent: 'sky' },
    tags: ['城市联动', '主题列车', '打卡'],
    content: [
      {
        type: 'p',
        text: '漫展不只在展馆里。我们和城市地铁一起，把四位原创角色的日常搬进了车厢：赶早班车的困倦、戴上耳机的那一站、和陌生同好对视时的微笑。',
      },
      { type: 'h2', text: '联动打卡点' },
      {
        type: 'list',
        items: [
          '主题列车：2 号线、17 号线，11.30—12.21 限时运行',
          '山谷车站：静安寺、人民广场、南京东路、虹桥火车站等 6 站',
          '集章活动：集满 3 枚站章，可在漫展现场兑换限定透卡',
        ],
      },
      {
        type: 'p',
        text: '列车班次与打卡地图将在活动前一周公布。拍照时请留意站内安全提示，不要在站台边缘停留。',
      },
    ],
  },
  {
    id: 'volunteer-recruit',
    title: '志愿者招募｜成为山谷里的一束光',
    category: '招募',
    date: '2026.10.30',
    readTime: '3 min',
    author: '志愿者团队',
    featured: false,
    excerpt:
      '我们需要 120 位伙伴，负责引导、舞台协助、媒体接待与机动支持。你会得到一张工作证、两顿热饭和一群新朋友。',
    cover: { variant: 'star', label: 'JOIN THE CREW', accent: 'lime' },
    tags: ['志愿者', '招募', '幕后'],
    content: [
      {
        type: 'p',
        text: '每一届有谷，最常被问到的不是「嘉宾是谁」，而是「你们还缺人吗」。今年，我们开放 120 个志愿者名额，邀请你从另一种视角走进山谷。',
      },
      { type: 'h2', text: '你需要做什么' },
      {
        type: 'list',
        items: [
          '观众引导与问询：成为大家最先遇到的善意。',
          '舞台协助：后台递麦、计时、引导上下场。',
          '媒体与嘉宾接待：让远道而来的人感到被照顾。',
          '机动支持：哪里需要就去哪里，接受现场的不可预测。',
        ],
      },
      { type: 'h2', text: '我们提供' },
      {
        type: 'p',
        text: '志愿者工作证、每日两餐、交通补贴、限定纪念卫衣，以及一次把「喜欢」变成行动的体验。完成服务后，你将获得官方志愿者证书。',
      },
      { type: 'p', text: '报名截止至 11 月 20 日 23:59，面试将以线上方式进行。' },
    ],
  },
  {
    id: 'night-live',
    title: '夜场 Live 特别企划「星屑回响」',
    category: '活动',
    date: '2026.10.26',
    readTime: '4 min',
    author: '音乐企划组',
    featured: false,
    excerpt:
      '12 月 20 日晚，四组音乐人与一支现场乐队，把展馆变成一座会发光的山谷。仅有 1,500 个席位。',
    cover: { variant: 'moon', label: 'NIGHT LIVE', accent: 'pink' },
    tags: ['夜场', 'Live', '音乐'],
    content: [
      {
        type: 'p',
        text: '白天的展馆属于奔跑、排队和偶遇，夜晚则属于音乐。12 月 20 日 19:00，夜场 Live「星屑回响」将在 6.2H 主舞台开启。',
      },
      { type: 'h2', text: '演出阵容' },
      {
        type: 'p',
        text: '四组风格各异的音乐人，将以「从城市到山谷」为线索，带来 100 分钟的连续演出。现场配置全编制乐队与灯光装置，部分曲目为本次漫展特别编曲。',
      },
      {
        type: 'quote',
        text: '请允许自己在黑暗里大声唱一次。反正第二天，我们谁也不记得谁跑调了。',
      },
      { type: 'h2', text: '票务与入场' },
      {
        type: 'p',
        text: '夜场票单独发售，限量 1,500 张，不包含日场门票。演出结束后安排三班接驳车前往市区。',
      },
    ],
  },
  {
    id: 'accessibility-guide',
    title: '无障碍观展指南：让每个人都能抵达热爱',
    category: '官方公告',
    date: '2026.10.20',
    readTime: '5 min',
    author: '观众体验组',
    featured: false,
    excerpt:
      '我们整理了场馆无障碍设施、辅助服务与低刺激时段。希望山谷对每一个想进来的人，都尽量友好。',
    cover: { variant: 'wave', label: 'EVERYONE WELCOME', accent: 'violet' },
    tags: ['无障碍', '观展指南', '友好'],
    content: [
      {
        type: 'p',
        text: '「友好」不应该只出现在宣传语里。以下是本届展会的无障碍与友好观展信息。如果你还有别的需要，欢迎随时联系我们。',
      },
      { type: 'h2', text: '场馆设施' },
      {
        type: 'list',
        items: [
          '所有入口均设有无障碍坡道，5.2H 与 6.2H 之间有无障碍连廊。',
          '馆内提供 20 台轮椅免费借用，需提前 48 小时预约。',
          '设有无障碍卫生间、母婴室与安静休息室。',
          '导盲犬可进入所有公共区域。',
        ],
      },
      { type: 'h2', text: '低刺激时段' },
      {
        type: 'p',
        text: '每日 09:00—10:00 为低刺激时段：主舞台音量降低，频闪灯光关闭，人流引导优先。需要安静环境的观众可以在这段时间优先入场。',
      },
      {
        type: 'p',
        text: '如需预约轮椅、手语翻译或陪同服务，请发送邮件至 access@yougu-expo.cn，或致电 021-6688-1219。',
      },
    ],
  },
]

export const guests = [
  {
    name: '阿柚 Ayu',
    role: '插画师 / 主视觉',
    line: '把日常画成一场柔软的冒险。',
    tone: 'lime',
    mark: '柚',
    tag: '主视觉',
  },
  {
    name: '夜行电台',
    role: '唱见组合',
    line: '在午夜之后，把心跳调成同一频率。',
    tone: 'violet',
    mark: '夜',
    tag: '夜场 Live',
  },
  {
    name: '小满 Mian',
    role: '配音演员',
    line: '声音是角色递给世界的第一张名片。',
    tone: 'coral',
    mark: '满',
    tag: '舞台对谈',
  },
  {
    name: '北岛 Hako',
    role: '漫画家',
    line: '用分镜收藏那些没说出口的瞬间。',
    tone: 'sky',
    mark: '北',
    tag: '创作者大会',
  },
]

export const schedule = [
  {
    day: 'DAY 1',
    date: '12.19',
    weekday: '周六',
    items: [
      { time: '09:00', title: '观众入场 · 山谷集章开始', place: '全馆', type: 'OPEN' },
      { time: '11:00', title: '开幕式 & 主视觉创作者对谈', place: '主舞台', type: 'STAGE', guest: '阿柚 Ayu' },
      { time: '13:30', title: '同人市集 · 新摊主巡礼', place: 'B 区', type: 'MARKET' },
      { time: '15:30', title: '「声音的形状」声优分享会', place: '主舞台', type: 'TALK', guest: '小满 Mian' },
      { time: '18:00', title: '首日结束 · 夜间接驳车发车', place: '南广场', type: 'INFO' },
    ],
  },
  {
    day: 'DAY 2',
    date: '12.20',
    weekday: '周日',
    items: [
      { time: '09:00', title: '低刺激时段 · 优先入场', place: '全馆', type: 'OPEN' },
      { time: '11:30', title: '独立游戏试玩 & 开发者圆桌', place: '次舞台', type: 'TALK' },
      { time: '13:00', title: '有谷创作者大会：从热爱到职业', place: '主舞台', type: 'STAGE', guest: '北岛 Hako' },
      { time: '16:00', title: '随机舞蹈 · 冬日特别场', place: '中央广场', type: 'DANCE' },
      { time: '19:00', title: '夜场 Live「星屑回响」', place: '6.2H 主舞台', type: 'LIVE', guest: '夜行电台' },
    ],
  },
  {
    day: 'DAY 3',
    date: '12.21',
    weekday: '周一',
    items: [
      { time: '09:30', title: '最后一日 · 限定谷子补货', place: 'D 区', type: 'MARKET' },
      { time: '11:00', title: '创作者签售 · 冬日感谢场', place: '签售区', type: 'SIGN', guest: '阿柚 Ayu / 北岛 Hako' },
      { time: '14:00', title: '痛车巡游 & 最佳应援评选', place: '北广场', type: 'PARADE' },
      { time: '16:00', title: '随机舞蹈总决赛 & 闭幕式', place: '主舞台', type: 'STAGE' },
      { time: '18:30', title: '山谷熄灯 · 我们明年见', place: '全馆', type: 'END' },
    ],
  },
]

export const faqs = [
  {
    q: '漫展的具体地址和交通方式？',
    a: '展会位于上海国家会展中心 5.2H / 6.2H（青浦区崧泽大道 333 号）。地铁 2 号线徐泾东站 4 号口步行约 8 分钟；17 号线诸光路站 2 号口步行约 12 分钟。展会期间将加开接驳车，建议优先选择公共交通。',
  },
  {
    q: '小朋友可以入场吗？需要买票吗？',
    a: '可以。1.2 米以下儿童在持票成人陪同下免票入场，每位成人最多携带一名免票儿童。1.2 米以上需购买正常门票。现场设有母婴室与儿童走失联络点。',
  },
  {
    q: '门票可以退换或转赠吗？',
    a: '门票支持在开展前 7 天申请退款，具体以购票平台规则为准。本届为实名制，转赠需通过官方渠道完成实名信息变更，请勿私下交易。',
  },
  {
    q: '现场可以拍照和直播吗？',
    a: '公共区域可以拍照留念。拍摄 coser 或摊主前请先征得对方同意；舞台演出与签售区禁止专业设备拍摄和商业直播，现场工作人员会进行引导。',
  },
  {
    q: '可以带食物和行李箱入场吗？',
    a: '可以携带密封包装的食物与饮用水，请勿携带酒精饮品和需加热食品。馆内设有行李寄存处（收费），大件行李建议提前寄存。',
  },
  {
    q: '如何申请媒体证或商务合作？',
    a: '媒体证申请请发送资料至 press@yougu-expo.cn，商务合作请联系 business@yougu-expo.com。我们通常在 3 个工作日内回复。开展前两周将停止媒体证申请。',
  },
]

export const communityTopics = [
  { name: '同人市集', count: 128, tone: 'lime' },
  { name: '找搭子', count: 96, tone: 'violet' },
  { name: '痛包研究所', count: 82, tone: 'coral' },
  { name: '舞台应援', count: 64, tone: 'sky' },
  { name: '社恐友好', count: 51, tone: 'yellow' },
]

export const seedPosts = [
  {
    id: 'seed-1',
    author: '纸灯Yoru',
    email: 'yoru@example.com',
    role: '痛包研究所 · 常驻谷粒',
    topic: '痛包研究所',
    time: Date.now() - 1000 * 60 * 18,
    title: '第一次做痛包，薄荷绿还是奶油黄？',
    body: '为了 12.20 的场次准备了两个配色，纠结到凌晨三点。薄荷绿更清爽，但奶油黄好像更衬这次主视觉？附上我的草图，求路过的老师给点意见，听劝。',
    art: { variant: 'painbag', label: 'PAINBAG 001' },
    likes: 128,
    likedBy: [],
    comments: [
      { id: 'c-1', author: '阿满', body: '奶油黄！和主视觉的橙色描边很搭。', time: Date.now() - 1000 * 60 * 9 },
      { id: 'c-2', author: '一颗西柚', body: '薄荷绿一票，冬天背很亮眼。', time: Date.now() - 1000 * 60 * 4 },
    ],
  },
  {
    id: 'seed-2',
    author: '阿柚 Ayu',
    email: 'ayu@example.com',
    role: '本届主视觉插画师',
    topic: '同人市集',
    time: Date.now() - 1000 * 60 * 62,
    title: '这次的无料贴纸草稿，来投票！',
    body: '准备了三版小贴纸，开展当天会在 B-17 摊位免费发放。A 是山谷小精灵，B 是主视觉眼睛，C 是那只总在睡觉的猫。评论留下字母就好，我会按票数多做一点。',
    art: { variant: 'sticker', label: 'FREE STICKERS' },
    likes: 342,
    likedBy: [],
    comments: [
      { id: 'c-3', author: '北岸电波', body: 'CCC！猫猫赛高。', time: Date.now() - 1000 * 60 * 38 },
      { id: 'c-4', author: '抹茶拿铁', body: 'B 做成镭射的话会很好看。', time: Date.now() - 1000 * 60 * 21 },
      { id: 'c-5', author: '纸灯Yoru', body: '可以全都要吗（小声）', time: Date.now() - 1000 * 60 * 12 },
    ],
  },
  {
    id: 'seed-3',
    author: '北岸电波',
    email: 'north@example.com',
    role: '夜场 Live · 三年老谷粒',
    topic: '找搭子',
    time: Date.now() - 1000 * 60 * 60 * 3,
    title: '12.20 夜场结束后一起拼车回市区',
    body: '我和朋友两个人，住在中山公园附近。夜场大概 21:30 结束，想找 2—3 位顺路的姐妹一起拼车，安全一点也热闹一点。可以先在馆内集合，社恐也没关系，我们可以先线上聊。',
    art: { variant: 'moon', label: 'NIGHT RIDE' },
    likes: 76,
    likedBy: [],
    comments: [
      { id: 'c-6', author: '小岛', body: '我住娄山关路，可以一起！', time: Date.now() - 1000 * 60 * 120 },
    ],
  },
  {
    id: 'seed-4',
    author: '抹茶拿铁',
    email: 'matcha@example.com',
    role: '社恐友好 · 攻略组',
    topic: '社恐友好',
    time: Date.now() - 1000 * 60 * 60 * 7,
    title: '社恐友好逛展清单 v2.0（含休息点）',
    body: '去年写的那版被很多人收藏了，今年更新一下：6.2H 二层靠窗有一排很少人的座位；下午两点到四点是主通道最挤的时段，建议错峰去 B 区；如果突然不想说话，可以去安静休息室待十分钟，不需要解释。',
    art: { variant: 'guide', label: 'GUIDE V2.0' },
    likes: 219,
    likedBy: [],
    comments: [
      { id: 'c-7', author: '一只团子', body: '谢谢，太需要了。去年就是靠你的攻略活下来的。', time: Date.now() - 1000 * 60 * 300 },
    ],
  },
]

export const stats = [
  { value: '30,000', unit: '㎡', label: '热爱现场' },
  { value: '320', unit: '+', label: '同人摊位' },
  { value: '48', unit: '场', label: '舞台与活动' },
  { value: '30,000', unit: '+', label: '预计同好' },
]

export const timeline = [
  { year: '2022', title: '山谷第一次亮灯', text: '第一届有谷在一个 3,000㎡ 的小展馆里发生，来了 4,200 个人。我们在闭馆后一起吃完了剩下的饭团。' },
  { year: '2023', title: '从一天变成两天', text: '第二届增加了同人市集与夜场放映，第一次有摊主说：「原来我的画真的会被喜欢。」' },
  { year: '2024', title: '我们开始被城市看见', text: '第三届有了主题地铁和第一场独立游戏展，3 万名同好从 27 个城市来到山谷。' },
  { year: '2025', title: '休整，然后想得更清楚', text: '我们没有办展，用一年时间重新讨论：一个漫展除了热闹，还能给创作者和同好留下什么。' },
  { year: '2026', title: '把山谷再扩大一点', text: '第四届，两个展馆、六个区域、三天。我们希望它仍然像一个可以被依靠的社区，而不只是一场活动。' },
]

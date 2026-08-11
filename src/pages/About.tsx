import { Building2, Database, Globe2, GraduationCap, Landmark, Network, Sparkles, Target, UsersRound, Wrench } from 'lucide-react'

const strategyCards = [
  {
    title: '国家战略定位',
    icon: Landmark,
    text: 'AI for Science（AI4S）是一种全新的科研范式，也是我国实现科技自立自强、建设科技强国的必经之路。习近平总书记强调要“以人工智能引领科研范式变革”“体系化布局建设重大科技基础设施，建设智能化科研平台系统”，《国务院关于深入实施“人工智能+”行动的意见》明确要求加快科学大模型建设应用、打造开放共享的高质量科学数据集。当前，全球AI竞争正进入以高质量科学数据为核心的战略博弈阶段，数据作为与算法、算力协同的关键资源，直接决定模型对复杂科学问题的理解与推理能力。建设AI4S战略语料库，对于我国突破“卡脖子”技术瓶颈、抢占科学智能制高点具有重大战略意义。',
  },
  {
    title: '项目定位',
    icon: Target,
    text: '项目坚持“边建设、边应用、边开放”原则，免费向国家人工智能训练场全量开放，以公益授权机制无条件支持国家战略重点项目研发。构建“数据—工具—人才—模型”四位一体、长效共进化的建设体系，致力于服务国家战略需求、赋能科研创新、降低行业门槛、培养复合型人才，打造中国科学界共同的数据地基和创新引擎。',
  },
  {
    title: '当前困境与挑战',
    icon: Network,
    text: '当前，我国基础学科语料资源建设面临多重结构性瓶颈。基础学科语料资源分散于高校、科研院所和行业机构，统一的汇交治理机制与数据标准尚不完善，“数据孤岛”问题突出。数学公式、实验图谱、生物分子结构等复杂多模态数据难以深度对齐，现有互联网语料也面临质量、科学价值和版权合规等风险，高质量科研语料及思维链数据仍存在结构性缺口。',
  },
  {
    title: '建设必要性',
    icon: Sparkles,
    text: '面向科学智能发展，需要推动科研数据的有组织汇聚、标准化治理与高质量增量生成，构建“数据生成—模型训练—科学发现”的闭环。北京大学依托完备的人才梯队和数理化天地生六大基础学科优势，建设高质量战略语料库，为AI4S发展和关键核心技术突破提供数据基础。',
  },
]

const universities = [
  { mark: '清华', name: '清华大学', subject: '主责物理学科', text: '1978年建立我国人工智能最早的教研组，CS Rankings人工智能学者高水平成果居世界第一，US News全球计算机学科第一。物理系拥有1个全国重点实验室、1个前沿科学中心，教师中科院院士10人。' },
  { mark: '厦大', name: '厦门大学', subject: '主责化学学科', text: '化学学科入选国家“双一流”建设学科，首批获批建设人工智能专业高校。Nature Index 2024 AI全球100强中位居全国第12、全球第71。' },
  { mark: '南大', name: '南京大学', subject: '主责天文学科', text: '依托百年学科基础，近五年承担国家级重大项目140余项。天文学领域主持研制龙虾眼X射线探测卫星、羲和号等大型观测设备，已建成PB量级数据中心。' },
  { mark: '武大', name: '武汉大学', subject: '主责地理学科', text: '地理、环境两学科双双进入QS世界前100名，测绘科学与技术获评A+。设有人工智能学院、武汉数学与智能研究院。' },
  { mark: '复旦', name: '复旦大学', subject: '主责生物学科', text: '生物学入选国家“双一流”建设学科，发布国内第一个对话式大语言模型MOSS。在AI与生命、数学、物理、化学、医学等多学科交叉领域重点布局，全球声誉位居世界前50。' },
  { mark: '交大', name: '上海交通大学', subject: '主责大模型技术', text: 'CS Rankings计算机专业和AI分项均位列全球第三，拥有全国唯一的教育部人工智能重点实验室，获批国家人工智能产教融合创新平台。汇聚IEEE Fellow 14名、国家级高层次人才66人次。' },
]

const enterprises = ['鹏城实验室', '华为', '万方数据', '深势科技', '京能集团', '百度', '字节跳动', '中国联通', '蚂蚁集团']

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-orbit" aria-hidden="true" />
        <div className="about-hero-inner">
          <span>关于我们</span>
          <h1>共建基础学科战略语料库<br />夯实科学智能数据基础</h1>
          <p>汇聚多方建设力量，推动科学语料有组织汇交、标准化治理与开放共享</p>
        </div>
      </section>

      <section className="about-section about-overview-section">
        <header className="about-section-heading"><span>01</span><div><h2>项目概述</h2><p>覆盖基础学科全谱系的战略语料库建设工程</p></div></header>
        <div className="about-overview-card">
          <article>
            <h3>格物 · 科学语料库</h3>
            <p>由国家发展改革委批复立项，教育部统筹，北京大学牵头建设，聚焦数学、物理、化学、天文、地理、生物六大基础学科，旨在建成全球首个覆盖基础学科全谱系的战略语料库。</p>
            <p>项目按照“1+6+N”开放协同机制推进，以国际科学智能联盟为组织抓手，以“可治理、可追溯、可复用、可迭代”为建设主线，构建覆盖数理化天地生六大基础学科的高质量语料体系。</p>
          </article>
          <div className="about-goal-grid">
            <div><Database size={21} /><strong>≥1,000</strong><span>个子语料库</span></div>
            <div><Globe2 size={21} /><strong>≥1,000</strong><span>种数据源</span></div>
            <div><Network size={21} /><strong>≥50</strong><span>种数据子模态</span></div>
            <div><Wrench size={21} /><strong>≥50 / ≥200</strong><span>加工工具 / 工具链</span></div>
          </div>
        </div>
        <div className="about-collaboration-line"><span>1个牵头单位</span><i /><span>6所协同高校</span><i /><span>N个共建机构</span><i /><strong>人机协同迭代演化</strong></div>
      </section>

      <section className="about-section about-strategy-section">
        <header className="about-section-heading"><span>02</span><div><h2>战略背景</h2><p>面向国家战略需求，构建科学智能发展所需的数据基础设施</p></div></header>
        <div className="about-strategy-grid">{strategyCards.map((card, index) => { const Icon = card.icon; return <article key={card.title} className={index === 0 ? 'is-primary' : ''}><div><Icon size={21} /><span>0{index + 1}</span></div><h3>{card.title}</h3><p>{card.text}</p></article> })}</div>
      </section>

      <section className="about-section about-units-section">
        <header className="about-section-heading is-centered"><span>03</span><div><h2>建设单位</h2><p>多方协同、优势互补，共建科学语料开放生态</p></div></header>

        <div className="about-subheading"><Landmark size={18} /><h3>牵头单位</h3></div>
        <article className="lead-unit-card">
          <div className="university-mark is-pku"><span>北大</span><small>1898</small></div>
          <div><div className="lead-unit-title"><span>牵头单位</span><h3>北京大学</h3></div><p>北京大学坚持文理医工协调发展，学科体系完备。在全国第四轮学科评估中，数学、物理、化学、地理、生物等21个一级学科获评“A+”，居全国高校首位。2018年，鄂维南院士和汤超院士在北大首倡AI for Science理念，学校设立全球首个科学智能学院，牵头发起“国际科学智能联盟”，超60家机构深度参与。北大自主开发的DataFlow语料全生命周期加工与管理平台，已具备覆盖“采集—清洗—加工—对齐—评测—发布—迭代”的全链条流程支撑能力。</p></div>
        </article>

        <div className="about-subheading"><GraduationCap size={18} /><h3>协同高校</h3></div>
        <div className="partner-university-grid">{universities.map((item) => <article key={item.name}><header><div className="university-mark"><span>{item.mark}</span></div><div><h3>{item.name}</h3><span>{item.subject}</span></div></header><p>{item.text}</p></article>)}</div>

        <div className="about-subheading"><Building2 size={18} /><h3>共建企业与机构</h3></div>
        <div className="co-builder-panel"><div><UsersRound size={30} /><strong>开放协同建设网络</strong><span>汇集科研机构、科技企业与数据服务单位的专业能力</span></div><ul>{enterprises.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>

      <section id="site-statement" className="about-statement"><span>© 2026 北京大学 版权所有</span></section>
    </div>
  )
}

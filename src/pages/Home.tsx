import { ArrowRight, BadgeCheck, BookOpen, Boxes, Braces, BrainCircuit, Database, FileStack, LibraryBig, ListFilter, Network, ScanSearch, Search, Tags, UploadCloud, Waypoints } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useApp } from '../context/app-context'
import CorpusCommunity from '../components/CorpusCommunity'
import SubjectShowcase from '../components/SubjectShowcase'
import QualityCorpusDiscovery from '../components/QualityCorpusDiscovery'

const metrics = [
  { value: '92亿条', label: '语料条数' },
  { value: '900个', label: '语料集' },
  { value: '38PB', label: '语料规模' },
  { value: '400万', label: '服务用户' },
]

const evolutionItems = [
  { key: 'data', mark: '数', title: '数据', detail: '高质量科学语料' },
  { key: 'tools', mark: '器', title: '工具', detail: '智能化生产工具链' },
  { key: 'talent', mark: '人', title: '人才', detail: '多学科专业力量' },
  { key: 'model', mark: '智', title: '模型', detail: '智能模型' },
]

const subjects = ['数学', '物理', '化学', '天文', '地理', '生物']
const learningSources = ['培养方案与教学大纲', '专业教材', '课件', '教学视频', '习题与考题']
const chainOutputs = ['公式推理证明', '动力学演化推理', '物质性质分析', '天体起源推演', '地质环境影响', '……']

export default function Home() {
  const navigate = useNavigate()
  const { user, openAuth } = useApp()

  const handleUpload = () => {
    if (user) navigate('/upload')
    else openAuth()
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-stars" aria-hidden="true" />
        <div className="cosmic-arc cosmic-arc-one" aria-hidden="true" />
        <div className="cosmic-arc cosmic-arc-two" aria-hidden="true" />
        <div className="hero-grid hero-grid-redesign">
          <div className="hero-copy">
            <span className="hero-kicker"><Database size={16} />开放汇聚 · 协同建设 · 共享使用</span>
            <h1>高质量科学语料<br /><em>共建共享平台</em></h1>
            <p>汇聚高校、企业、新型研发机构与个人建设成果，连接语料贡献者与使用者，服务科研创新、教育教学与模型训练。</p>
            <div className="hero-actions">
              <button className="primary-action hero-button" type="button" onClick={handleUpload}>
                <UploadCloud size={18} />语料上传<ArrowRight size={16} />
              </button>
              <Link className="secondary-action" to="/search"><Search size={18} />浏览语料</Link>
            </div>
            <div className="hero-metrics">
              {metrics.map((item) => (
                <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
              ))}
            </div>
            <small className="update-note">数据截至2026年7月10日，每月10日更新</small>
          </div>

          <section className="hero-evolution-panel" aria-labelledby="evolution-title">
            <div className="hero-evolution-heading">
              <span>CORE CONCEPT</span>
              <h2 id="evolution-title">“数据-工具-人才-模型”共进化</h2>
            </div>

            <div className="compact-evolution" aria-label="数据、工具、人才、模型共进化循环">
              <div className="compact-track track-outer" aria-hidden="true" />
              <div className="compact-track track-inner" aria-hidden="true" />
              <div className="orbiting-nodes">
                {evolutionItems.map((item) => (
                  <div key={item.key} className={`compact-node compact-${item.key}`}>
                    <span className="compact-node-content">
                      <span className="node-disc">{item.mark}</span>
                      <span className="node-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="compact-center"><span>科学语料</span><strong>共进化</strong></div>
            </div>

            <div className="evolution-statements">
              <div><b>语料服务模型</b><span>支撑训练、评测与知识增强</span></div>
              <div><b>模型反哺语料</b><span>辅助生成、标注与质量治理</span></div>
              <div><b>模型服务人才</b><span>赋能科研创新与教育教学</span></div>
            </div>
          </section>
        </div>
      </section>

      <section className="corpus-features-section">
        <div className="features-section-heading">
          <span>PLATFORM CORPUS FEATURES</span>
          <h2>平台语料特色</h2>
        </div>

        <div className="corpus-features-grid">
          <article className="corpus-feature-card chain-feature-card">
            <header className="feature-card-heading">
              <span className="feature-card-icon"><BrainCircuit size={22} /></span>
              <div><h3>长思维链语料</h3><p>人 + 模型 + 工具</p></div>
            </header>

            <div className="chain-flow-diagram">
              <div className="chain-input-column">
                <section className="diagram-box subject-box">
                  <div className="diagram-box-title"><Network size={15} />学科体系</div>
                  <div className="diagram-tag-grid subjects-grid">
                    {subjects.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </section>
                <section className="diagram-box data-foundation-box">
                  <div className="diagram-box-title"><BookOpen size={15} />数据基础</div>
                  <div className="diagram-tag-grid learning-grid">
                    {learningSources.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </section>
              </div>

              <div className="diagram-arrow horizontal-arrow" aria-hidden="true"><i /></div>

              <section className="diagram-box chain-module-box">
                <div className="diagram-box-title"><BrainCircuit size={15} />思维链模块</div>
                <div className="chain-module-items">
                  <figure>
                    <img src={`${import.meta.env.BASE_URL}images/knowledge-map.png`} alt="领域知识地图" />
                    <figcaption>领域知识地图</figcaption>
                  </figure>
                  <figure>
                    <img src={`${import.meta.env.BASE_URL}images/reasoning-process.png`} alt="领域推理过程" />
                    <figcaption>领域推理过程</figcaption>
                  </figure>
                </div>
              </section>

              <div className="diagram-arrow horizontal-arrow" aria-hidden="true"><i /></div>

              <section className="chain-output-box">
                <strong>高质量领域<br />长思维链语料</strong>
                <div className="output-tags">
                  {chainOutputs.map((item) => <span className={item === '……' ? 'output-more' : ''} key={item}>{item}</span>)}
                </div>
              </section>

              <div className="vertical-flow module-generation-flow" aria-hidden="true"><i /><span>模块生成</span></div>
              <div className="vertical-flow model-synthesis-flow" aria-hidden="true"><i /><span>合成补足</span></div>
              <section className="foundation-model-bar">
                <strong>先进通用大模型合成数据构建体系</strong>
              </section>
            </div>
          </article>

          <article className="corpus-feature-card multimodal-feature-card">
            <header className="feature-card-heading">
              <span className="feature-card-icon"><Database size={22} /></span>
              <div><h3>多模态语料</h3><p>多源数据融合与深度对齐</p></div>
            </header>

            <div className="multimodal-flow-diagram">
              <section className="diagram-box production-box">
                <div className="diagram-stage-title">01&nbsp;&nbsp;数据生产</div>
                <div className="production-visual-list">
                  <div className="visual-process-card"><i><FileStack size={20} /></i><span><strong>数据来源</strong><small>文献 · 专利 · 报告 · 仪器</small></span></div>
                  <div className="visual-process-card"><i><ListFilter size={20} /></i><span><strong>数据处理</strong><small>采集 · 清洗 · 识别</small></span></div>
                  <div className="visual-process-card"><i><Boxes size={20} /></i><span><strong>数据实体</strong><small>文本 · 公式 · 图像 · 光谱 · 结构</small></span></div>
                </div>
              </section>

              <div className="diagram-arrow horizontal-arrow" aria-hidden="true"><i /></div>

              <section className="diagram-box processing-box">
                <div className="diagram-stage-title">02&nbsp;&nbsp;多模态解析、标注与评估</div>
                <div className="processing-visual-list">
                  <div><i><ScanSearch size={19} /></i><span>多模态解析</span></div>
                  <div><i><Tags size={19} /></i><span>专家标注</span></div>
                  <div><i><BadgeCheck size={19} /></i><span>质量评估</span></div>
                </div>
              </section>

              <div className="diagram-arrow horizontal-arrow" aria-hidden="true"><i /></div>

              <section className="diagram-box storage-box">
                <div className="diagram-stage-title">03&nbsp;&nbsp;多模态语料存储</div>
                <div className="storage-path visual-storage-path">
                  <div className="storage-sources">
                    <span><Waypoints size={18} />向量表征数据</span>
                    <span><Braces size={18} />结构化数据</span>
                  </div>
                  <div className="storage-mini-arrow" aria-hidden="true" />
                  <div className="ai-database"><Database size={24} /><span>AI数据库</span></div>
                  <div className="storage-mini-arrow" aria-hidden="true" />
                  <div className="corpus-library"><LibraryBig size={18} /><strong>多模态语料库</strong></div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>

      <CorpusCommunity />
      <SubjectShowcase />
      <QualityCorpusDiscovery />
    </div>
  )
}

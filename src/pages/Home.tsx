import { Search, UploadCloud } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useApp } from '../context/app-context'
import CorpusCommunity from '../components/CorpusCommunity'
import SubjectShowcase from '../components/SubjectShowcase'
import QualityCorpusDiscovery from '../components/QualityCorpusDiscovery'
import multiPartyImage from '../assets/capabilities/multi-party.png'
import governanceImage from '../assets/capabilities/governance.png'
import discoveryImage from '../assets/capabilities/discovery.png'
import processingImage from '../assets/capabilities/processing.png'
import trustedUseImage from '../assets/capabilities/trusted-use.png'
import iterationImage from '../assets/capabilities/iteration.png'

const metrics = [
  { value: '92亿条', label: '语料条数' },
  { value: '900个', label: '语料库' },
  { value: '38PB', label: '语料规模' },
  { value: '400万', label: '服务用户' },
]

const evolutionItems = [
  { key: 'data', mark: '数', title: '数据', detail: '高质量科学语料' },
  { key: 'tools', mark: '器', title: '工具', detail: '智能化生产工具链' },
  { key: 'talent', mark: '人', title: '人才', detail: '多学科专业力量' },
  { key: 'model', mark: '智', title: '模型', detail: '智能模型' },
]

const platformCapabilities = [
  {
    key: 'contribute',
    title: '多方汇聚',
    description: '连接高校、科研机构、企业和个人，持续汇交科学语料',
    image: multiPartyImage,
    to: '/upload',
  },
  {
    key: 'govern',
    title: '规范治理',
    description: '统一分类与权益记录，保障语料全流程可追溯',
    image: governanceImage,
  },
  {
    key: 'discover',
    title: '精准发现',
    description: '通过多维检索、在线预览和筛选快速定位所需语料',
    image: discoveryImage,
    to: '/search',
  },
  {
    key: 'process',
    title: '专业加工',
    description: '复用专业工具链，支持多模态处理、标注、对齐与评估',
    image: processingImage,
    to: '/tools',
  },
  {
    key: 'use',
    title: '可信使用',
    description: '提供分级开放与权限管理，兼顾共享、权益和安全合规',
    image: trustedUseImage,
  },
  {
    key: 'iterate',
    title: '协同迭代',
    description: '连接贡献、使用与管理，以应用反馈推动持续更新',
    image: iterationImage,
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { user, openAuth } = useApp()

  const handleUpload = () => {
    if (user) navigate('/upload')
    else {
      navigate('/upload')
      openAuth()
    }
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-stars" aria-hidden="true" />
        <div className="cosmic-arc cosmic-arc-one" aria-hidden="true" />
        <div className="cosmic-arc cosmic-arc-two" aria-hidden="true" />
        <div className="hero-grid hero-grid-redesign">
          <div className="hero-copy">
            <h1><span>高质量科学语料</span><br /><em>共建共享平台</em></h1>
            <p>汇聚高校、企业、新型研发机构与个人建设成果，连接语料贡献者与使用者，服务科研创新、教育教学与模型训练</p>
            <div className="hero-actions">
              <button className="primary-action hero-button" type="button" onClick={handleUpload}>
                <UploadCloud size={18} />语料上传
              </button>
              <Link className="secondary-action" to="/search/results"><Search size={18} />浏览语料</Link>
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

      <section className="platform-capabilities-section">
        <div className="platform-capabilities-container">
          <header className="platform-capabilities-heading">
            <h2>平台能力</h2>
            <p>贯通科学语料汇聚、治理、加工、发现、使用与迭代，连接语料建设成果与科研应用</p>
          </header>

          <div className="platform-capabilities-grid">
            {platformCapabilities.map((capability) => {
              const content = (
                <>
                  <img src={capability.image} alt="" aria-hidden="true" />
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </>
              )

              return capability.to
                ? <Link className={`platform-capability-card capability-${capability.key}`} to={capability.to} key={capability.key}>{content}</Link>
                : <article className={`platform-capability-card capability-${capability.key}`} key={capability.key}>{content}</article>
            })}
          </div>
        </div>
      </section>

      <CorpusCommunity />
      <SubjectShowcase />
      <QualityCorpusDiscovery />
    </div>
  )
}

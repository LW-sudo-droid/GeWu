import { Atom, Calculator, Dna, Earth, FlaskConical, Telescope } from 'lucide-react'
import { Link } from 'react-router'

const subjectData = [
  {
    name: '数学',
    sets: '92个',
    items: '3.2亿条',
    size: '1.8PB',
    tools: '36个',
    icon: Calculator,
    accent: 'blue',
  },
  {
    name: '物理',
    sets: '118个',
    items: '6.8亿条',
    size: '5.6PB',
    tools: '42个',
    icon: Atom,
    accent: 'violet',
  },
  {
    name: '化学',
    sets: '156个',
    items: '21.5亿条',
    size: '2.4PB',
    tools: '58个',
    icon: FlaskConical,
    accent: 'rose',
  },
  {
    name: '天文',
    sets: '134个',
    items: '9.6亿条',
    size: '12.8PB',
    tools: '44个',
    icon: Telescope,
    accent: 'amber',
  },
  {
    name: '地理',
    sets: '180个',
    items: '12.2亿条',
    size: '5.2PB',
    tools: '51个',
    icon: Earth,
    accent: 'teal',
  },
  {
    name: '生物',
    sets: '246个',
    items: '38.7亿条',
    size: '10.2PB',
    tools: '69个',
    icon: Dna,
    accent: 'cyan',
  },
]

export default function SubjectShowcase() {
  return (
    <section className="subject-showcase-section" aria-labelledby="subject-showcase-title">
      <div className="subject-showcase-inner">
        <header className="subject-showcase-heading">
          <div>
            <h2 id="subject-showcase-title">六大学科领域</h2>
          </div>
          <p>覆盖数理化天地生六大基础学科，集中展示各领域语料建设规模与工具链成果。</p>
        </header>

        <div className="subject-card-grid">
          {subjectData.map((subject, index) => {
            const Icon = subject.icon
            return (
              <Link
                className={`subject-data-card subject-accent-${subject.accent}`}
                to={`/search/results?domain=${encodeURIComponent(subject.name)}`}
                aria-label={`查看${subject.name}领域语料`}
                key={subject.name}
              >
                <span className="subject-card-index">0{index + 1}</span>
                <header>
                  <span className="subject-card-icon"><Icon size={22} /></span>
                  <div>
                    <h3>{subject.name}</h3>
                  </div>
                </header>

                <dl>
                  <div><dt>语料集</dt><dd>{subject.sets}</dd></div>
                  <div><dt>语料条数</dt><dd>{subject.items}</dd></div>
                  <div><dt>语料规模</dt><dd>{subject.size}</dd></div>
                  <div><dt>工具链</dt><dd>{subject.tools}</dd></div>
                </dl>

                <span className="subject-card-link">查看领域语料 <i aria-hidden="true">→</i></span>
              </Link>
            )
          })}
        </div>

        <div className="subject-showcase-note">
          <span>数据按每月10日正式统计快照更新</span>
        </div>
      </div>
    </section>
  )
}

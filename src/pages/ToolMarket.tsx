import { useEffect, useMemo, useState } from 'react'
import { Search, Wrench, X } from 'lucide-react'
import toolMarketData from '../data/tool-market.json'

type Subject = '数学' | '物理' | '化学' | '天文' | '地理' | '生物'

type ToolRecord = {
  id: string
  subject: Subject
  name: string
  description: string
  sourceSheet: string
  sourceRow: number
}

const tools = toolMarketData as ToolRecord[]
const subjects: Array<'全部工具' | Subject> = ['全部工具', '数学', '物理', '化学', '天文', '地理', '生物']
const PAGE_SIZE = 12

function visiblePageNumbers(current: number, total: number) {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}

export default function ToolMarket() {
  const [subject, setSubject] = useState<(typeof subjects)[number]>('全部工具')
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [selectedTool, setSelectedTool] = useState<ToolRecord | null>(null)

  const subjectCounts = useMemo(() => {
    const counts = new Map<string, number>([['全部工具', tools.length]])
    subjects.slice(1).forEach((item) => counts.set(item, tools.filter((tool) => tool.subject === item).length))
    return counts
  }, [])

  const filteredTools = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase('zh-CN')
    return tools.filter((tool) => {
      const subjectMatched = subject === '全部工具' || tool.subject === subject
      const keywordMatched = !normalizedKeyword || [tool.name, tool.description, tool.subject]
        .some((value) => value.toLocaleLowerCase('zh-CN').includes(normalizedKeyword))
      return subjectMatched && keywordMatched
    })
  }, [keyword, subject])

  const pageCount = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE))
  const pageTools = filteredTools.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (!selectedTool) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedTool(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedTool])

  const chooseSubject = (nextSubject: (typeof subjects)[number]) => {
    setSubject(nextSubject)
    setPage(1)
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setKeyword(keywordInput.trim())
    setPage(1)
  }

  const clearSearch = () => {
    setKeywordInput('')
    setKeyword('')
    setPage(1)
  }

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
    document.querySelector('.tool-market-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="tool-market-page">
      <section className="tool-market-hero">
        <div className="tool-market-hero-inner">
          <span className="tool-market-hero-kicker">六大学科语料加工工具汇聚平台</span>
          <h1>工具链市场</h1>
          <p>汇聚六大学科语料加工工具，服务科学语料采集、解析、清洗、标注、对齐与质量评估</p>

          <form className="tool-market-search" onSubmit={submitSearch} role="search">
            <Search aria-hidden="true" />
            <input
              aria-label="搜索工具链"
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="搜索工具链"
              type="search"
              value={keywordInput}
            />
            {keywordInput && (
              <button className="tool-market-search-clear" type="button" onClick={clearSearch} aria-label="清空搜索">
                <X aria-hidden="true" />
              </button>
            )}
            <button className="tool-market-search-submit" type="submit">搜索</button>
          </form>
        </div>
      </section>

      <section className="tool-market-content">
        <aside className="tool-subject-sidebar" aria-label="按学科领域筛选">
          <h2>按学科领域</h2>
          <div className="tool-subject-list">
            {subjects.map((item) => (
              <button
                className={subject === item ? 'is-active' : ''}
                key={item}
                onClick={() => chooseSubject(item)}
                type="button"
              >
                <span>{item}</span>
                <small>{subjectCounts.get(item) ?? 0}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="tool-results-panel">
          <header className="tool-results-header">
            <div>
              <h2>{subject}</h2>
              <p>共收录 <strong>{filteredTools.length}</strong> 条工具链</p>
            </div>
            {keyword && (
              <button className="tool-active-keyword" type="button" onClick={clearSearch}>
                搜索：{keyword}<X aria-hidden="true" />
              </button>
            )}
          </header>

          {pageTools.length > 0 ? (
            <div className="tool-card-grid">
              {pageTools.map((tool) => (
                <article
                  className="tool-market-card"
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedTool(tool)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="tool-card-heading">
                    <span className="tool-card-icon"><Wrench aria-hidden="true" /></span>
                    <span className="tool-subject-tag">{tool.subject}</span>
                  </div>
                  <h3>{tool.name}</h3>
                  <div className="tool-card-description">
                    <strong>处理场景</strong>
                    <p>{tool.description}</p>
                  </div>

                  <div className="tool-card-hover-detail" role="tooltip">
                    <div className="tool-card-hover-title">
                      <span>{tool.subject}</span>
                      <strong>{tool.name}</strong>
                    </div>
                    <p>{tool.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="tool-market-empty">
              <Search aria-hidden="true" />
              <h3>暂未找到符合条件的工具链</h3>
              <p>请尝试更换关键词</p>
              <button type="button" onClick={clearSearch}>清空搜索</button>
            </div>
          )}

          {filteredTools.length > PAGE_SIZE && (
            <nav className="tool-market-pagination" aria-label="工具链分页">
              <button disabled={page === 1} onClick={() => goToPage(page - 1)} type="button">上一页</button>
              {visiblePageNumbers(page, pageCount).map((pageNumber) => (
                <button
                  aria-current={page === pageNumber ? 'page' : undefined}
                  className={page === pageNumber ? 'is-active' : ''}
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              <button disabled={page === pageCount} onClick={() => goToPage(page + 1)} type="button">下一页</button>
            </nav>
          )}
        </div>
      </section>

      {selectedTool && (
        <div className="tool-detail-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedTool(null)}>
          <section
            aria-labelledby="tool-detail-title"
            aria-modal="true"
            className="tool-detail-dialog"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <div>
                <span>{selectedTool.subject}</span>
                <h2 id="tool-detail-title">{selectedTool.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedTool(null)} aria-label="关闭完整介绍">
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="tool-detail-dialog-body">
              <h3>处理场景</h3>
              <p>{selectedTool.description}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

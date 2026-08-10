import { Check, Search } from 'lucide-react'
import { useSearchParams } from 'react-router'

export default function CorpusSearch() {
  const [searchParams] = useSearchParams()
  const publisher = searchParams.get('publisher')
  const domain = searchParams.get('domain')
  const sort = searchParams.get('sort')
  const sortLabels: Record<string, string> = {
    latest: '最新发布',
    views: '近30日最多浏览',
    usage: '最高使用',
  }
  const activeSort = sortLabels[sort ?? ''] ?? '综合排序'

  return (
    <section className="search-page">
      <div className="search-page-heading">
        <span className="eyebrow">CORPUS SEARCH</span>
        <h1>语料检索</h1>
        <p>按学科、建设机构、语料类型及模型训练阶段检索平台语料。</p>
      </div>
      <div className="search-layout">
        <aside className="filter-panel">
          <h2>筛选条件</h2>
          <div className="filter-group">
            <strong>发布机构</strong>
            {publisher ? (
              <div className="checked-filter"><span><Check size={13} /></span>{publisher}</div>
            ) : (
              <p>暂未选择发布机构</p>
            )}
          </div>
          <div className="filter-group muted-filter"><strong>学科领域</strong><p>{domain ?? '全部学科'}</p></div>
          <div className="filter-group muted-filter"><strong>语料类型</strong><p>全部类型</p></div>
        </aside>
        <div className="results-panel">
          <div className="results-toolbar"><Search size={18} /><span>{publisher ? `${publisher}发布的语料` : domain ? `${domain}领域语料` : '全部语料'} · {activeSort}</span></div>
          <div className="empty-results"><strong>语料结果区域</strong><p>后续接入后台数据后，将在此展示符合筛选条件的语料集。</p></div>
        </div>
      </div>
    </section>
  )
}

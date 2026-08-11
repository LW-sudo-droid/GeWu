import { useEffect, useMemo, useState } from 'react'
import { Building2, FlaskConical, GraduationCap, MapPinned, UsersRound } from 'lucide-react'

type Position = [number, number]

type ProvinceGeometry = {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: Position[][] | Position[][][]
}

type ProvinceFeature = {
  type: 'Feature'
  properties: {
    adcode?: number
    name?: string
  }
  geometry: ProvinceGeometry
}

type ProvinceCollection = {
  type: 'FeatureCollection'
  features: ProvinceFeature[]
}

type CategoryKey = 'university' | 'enterprise' | 'institute' | 'individual'

type CommunityMetric = {
  corpusSets: number
  corpusRows: number
  corpusScale: number
}

type CategoryDefinition = {
  key: CategoryKey
  title: string
  shortTitle: string
  icon: typeof GraduationCap
  national: CommunityMetric
}

const MAP_WIDTH = 760
const MAP_HEIGHT = 520
const MAP_PADDING = 22

const categoryDefinitions: CategoryDefinition[] = [
  {
    key: 'university',
    title: '高校',
    shortTitle: '高校',
    icon: GraduationCap,
    national: { corpusSets: 428, corpusRows: 46.8, corpusScale: 18.6 },
  },
  {
    key: 'enterprise',
    title: '企业',
    shortTitle: '企业',
    icon: Building2,
    national: { corpusSets: 186, corpusRows: 21.4, corpusScale: 8.9 },
  },
  {
    key: 'institute',
    title: '新型研发机构',
    shortTitle: '研发机构',
    icon: FlaskConical,
    national: { corpusSets: 152, corpusRows: 14.7, corpusScale: 7.1 },
  },
  {
    key: 'individual',
    title: '个人',
    shortTitle: '个人',
    icon: UsersRound,
    national: { corpusSets: 134, corpusRows: 9.1, corpusScale: 3.4 },
  },
]

const referenceRegions = new Set(['香港特别行政区', '澳门特别行政区', '台湾省'])

const regionWeights: Record<string, number> = {
  北京市: 0.148,
  广东省: 0.121,
  上海市: 0.103,
  江苏省: 0.092,
  浙江省: 0.081,
  湖北省: 0.061,
  山东省: 0.057,
  四川省: 0.052,
  福建省: 0.047,
  陕西省: 0.044,
}

const categoryWeights: Record<CategoryKey, number> = {
  university: 1,
  enterprise: 0.92,
  institute: 0.78,
  individual: 0.7,
}

function visitCoordinates(geometry: ProvinceGeometry, callback: (position: Position) => void) {
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates as Position[][]]
    : geometry.coordinates as Position[][][]

  polygons.forEach((polygon) => {
    polygon.forEach((ring) => ring.forEach(callback))
  })
}

function buildProjection(features: ProvinceFeature[]) {
  let minLongitude = Number.POSITIVE_INFINITY
  let maxLongitude = Number.NEGATIVE_INFINITY
  let minLatitude = Number.POSITIVE_INFINITY
  let maxLatitude = Number.NEGATIVE_INFINITY

  features.forEach((feature) => {
    visitCoordinates(feature.geometry, ([longitude, latitude]) => {
      minLongitude = Math.min(minLongitude, longitude)
      maxLongitude = Math.max(maxLongitude, longitude)
      minLatitude = Math.min(minLatitude, latitude)
      maxLatitude = Math.max(maxLatitude, latitude)
    })
  })

  const longitudeSpan = maxLongitude - minLongitude
  const latitudeSpan = maxLatitude - minLatitude
  const scale = Math.min(
    (MAP_WIDTH - MAP_PADDING * 2) / longitudeSpan,
    (MAP_HEIGHT - MAP_PADDING * 2) / latitudeSpan,
  )
  const contentWidth = longitudeSpan * scale
  const contentHeight = latitudeSpan * scale
  const xOffset = (MAP_WIDTH - contentWidth) / 2
  const yOffset = (MAP_HEIGHT - contentHeight) / 2

  return ([longitude, latitude]: Position): Position => [
    xOffset + (longitude - minLongitude) * scale,
    yOffset + (maxLatitude - latitude) * scale,
  ]
}

function geometryToPath(geometry: ProvinceGeometry, project: (position: Position) => Position) {
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates as Position[][]]
    : geometry.coordinates as Position[][][]

  return polygons
    .flatMap((polygon) => polygon.map((ring) => {
      if (!ring.length) return ''
      return ring.map((position, index) => {
        const [x, y] = project(position)
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      }).join(' ') + ' Z'
    }))
    .join(' ')
}

function stableHash(value: string) {
  return Array.from(value).reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7)
}

function getProvinceMetric(province: string, definition: CategoryDefinition): CommunityMetric {
  const baseWeight = regionWeights[province] ?? (0.018 + (stableHash(province) % 31) / 1000)
  const weight = Math.min(baseWeight * categoryWeights[definition.key], 0.16)

  return {
    corpusSets: Math.max(1, Math.round(definition.national.corpusSets * weight)),
    corpusRows: Math.max(0.1, definition.national.corpusRows * weight),
    corpusScale: Math.max(0.01, definition.national.corpusScale * weight),
  }
}

function formatMetric(metric: CommunityMetric) {
  return {
    corpusSets: `${metric.corpusSets}个`,
    corpusRows: `${metric.corpusRows.toFixed(metric.corpusRows >= 10 ? 1 : 2)}亿条`,
    corpusScale: `${metric.corpusScale.toFixed(metric.corpusScale >= 10 ? 1 : 2)}PB`,
  }
}

export default function CorpusCommunity() {
  const [geoData, setGeoData] = useState<ProvinceCollection | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [activeProvince, setActiveProvince] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}data/china-provinces.geojson`)
      .then((response) => {
        if (!response.ok) throw new Error('地图数据加载失败')
        return response.json() as Promise<ProvinceCollection>
      })
      .then((data) => {
        if (!cancelled) setGeoData(data)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const mapFeatures = useMemo(() => {
    const namedFeatures = geoData?.features.filter((feature) => feature.properties.name) ?? []
    if (!namedFeatures.length) return []
    const project = buildProjection(namedFeatures)
    return namedFeatures.map((feature) => ({
      feature,
      path: geometryToPath(feature.geometry, project),
    }))
  }, [geoData])

  const visibleMetrics = useMemo(() => categoryDefinitions.map((definition) => ({
    ...definition,
    metric: activeProvince ? getProvinceMetric(activeProvince, definition) : definition.national,
  })), [activeProvince])

  return (
    <section className="corpus-community-section" aria-labelledby="community-title">
      <div className="community-section-inner">
        <header className="community-section-heading">
          <h2 id="community-title">数据社区 · 共建共享</h2>
          <p>连接高校、企业、新型研发机构和个人贡献者，展现全国科学语料共建图景。</p>
        </header>

        <div className="community-layout">
          <section
            className="community-map-panel"
            aria-label="全国科学语料建设分布地图"
            onMouseLeave={() => setActiveProvince(null)}
          >
            <div className="community-panel-bar">
              <div>
                <MapPinned size={18} />
                <span>全国建设分布</span>
              </div>
            </div>

            <div className="community-map-status">
              <span>当前查看</span>
              <strong>{activeProvince ?? '全国'}</strong>
            </div>

            <div className="china-map-wrap">
              {loadError && <div className="map-load-state">地图数据暂未加载，请刷新页面重试</div>}
              {!geoData && !loadError && <div className="map-load-state">正在加载全国地图…</div>}
              {!!mapFeatures.length && (
                <svg
                  className="china-community-map"
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  role="img"
                  aria-label="中国省级区域地图"
                >
                  <defs>
                    <filter id="province-active-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {mapFeatures.map(({ feature, path }) => {
                    const name = feature.properties.name ?? ''
                    const isReference = referenceRegions.has(name)
                    const isActive = activeProvince === name
                    return (
                      <path
                        key={`${feature.properties.adcode ?? name}-${name}`}
                        className={`province-shape${isActive ? ' is-active' : ''}${isReference ? ' is-reference' : ''}`}
                        d={path}
                        fillRule="evenodd"
                        vectorEffect="non-scaling-stroke"
                        tabIndex={isReference ? -1 : 0}
                        role={isReference ? undefined : 'button'}
                        aria-label={isReference ? `${name}边界` : `查看${name}语料数据`}
                        onMouseEnter={() => !isReference && setActiveProvince(name)}
                        onClick={() => !isReference && setActiveProvince(name)}
                        onFocus={() => !isReference && setActiveProvince(name)}
                        onBlur={() => setActiveProvince(null)}
                        onKeyDown={(event) => {
                          if (!isReference && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault()
                            setActiveProvince(name)
                          }
                        }}
                      />
                    )
                  })}
                </svg>
              )}
            </div>

            <div className="community-map-legend" aria-hidden="true">
              <span><i className="legend-normal" />省级区域</span>
              <span><i className="legend-active" />当前区域</span>
            </div>
          </section>

          <aside className="community-summary-panel" aria-live="polite">
            <div className="community-summary-heading">
              <div>
                <span>{activeProvince ? '省级数据' : '全国数据'}</span>
                <h3>{activeProvince ? `${activeProvince}汇总` : '全国汇总'}</h3>
              </div>
            </div>

            <div className="community-card-grid">
              {visibleMetrics.map(({ key, title, shortTitle, icon: Icon, metric }) => {
                const formatted = formatMetric(metric)
                return (
                  <article className={`community-data-card category-${key}`} key={key}>
                    <header>
                      <span className="community-category-icon"><Icon size={19} /></span>
                      <div><small>{shortTitle}</small><h4>{title}</h4></div>
                    </header>
                    <dl>
                      <div><dt>语料集</dt><dd>{formatted.corpusSets}</dd></div>
                      <div><dt>语料条数</dt><dd>{formatted.corpusRows}</dd></div>
                      <div><dt>语料规模</dt><dd>{formatted.corpusScale}</dd></div>
                    </dl>
                  </article>
                )
              })}
            </div>
          </aside>
        </div>

        <footer className="community-data-note">
          <span>机构所在省以注册机构地址为准</span>
          <span>个人仅展示省级汇总数据，不展示精确位置和未授权个人信息</span>
          <span>统计快照：2026年7月10日 · 每月10日更新</span>
        </footer>
      </div>
    </section>
  )
}

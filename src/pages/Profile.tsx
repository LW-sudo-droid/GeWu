import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Heart,
  Pencil,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from 'lucide-react'
import { Link } from 'react-router'
import { useApp } from '../context/app-context'
import { corpusRecords, recordDisplayMeta, type CorpusRecord } from './CorpusSearch'

type ProfileTab = 'claimed' | 'uploaded' | 'favorite'
type ModalType = 'basic' | 'realname' | null

type UserProfile = {
  username: string
  institution: string
  realName: string
  contact: string
  researchField: string
  position: string
  bio: string
  avatar: string
}

const emptyProfile = (username = ''): UserProfile => ({
  username,
  institution: '',
  realName: '',
  contact: '',
  researchField: '',
  position: '',
  bio: '',
  avatar: '',
})

function loadProfile(account: string, username: string) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(`gw-profile-${account}`) ?? '{}')
    return { ...emptyProfile(username), ...stored, username: stored.username || username } as UserProfile
  } catch {
    return emptyProfile(username)
  }
}

function corpusByIds(ids: string[]) {
  return ids.map((id) => corpusRecords.find((item) => item.id === id)).filter((item): item is CorpusRecord => Boolean(item))
}

export default function Profile() {
  const { user, openAuth, favorites } = useApp()
  const [activeTab, setActiveTab] = useState<ProfileTab>('claimed')
  const [modal, setModal] = useState<ModalType>(null)
  const [profile, setProfile] = useState<UserProfile>(() => user ? loadProfile(user.account, user.name) : emptyProfile())
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [verificationCode, setVerificationCode] = useState('')
  const [verified, setVerified] = useState(() => Boolean(user && window.localStorage.getItem(`gw-realname-${user.account}`) === 'true'))
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) {
      setProfile(emptyProfile())
      setVerified(false)
      return
    }
    const nextProfile = loadProfile(user.account, user.name)
    setProfile(nextProfile)
    setDraft(nextProfile)
    setVerified(window.localStorage.getItem(`gw-realname-${user.account}`) === 'true')
  }, [user])

  const tabRecords = useMemo(() => {
    if (activeTab === 'claimed') return corpusByIds(['math-01', 'physics-01', 'chem-01', 'geo-04'])
    if (activeTab === 'uploaded') return corpusByIds(['chem-02', 'bio-02', 'physics-03'])
    return favorites
      .map((favorite) => corpusRecords.find((item) => item.id === favorite.id))
      .filter((item): item is CorpusRecord => Boolean(item))
  }, [activeTab, favorites])

  const tabCounts = {
    claimed: 4,
    uploaded: 3,
    favorite: favorites.length,
  }

  const persistProfile = (nextProfile: UserProfile) => {
    if (!user) return
    window.localStorage.setItem(`gw-profile-${user.account}`, JSON.stringify(nextProfile))
    setProfile(nextProfile)
    setDraft(nextProfile)
  }

  const openModal = (type: Exclude<ModalType, null>) => {
    setDraft(profile)
    setVerificationCode('')
    setModal(type)
  }

  const submitBasic = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    persistProfile({ ...profile, username: draft.username.trim(), institution: draft.institution.trim() })
    setModal(null)
  }

  const submitRealname = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !/^\d{6}$/.test(verificationCode)) return
    const nextProfile = {
      ...profile,
      institution: draft.institution.trim(),
      realName: draft.realName.trim(),
      contact: draft.contact.trim(),
      researchField: draft.researchField.trim(),
      position: draft.position.trim(),
      bio: draft.bio.trim(),
    }
    persistProfile(nextProfile)
    window.localStorage.setItem(`gw-realname-${user.account}`, 'true')
    setVerified(true)
    setModal(null)
  }

  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => persistProfile({ ...profile, avatar: typeof reader.result === 'string' ? reader.result : '' })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  if (!user) {
    return (
      <main className="profile-page profile-guest-page">
        <section className="profile-guest-card">
          <div className="profile-guest-icon"><UserRound size={35} /></div>
          <h1>个人主页</h1>
          <p>登录后可管理个人资料、实名认证信息，以及已认领、已上传和已收藏的语料库</p>
          <button type="button" onClick={() => openAuth('/profile')}>登录平台</button>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <section className="profile-heading">
        <div><h1>个人主页</h1><p>管理个人资料、认证信息与语料建设成果</p></div>
      </section>

      <div className="profile-layout">
        <aside className="profile-user-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-large">
              {profile.avatar ? <img src={profile.avatar} alt="用户头像" /> : <span>{profile.username.slice(0, 1) || '用'}</span>}
            </div>
            <button type="button" className="profile-avatar-upload" onClick={() => avatarInputRef.current?.click()} aria-label="上传头像"><Camera size={17} /></button>
            <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={uploadAvatar} />
          </div>

          <div className="profile-identity">
            <h2>{profile.username}</h2>
            <p><Building2 size={15} />{profile.institution || '暂未填写机构'}</p>
            <button type="button" className={`profile-verification-trigger ${verified ? 'is-verified' : ''}`} onClick={() => openModal('realname')}>
              {verified ? <BadgeCheck size={15} /> : <ShieldCheck size={15} />}{verified ? '已实名认证' : '未实名认证'}
            </button>
          </div>

          {(profile.researchField || profile.position) && (
            <div className="profile-detail-tags">
              {profile.researchField && <span>{profile.researchField}</span>}
              {profile.position && <span>{profile.position}</span>}
            </div>
          )}

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-side-actions">
            <button type="button" onClick={() => openModal('basic')}><Pencil size={16} />编辑基本信息</button>
          </div>
        </aside>

        <section className="profile-corpus-panel">
          <header className="profile-corpus-header">
            <div><h2>我的语料库</h2><p>集中查看个人参与建设和关注的语料资源</p></div>
            <Link to="/upload">上传语料库<ChevronRight size={16} /></Link>
          </header>

          <div className="profile-tabs" role="tablist" aria-label="语料信息分类">
            {([
              ['claimed', '已认领'],
              ['uploaded', '已上传'],
              ['favorite', '已收藏'],
            ] as Array<[ProfileTab, string]>).map(([value, label]) => (
              <button type="button" role="tab" aria-selected={activeTab === value} className={activeTab === value ? 'is-active' : ''} onClick={() => setActiveTab(value)} key={value}>
                {label}<span>{tabCounts[value]}</span>
              </button>
            ))}
          </div>

          {tabRecords.length ? (
            <div className="profile-corpus-grid">
              {tabRecords.map((item) => {
                const meta = recordDisplayMeta(item)
                return (
                  <Link className="catalog-corpus-card profile-corpus-card" to={`/search/datasets/${item.id}`} target="_blank" rel="noreferrer" key={item.id}>
                    <div className="catalog-card-topline">
                      <div className="catalog-card-tags">
                        <span className="catalog-subject-tag">{item.subject}</span>
                        <span>{item.corpusType}</span>
                        <span className={meta.opennessLabel === '全部公开' ? 'is-open' : ''}>{meta.opennessLabel}</span>
                      </div>
                      <time dateTime={item.publishedAt}><CalendarDays size={13} />{item.publishedAt}</time>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="catalog-card-metadata"><span><Building2 size={14} />{item.organization} - {item.authors}</span></div>
                    <p>{item.summary}</p>
                    <div className="profile-card-volume">
                      <span><small>语料规模</small><strong>{meta.corpusSize}</strong></span>
                      <span><small>存储容量</small><strong>{meta.storageSize}</strong></span>
                    </div>
                    <footer>
                      <span><Eye size={14} />{item.views.toLocaleString()}</span>
                      <span><Heart size={14} />{item.favorites.toLocaleString()}</span>
                      <span><Download size={14} />{item.usage.toLocaleString()}</span>
                      <strong>查看详情<ChevronRight size={14} /></strong>
                    </footer>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="profile-empty-state">
              <Star size={30} />
              <strong>暂时没有已收藏的语料库</strong>
              <p>浏览语料详情并点击收藏后，语料库会实时显示在这里</p>
              <Link to="/search">浏览语料</Link>
            </div>
          )}
        </section>
      </div>

      {modal === 'basic' && (
        <div className="dataset-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}>
          <form className="dataset-modal profile-edit-modal" onSubmit={submitBasic}>
            <div className="dataset-modal-title"><div><Pencil size={21} /><h2>编辑基本信息</h2></div><button type="button" onClick={() => setModal(null)} aria-label="关闭"><X size={18} /></button></div>
            <p>更新个人主页对外展示的名称与机构信息</p>
            <label><span>用户名</span><input required value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} placeholder="请输入用户名" /></label>
            <label><span>机构名称</span><input required value={draft.institution} onChange={(event) => setDraft({ ...draft, institution: event.target.value })} placeholder="请输入所在机构" /></label>
            <div className="dataset-modal-actions"><button type="button" onClick={() => setModal(null)}>取消</button><button type="submit" className="is-primary">保存</button></div>
          </form>
        </div>
      )}

      {modal === 'realname' && (
        <div className="dataset-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}>
          <form className="dataset-modal profile-realname-modal" onSubmit={submitRealname}>
            <div className="dataset-modal-title"><div><ShieldCheck size={21} /><h2>{verified ? '编辑认证信息' : '实名认证'}</h2></div><button type="button" onClick={() => setModal(null)} aria-label="关闭"><X size={18} /></button></div>
            <p>带星号的项目用于完成身份认证，认证信息将按平台规则妥善管理</p>
            <div className="profile-form-grid">
              <label><span>真实姓名 <b>*</b></span><input required value={draft.realName} onChange={(event) => setDraft({ ...draft, realName: event.target.value })} placeholder="请输入真实姓名" /></label>
              <label><span>所在单位 <b>*</b></span><input required value={draft.institution} onChange={(event) => setDraft({ ...draft, institution: event.target.value })} placeholder="请输入所在单位" /></label>
              <label className="is-wide"><span>联系方式（手机号/邮箱） <b>*</b></span><input required value={draft.contact} onChange={(event) => setDraft({ ...draft, contact: event.target.value })} placeholder="请输入手机号或邮箱" /></label>
              <label className="is-wide"><span>验证码 <b>*</b></span><input required inputMode="numeric" minLength={6} maxLength={6} pattern="[0-9]{6}" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入6位验证码" /></label>
              <label><span>研究领域</span><input value={draft.researchField} onChange={(event) => setDraft({ ...draft, researchField: event.target.value })} placeholder="如：计算数学" /></label>
              <label><span>职务</span><input value={draft.position} onChange={(event) => setDraft({ ...draft, position: event.target.value })} placeholder="如：教师、科研人员" /></label>
              <label className="is-wide"><span>个人简介</span><textarea rows={4} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} placeholder="简要介绍您的研究方向或语料建设经历" /></label>
            </div>
            <div className="dataset-modal-actions"><button type="button" onClick={() => setModal(null)}>取消</button><button type="submit" className="is-primary"><CheckCircle2 size={16} />提交认证</button></div>
          </form>
        </div>
      )}
    </main>
  )
}

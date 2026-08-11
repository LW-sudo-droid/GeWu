import { type FormEvent, useMemo, useRef, useState } from 'react'
import {
  ArrowUpFromLine,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Download,
  FileArchive,
  FileText,
  Folder,
  FolderUp,
  Github,
  Info,
  Mail,
  Pencil,
  Share2,
  ShieldCheck,
  Star,
  ThumbsUp,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useApp } from '../context/app-context'
import { corpusRecords, recordDisplayMeta } from './CorpusSearch'

type DetailTab = 'guide' | 'preview' | 'feedback'
type PendingAction = 'edit' | 'upload' | 'download' | null
type UploadMode = 'local' | 'external'
type MemberPermission = '可管理' | '可编辑' | '可使用'

const previewFiles = [
  { name: 'README.md', type: 'file' },
  { name: 'metadata.json', type: 'file' },
  { name: '训练数据', type: 'folder' },
  { name: 'train_0001.jsonl', type: 'file', nested: true },
  { name: 'train_0002.jsonl', type: 'file', nested: true },
  { name: '示例数据', type: 'folder' },
  { name: 'sample.jsonl', type: 'file', nested: true },
]

const previewContent: Record<string, string> = {
  'README.md': `# 数据集说明\n\n本语料集面向基础学科模型训练与专业推理能力提升，包含规范化问题、推理过程、结论与来源信息。`,
  'metadata.json': `{
  "title": "高质量科学语料示例",
  "language": "zh-CN",
  "license": "平台科研使用许可协议",
  "modalities": ["text", "formula"],
  "version": "1.0.0"
}`,
  'train_0001.jsonl': `{"id":"math_000001","question":"证明连续函数在闭区间上有界","reasoning":"首先利用闭区间的紧致性……","answer":"因此函数在该区间上有界","source":"专业教材"}\n{"id":"math_000002","question":"计算该积分并说明换元依据","reasoning":"识别被积函数结构后……","answer":"积分结果为……","source":"课程习题"}`,
  'train_0002.jsonl': `{"id":"science_000003","instruction":"分析实验现象并给出推理过程","evidence":["实验记录","参数表"],"response":"根据观测证据可得到……"}`,
  'sample.jsonl': `{"sample":true,"subject":"科学语料","content":"此处展示平台允许公开浏览的示例数据。"}`,
}

export default function DatasetDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user, openAuth, favorites, toggleFavorite } = useApp()
  const item = corpusRecords.find((record) => record.id === id) ?? corpusRecords[0]
  const displayMeta = recordDisplayMeta(item)
  const isOwner = Boolean(user)
  const favorite = favorites.some((record) => record.id === item.id)
  const verifiedKey = user ? `gw-realname-${user.account}` : 'gw-realname-guest'
  const [verified, setVerified] = useState(() => window.localStorage.getItem(verifiedKey) === 'true')
  const [liked, setLiked] = useState(() => window.localStorage.getItem(`gw-liked-${item.id}`) === 'true')
  const [activeTab, setActiveTab] = useState<DetailTab>('guide')
  const [selectedFile, setSelectedFile] = useState('README.md')
  const [toast, setToast] = useState('')
  const [realnameOpen, setRealnameOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState<UploadMode>('local')
  const [memberOpen, setMemberOpen] = useState(false)
  const [memberAccount, setMemberAccount] = useState('')
  const [memberPermission, setMemberPermission] = useState<MemberPermission>('可编辑')
  const [members, setMembers] = useState<Array<{ account: string; permission: MemberPermission }>>([
    { account: 'corpus_editor01', permission: '可编辑' },
    { account: 'research_user02', permission: '可使用' },
  ])
  const [feedbackTask, setFeedbackTask] = useState('')
  const [feedbackModel, setFeedbackModel] = useState('')
  const [feedbackEffect, setFeedbackEffect] = useState('')
  const [feedbackSuggestion, setFeedbackSuggestion] = useState('')
  const toastTimer = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const openness = displayMeta.opennessLabel
  const canDownloadAll = isOwner || openness === '全部公开'
  const restrictedPreview = !isOwner && openness === '不公开'
  const likeCount = item.favorites + 120 + (liked ? 1 : 0)
  const updatedAt = useMemo(() => {
    const date = new Date(item.publishedAt)
    date.setDate(date.getDate() + 12)
    return date.toISOString().slice(0, 10)
  }, [item.publishedAt])

  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const beginProtectedAction = (action: Exclude<PendingAction, null>) => {
    if (!user) {
      openAuth()
      notify('请先登录后继续操作')
      return
    }
    if (!verified) {
      setPendingAction(action)
      setRealnameOpen(true)
      return
    }
    if (action === 'edit') navigate(`/upload?edit=${item.id}`)
    else setUploadOpen(true)
  }

  const submitRealname = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.localStorage.setItem(verifiedKey, 'true')
    setVerified(true)
    setRealnameOpen(false)
    notify('实名认证已提交并通过验证')
    if (pendingAction === 'edit') navigate(`/upload?edit=${item.id}`)
    if (pendingAction === 'upload') setUploadOpen(true)
    if (pendingAction === 'download') performDownload()
    setPendingAction(null)
  }

  const handleLike = () => {
    const next = !liked
    setLiked(next)
    window.localStorage.setItem(`gw-liked-${item.id}`, String(next))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      notify('已复制链接，可以转发')
    } catch {
      notify('链接已准备好，请从浏览器地址栏复制')
    }
  }

  const performDownload = () => {
    if (openness === '不公开' && !isOwner) {
      notify('该语料暂不公开，请联系作者申请下载权限')
      return
    }
    const scope = canDownloadAll ? '全部数据' : '公开部分数据'
    const content = JSON.stringify({ corpus: item.title, scope, generatedAt: new Date().toISOString(), sample: previewContent['sample.jsonl'] }, null, 2)
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${item.id}-${canDownloadAll ? 'full' : 'public'}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    notify(openness === '部分公开' && !isOwner ? '已下载公开部分数据，完整数据请联系作者申请' : '下载任务已开始')
  }

  const handleDownload = () => {
    if (!user) {
      openAuth()
      notify('请先登录并完成实名认证')
      return
    }
    if (!verified) {
      setPendingAction('download')
      setRealnameOpen(true)
      return
    }
    performDownload()
  }

  const addMember = () => {
    const account = memberAccount.trim()
    if (!account) return
    setMembers((current) => [...current.filter((member) => member.account !== account), { account, permission: memberPermission }])
    setMemberAccount('')
    notify('成员已添加')
  }

  const submitUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploadOpen(false)
    notify('语料已提交，等待最高管理员审核')
  }

  const submitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    notify('反馈提交成功，感谢您的使用')
    setFeedbackTask('')
    setFeedbackModel('')
    setFeedbackEffect('')
    setFeedbackSuggestion('')
  }

  return (
    <main className="dataset-detail-page">
      <nav className="dataset-breadcrumb" aria-label="网页层级">
        <Link to="/">首页</Link><ChevronRight size={14} />
        <Link to="/search/results">语料集</Link><ChevronRight size={14} />
        <span>{item.title}</span>
      </nav>

      <div className="dataset-detail-layout">
        <section className="dataset-summary-card">
          <div className="dataset-summary-head">
            <div className="dataset-badges">
              <span className={`dataset-status ${displayMeta.status === '已上传' ? 'is-uploaded' : 'is-pending'}`}>{displayMeta.status}</span>
              <span>{item.subject}</span><span>{item.corpusType}</span><span className="is-open">{openness}</span>
            </div>
            <div className="dataset-admin-actions">
              {isOwner && <button type="button" onClick={() => beginProtectedAction('edit')}><Pencil size={15} />编辑语料</button>}
              {isOwner && <button type="button" onClick={() => setMemberOpen(true)}><Users size={15} />管理成员</button>}
              <button type="button" onClick={() => beginProtectedAction('upload')}><Upload size={15} />上传语料</button>
            </div>
          </div>

          <div className="dataset-title-block">
            <p className="dataset-id">语料集编号：GW-{item.id.toUpperCase()}</p>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </div>

          <div className="dataset-metadata-grid">
            <div><span>发布机构</span><strong><Building2 size={15} />{item.organization}</strong></div>
            <div><span>作者姓名</span><strong>{item.authors}</strong></div>
            <div><span>发布时间</span><strong><CalendarDays size={15} />{item.publishedAt}</strong></div>
            <div><span>更新时间</span><strong>{updatedAt}</strong></div>
            <div><span>语料规模</span><strong>{displayMeta.corpusSize}</strong></div>
            <div><span>存储容量</span><strong>{displayMeta.storageSize}</strong></div>
          </div>

          <div className="dataset-social-actions">
            <button type="button" className={liked ? 'is-active' : ''} onClick={handleLike}><ThumbsUp size={17} />点赞 <b>{likeCount}</b></button>
            <button type="button" className={favorite ? 'is-active' : ''} onClick={() => { toggleFavorite({ id: item.id, title: item.title }); notify(favorite ? '已取消收藏' : '已收藏，可在个人主页查看') }}><Star size={17} />{favorite ? '已收藏' : '收藏'}</button>
            <button type="button" onClick={handleShare}><Share2 size={17} />转发</button>
            <button type="button" className="dataset-download-button" onClick={handleDownload}><Download size={17} />{canDownloadAll ? '下载数据' : openness === '部分公开' ? '下载公开数据' : '申请下载'}</button>
          </div>
        </section>

        <aside className="dataset-side-column">
          <section className="dataset-side-card">
            <div className="side-card-title"><Info size={18} /><h2>基本信息</h2></div>
            <dl><div><dt>语料类型</dt><dd>{item.corpusType}</dd></div><div><dt>开放程度</dt><dd>{openness}</dd></div><div><dt>语料格式</dt><dd>JSONL、Markdown</dd></div><div><dt>时间跨度</dt><dd>2018—2026年</dd></div></dl>
          </section>
          <section className="dataset-side-card">
            <div className="side-card-title"><ShieldCheck size={18} /><h2>权益信息</h2></div>
            <dl><div><dt>权益主体</dt><dd>{item.organization}</dd></div><div><dt>授权方式</dt><dd>{openness === '全部公开' ? '科研与教学开放许可' : '依申请授权使用'}</dd></div></dl>
            <a className="dataset-contact" href={`mailto:corpus@pku.edu.cn?subject=${encodeURIComponent(`申请使用：${item.title}`)}`}><Mail size={15} />联系作者申请权限</a>
          </section>
        </aside>
      </div>

      <section className="dataset-content-panel">
        <div className="dataset-content-tabs" role="tablist">
          <button type="button" className={activeTab === 'guide' ? 'is-active' : ''} onClick={() => setActiveTab('guide')}><FileText size={17} />使用说明</button>
          <button type="button" className={activeTab === 'preview' ? 'is-active' : ''} onClick={() => setActiveTab('preview')}><Code2 size={17} />语料预览</button>
          <button type="button" className={activeTab === 'feedback' ? 'is-active' : ''} onClick={() => setActiveTab('feedback')}><ClipboardCheck size={17} />用户反馈</button>
        </div>

        {activeTab === 'guide' && (
          <div className="dataset-guide-grid">
            <article><h2>语料说明</h2><p>{item.summary}</p><h3>主要数据来源</h3><ul><li>高校专业教材、培养方案与课程资料</li><li>科研文献、实验记录及规范化数据资源</li><li>经专家校验的领域知识与推理过程</li></ul></article>
            <article><h2>下载教程</h2><ol><li>根据开放程度确认可下载的数据范围</li><li>点击页面上方“下载”按钮获取数据文件</li><li>部分公开或不公开数据可通过“联系作者”申请</li><li>使用数据时请遵循对应许可协议并规范引用</li></ol></article>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="dataset-preview-layout">
            <aside className="preview-file-tree">
              <strong>示例文件</strong>
              {previewFiles.map((file) => (
                <button type="button" key={file.name} className={`${file.nested ? 'is-nested ' : ''}${selectedFile === file.name ? 'is-active' : ''}`} disabled={file.type === 'folder'} onClick={() => file.type === 'file' && setSelectedFile(file.name)}>
                  {file.type === 'folder' ? <Folder size={15} /> : <FileText size={15} />}{file.name}
                </button>
              ))}
            </aside>
            <div className="preview-code-panel">
              <div><span>{selectedFile}</span><small>{restrictedPreview ? '仅展示公开样例' : '示例数据预览'}</small></div>
              <pre><code>{restrictedPreview ? previewContent['sample.jsonl'] : previewContent[selectedFile] ?? '请选择文件查看内容'}</code></pre>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <form className="dataset-feedback-form" onSubmit={submitFeedback}>
            <div className="feedback-heading"><h2>语料使用反馈</h2><p>反馈将用于持续优化语料质量和服务方式</p></div>
            <label><span>使用本语料完成的任务 <b>*</b></span><input required value={feedbackTask} onChange={(event) => setFeedbackTask(event.target.value)} placeholder="例如：基础学科问答模型训练" /></label>
            <label><span>涉及的模型名称 <b>*</b></span><input required value={feedbackModel} onChange={(event) => setFeedbackModel(event.target.value)} placeholder="请输入模型名称及版本" /></label>
            <label className="is-wide"><span>语料效果反馈 <b>*</b></span><textarea required value={feedbackEffect} onChange={(event) => setFeedbackEffect(event.target.value)} placeholder="请描述语料在实际使用中的效果" /></label>
            <label className="is-wide"><span>其他建议</span><textarea value={feedbackSuggestion} onChange={(event) => setFeedbackSuggestion(event.target.value)} placeholder="可填写数据质量、格式或平台功能建议" /></label>
            <button type="submit">提交反馈</button>
          </form>
        )}
      </section>

      {realnameOpen && (
        <div className="dataset-modal-overlay">
          <form className="dataset-modal realname-modal" onSubmit={submitRealname}>
            <div className="dataset-modal-title"><div><ShieldCheck size={21} /><h2>实名认证</h2></div><button type="button" onClick={() => setRealnameOpen(false)}><X size={18} /></button></div>
            <p>完成实名认证后可编辑或向语料库上传数据</p>
            <label><span>真实姓名</span><input required placeholder="请输入真实姓名" /></label>
            <label><span>联系方式</span><input required placeholder="手机号/邮箱" /></label>
            <label><span>所在单位</span><input required placeholder="请输入所在单位" /></label>
            <label><span>验证码</span><div className="verification-row"><input required placeholder="请输入验证码" /><button type="button" onClick={() => notify('验证码已发送')}>获取验证码</button></div></label>
            <div className="dataset-modal-actions"><button type="button" onClick={() => setRealnameOpen(false)}>取消</button><button type="submit" className="is-primary">提交认证</button></div>
          </form>
        </div>
      )}

      {memberOpen && (
        <div className="dataset-modal-overlay">
          <section className="dataset-modal member-modal" role="dialog" aria-modal="true">
            <div className="dataset-modal-title"><div><Users size={21} /><h2>管理成员</h2></div><button type="button" onClick={() => setMemberOpen(false)}><X size={18} /></button></div>
            <div className="member-add-row"><input value={memberAccount} onChange={(event) => setMemberAccount(event.target.value)} placeholder="输入用户账号名" /><select value={memberPermission} onChange={(event) => setMemberPermission(event.target.value as MemberPermission)}><option>可管理</option><option>可编辑</option><option>可使用</option></select><button type="button" onClick={addMember}><UserPlus size={16} />添加</button></div>
            <div className="member-list"><div className="member-list-head"><span>成员账号</span><span>权限</span><span>操作</span></div>{members.map((member) => <div key={member.account}><span>{member.account}</span><span>{member.permission}</span><button type="button" onClick={() => setMembers((current) => current.filter((item) => item.account !== member.account))}>移除</button></div>)}</div>
          </section>
        </div>
      )}

      {uploadOpen && (
        <div className="dataset-modal-overlay">
          <form className="dataset-modal upload-corpus-modal" onSubmit={submitUpload}>
            <div className="dataset-modal-title"><div><ArrowUpFromLine size={21} /><h2>上传语料</h2></div><button type="button" onClick={() => setUploadOpen(false)}><X size={18} /></button></div>
            <label className="upload-license"><span>语料库文件许可协议</span><select required defaultValue=""><option value="" disabled>请选择许可协议</option><option>平台科研使用许可协议</option><option>署名共享许可协议</option><option>自定义授权协议</option></select></label>
            <div className="upload-mode-tabs"><button type="button" className={uploadMode === 'local' ? 'is-active' : ''} onClick={() => setUploadMode('local')}>本地上传</button><button type="button" className={uploadMode === 'external' ? 'is-active' : ''} onClick={() => setUploadMode('external')}>外部导入</button></div>
            {uploadMode === 'local' ? (
              <div className="upload-drop-area"><FileArchive size={32} /><strong>选择需要上传的语料文件</strong><p>支持常见文本、表格、压缩包及多模态文件</p><div><button type="button" onClick={() => fileInputRef.current?.click()}><ArrowUpFromLine size={16} />上传文件</button><button type="button" onClick={() => folderInputRef.current?.click()}><FolderUp size={16} />上传文件夹</button></div><input ref={fileInputRef} hidden type="file" multiple /><input ref={(node) => { folderInputRef.current = node; node?.setAttribute('webkitdirectory', '') }} hidden type="file" multiple /></div>
            ) : (
              <label className="github-import"><Github size={24} /><span>GitHub 仓库链接</span><input required placeholder="https://github.com/organization/repository" /></label>
            )}
            <label className="upload-confirm"><input required type="checkbox" /><span>我已确认上传内容符合许可协议及平台合规要求</span></label>
            <div className="dataset-modal-actions"><button type="button" onClick={() => setUploadOpen(false)}>取消</button><button type="submit" className="is-primary">提交审核</button></div>
          </form>
        </div>
      )}

      {toast && <div className="dataset-toast"><Check size={16} />{toast}</div>}
    </main>
  )
}

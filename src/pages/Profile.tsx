import { useState, type FormEvent } from 'react'
import { BadgeCheck, ShieldCheck, X } from 'lucide-react'
import { Link } from 'react-router'
import PlaceholderPage from '../components/PlaceholderPage'
import { useApp } from '../context/app-context'

export default function Profile() {
  const { user, openAuth, favorites } = useApp()
  const verifiedKey = user ? `gw-realname-${user.account}` : 'gw-realname-guest'
  const [verified, setVerified] = useState(() => Boolean(user && window.localStorage.getItem(verifiedKey) === 'true'))
  const [realnameOpen, setRealnameOpen] = useState(false)

  const submitRealname = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.localStorage.setItem(verifiedKey, 'true')
    setVerified(true)
    setRealnameOpen(false)
  }

  return (
    <PlaceholderPage eyebrow="个人中心" title="个人主页" description={user ? `当前登录用户：${user.name}（${user.account}）` : '登录后可查看个人信息、上传记录与语料贡献。'}>
      {!user && <button type="button" className="auth-submit profile-login" onClick={openAuth}>立即登录</button>}
      {user && (
        <>
          <section className="profile-verification-card">
            <div>{verified ? <BadgeCheck size={25} /> : <ShieldCheck size={25} />}<span><strong>{verified ? '已完成实名认证' : '尚未完成实名认证'}</strong><small>{verified ? '您可以上传和下载权限范围内的语料数据' : '完成实名认证后方可上传或下载语料数据'}</small></span></div>
            {verified ? <Link to="/upload">上传语料库</Link> : <button type="button" onClick={() => setRealnameOpen(true)}>立即认证</button>}
          </section>
          <section className="profile-favorites"><h2>我的收藏</h2>{favorites.length ? favorites.map((item) => <Link key={item.id} to={`/search/datasets/${item.id}`}>{item.title}</Link>) : <p>暂未收藏语料</p>}</section>
        </>
      )}
      {realnameOpen && (
        <div className="dataset-modal-overlay">
          <form className="dataset-modal realname-modal" onSubmit={submitRealname}>
            <div className="dataset-modal-title"><div><ShieldCheck size={21} /><h2>实名认证</h2></div><button type="button" onClick={() => setRealnameOpen(false)}><X size={18} /></button></div>
            <p>完成实名认证后可上传和下载语料数据</p>
            <label><span>真实姓名</span><input required placeholder="请输入真实姓名" /></label>
            <label><span>联系方式</span><input required placeholder="手机号/邮箱" /></label>
            <label><span>所在单位</span><input required placeholder="请输入所在单位" /></label>
            <label><span>验证码</span><div className="verification-row"><input required placeholder="请输入验证码" /><button type="button">获取验证码</button></div></label>
            <div className="dataset-modal-actions"><button type="button" onClick={() => setRealnameOpen(false)}>取消</button><button type="submit" className="is-primary">提交认证</button></div>
          </form>
        </div>
      )}
    </PlaceholderPage>
  )
}

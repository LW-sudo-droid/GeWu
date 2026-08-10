import PlaceholderPage from '../components/PlaceholderPage'
import { useApp } from '../context/app-context'
export default function Profile() {
  const { user, openAuth } = useApp()
  return (
    <PlaceholderPage eyebrow="PROFILE" title="个人主页" description={user ? `当前登录用户：${user.name}（${user.account}）` : '登录后可查看个人信息、上传记录与语料贡献。'}>
      {!user && <button type="button" className="auth-submit profile-login" onClick={openAuth}>立即登录</button>}
    </PlaceholderPage>
  )
}

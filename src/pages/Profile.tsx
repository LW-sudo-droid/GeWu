import PlaceholderPage from '../components/PlaceholderPage'
import { useApp } from '../context/app-context'
import { Link } from 'react-router'
export default function Profile() {
  const { user, openAuth, favorites } = useApp()
  return (
    <PlaceholderPage eyebrow="个人中心" title="个人主页" description={user ? `当前登录用户：${user.name}（${user.account}）` : '登录后可查看个人信息、上传记录与语料贡献。'}>
      {!user && <button type="button" className="auth-submit profile-login" onClick={openAuth}>立即登录</button>}
      {user && (
        <section className="profile-favorites">
          <h2>我的收藏</h2>
          {favorites.length ? favorites.map((item) => <Link key={item.id} to={`/search/datasets/${item.id}`}>{item.title}</Link>) : <p>暂未收藏语料</p>}
        </section>
      )}
    </PlaceholderPage>
  )
}

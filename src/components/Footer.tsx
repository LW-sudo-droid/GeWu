import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import LogoMark from './LogoMark'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <section className="footer-unit-column" aria-label="项目建设单位">
          <h2>建设单位</h2>
          <dl>
            <div><dt>主管单位</dt><dd>北京大学</dd></div>
            <div><dt>主建单位</dt><dd>北京大学图书馆<br />北京大学计算中心</dd></div>
            <div><dt>合作单位</dt><dd>北京科学智能研究院（AISI）</dd></div>
          </dl>
        </section>

        <section className="footer-contact-column" aria-label="运营与联系信息">
          <h2>运营与联系</h2>
          <p><strong>运营单位</strong><span>北京大学图书馆</span></p>
          <p><MapPin size={14} /><span>北京市海淀区颐和园路5号</span></p>
          <p><Phone size={14} /><span>010-62751000</span></p>
          <p><Mail size={14} /><a href="mailto:noah@pku.edu.cn">noah@pku.edu.cn</a></p>
        </section>

        <section className="footer-service-column" aria-label="服务支持">
          <h2>服务支持</h2>
          <a href="mailto:noah@pku.edu.cn?subject=问题反馈">问题反馈</a>
          <a href="mailto:noah@pku.edu.cn?subject=权益申诉">权益申诉</a>
          <span>服务邮箱：noah@pku.edu.cn</span>
        </section>

        <section className="footer-brand-column" aria-label="平台信息">
          <div className="footer-brand-mark"><LogoMark size={58} /></div>
          <div>
            <strong>格物 · 科学语料库</strong>
            <span>科学语料共建共享平台</span>
          </div>
        </section>
      </div>

      <div className="site-footer-bottom">
        <div>
          <span>© 2026 北京大学 版权所有</span>
          <i aria-hidden="true" />
          <Link to="/about">关于我们</Link>
          <span aria-hidden="true">·</span>
          <Link to="/about#site-statement">网站声明</Link>
          <span aria-hidden="true">·</span>
          <Link to="/about#privacy">隐私政策</Link>
        </div>
      </div>
    </footer>
  )
}

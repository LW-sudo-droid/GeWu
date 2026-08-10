import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Panorama from './pages/Panorama'
import CorpusSearch from './pages/CorpusSearch'
import ToolMarket from './pages/ToolMarket'
import About from './pages/About'
import DatasetDetail from './pages/DatasetDetail'
import CorpusUpload from './pages/CorpusUpload'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/panorama" element={<Panorama />} />
        <Route path="/search" element={<CorpusSearch />} />
        <Route path="/search/datasets/:id" element={<DatasetDetail />} />
        <Route path="/upload" element={<CorpusUpload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tools" element={<ToolMarket />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

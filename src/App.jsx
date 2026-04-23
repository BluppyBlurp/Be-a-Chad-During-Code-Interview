    import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Config from './pages/Config'
import IDE from './pages/IDE'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/config" element={<Config />} />
        <Route path="/ide" element={<IDE />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
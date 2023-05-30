import Navbar from "./Navbar";
import MainPage from "./pages/mainpage";
import KeywordsPage from './pages/keywordsPage';
import Bulkategorize from "./pages/BulKategorize";
import {Route, Routes} from 'react-router-dom'
function App() {

  return (
    <div >
    <Navbar/>
    <div>
    <Routes>
<Route path="/" element={<MainPage />}/>
<Route path="/keywords" element={<KeywordsPage />} />
<Route path="/bulkategorize" element={<Bulkategorize />} />
    </Routes>
    </div>
    </div>

  );
}

export default App;

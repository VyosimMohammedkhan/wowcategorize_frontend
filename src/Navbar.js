import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import KeywordsPage from './pages/keywordsPage';
import CrawlMany from "./pages/CrawlManyDomains";

export default function Navbar() {

  return (
    <div>
      <nav class="navbar navbar-expand-md navbar-light bg-light" >
        <h2><Link to='/' className='navbar-brand'>WowCategorize</Link></h2>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        {/* <div class="collapse navbar-collapse " id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link to='/' className='nav-link'>Main Page</Link>
            </li>
            <li class="nav-item">
              <Link to='/keywords' className='nav-link'>Customize keywords</Link>
            </li>
            <li class="nav-item">
              <Link to='/crawlSingleUrl' className='nav-link'>Crawl single domain</Link>
            </li>
          </ul>
        </div> */}
        <div className='container-fluid'>
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="categorizationtab" data-bs-toggle="tab" data-bs-target="#mainpage" type="button" role="tab" aria-controls="categorizationData" aria-selected="true">Main Page</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="HTMLtab" data-bs-toggle="tab" data-bs-target="#keywordspage" type="button" role="tab" aria-controls="renderedHTML" aria-selected="false">Customize keywords</button>
            </li>
          </ul>
        </div>
      </nav>

      <div class="tab-content" id="myTabContent">
        <div className="mt-1 tab-pane fade show active" id="mainpage" role="tabpanel" aria-labelledby="mainpage">
          <CrawlMany/>
        </div>
        <div className="tab-pane fade overflow-auto" id="keywordspage" role="tabpanel" aria-labelledby="keywordspage" >
          <KeywordsPage/>
        </div>
      </div>
    </div>
  )
}
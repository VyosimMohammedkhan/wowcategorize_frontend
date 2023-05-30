import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
export default function Navbar(){

    return (<div>
      <nav class="navbar-custom" style={{height:'3vw' , fontSize:'10px'}}>
        <h2><Link to='/' className='mainPage' >WowCategorize</Link> </h2>
        <div >
        <Link to='/'><button className='Pagebutton'>Main Page</button></Link>
        <Link to='/keywords' ><button className='Pagebutton'>Customize keywords</button></Link>
        <Link to='/bulkategorize' ><button className='Pagebutton'>Bulk categorization</button></Link>
        </div>
  </nav>
  
    </div>)
}
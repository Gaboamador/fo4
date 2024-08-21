import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import $ from 'jquery'
import { BsChevronUp } from "react-icons/bs";
import Header from './components/header';
import Home from './components/home'
import PasswordHacker from './components/passwordHacker';
import PerkTable from './components/perkTable';
import FindMaterials from './components/findMaterials';

function App() {
  
  $(document).ready(function(){

    $('.ir-arriba').click(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }, 300);
    });

    $(window).scroll(function(){
      if( $(this).scrollTop() > 0 ){
        $('.ir-arriba').slideDown(300);
      } else {
        $('.ir-arriba').slideUp(300);
      }
    });

  });

  return (
    <div className="App">
      {/* <header className="App-header">
        
      </header> */}
      <Router>
        <Header/>
        <Routes>
            <Route exact path="/" element={<Home/>}></Route>
            <Route path="/passwordHacker" element={<PasswordHacker/>}></Route>
            <Route path="/perkTable" element={<PerkTable/>}></Route>
            <Route path="/findMaterials" element={<FindMaterials/>}></Route>
          </Routes>
          <span className="ir-arriba">
            <BsChevronUp/>
          </span>
      </Router>
    </div>
  );
}

export default App;

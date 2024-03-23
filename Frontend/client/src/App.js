// import logo from './logo.svg';
import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup';
import Home from './Home';
import Response from './Response';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/auth' element = {<Home />}></Route>
        <Route path='/login' element = {<Login />}></Route>
        <Route path='/signup' element = {<Signup />}></Route>
        <Route path='/select' element={<Response />}></Route>
      </Routes>
   </BrowserRouter>
  );
}

export default App;

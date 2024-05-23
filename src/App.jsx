import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./pages/home"
import Login from "./pages/login"
import Main from "./pages/mainP"


import {BrowserRouter as Router , Routes , Route , Link } from "react-router-dom"
import './App.css'

function Layout () {
  return (
    <div className='layout'>
        layout
    </div>
  )
}
function App() {
    const [isAuth , setIsAuth] = useState(true)

  return (
    <>
      <Router>
       
       <nav>
          <Link to="/" > Home </Link>
          {/* isAuth && */ <Link to="/login" > Login </Link>}
          <Link to="/main" > Main </Link>
       </nav>
      
      <Routes>
        
        
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/main" element={<Main />} />
        

      </Routes>
    
      </Router>
    </>
  )
}

export default App

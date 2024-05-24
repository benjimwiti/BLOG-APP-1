import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./pages/home"
import Login from "./pages/login"
import Main from "./pages/mainP"

import { signOut } from 'firebase/auth'
import {auth} from './firebase-config'


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

    //sign out functionality --after promise resolves change isAuth state to apply the changes
    const signOutfn = () => {
      signOut(auth).then(() => {
        localStorage.clear()
        setIsAuth(false) 
      })
    }

  return (
    <>
      <Router>
       
       <nav>
          <Link to="/" > Home </Link>
          {!isAuth ? 
           <Link to="/login" > Login </Link> :
            <button className='sign-out-btn' onClick={signOutfn} > Sign Out</button> }
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

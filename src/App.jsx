import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./pages/home"
import Login from "./pages/login"
import Comments from './pages/Comments';

import Main from "./pages/create-post"
import ErrorSpecs from './pages/error-specs'
import AIchat from './pages/chat-bot'
import EditPost from './pages/edit-post'

import { signOut } from 'firebase/auth'
import {auth} from './firebase-config'
import { getAuth, setPersistence } from 'firebase/auth'


import {BrowserRouter as Router , Routes , Route , Link } from "react-router-dom"
import './App.css'
import firebase from 'firebase/compat/app'
import CreatePost from './pages/create-post'

function Layout () {
  return (
    <div className='layout'>
        layout
    </div>
  )
}

function App() {
    const loggedIn= () => localStorage.getItem('isAuth') || false 
    const [isAuth , setIsAuth] = useState(loggedIn)
    console.log(loggedIn)
    //if()
    const [errorInfo, setErrorInfo] = useState("")
    console.log(auth)
    //sign out functionality --after promise resolves change isAuth state to apply the changes
    const signOutfn = async () => {
      try {
        await signOut(auth)
          localStorage.clear()
          setIsAuth(false) 
        
      } catch (error) {
        setErrorInfo (error)
        window.location.pathname = "*"
        console.log('unsuccessful log out')
      }
      
    }
    

  return (
    <>
      <Router>
       
       <nav>
          <Link to="/" > Home </Link>
          {!isAuth ? 
            <Link to="/login" > Login </Link> :
          <>
            <Link to="/create-post" > Create New post </Link>
            <Link className='chat-bot-btn' to ="/chat-bot" > AI chat </Link>
            <button className='sign-out-btn' onClick={signOutfn} > Sign Out</button>
          </>
          }
       </nav>
      
      <Routes>
        
        
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/chat-bot" element={<AIchat />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path = '*' element = {<ErrorSpecs errorInfoProp={errorInfo}/>} />
          <Route path="/post/:postId" element={<Comments />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />

      </Routes>
    
      </Router>
    </>
  )
}

export default App

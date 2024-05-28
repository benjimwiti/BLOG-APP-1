import {useEffect, useState} from "react";
import { getDocs , deleteDoc, doc, onSnapshot, setDoc} from "firebase/firestore";
import { createNewPostRef , auth, followingRef } from "../firebase-config";
import App from "../App";
import { BrowserRouter as Router , Routes , Route , Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import { useAuthState } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import {app} from "../firebase-config"




const isAuth = localStorage.getItem("isAuth") || false


export default function Home() {
  
    //console.log(loggedIn)
    
    const userName = auth.currentUser?  auth.currentUser.displayName : false//"not-logged-in"
    const userId = auth.currentUser? auth.currentUser.uid : false //not logged in
    console.log(userId)
    
    // const authCurrent = getAuth(app)
    // console.log(authCurrent.currentUser.uid)
    // const [user] = useAuthState(auth);
    // console.log(user)

    const [postsList, setPostsList] = useState([])
    const [count, setCount] = useState(0)

    //const[userID, setUserID] = useState('')

    // SYNCING LOCAL STATE TO FIRESTORE

    // const getPosts = async () => {
    //     const postData = await getDocs(createNewPostRef)
    //     const complexPostsArray = postData.docs
    //     const simplePostsArray = complexPostsArray.map(post => (
    //         {
    //         ...post.data() ,
    //         id : post.id
           
    //         }
    //     ))
    //     setPostsList(simplePostsArray)
    // }

    // useEffect (()=> {
    //     //setCount(count => count + 1)
    //     getPosts()
    //     console.log(postsList)
    //     return () => console.log("cleaning up")
    // }, [/* postsList */])
    
    
    useEffect(() => {
      const unsubscribe = onSnapshot(createNewPostRef, (onSnapshot)=> {
        const complexPostsArray = onSnapshot.docs
        const simplePostsArray = complexPostsArray.map(post => (
          {
            ...post.data() ,
            id : post.id
            
          }
        ))
        const sortedArray = simplePostsArray.sort((a, b) => b.createdAt - a.createdAt )
        setPostsList(simplePostsArray)
        //setPostsList(sortedArray)
        console.log(sortedArray)
      })
      
      return unsubscribe
    },[])
    
    
    
    
    async function deletePost(id) {
      const postDoc = doc(createNewPostRef, id)
      await deleteDoc(postDoc)
    }
    
    const navigate = useNavigate()
    
    const [following , setFollowing] = useState({})
    const [hasChangedFollow, setHasChangedFollow] = useState(false)
    
    
    /*FOLLOW STATUS */
    useEffect( () => {
      console.log('flag down')
      // if (hasChangedFollow)  return 
      // setHasChangedFollow(true) // raising the flag
  console.log('flag up') 
  window.addEventListener('load', ()=> {
    document.body.style.backgroundImage = `url(../assets/react.svg)`

  })
  console.log(followingRef)
  console.log(userId)
  const personalFollowRef =  doc(followingRef, userId)
      const unsubscribeMe = onSnapshot(personalFollowRef, (followingSnap) => {
        console.log('fetched following')
        console.log(followingSnap.data())
        setFollowing(followingSnap.data())
      }
    )
  setTimeout( ()=> {
    console.log('ran timeout')
  }, 5000)
},[hasChangedFollow])
    
const toggleFollow = (authorId) => {
  const personalFollowRef = doc(followingRef, userId)
      /* handle unfollow */
      if(following[authorId]){
        setFollowing(prevFollowing => (
          {
            ...prevFollowing ,
            [authorId] : false
          }
        ))
      console.log('unfollow')
      setDoc(personalFollowRef, {[authorId]: false} , {merge : true})
      } 
      /*handle follow*/
      else {
        setFollowing(prevFollowing => (
          {
            ...prevFollowing ,
            [authorId] : true
          }
        ))
        console.log('follow')
        setDoc(personalFollowRef, {[authorId] : true} , {merge : true})
      }
    }
 /* FOLLOW STATUS */

    //INDIVIDUAL POST -you want to change sth about the individual post
    console.log(userId)
    function changeBlogcontainerheight (event) {
        event.target.parentElement.classList.toggle("auto-height")
    } 

    const postElements = postsList.map(post => {
        const blogTextArray = post.blogText.split("\n")
        const firstLine = blogTextArray[0]
        const secondLine = blogTextArray[1]
        const authorId = post.author.id
        const blogHtmlContent = post.blogText
       
       
        return( 
       <div key={post.id} className="blog-card">
            <div className="user-info-container">@{post.author.name}</div>
            <div className="blog-title">{post.blogTitle}</div>
            {/* <div className="blog-text"> */}{/* post.blogText */}{/* </div> */} {/* rendering from the onSnapShotDocs */}
 
        <div className="blog-text" onClick={
          (event)=> changeBlogcontainerheight(event)} 
          dangerouslySetInnerHTML={{ __html: blogHtmlContent 
            }} 
          />
    

            {/* author privileges */}

            <div className="delete-btn-container">

               {
                isAuth &&
                userId === authorId && 
                <>
                    <button className="delete-btn" onClick={() => deletePost(post.id)}>
                        &#128686;
                    </button>

                    <button className="edit-btn" >
                       <Link to={`/edit-post/${post.id}`} className="edit-link">
                        Edit
                       </Link> 
                    </button>
                </>
                }

            </div>
            {/* author privileges */}

            {/* follow */}

           {isAuth && userId != authorId &&
            <div className="follow-btn-container">
              <button className="follow-btn" onClick={()=> {
                toggleFollow(authorId)
                /* setHasChangedFollow(false) */
              }} >
                {following[authorId] ? "Unfollow" : "Follow"}

              </button>
            </div>
          }
        
        </div>
       )
    })

    return (
        <>
            <main className="page-body">
                <p className="p-el">HOME PAGE</p>
                <div className="blog-posts"> 
                    {postElements}
                </div>
            </main>
            <button onClick={()=> setCount(count => count++)}>count</button>
            <footer>
            </footer>
        </>
    )
}
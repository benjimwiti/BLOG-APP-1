import {useEffect, useState} from "react";
import { getDocs , deleteDoc, doc} from "firebase/firestore";
import { createNewPostRef , auth } from "../firebase-config";
import App from "../App";

const isAuth = localStorage.getItem("isAuth") || ""


export default function Home() {
    //console.log(loggedIn)
    
    const userName = auth.currentUser?  auth.currentUser.displayName : false//"not-logged-in"
    const userId = auth.currentUser? auth.currentUser.uid : false //not logged in

    const [postsList, setPostsList] = useState([])
    const [count, setCount] = useState(0)

    // SYNCING LOCAL STATE TO FIRESTORE
    useEffect (()=> {
        //setCount(count => count + 1)
        const getPosts = async () => {
            const postData = await getDocs(createNewPostRef)
            const complexPostsArray = postData.docs
            const simplePostsArray = complexPostsArray.map(post => (
                {
                ...post.data() ,
                id : post.id
               
                }
            ))
            setPostsList(simplePostsArray)
        }
        getPosts()
        console.log(postsList)
    }, [/* postsList */])

    async function deletePost(id) {
        const postDoc = doc(createNewPostRef, id)
        await deleteDoc(postDoc)
    }

    //INDIVIDUAL POST -you want to change sth about the individual post
    console.log(userId, )
    const postElements = postsList.map(post => {
        const authorId = post.author.id
       return( 
       <div key={post.id} className="blog-card">
            <div className="user-info-container">{post.author.name}</div>
            <div className="blog-title">{post.blogTitle}</div>
            <div className="blog-text">{post.blogText}</div>

            <div className="delete-btn-container">


               {
                isAuth &&
                userId === authorId && 
                <button className="delete-btn" onClick={() => deletePost(post.id)}>
                    &#128686;
                </button>
                }

            </div>
        </div>
       )
    })

    return (
        <>
            <main>
                <p className="p-el">HOME PAGE</p>
                {postElements}
            </main>
                <button onClick={()=> setCount(count => count++)}>count</button>
            <footer></footer>
        </>
    )
}
import {useEffect, useState} from "react";
import { getDocs} from "firebase/firestore";
import { createNewPostRef } from "../firebase-config";


export default function Home() {
    const [postsList, setPostsList] = useState([])
    const [count, setCount] = useState(0)

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
    }, [count])

    const postElements = postsList.map(post => {
       return( 
       <div key={post.id} className="blog-card">
            <div className="user-info-container">{post.author.name}</div>
            <div className="blog-title">{post.blogTitle}</div>
            <div className="blog-text">{post.blogText}</div>
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
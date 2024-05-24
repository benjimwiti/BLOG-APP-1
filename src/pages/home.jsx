import {useEffect, useState} from "react";
import { getDocs , deleteDoc, doc} from "firebase/firestore";
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
    }, [postsList])

    async function deletePost(id) {
        const postDoc = doc(createNewPostRef, id)
        await deleteDoc(postDoc)
    }

    const postElements = postsList.map(post => {
       return( 
       <div key={post.id} className="blog-card">
            <div className="user-info-container">{post.author.name}</div>
            <div className="blog-title">{post.blogTitle}</div>
            <div className="blog-text">{post.blogText}</div>

            <div className="delete-btn-container">
                <button className="delete-btn" onClick={() => deletePost(post.id)}>
                    &#128686;
                </button>
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
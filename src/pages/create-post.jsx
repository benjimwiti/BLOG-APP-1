import React from "react";
import { useState } from "react";
import { createNewPostRef , auth} from "../firebase-config";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";




export default function CreatePost() {
    const userName = auth.currentUser.displayName
    const userId = auth.currentUser.uid
    let navigate = useNavigate()
    const [blogTitle , setBlogTitle] = useState("")
    const [blogText , setBlogText] = useState("")
    
    //at firease config js destructure the display name from the current user auth object
    const createNewPostFn = async () => { 
        await addDoc(createNewPostRef ,
             {
                 blogTitle,
                 blogText, 
                 author:
                 {name: userName, id: userId }  
                })
                navigate("/")

    }
    const updateCurrentText = (event) => {
        const currentText = event.target.value
        console.log(currentText)
        return currentText
    }

    return (
        <>
        <p className="p-el"> MAIN </p>
        <div className="create-blog-container">
            <div className="title-container">
                <label htmlFor="blog-title">Blog Title</label>
                <input type="text" id="blog-title" placeholder="blog-title" onChange={(event) => {
                    setBlogTitle(updateCurrentText(event))
                } } />
            </div>

            <div className="blog-text">
                <label htmlFor="blog-text">What's on your mind?</label>
                <textarea type="text" placeholder="blog-text" rows="10" cols="30" onChange={(event) => {
                    setBlogText(updateCurrentText(event))
                } } />
            </div>

            <button className="submit-post" onClick={createNewPostFn}>post</button>
        </div>
        </>
    )
}
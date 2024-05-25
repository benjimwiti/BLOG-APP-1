import React from "react";
import { useState } from "react";
import { createNewPostRef , auth} from "../firebase-config";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { update } from "firebase/database";




export default function CreatePost() {
    const userName = auth.currentUser.displayName
    const userId = auth.currentUser.uid
    let navigate = useNavigate()
    const [blogTitle , setBlogTitle] = useState("")
    const [blogText , setBlogText] = useState("")
    
    //at firease config js destructure the display name from the current user auth object
    const createNewPostFn = async () => { 
        await addDoc(createNewPostRef ,
             { //on clicking post the data in state is sent out /
                 blogTitle,
                 blogText, 
                 author:
                 {name: userName, id: userId },
                 createdAt :  Date.now() ,
                 updatedAt :  Date.now()
                })
                navigate("/") //re-runs the use-effect for rendering display

    }

    const updateCurrentText = (event) => {
        const currentText = event.target.value
        console.log(currentText)
        return currentText
    }

    return (
        <>
        {/* <p className="p-el"> MAIN </p> */}
        <main className='create-post-page-area'>
            <div className="create-blog-container">
                <div className="title-container">
                    <label htmlFor="blog-title">Blog Title</label>
                    <input type="text" id="blog-title" placeholder="blog-title" className='create-blog-title-text' onChange={(event) => {
                        setBlogTitle(updateCurrentText(event))
                    } } />
                </div>

                <div className="blog-text">
                    <label htmlFor="blog-text">Tell your story</label>
                    <textarea type="text" placeholder="blog-text" rows="10" cols="30" className='create-blog-textarea' onChange={(event) => {
                        setBlogText(updateCurrentText(event))
                    } } />
                </div>

                
            </div>
            <div className="submit-post-container">
                <button className='submit-post-button' onClick={createNewPostFn}>PUBLISH</button> 
            </div>
        </main>
        </>
    )
}
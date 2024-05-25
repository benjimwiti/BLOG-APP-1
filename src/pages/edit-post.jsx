import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc , updateDoc } from "firebase/firestore";
import { createNewPostRef } from "../firebase-config";

function EditPost() { 
    
    const {postId} = useParams()
    const [postObject , setPostObject] = useState(null)
    const [titleEdit, setTitleEdit] = useState('')
    const [textEdit, setTextEdit] = useState('')
    //  const blogTitle = postObject.blogTitle
    //  const blogText = postObject.blogText

    //console.log(postObject.blogTitle)

    

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                const postDoc = doc(createNewPostRef, postId);
                const postSnapShot = await getDoc(postDoc);
                console.log(postSnapShot.data())
                const postObjectSnap = postSnapShot.data()
                
                if (postSnapShot.exists()) {
                    setPostObject(postObjectSnap);
                } else {
                    console.log("Post not found!");
                }
            } 
            
            catch (error) {
                console.error("Error fetching post data:", error);
            }
            
        }
        fetchPostList()
        setTitleEdit(postObject.blogTitle)
        setTextEdit(postObject.blogText)
    },[])
    console.log(postId)
//     const handlePostFetch = async () => {
//     const postRef = doc(createNewPostRef, postId)
//     const result = await getDoc(postRef)
    
//     console.log("fetch successful")
// }
//     handlePostFetch()
    console.log('hello')
    const [editTitle, setEditTitle] = React.useState("")
    // const [editText, setEditText] = React.useState("");
    // console.log(editTitle) 

    const handleSubmit = (e) => {
        e.preventDefault();
        const postDoc = doc(createNewPostRef, postId)
        const postUpdate = async () => await updateDoc(postDoc, {
            blogTitle: titleEdit,
            blogText: textEdit
        })
        postUpdate()
    };

    
    return (
        <>
                <p className="p-el"> edit post</p>
            <section>
                <form  className="edit-post-page" onSubmit={handleSubmit}>
                    <label htmlFor="edited-title">Edit title</label>
                    <input type="text" id="edited-title" value={titleEdit}  onChange={(e) => setTitleEdit(e.target.value)} />
                    
                    <label htmlFor="edited-text">Reframe your story</label>
                    <textarea id="edited-text"  value={textEdit}  onChange={(e) => setTextEdit(e.target.value)}  />
                    
                    <button type="submit">Save</button>
                </form>
            </section>
        </>
    )
}

export default EditPost
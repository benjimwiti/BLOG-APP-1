import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc , updateDoc } from "firebase/firestore";
import { createNewPostRef } from "../firebase-config";
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";


function EditPost() { 
    const navigate = useNavigate()
    
    const {postId} = useParams()
    const [postObject , setPostObject] = useState({})
    const [titleEdit, setTitleEdit] = useState('')
    const [textEdit, setTextEdit] = useState('')
    //  const blogTitle = postObject.blogTitle
    //  const blogText = postObject.blogText

    //console.log(postObject.blogTitle)

    

    useEffect(() => {
        const fetchPost = async () => {
          try {
            const postDoc = doc(createNewPostRef, postId);
            const postSnapShot = await getDoc(postDoc);
    
            if (postSnapShot.exists()) {
              const postObjectSnap = postSnapShot.data();
              setPostObject(postObjectSnap);
              setTitleEdit(postObjectSnap.blogTitle);
              setTextEdit(postObjectSnap.blogText);
            } else {
              console.log("Post not found!");
            }
          } catch (error) {
            console.error("Error fetching post data:", error);
          }
        };
    
        fetchPost();
      }, [postId]);
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
            blogText: textEdit,
            updatedAt : Date.now()
        })
        postUpdate()
        navigate('/')
    };

    
    return (
        <>
                <p className="p-el"> edit post</p>
            <section>
                <form  className="edit-post-page" onSubmit={handleSubmit}>
                    <label htmlFor="edited-title">Edit title</label>
                    <input type="text" id="edited-title" value={titleEdit}  onChange={(e) => setTitleEdit(e.target.value)} />
                    
                    <label htmlFor="edited-text">Reframe your story</label>
                    {/* <textarea id="edited-text"  value={textEdit}  onChange={(e) => setTextEdit(e.target.value)}  /> */}
                    <ReactQuill
                        className="ql-editor"
                        theme="snow"
                        value={textEdit}
                        onChange={setTextEdit}
                    />
                    
                    <button type="submit">Save</button>
                </form>
            </section>
        </>
    )
}

export default EditPost
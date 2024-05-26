import React, { useState } from "react";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { createNewPostRef, auth } from "../firebase-config";

export default function CreatePost() {
  const userName = auth.currentUser.displayName;
  const userId = auth.currentUser.uid;
  let navigate = useNavigate();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [tags, setTags] = useState("");


  const createNewPostFn = async () => {
   
    await addDoc(createNewPostRef, {
      blogTitle,
      blogText,
      author: { name: userName, id: userId },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: tags.split(",").map(tag => tag.trim()), // Split tags by comma and trim whitespace
      
    });
    navigate("/");
  };

  const updateCurrentText = event => {
    const currentText = event.target.value;
    return currentText;
  };

 

  return (
    <>
      <main className="create-post-page-area">
        <div className="create-blog-container">
          <div className="title-container">
            <label htmlFor="blog-title">Blog Title</label>
            <input
              type="text"
              id="blog-title"
              placeholder="blog-title"
              className="create-blog-title-text"
              onChange={event => {
                setBlogTitle(updateCurrentText(event));
              }}
            />
          </div>

          <div className="blog-text">
            <label htmlFor="blog-text">Tell your story</label>
            <textarea
              type="text"
              placeholder="blog-text"
              rows="10"
              cols="30"
              className="create-blog-textarea"
              onChange={event => {
                setBlogText(updateCurrentText(event));
              }}
            />
          </div>

          <div className="tags-container">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              placeholder="e.g., sports, tech"
              className="create-blog-tags"
              onChange={event => {
                setTags(updateCurrentText(event));
              }}
            />
            
          </div>

        </div>
        <div className="submit-post-container">
          <button className="submit-post-button" onClick={createNewPostFn}>
            PUBLISH
          </button>
        </div>
      </main>
    </>
  );
}

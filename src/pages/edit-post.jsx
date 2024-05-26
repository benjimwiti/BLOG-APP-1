import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createNewPostRef } from "../firebase-config";

function EditPost() {
  const { postId } = useParams();
  const [postObject, setPostObject] = useState(null);
  const [titleEdit, setTitleEdit] = useState('');
  const [textEdit, setTextEdit] = useState('');
  const [tagsEdit, setTagsEdit] = useState('');
  
  const navigate = useNavigate();

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
          setTagsEdit(postObjectSnap.tags.join(", "));
        } else {
          console.log("Post not found!");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postDoc = doc(createNewPostRef, postId);
    try {
      await updateDoc(postDoc, {
        blogTitle: titleEdit,
        blogText: textEdit,
        tags: tagsEdit.split(",").map(tag => tag.trim()), // Split tags by comma and trim whitespace
       
      });
      console.log("Post updated successfully!");
      navigate("/"); // Redirect to the home page after saving
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };



  if (!postObject) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p className="p-el">Edit Post</p>
      <section>
        <form className="edit-post-page" onSubmit={handleSubmit}>
          <label htmlFor="edited-title">Edit Title</label>
          <input
            type="text"
            id="edited-title"
            value={titleEdit}
            onChange={(e) => setTitleEdit(e.target.value)}
          />

          <label htmlFor="edited-text">Reframe your story</label>
          <textarea
            id="edited-text"
            value={textEdit}
            onChange={(e) => setTextEdit(e.target.value)}
          />

          <label htmlFor="edited-tags">Edit Tags (comma-separated)</label>
          <input
            type="text"
            id="edited-tags"
            value={tagsEdit}
            onChange={(e) => setTagsEdit(e.target.value)}
          />

          

          <button type="submit">Save</button>
        </form>
      </section>
    </>
  );
}

export default EditPost;

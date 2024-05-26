import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { createNewPostRef, auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";

const isAuth = localStorage.getItem("isAuth") || "";

export default function Home() {
  const userName = auth.currentUser ? auth.currentUser.displayName : false;
  const userId = auth.currentUser ? auth.currentUser.uid : false;

  const [postsList, setPostsList] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(createNewPostRef, (snapshot) => {
      const complexPostsArray = snapshot.docs;
      const simplePostsArray = complexPostsArray.map(post => ({
        ...post.data(),
        id: post.id
      }));
      const sortedArray = simplePostsArray.sort((a, b) => b.createdAt - a.createdAt);
      setPostsList(sortedArray);
    });
    return unsubscribe;
  }, []);

  async function deletePost(id) {
    const postDoc = doc(createNewPostRef, id);
    await deleteDoc(postDoc);
  }

  const navigate = useNavigate();

  const filteredPosts = postsList.filter(post =>
    post.blogTitle.toLowerCase().includes(search.toLowerCase())
  );

  const postElements = filteredPosts.map(post => {
    const authorId = post.author.id;
    return (
      <div key={post.id} className="blog-card">
        <div className="user-info-container">@{post.author.name}</div>
        <div className="blog-title">{post.blogTitle}</div>
        <div className="blog-text">{post.blogText}</div>
        <div className="like-comment-container">
          <LikeButton post={post} />
          <Link to={`/post/${post.id}`}>Comments</Link>
        </div>
        <div className="delete-btn-container">
          {isAuth && userId === authorId && (
            <>
              <button className="delete-btn" onClick={() => deletePost(post.id)}>
                &#128686;
              </button>
              <button className="edit-btn">
                <Link to={`/edit-post/${post.id}`} className="edit-link">
                  Edit
                </Link>
              </button>
            </>
          )}
        </div>
      </div>
    );
  });

  return (
    <>
      <main className="page-body">
        <p className="p-el">HOME PAGE</p>
        <form>
          <input
            onChange={(e => { setSearch(e.target.value) })}
            placeholder="Search Blog by title"
          />
        </form>
        <div className="blog-posts">
          {postElements}
        </div>
      </main>
      <button onClick={() => setCount(count + 1)}>count</button>
      <footer></footer>
    </>
  );
}

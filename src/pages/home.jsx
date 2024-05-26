import React, { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { createNewPostRef, auth, db } from "../firebase-config";
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
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(createNewPostRef, (snapshot) => {
      const complexPostsArray = snapshot.docs;
      const simplePostsArray = complexPostsArray.map((post) => ({
        ...post.data(),
        id: post.id,
      }));
      const sortedArray = simplePostsArray.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setPostsList(sortedArray);
    });

    // Fetch following status for current user
    const fetchFollowingStatus = async () => {
      const followingRef = doc(db, "following", userId);
      const followingSnapshot = await getDocs(followingRef);
      const followingData = followingSnapshot.data();
      if (followingData) {
        setFollowingMap(followingData);
      }
    };
    fetchFollowingStatus();

    return unsubscribe;
  }, []);

  async function deletePost(id) {
    const postDoc = doc(createNewPostRef, id);
    await deleteDoc(postDoc);
  }

  const navigate = useNavigate();

  const filteredPosts = postsList.filter((post) =>
    post.blogTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleFollow = async (authorId) => {
    const followingRef = doc(db, "following", userId);
    const followingData = followingMap || {};
    followingData[authorId] = true; // Follow author
    await setDoc(followingRef, followingData, { merge: true });
    setFollowingMap({ ...followingMap, [authorId]: true });
  };

  const handleUnfollow = async (authorId) => {
    const followingRef = doc(db, "following", userId);
    const followingData = followingMap || {};
    delete followingData[authorId]; // Unfollow author
    await setDoc(followingRef, followingData, { merge: true });
    setFollowingMap({ ...followingMap, [authorId]: false });
  };

  const followButtonText = (authorId) => {
    return followingMap && followingMap[authorId] === true ? "Following" : "Follow";
  };

  const postElements = filteredPosts.map((post) => {
    const authorId = post.author.id;
    const isFollowing = followingMap && followingMap[authorId] === true;
    const tagsString = post.tags ? post.tags.join(", ") : "";
    return (
      <div key={post.id} className="blog-card">
        <div className="user-info-container">
          @{post.author.name}
          {userId !== authorId && ( // Show follow/unfollow button only if not the author
            <button onClick={() => (isFollowing ? handleUnfollow(authorId) : handleFollow(authorId))}>
              {followButtonText(authorId)}
            </button>
          )}
        </div>
        <div className="blog-title">{post.blogTitle}</div>
        <div className="blog-text">{post.blogText}</div>
        <div className="tags">Tags: {tagsString}</div>
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
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search Blog by title"
          />
        </form>
        <div className="blog-posts">{postElements}</div>
      </main>
      <button onClick={() => setCount(count + 1)}>count</button>
      <footer></footer>
    </>
  );
}

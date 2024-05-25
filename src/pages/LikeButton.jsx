import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { createNewPostRef, auth } from "../firebase-config";

export default function LikeButton({ post }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.likes?.length || 0); // Use optional chaining to handle undefined post or likes array

    useEffect(() => {
        if (auth.currentUser && post?.likes?.includes(auth.currentUser.uid)) {
            setLiked(true);
        }
    }, [post]);

    const toggleLike = async () => {
        if (!auth.currentUser) return;
        const postDoc = doc(createNewPostRef, post.id);
        if (liked) {
            await updateDoc(postDoc, { likes: arrayRemove(auth.currentUser.uid) });
            setLikesCount((prevCount) => prevCount - 1);
        } else {
            await updateDoc(postDoc, { likes: arrayUnion(auth.currentUser.uid) });
            setLikesCount((prevCount) => prevCount + 1);
        }
        setLiked(!liked);
    };

    return (
        <button onClick={toggleLike}>
            {liked ? '❤️' : '🤍'} {likesCount}
        </button>
    );
}

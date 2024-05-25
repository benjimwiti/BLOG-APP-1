import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { createNewPostRef, auth } from "../firebase-config";

export default function Comments() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const userName = auth.currentUser ? auth.currentUser.displayName : false;
    const userId = auth.currentUser ? auth.currentUser.uid : false;

    useEffect(() => {
        const fetchPost = async () => {
            const postDoc = doc(createNewPostRef, postId);
            const postData = await getDoc(postDoc);
            setPost({ id: postId, ...postData.data() });
        };
        fetchPost();
    }, [postId]);

    const addComment = async () => {
        if (!newComment.trim()) return;
        const postDoc = doc(createNewPostRef, postId);
        await updateDoc(postDoc, {
            comments: arrayUnion({ userId, userName, text: newComment, createdAt: new Date() })
        });
        setNewComment("");
    };

    // Comments for displaying post comments
    const commentsContent = post?.comments?.map((comment, index) => (
        <div key={index}>
            <strong>{comment.userName}</strong>: {comment.text}
        </div>
    ));

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h2>Comments for {post.blogTitle}</h2>
            <div>
                {commentsContent}
            </div>
            {userId && (
                <div>
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={addComment}>Add Comment</button>
                </div>
            )}
        </div>
    );
}

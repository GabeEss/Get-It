import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, collection, addDoc, updateDoc, getDocs, getDoc, deleteDoc } from "firebase/firestore";

async function addComment(page, postId, content, time) {

    // Get reference to the post
    const postRef = doc(db, `${page}Posts`, postId);

    // Get reference to the user
    const auth = getAuth();
    const user = auth.currentUser;
    const owner = user.email;
    const nickname = user.displayName;

    // The comment data.
    const comment = {
      content: content,
      nickname: nickname,
      owner: owner,
      page: page,
      postId: postId,
      time: time,
      likes: 0,
    };

    try {
      // Create a new comment document within the "comments" collection of the post
      const commentsCollectionRef = collection(postRef, "comments");
      const newCommentRef = await addDoc(commentsCollectionRef, comment);
      const commentId = newCommentRef.id;
      console.log('Comment added successfully with ID:', commentId);
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  }
  
  // Update the likes for a specific comment in the post
  async function updateCommentLikes(page, postId, commentId, numLikes, type) {

    // Get a reference to the specific comment
    const commentRef = doc(db, `${page}Posts/${postId}/comments`, commentId);

    // Get a reference to the user
    const auth = getAuth();
    const user = auth.currentUser;
    const owner = user.email;
    const userRef = doc(db, "users", owner);

    // Get user likes history, find if user has liked the post before
    const likesCollectionRef = collection(userRef, "likes");
    const querySnapshot = await getDocs(likesCollectionRef);

    // Find the like to the specific comment
    const existingLike = querySnapshot.docs.find(doc => doc.data().commentId === commentId);
    if (existingLike) {
      // Get the doc snapshot
      const existingLikeRef = doc(likesCollectionRef, existingLike.id);
      const docSnapshot = await getDoc(existingLikeRef);

      if (docSnapshot.exists()) {
        // Get the previous liked value (like/dislike)
        const prevlikedValue = docSnapshot.data().type;
        
        if(type === "like") {
            // If the user is changing their like, change the type. Otherwise, remove from like history.
            if(prevlikedValue === "dislike") {
              // Update the number of likes in the post. Add a like, remove a dislike.
              updateNumberOfLikes(commentRef, numLikes, 2);
              // Updaye the user's like value for this post in their like history.
              await updateDoc(existingLikeRef, { type: type });
            } else {
              // Update the number of likes in the post. Remove a like.
              updateNumberOfLikes(commentRef, numLikes, -1);
              // Delete the like from user history.
              await deleteDoc(existingLikeRef);
          }
        } else if(type === "dislike") {
            // If the user is changing their like, change the type. Otherwise, remove from like history.
            if(prevlikedValue === "like") {
              // Update the number of likes in the post. Add a dislike, remove a like.
              updateNumberOfLikes(commentRef, numLikes, -2);
              // Updaye the user's like value for this post in their like history.
              await updateDoc(existingLikeRef, { type: type });
            } else {
              // Update the number of likes in the post. Remove a dislike.
              updateNumberOfLikes(commentRef, numLikes, 1);
              // Delete the like from user history.
              await deleteDoc(existingLikeRef);
            }
        } else console.log("The type of like is not defined.");
      } 
    } else {
      // user like data
    const userLikeData = {
        postId: postId,
        commentId: commentId,
        type: type
    }

      // Update number of likes in the post.
      if(type === "like") updateNumberOfLikes(commentRef, numLikes, 1);
      else if(type === "dislike") updateNumberOfLikes(commentRef, numLikes, -1);
      else console.log("The type of like is not defined.");

      // Add the like to the user's like history, if the user has not liked this post before.
      await addDoc(likesCollectionRef, userLikeData);
    }
}

// Update the number of likes in the comment.
const updateNumberOfLikes = async (commentRef, numLikes, plusMinus) => {
    const newNum = numLikes + plusMinus;
    await updateDoc(commentRef, {
      likes: newNum,
    })
    .then(() => {
      // console.log('Likes updated successfully');
    })
    .catch((error) => {
      console.error('Error updating likes: ', error);
    });
  }

export { addComment, updateCommentLikes };
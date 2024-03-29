import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, collection, addDoc, updateDoc,
  getDocs, getDoc, deleteDoc, query, orderBy, writeBatch } from "firebase/firestore";

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
      postId: postId,
      time: time,
      likes: 0,
    };

    try {
      // Create a new comment document within the "comments" collection of the post
      const commentsCollectionRef = collection(postRef, "comments");
      const newCommentRef = await addDoc(commentsCollectionRef, comment);
      const commentId = newCommentRef.id;
      // console.log('Comment added successfully with ID:', commentId);
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  }

  async function deleteComment(page, postId, commentId) {
    const commentRef = doc(db, `${page}Posts/${postId}/comments`, commentId);
  
    await updateDoc(commentRef, {
      content: "[deleted]",
      nickname: "[deleted]",
      owner: ""
    })
    .then(() => {
      // console.log('Post deleted successfully');
    })
    .catch((error) => {
      console.error('Error updating post: ', error);
    });
  }
  
  async function editCommentInFirestore(page, postId, commentId, newContent) {
    const commentRef = doc(db, `${page}Posts/${postId}/comments`, commentId);
  
    await updateDoc(commentRef, {
      content: `${newContent} (edited)`,
    })
    .then(() => {
      // console.log('Post updated successfully');
    })
    .catch((error) => {
      console.error('Error updating post: ', error);
    });
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
        return prevlikedValue;
      } 
    } else {
      // user like data
    const userLikeData = {
        commentId: commentId,
        parentId: postId,
        page: page,
        type: type
    }

      // Update number of likes in the post.
      if(type === "like") updateNumberOfLikes(commentRef, numLikes, 1);
      else if(type === "dislike") updateNumberOfLikes(commentRef, numLikes, -1);
      else console.log("The type of like is not defined.");

      // Add the like to the user's like history, if the user has not liked this post before.
      await addDoc(likesCollectionRef, userLikeData);
      return null;
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

const fetchCommentsFromCurrentPage = async (page, id, sortOption) => {
    const postRef = doc(db, `${page}Posts`, id);
    const commentsCollectionRef = collection(postRef, "comments");
    let querySnapshot;
    if (sortOption === "new") {
        querySnapshot = await getDocs(query(commentsCollectionRef, orderBy("time", "desc")));
    } else if (sortOption === "old") {
        querySnapshot = await getDocs(query(commentsCollectionRef, orderBy("time", "asc")));
    } else {
        querySnapshot = await getDocs(query(commentsCollectionRef, orderBy("likes", "desc")));
    }
    // Add the comment id into the commentData state.
    const comments = querySnapshot.docs.map((doc) => 
    ({
        ...doc.data(),
        commentid: doc.id
    }));

    return comments;
}

const deleteUserCommentsFromPage = async (page, email) => {
  try {
    // Query all posts on the page
    const postsQuerySnapshot = await getDocs(collection(db, `${page}Posts`));

    const batch = writeBatch(db);

    // Loop through each post
    for (const postDoc of postsQuerySnapshot.docs) {
      const postId = postDoc.id;
      const commentsCollectionRef = collection(db, `${page}Posts/${postId}/comments`);

      // Get all comments for the current post
      const commentsQuerySnapshot = await getDocs(commentsCollectionRef);

      // Loop through each comment and update it in the batch
      for (const commentDoc of commentsQuerySnapshot.docs) {
        const commentId = commentDoc.id;
        const commentData = commentDoc.data();
        const commentRef = doc(commentsCollectionRef, commentId);

        // If the user is the owner of the comment
        if (commentData.owner === email) {
          batch.update(commentRef, {
            content: "[deleted]",
            nickname: "[deleted]",
            owner: ""
          });
        }
      }
    }
    // Commit the batch operation to update all comments and posts
    await batch.commit();
  } catch (error) {
    console.error("Error deleting comments: ", error);
  }
}

export { 
  addComment,
  updateCommentLikes,
  editCommentInFirestore,
  deleteComment,
  fetchCommentsFromCurrentPage,
  deleteUserCommentsFromPage
 };
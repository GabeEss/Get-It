import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, collection, addDoc, updateDoc, getDocs, getDoc, deleteDoc } from "firebase/firestore";

async function createPost(owner, title, content, page, time, nickname) {
    const post = {
      title: title,
      owner: owner,
      content: content,
      likes: 0,
      time: time,
      nickname: nickname
    };

    try {
        const postsCollection = collection(db, `${page}Posts`);
        const docRef = await addDoc(postsCollection, post);
        // console.log('Post added with ID: ', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error adding post: ', error);
      }
}

async function deletePost(page, postId) {
  const postRef = doc(db, `${page}Posts`, postId);

  await updateDoc(postRef, {
    title: "[deleted]",
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

async function editPost(page, postId, newTitle, newContent) {
  const postRef = doc(db, `${page}Posts`, postId);

  await updateDoc(postRef, {
    title: `${newTitle} (edited)`,
    content: newContent
  })
  .then(() => {
    // console.log('Post updated successfully');
  })
  .catch((error) => {
    console.error('Error updating post: ', error);
  });
}

// Update the likes for a specific post
async function updateLikes(page, postId, numLikes, type) {

  // Get a reference to the post
  const postRef = doc(db, `${page}Posts`, postId);

  // Get a reference to the user
  const auth = getAuth();
  const user = auth.currentUser;
  const owner = user.email;
  const userRef = doc(db, "users", owner);

  // Get user likes history, find if user has liked the post before
  const likesCollectionRef = collection(userRef, "likes");
  const querySnapshot = await getDocs(likesCollectionRef);

  // Find the like to the specific comment
  const existingLike = querySnapshot.docs.find(doc => doc.data().postId === postId);
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
            updateNumberOfLikes(postRef, numLikes, 2);
            // Updaye the user's like value for this post in their like history.
            await updateDoc(existingLikeRef, { type: type });
          } else {
            // Update the number of likes in the post. Remove a like.
            updateNumberOfLikes(postRef, numLikes, -1);
            // Delete the like from user history.
            await deleteDoc(existingLikeRef);
        }
      } else if(type === "dislike") {
          // If the user is changing their like, change the type. Otherwise, remove from like history.
          if(prevlikedValue === "like") {
            // Update the number of likes in the post. Add a dislike, remove a like.
            updateNumberOfLikes(postRef, numLikes, -2);
            // Updaye the user's like value for this post in their like history.
            await updateDoc(existingLikeRef, { type: type });
          } else {
            // Update the number of likes in the post. Remove a dislike.
            updateNumberOfLikes(postRef, numLikes, 1);
            // Delete the like from user history.
            await deleteDoc(existingLikeRef);
          }
      } else console.log("The type of like is not defined.");
      return prevlikedValue;
    } 
  } else {
    // user like data
  const userLikeData = {
      page: page,
      postId: postId,
      type: type
  }

    // Update number of likes in the post.
    if(type === "like") updateNumberOfLikes(postRef, numLikes, 1);
    else if(type === "dislike") updateNumberOfLikes(postRef, numLikes, -1);
    else console.log("The type of like is not defined.");

    // Add the like to the user's like history, if the user has not liked this post before.
    await addDoc(likesCollectionRef, userLikeData);
    return null;
  }
}

// Update the number of likes in a post.
const updateNumberOfLikes = async (postRef, numLikes, plusMinus) => {
  const newNum = numLikes + plusMinus;
  await updateDoc(postRef, {
    likes: newNum,
  })
  .then(() => {
    // console.log('Likes updated successfully');
  })
  .catch((error) => {
    console.error('Error updating likes: ', error);
  });
}

export { createPost, updateLikes, editPost, deletePost };
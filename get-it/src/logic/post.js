import { db } from "../firebase";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";

async function createPost(owner, title, content, page, time, nickname) {
    const post = {
      title: title,
      owner: owner,
      content: content,
      likes: 0,
      comments: [],
      page: page,
      time: time,
      nickname: nickname
    };

    try {
        const postsCollection = collection(db, `${page}Posts`);
        const docRef = await addDoc(postsCollection, post);
        console.log('Post added with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding post: ', error);
      }
}

function updateLikes(page, id, newLikes) {
    const postRef = doc(db, `${page}Posts`, id);

    // Update the "likes" field of the post document
    updateDoc(postRef, {
        likes: newLikes,
      })
      .then(() => {
        console.log('Likes updated successfully');
      })
      .catch((error) => {
        console.error('Error updating likes: ', error);
      });
  }

  async function addComment(page, postId, content, time) {
    const comment = {
      content: content,
      likes: 0,
      time: time,
      replies: []
    };
  
    // Get a reference to the post
    const postRef = db.collection(`${page}Posts`).doc(postId);
  
    try {
        // Get the data in the post
        const postDoc = await postRef.get();
        // Get the comments
        const currentComments = postDoc.data().comments || [];
        // Append the new comment to the existing comments
        const updatedComments = [...currentComments, comment];
        // Update the comments in the post
        await postRef.update({ comments: updatedComments });
    
        console.log('Comment added successfully');
    } catch (error) {
        console.error('Error adding comment: ', error);
    }
  }
  
  // Update the likes for a specific comment in the post
  function updateCommentLikes(page, postId, commentIndex, newLikes) {
    const postRef = db.collection(`${page}Posts`).doc(postId);
  
    postRef.update({
      [`comments.${commentIndex}.likes`]: newLikes
    })
      .then(() => {
        console.log('Comment likes updated successfully');
      })
      .catch((error) => {
        console.error('Error updating comment likes: ', error);
      });
}

export { createPost, addComment, updateLikes, updateCommentLikes };
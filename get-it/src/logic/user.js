import { db } from "../firebase";
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { deleteUserPostsFromPage } from "./post";
import { deleteUserCommentsFromPage } from "./comment";

// Get the user document id from the user's email.
const searchUserByEmail = async (email) => {
    const usersCollectionRef = collection(db, "users");
  
    try {
      // Perform the query to find the document with the matching email
      const querySnapshot = await getDocs(query(usersCollectionRef, where("email", "==", email)));
  
      if (querySnapshot.empty) {
        console.log("No user found with the specified email.");
        return null;
      }
  
      // Assuming there's only one document with the given email, return it
      const userDocument = querySnapshot.docs[0];
      return { id: userDocument.id, ...userDocument.data() };
      // return userDocument.data();
    } catch (error) {
      console.error("Error searching for user:", error);
      return null;
    }
  };

// Change the user's display name.
const changeUserDisplayName = async (displayName) => {
  // Get a reference to the user
  const auth = getAuth();
  const email = auth.currentUser.email;

  const userData = await searchUserByEmail(email);
  // Find user by email and update the displayName.
  if(userData) {
    // Update the user authentication profile
    await updateProfile(auth.currentUser, { displayName });

    // Get the user document and update it.
    const userRef = doc(db, "users", userData.id);
    await updateDoc(userRef, { displayName: displayName });
  } else {
    console.log("Creating user document.");
    // Set display name.
    await updateProfile(auth.currentUser, { displayName });

    // Add user details to the users collection.
    const usersCollectionRef = collection(db, "users");
    await addDoc(usersCollectionRef, { email, displayName });
  }
}

const deleteUserOperation = async () => {
  // Get a reference to the user
  const auth = getAuth();
  const user = auth.currentUser;
  const email = auth.currentUser.email;

  try {
    // Reauthenticate the user by prompting for their password
    const password = prompt("Please enter your password to confirm account deletion:");
    const credentials = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credentials);


    await deleteUserPosts(email);
    console.log("Delete posts done.");
    await deleteUserComments(email);
    console.log("Delete comments done.");
    await deleteUserLikes(email);
    console.log("Delete like history done.");
    await deleteUserDocument(email);
    console.log("Delete user document done.");
    await auth.currentUser.delete();
    console.log("User authentication deleted.");
  } catch (error) {
    console.log("Failed to completely delete the user.", error);
  }
}

// Delete the user's posts on each page
const deleteUserPosts = async (email) => {
  const page1 = "gaming";
  const page2 = "business";
  const page3 = "television";
  
  await deleteUserPostsFromPage(page1, email);
  await deleteUserPostsFromPage(page2, email);
  await deleteUserPostsFromPage(page3, email);
}

// Delete the user's comments on each page
const deleteUserComments = async (email) => {
  const page1 = "gaming";
  const page2 = "business";
  const page3 = "television";

  await deleteUserCommentsFromPage(page1, email);
  await deleteUserCommentsFromPage(page2, email);
  await deleteUserCommentsFromPage(page3, email);
}

// Delete the user's like history. Can't remove the likes the posts though.
const deleteUserLikes = async (email) => {
  try {
    // Get a reference to the user
    const auth = getAuth();
    const user = auth.currentUser;
    const owner = user.email;
    const userRef = doc(db, "users", owner);

    // Get user likes subcollection
    const likesCollectionRef = collection(userRef, "likes");
    const querySnapshot = await getDocs(likesCollectionRef);
    
    if (querySnapshot) {
      // Delete each document in the likes collection
      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        const docRef = doc(likesCollectionRef, docSnapshot.id);
        return deleteDoc(docRef);
      });

      // Wait for all the delete operations to complete
      await Promise.all(deletePromises)
    } else {
      console.log("The likes document was not found with the given email.");
    }
  } catch (error) {
    console.error("Error deleting user's like history: ", error);
  }
}

// Delete the user document containing their display name and email.
const deleteUserDocument = async (email) => {
  try {
    // Get a reference to the users collection
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);

     if (!querySnapshot.empty) {
      // Get the document and reference containing the user's display name and email
      const userDoc = querySnapshot.docs.find(doc => doc.data().email === email);
      const userDocRef = doc(usersCollectionRef, userDoc.id);

      // Delete the document
      await deleteDoc(userDocRef);
    } else {
      console.log("The user document was not found with the given email.");
    }
  } catch(error) {
    console.error("Error deleting user document: ", error);
  }
}

export { searchUserByEmail, changeUserDisplayName, deleteUserOperation }  
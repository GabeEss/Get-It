import { db } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

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

export { searchUserByEmail, changeUserDisplayName }  
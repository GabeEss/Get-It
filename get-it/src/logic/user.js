import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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
      return userDocument.data();
    } catch (error) {
      console.error("Error searching for user:", error);
      return null;
    }
  };

export { searchUserByEmail }  
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig"; // Ensure this is correctly configured
import { initializeApp, getApps } from "firebase/app";

import defaultData from "./DefaultData";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Create Context
const UserContext = createContext(null);

// Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously");
      } catch (error) {
        console.error("Auth error:", error.message);
      }
    };

    authenticate();

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch Firestore user data
        const userDocRef = doc(db, "userData", firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          await setDoc(userDocRef, {
            uid: firebaseUser.uid,
            ...defaultData,
          });
          setUserData(defaultData);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update Firestore user data
  const updateUserData = async (newData) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, newData);
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

import { useState, useEffect } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import firebaseConfig from "../firebaseConfig.js";
import defaultData from "./DefaultData.js";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/home/HomePage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [selected, setSelected] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") || 'light';
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const authenticateUser = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        console.log("Signed in anonymously");

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUserId(user.uid);
            const userDocRef = doc(db, "userData", user.uid);

            try {
              let docSnap = await getDoc(userDocRef);

              if (!docSnap.exists()) {
                console.log("Creating new user profile in Firestore...");
                await setDoc(userDocRef, { uid: user.uid, ...defaultData });
                console.log("Default profile created for:", user.uid);
                setIsUserCreated(true);
              } else {
                console.log("User profile already exists:", docSnap.data());
              }
            } catch (error) {
              console.error("Error accessing Firestore user profile:", error);
            }
          }
        });
      } catch (error) {
        console.error("Firebase Auth Error:", error.code, error.message);
      }
    };

    authenticateUser();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <section className={"flex flex-col min-h-screen bg-background dark:bg-background-dark "+(isDarkMode === 'dark' ? " dark" : "")}>
      <NavBar selected={selected} setSelected={setSelected} />

      {selected === "home" && (
        <div className="grow">
          <HomePage />
          <h3 className="text-7xl font-bold text-center">IN PROGRESS!</h3>
        </div>
      )}

      {selected === "dashboard" && (
        <div className="grow">
          <Dashboard userId={userId} />
        </div>
      )}

      <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </section>
  );
}

export default App;

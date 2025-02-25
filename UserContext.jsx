import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import firebaseConfig from "./firebaseConfig"; // Ensure this is correctly configured
import { initializeApp, getApps } from "firebase/app";

import defaultData from "./DefaultData";

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
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

  const addNewProject = async (project) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      projects: {
        ...userData.projects,
        [project.id]: project,
      },
    });
    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [project.id]: project,
      },
    }));
  };

  const getProjects = async (id = null) => {
    if (!userData) return null;

    const projects = userData.projects || {};

    if (id) {
      return projects[id] || null;
    }

    return projects;
  };

  const updateProjectName = async (projectId, newName) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      [`projects.${projectId}.projName`]: newName,
      [`projects.${projectId}.lastEdited`]: new Date().toISOString(),
    });
    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          projName: newName,
          lastEdited: new Date().toISOString(),
        },
      },
    }));
  }

  const updateProjectCount = async () => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      usage: {
        ...userData.usage,
        projects: {
          limit: userData.usage.projects.limit,
          usage: userData.usage.projects.usage + 1,
        },
      },
    });
    setUserData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        projects: {
          limit: prev.usage.projects.limit,
          usage: prev.usage.projects.usage + 1,
        },
      },
    }));
  };

  const getLimitAndUsage = async (usageVar) => {
    if (!userData) return;

    return {
      limit: userData.usage[usageVar].limit || 0,
      usage: userData.usage[usageVar].usage || 0,
    };
  };

  const addMessage = async (projectId, message) => {
    if (!user) return;

    const newMessage = {
      id: new Date().getTime(),
      value: message,
      timestamp: new Date().toISOString(),
    };

    // Ensure userData and messages exist
    const existingMessages = userData.projects[projectId].messages || [];

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      [`projects.${projectId}.messages`]: [...existingMessages, newMessage],
    });

    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          messages: [...existingMessages, newMessage],
        },
      },
    }));
  };

  const getMessages = async (projectId) => {
    if (!userData) return null;

    return userData.projects[projectId].messages || [];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        loading,
        updateUserData,
        addNewProject,
        getProjects,
        updateProjectName,
        updateProjectCount,
        getLimitAndUsage,
        addMessage,
        getMessages,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

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
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import firebaseConfig from "./firebaseConfig"; // Ensure this is correctly configured
import { initializeApp, getApps } from "firebase/app";

import defaultData from "./DefaultData";

import fs from "fs";

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

  const deleteProject = async (projectId) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    const updatedProjects = { ...userData.projects };
    delete updatedProjects[projectId];

    await updateDoc(userDocRef, {
      projects: updatedProjects,
    });

    setUserData((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  }

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

  const updateProjectCount = async (add = 1) => {
    if (!user) return;
    if (userData.usage.projects.usage + add < 0) return;
    if (userData.usage.projects.usage + add > userData.usage.projects.limit) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      usage: {
        ...userData.usage,
        projects: {
          limit: userData.usage.projects.limit,
          usage: userData.usage.projects.usage + add,
        },
      },
    });
    setUserData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        projects: {
          limit: prev.usage.projects.limit,
          usage: prev.usage.projects.usage + add,
        },
      },
    }));
  };

  const getLimitAndUsage = async (usageVar) => {
    if (!userData) return;

    return {
      limit: userData.usage[usageVar]?.limit || 0,
      usage: userData.usage[usageVar]?.usage || 0,
    };
  };

  const addMessage = async (projectId, message, author, image) => {
    if (!user) return;
  
    const newMessage = {
      id: userData.projects[projectId].messages.length+1,
      value: message,
      image: image,
      timestamp: new Date().toISOString(),
      sender: author,
    };
  
    const userDocRef = doc(db, "userData", user.uid);
  
    // ✅ Append message to Firestore instead of replacing the array
    await updateDoc(userDocRef, {
      [`projects.${projectId}.messages`]: arrayUnion(newMessage),
      [`usage.messages.usage`]: userData.usage.messages.usage + 1,
    });
  
    // ✅ Update local state
    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          messages: [...(prev.projects[projectId]?.messages || []), newMessage],
        },
      },
      usage: {
        ...prev.usage,
        messages: {
          limit: prev.usage.messages.limit,
          usage: prev.usage.messages.usage + 1,
        },
      },
    }));
  };

  const getMessages = async (projectId) => {
    if (!userData) return null;

    return userData.projects[projectId]?.messages || [];
  };

  const uploadFileToStorage = async (projectId, file) => {
    try {
      const filePath = `/${projectId}/${file.originalname}`;
      fs.writeFileSync(filePath, file.buffer);

      const uploadedFile = await fileManager.uploadFile(filePath, {
        displayName: file.originalname,
        mimeType: file.mimetype,
      });
      const fileUri = uploadedFile.file.uri;
      fs.unlinkSync(filePath);

      return fileUri;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const getSampleCSV = async () => {
    try {
      const storageRef = ref(storage, "/customers-1000.csv");  //create a reference to your file
      const url = await getDownloadURL(storageRef); //get the download url
      return url;
    } catch (error) {
      console.error("Error getting download URL:", error);
      return null;
    }
  }

  const setFileUri = async (projectId, fileUri) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      [`projects.${projectId}.fileUri`]: fileUri,
    });
    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          fileUri: fileUri,
        },
      },
    }));
  };

  const getFileUri = async (projectId) => {
    if (!userData) return null;

    return userData.projects[projectId]?.fileUri || null;
  };

  const setDownloadUri = async (projectId, downloadUri) => {
    if (!user) return;

    const userDocRef = doc(db, "userData", user.uid);
    await updateDoc(userDocRef, {
      [`projects.${projectId}.downloadUri`]: downloadUri,
    });
    setUserData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          downloadUri: downloadUri,
        },
      },
    }));
  };

  const getDownloadUri = async (projectId) => {
    if (!userData) return null;

    return userData.projects[projectId]?.downloadUri || null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        loading,
        updateUserData,
        addNewProject,
        deleteProject,
        getProjects,
        updateProjectName,
        updateProjectCount,
        getLimitAndUsage,
        addMessage,
        getMessages,
        getSampleCSV,
        setFileUri,
        getFileUri,
        setDownloadUri,
        getDownloadUri,
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

import { useState, useEffect } from "react";

import firebaseConfig from "../firebaseConfig.js";
import defaultData from "../DefaultData.js";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/home/HomePage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";


function App() {
  const [selectedWindow, setSelectedWindow] = useState(() => {
    return localStorage.getItem("currentWindow") || "home"
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") || 'light';
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("currentWindow", selectedWindow);
  }, [selectedWindow]);

  return (
    <section className={"flex flex-col min-h-screen bg-background dark:bg-background-dark "+(isDarkMode === 'dark' ? " dark" : "")}>
      <NavBar selected={selectedWindow} setSelected={setSelectedWindow} />

      {selectedWindow === "home" && (
        <div className="grow">
          <HomePage />
          <h3 className="text-7xl font-bold text-center">IN PROGRESS!</h3>
        </div>
      )}

      {selectedWindow === "dashboard" && (
        <div className="grow">
          <Dashboard/>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </section>
  );
}

export default App;

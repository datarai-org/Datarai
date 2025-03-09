import { useState, useEffect } from "react";

import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/home/HomePage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";
import About from "./components/about/About";


function App() {
  const [selectedWindow, setSelectedWindow] = useState(() => {
    return sessionStorage.getItem("currentWindow") || "home"
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") || 'light';
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    sessionStorage.setItem("currentWindow", selectedWindow);
  }, [selectedWindow]);

  return (
    <section className={"flex flex-col min-h-screen bg-background dark:bg-background-dark "+(isDarkMode === 'dark' ? " dark" : "")}>
      <NavBar selected={selectedWindow} setSelected={setSelectedWindow} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {selectedWindow === "home" && (
        <div className="grow">
          <HomePage setSelectedWindow={setSelectedWindow} />
        </div>
      )}

      {selectedWindow === "dashboard" && (
        <div className="grow">
          <Dashboard/>
        </div>
      )}

      {selectedWindow === "about" && (
        <div className="grow">
          <About/>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </section>
  );
}

export default App;

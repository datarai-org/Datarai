import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/home/HomePage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";

function App() {
  const [selected, setSelected] = useState("home");

  return (
    <section className="flex flex-col min-h-screen">
      <NavBar className="bg-warning" selected={selected} setSelected={setSelected} />

      {
        selected === "home" &&
        <div className="grow">
          <HomePage/>
          <h3 className="text-7xl font-bold text-center">IN PROGRESS!</h3>
        </div>
      }

      {
        selected === "dash" &&
        <div className="grow">
          <Dashboard />
        </div>
      }

      

      <Footer/>
    </section>
  );
}

export default App;

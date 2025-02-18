import React from "react";
import { FaCrown } from "react-icons/fa6";

const NavBar = ({ selected, setSelected }) => {
  const navBarClick = (e) => {
    setSelected(e.target.id);
  };

  return (
    <nav className="bg-section-base p-4 flex items-center justify-evenly">
      <a className="text-3xl michroma" href="/">
        Datarai.
      </a>
      <div className="flex justify-center gap-4 grow">
        {selected === "home" ? (
          <button
            id="home"
            className="cursor-pointer text-primary bg-primary/10 p-2 rounded-lg"
            onClick={navBarClick}
          >
            <b>Home</b>
          </button>
        ) : (
          <button
            id="home"
            className="cursor-pointer p-2"
            onClick={navBarClick}
          >
            Home
          </button>
        )}
        {selected === "dash" ? (
          <button
            id="dash"
            className="cursor-pointer text-primary bg-primary/10 p-2 rounded-lg"
            onClick={navBarClick}
          >
            <b>Dashboard</b>
          </button>
        ) : (
          <button
            id="dash"
            className="cursor-pointer p-2"
            onClick={navBarClick}
          >
            Dashboard
          </button>
        )}
        {selected === "about" ? (
          <button
            id="about"
            className="cursor-pointer text-primary bg-primary/10 p-2 rounded-lg"
            onClick={navBarClick}
          >
            <b>About</b>
          </button>
        ) : (
          <button
            id="about"
            className="cursor-pointer p-2"
            onClick={navBarClick}
          >
            About
          </button>
        )}
      </div>

      <button className="flex gap-1 bg-primary/30 text-primary font-bold py-1 px-2 text-center rounded-md border-2 border-black/20">
      <FaCrown className="self-center" /> Upgrade to Pro
      </button>
    </nav>
  );
};

export default NavBar;

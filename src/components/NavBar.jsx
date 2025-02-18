import React from "react";
import { FaCrown } from "react-icons/fa6";
import { IoMenu, IoCloseOutline } from "react-icons/io5";

const NavBar = ({ selected, setSelected }) => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [showMenu, setShowMenu] = React.useState(false);

  const navBarClick = (e) => {
    setSelected(e.target.id);
  };

  // 770 is medium screen size
  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="static bg-section-base p-4 flex items-center justify-between md:justify-evenly">
      <a className="text-3xl michroma" href="/">
        Datarai.
      </a>
      {screenWidth > 770 ? (
        <>
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

          <button className="flex gap-1 bg-primary/30 text-primary py-1 px-2 text-center rounded-md border-2 border-black/20">
            <FaCrown className="self-center" /> Upgrade to Pro
          </button>
        </>
      ) : (
        <>
          <button className="flex text-4xl">
            {showMenu ? (
              <IoCloseOutline
                className="self-center"
                onClick={() => setShowMenu(false)}
              />
            ) : (
              <IoMenu
                className="self-center"
                onClick={() => setShowMenu(true)}
              />
            )}
          </button>
          {showMenu && (
            <div className="absolute p-2 right-2 top-12 mt-2 bg-background rounded-lg shadow-lg">
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
              <div className="flex justify-center mt-2">
                <button className="flex gap-1 bg-primary/30 text-primary py-1 px-2 text-center rounded-md border-2 border-black/20">
                  <FaCrown className="self-center" /> Upgrade to Pro
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default NavBar;

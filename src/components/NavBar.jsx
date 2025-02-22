import React from "react";
import { FaCrown } from "react-icons/fa6";
import { IoMenu, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = ({ selected, setSelected }) => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [showMenu, setShowMenu] = React.useState(false);

  const navBarClick = (e) => {
    setSelected(e.target.id);
    setShowMenu(false); // Close menu when an item is clicked
  };

  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="relative bg-section-base dark:bg-section-dark p-4 flex items-center justify-between md:justify-evenly">
      <a className="text-3xl michroma text-primary" href="/">
        Datarai.
      </a>

      {screenWidth > 770 ? (
        <>
          <div className="flex justify-center gap-4 grow">
            {["home", "dashboard", "about"].map((item) => (
              <button
                key={item}
                id={item}
                className={`cursor-pointer p-2 ${
                  selected === item ? "text-primary bg-primary/10 rounded-lg" : "dark:text-text-dark"
                }`}
                onClick={navBarClick}
              >
                {selected === item ? <b>{item.charAt(0).toUpperCase() + item.slice(1)}</b> : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <button className="flex gap-1 bg-primary/30 text-primary py-1 px-2 text-center rounded-md border-2 border-black/20">
            <FaCrown className="self-center" /> Upgrade to Pro
          </button>
        </>
      ) : (
        <>
          {/* Menu Button */}
          <button className="flex text-4xl">
            {showMenu ? (
              <IoCloseOutline className="self-center" onClick={() => setShowMenu(false)} />
            ) : (
              <IoMenu className="self-center" onClick={() => setShowMenu(true)} />
            )}
          </button>

          {/* Sliding Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-16 right-0 w-3/5 sm:w-1/2 bg-section-base dark:bg-section-dark shadow-lg p-4 flex flex-col items-center"
              >
                {["home", "dash", "about"].map((item) => (
                  <button
                    key={item}
                    id={item}
                    className={`cursor-pointer p-2 w-full text-center ${
                      selected === item ? "text-primary bg-primary/10 rounded-lg" : ""
                    }`}
                    onClick={navBarClick}
                  >
                    {selected === item ? <b>{item.charAt(0).toUpperCase() + item.slice(1)}</b> : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
                <div className="mt-4">
                  <button className="flex gap-1 bg-primary/30 text-primary py-1 px-2 text-center rounded-md border-2 border-black/20">
                    <FaCrown className="self-center" /> Upgrade to Pro
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </nav>
  );
};

export default NavBar;

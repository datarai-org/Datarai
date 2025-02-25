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

          <div>
            <button className="bg-primary/30 text-primary dark:text-text-dark border-2 border-white/50 rounded-lg p-2 flex gap-2 justify-center content-center cursor-pointer hover:bg-primary/50" onClick={() => window.open("https://www.buymeacoffee.com/adityapatel")}>
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" className="w-1/12" alt="Buy me a coffee" />
            <p className="">Buy me a coffee</p>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Menu Button */}
          <button className="flex text-4xl text-primary dark:text-text-dark">
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
                {["home", "dashboard", "about"].map((item) => (
                  <button
                    key={item}
                    id={item}
                    className={`cursor-pointer p-2 w-full text-center ${
                      selected === item ? "text-primary bg-primary/10 rounded-lg" : "dark:text-text-dark"
                    }`}
                    onClick={navBarClick}
                  >
                    {selected === item ? <b>{item.charAt(0).toUpperCase() + item.slice(1)}</b> : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
                <div>
                  <button className="mt-2 bg-primary/30 text-primary dark:text-text-dark border-2 border-white/50 rounded-lg p-2 flex gap-2 justify-center content-center cursor-pointer hover:bg-primary/50" onClick={() => window.open("https://www.buymeacoffee.com/adityapatel")}>
                  <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" className="w-1/12" alt="Buy me a coffee" />
                  <p className="">Buy me a coffee</p>
                  </button>
                  <p className="italic text-xs mt-1 text-black/50 dark:text-text-dark/50">if you wish to support me</p>
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

import {
  MdToggleOff,
  MdToggleOn,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";

import { useUser } from "../../UserContext";

const Footer = ({ isDarkMode, setIsDarkMode }) => {
  const { user } = useUser();

  if (!user) return null;
  return (
    <footer className="bg-section-base dark:bg-section-dark text-center p-4">
      <a
        href="https://datarai.com/privacy.html"
        className="text-info"
        target="none"
      >
        <u>Privacy Policy</u>
      </a>

      <p className="text-black/50 dark:text-text-dark/50 mt-8">Toggle theme</p>
      <div className="flex justify-center content-start mb-8">
        <MdLightMode className="text-4xl dark:text-text-dark self-center" />
        <button
          className="flex text-black dark:text-text-dark text-6xl outline-none"
          onClick={() =>
            setIsDarkMode(isDarkMode === "light" ? "dark" : "light")
          }
        >
          {isDarkMode === "dark" ? (
            <MdToggleOn className="self-start" />
          ) : (
            <MdToggleOff className="self-start" />
          )}
        </button>
        <MdDarkMode className="text-4xl dark:text-text-dark self-center" />
      </div>

      <p className="text-black/50 dark:text-text-dark/50">
        Created by{" "}
        <a href="https://apatel.xyz" className="text-info" target="none">
          <u>Aditya Patel</u>
        </a>
      </p>
      <p className="text-black/50 dark:text-text-dark/50">
        © 2025 Datarai. - All rights reserved
      </p>
      <p className="mt-2 text-black/50 dark:text-text-dark/50 text-xs">
        UserID: {user.uid}
      </p>
    </footer>
  );
};

export default Footer;

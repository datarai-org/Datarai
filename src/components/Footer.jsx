import {
  MdToggleOff,
  MdToggleOn,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";

const Footer = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <footer className="bg-section-base dark:bg-section-dark text-center p-4">
      <p className="text-black/50 dark:text-text-dark/50">
        © 2025 - All rights reserved
      </p>
      <p className="text-black/50 dark:text-text-dark/50 text-sm">
        Created by{" "}
        <a href="https://apatel.xyz" className="text-info" target="none">
          <u>Aditya Patel</u>
        </a>
      </p>

      <p className="text-black/50 dark:text-text-dark/50 mt-8">Toggle theme</p>
      <div className="flex justify-center content-start mb-8">
        <MdLightMode className="text-4xl dark:text-text-dark self-center" />
        <button
          className="flex text-black dark:text-text-dark text-6xl outline-none"
          onClick={() =>
            setIsDarkMode(isDarkMode === "light" ? "dark" : "light")
          }
        >
          {isDarkMode === "dark" ? <MdToggleOn className="self-start" /> : <MdToggleOff className="self-start" />}
        </button>
        <MdDarkMode className="text-4xl dark:text-text-dark self-center" />
      </div>
    </footer>
  );
};

export default Footer;

import { FaUpload, FaMagnifyingGlass } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";

const HomePage = () => {
  return (
    <div className="m-8 px-4 py-8 bg-section-base rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      <h1 className="text-5xl font-bold">
        Intelligent AI Powered Tool for{" "}
        <span className="bg-gradient-to-br from-primary to-primary/30 text-transparent bg-clip-text">
          Data Analysis
        </span>
      </h1>
      <p className="text-lg w-[40%] self-center py-4 text-black/40">
        Analyze and visualize data with ease.
      </p>

      <div className="flex justify-center gap-4 text-left mt-16">
        <div className="flex flex-col p-4 rounded-b-lg w-3/12 shadow-lg">
          <h2 className="text-xl">
            <b className="flex gap-2">
              <FaUpload className="self-center" />
              Upload
            </b>
          </h2>
          <p className="text-black/50 pt-4">
            Upload your data as a CSV file or spreadsheet to get started.
          </p>
        </div>
        <div className="flex flex-col p-4 rounded-b-lg w-5/12 shadow-lg">
          <h2 className="text-xl">
            <b className="flex gap-2">
              <FaMagnifyingGlass className="self-center" />
              Analyze
            </b>
          </h2>
          <p className="text-black/50 pt-4">
            Talk to your data, generate statistics and get in-depth analysis
          </p>
          <p className="text-black/50 pt-3">
            "How many users created an account this year?"
          </p>
          <p className="text-black/50 pt-1">
            "Give me tips for increasing the amount of clicks on this button."
          </p>
        </div>
        <div className="flex flex-col p-4 rounded-b-lg w-3/12 shadow-lg">
          <h2 className="text-xl">
            <b className="flex gap-2">
              <BsStars className="self-center" />
              Visualize
            </b>
          </h2>
          <p className="text-black/50 pt-4">
            Generate customizable Python code to visualize your data in seconds,
            or just get ready-made graphs that you can directly use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

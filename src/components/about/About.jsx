import React from "react";

const About = () => {
  return (
    <div className="mx-2 md:mx-8 mt-8 px-4 py-8 bg-section-base dark:bg-section-dark text-black dark:text-text-dark rounded-lg flex flex-col shadow-lg">
      <div className="w-3/4 self-center">
        <h1 className="text-3xl font-bold mb-6 text-center">About Datarai</h1>
        <p className="text-lg mb-4 text-pretty">
          Datarai is a cutting-edge data analytics platform designed to help
          businesses make data-driven decisions. Our platform offers a range of
          tools and features to analyze, visualize, and interpret data, making
          it easier for companies to gain insights and drive growth.
        </p>
        <h2 className="text-2xl font-semibold mb-3 text-center">Who I Am</h2>
        <p className="text-lg text-center ">
          Hi, I'm Aditya Patel, the creator of Datarai. Currently pursuing a
          major in computer science, I am passionate about leveraging technology
          to solve complex problems. My goal is to provide a powerful and
          user-friendly platform that empowers users to unlock the full
          potential of their data.
        </p> 
        {/* <div className="flex gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-b-danger self-center">
            <p className="invisible">.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default About;

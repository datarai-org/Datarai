import React from "react";



const ChatBox = ({ className }) => {
    return (
        <div className={`mx-2 md:mx-8 my-8 px-4 py-8 bg-background/30 rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}>
            <h1 className="text-3xl font-bold">Chat Box</h1>
    
        </div>
    );
}

const Dashboard = () => {


  return (
    <div className="mx-2 md:mx-8 my-8 px-4 py-8 bg-section-base rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
        <h1 className="text-3xl font-bold">Welcome to your dashboard</h1>
        
        <div className="grid grid-cols-6 gap-4 grid-rows-4">
            <ChatBox className="col-start-4 col-span-3 row-span-4 h-screen"/>
        </div>
    </div>
  );
};

export default Dashboard;

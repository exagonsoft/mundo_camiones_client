import React from "react";

const ActiveRenderer = ({ active }: { active: boolean }) => {
  return (
    <div className={`flex justify-center gap-2 items-center`}>
      <div
        className={`p-2 rounded-full ${
          active ? "bg-green-500" : "bg-gray-600"
        }`}
      ></div>
      {active ? "Activa" : "Finalizada"}
    </div>
  );
};

export default ActiveRenderer;

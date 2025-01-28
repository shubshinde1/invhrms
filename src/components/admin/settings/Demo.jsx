import { React, useState, useEffect } from "react";
import data from "../../../dummydata/leaveData.json";

const Demo = () => {
  const [leaveData, setLeaveData] = useState("");

  useEffect(() => {
    setLeaveData(data);
  }, []);

  return (
    <div>
      {leaveData.length > 0 ? (
        <div>
          {leaveData.map((record, index) => {
            return <div key={index}>{record.empid}</div>;
          })}
        </div>
      ) : (
        <div>no data</div>
      )}
    </div>
  );
};

export default Demo;

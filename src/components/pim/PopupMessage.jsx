import React, { useEffect, useState } from "react";
import { BsPersonFillCheck, BsPersonFillAdd } from "react-icons/bs";
import { FaListUl } from "react-icons/fa6";

const PopupMessage = ({ message, onAddMore, onGoToList }) => {
  const [timer, setTimer] = useState(5);
  let countdown;

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [countdown]);

  // useEffect(() => {
  //   if (timer === 0) {
  //     clearInterval(countdown);
  //   }
  // }, [timer]);

  return (
    <>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-6 rounded-lg z-[9999] w-72 sm:w-auto px-5">
        <div className="flex items-center justify-center bg-sky-50 dark:bg-neutral-950 rounded-md px-4 py-3">
          <BsPersonFillCheck className="text-green-500 text-3xl" />
          <p className="ml-2">{message}</p>
        </div>

        <div className=" mt-2 w-[100%] items-center">
          {timer > 0 && (
            <div
              className="text-center "
              style={{
                top: "10px",
                right: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                zIndex: "9999",
              }}
            >
              <h1 className=" text-sm text-red-500">
                Ridirect To Employee list in {timer}s
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between  mt-5">
          <button
            className="bg-[#5336FD] text-white text-sm px-3 py-2 rounded-md cursor-pointer font-bold hover:scale-[1.020] flex items-center"
            onClick={onAddMore}
          >
            <BsPersonFillAdd className="mr-2.5 text-lg" />
            Add More
          </button>
          <button
            className="bg-green-600 text-white text-sm px-3 py-2 rounded-md cursor-pointer font-bold hover:scale-[1.020] flex items-center ml-4"
            onClick={onGoToList}
          >
            <FaListUl className="mr-2.5 text-lg" />
            Go to List
          </button>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity as needed
          backdropFilter: "blur(5px)", // Apply the blur effect
          zIndex: "9998",
        }}
        // onClick={onAddMore}
      ></div>
    </>
  );
};

export default PopupMessage;

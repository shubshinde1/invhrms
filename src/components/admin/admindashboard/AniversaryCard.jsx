import React, { useState } from "react";
import { TbTimelineEventFilled } from "react-icons/tb";
import userProfile from "../../../assets/images/clientAvatar.png";
import { FaCakeCandles } from "react-icons/fa6";
import { HiBriefcase } from "react-icons/hi2";

const AnniversaryCard = ({ employeeList }) => {
  const [activeTab, setActiveTab] = useState("birthdays"); // State to manage the active tab

  // Get today's date
  const today = new Date();
  const todayMonthDay = today.getMonth() * 100 + today.getDate(); // Today's month and day in MMDD format

  // Function to get today's birthdays
  const getTodaysBirthdays = () => {
    return employeeList.filter(
      (employee) =>
        employee.dob &&
        employee.status === 1 &&
        new Date(employee.dob).getMonth() * 100 +
          new Date(employee.dob).getDate() ===
          todayMonthDay
    );
  };

  // Function to get today's work anniversaries
  const getTodaysWorkAnniversaries = () => {
    return employeeList.filter(
      (employee) =>
        employee.dateofjoining &&
        employee.status === 1 &&
        new Date(employee.dateofjoining).getMonth() * 100 +
          new Date(employee.dateofjoining).getDate() ===
          todayMonthDay
    );
  };

  // Function to get filtered and sorted birthdays
  const getBirthdays = () => {
    return employeeList
      .filter(
        (employee) => employee.dob && employee.status === 1 // Filter by status and valid dob
      )
      .map((employee) => ({
        ...employee,
        dob: new Date(employee.dob), // Convert DOB to Date object
      }))
      .sort((a, b) => {
        // Sort by month and day in ascending order (January 1 to December 31)
        const monthDayA = a.dob.getMonth() * 100 + a.dob.getDate();
        const monthDayB = b.dob.getMonth() * 100 + b.dob.getDate();
        return monthDayA - monthDayB;
      });
  };

  // Function to get filtered and sorted work anniversaries
  const getWorkAnniversaries = () => {
    return employeeList
      .filter(
        (employee) => employee.dateofjoining && employee.status === 1 // Filter by status and valid dateofjoining
      )
      .map((employee) => ({
        ...employee,
        dateofjoining: new Date(employee.dateofjoining), // Convert dateofjoining to Date object
      }))
      .sort((a, b) => {
        // Sort by month and day in ascending order (January 1 to December 31)
        const monthDayA =
          a.dateofjoining.getMonth() * 100 + a.dateofjoining.getDate();
        const monthDayB =
          b.dateofjoining.getMonth() * 100 + b.dateofjoining.getDate();
        return monthDayA - monthDayB;
      });
  };

  const todaysBirthdays = getTodaysBirthdays();
  const todaysWorkAnniversaries = getTodaysWorkAnniversaries();
  const birthdays = getBirthdays();
  const workAnniversaries = getWorkAnniversaries();

  return (
    <div className="p-2 bg-white border-2 dark:border-none dark:bg-neutral-900 rounded-md flex flex-col gap-2 items-start">
      {/* Today's Birthdays and Work Anniversaries */}
      <h2 className="text-sm font-bold flex items-center gap-2">
        <TbTimelineEventFilled className="text-orange-500" fontSize={20} />
        Today's{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}{" "}
        Events
      </h2>
      <div className="flex flex-col md:flex-row gap-2 w-full ">
        <div className="flex flex-col gap-2 w-full md:w-1/2 ">
          {todaysBirthdays.length > 0 || todaysWorkAnniversaries.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {todaysBirthdays.length > 0 && (
                <div className="flex gap-2 items-start w-full">
                  <div className="font-semibold flex flex-co gap-2 bg-pink-500/20  text-pink-500 p-2 rounded-md items-center w-full">
                    <div className="flex flex-col gap-2 items-center w-1/3 text-center">
                      <FaCakeCandles fontSize={40} />
                      Birthdays
                    </div>
                    <div
                      className={`flex flex-col items- w-2/3 ${
                        todaysBirthdays.length > 2
                          ? "h-24 overflow-y-scroll scrollbar-hide"
                          : ""
                      } gap-2`}
                    >
                      {todaysBirthdays.map((employee) => (
                        <div
                          key={employee._id}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={employee.profile || userProfile}
                            alt=""
                            className="w-8 h-8 rounded-md"
                          />
                          <strong>{employee.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {todaysWorkAnniversaries.length > 0 && (
                <div className="flex gap-2 items-start w-full">
                  <div className="font-semibold flex flex-co gap-2 bg-purple-500/20  text-purple-500 p-2 rounded-md items-center w-full">
                    <div className="flex flex-col gap-2 items-center w-1/3 text-center">
                      <HiBriefcase fontSize={40} />
                      Work Anniversaries
                    </div>
                    <div
                      className={`flex flex-col items- w-2/3 ${
                        todaysWorkAnniversaries.length > 2
                          ? "h-24 overflow-y-scroll scrollbar-hide"
                          : ""
                      } gap-2`}
                    >
                      {todaysWorkAnniversaries.map((employee) => (
                        <div
                          key={employee._id}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={employee.profile || userProfile}
                            alt=""
                            className="w-8 h-8 rounded-md"
                          />
                          <strong>{employee.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 h-24 dark:bg-neutral-950 md:h-full rounded-lg flex items-center justify-center text-gray-500">
              No Any event We've today.
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-2  h-56">
          {/* Tab Headers */}
          <div className="flex bg-white border dark:border-none dark:bg-neutral-950 justify-between p-1 rounded-lg">
            <button
              className={` py-2 font-semibold w-1/2 ${
                activeTab === "birthdays"
                  ? "bg-blue-500/20 text-blue-500 rounded-md"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("birthdays")}
            >
              Birthdays
            </button>
            <button
              className={` py-2 font-semibold w-1/2 ${
                activeTab === "anniversaries"
                  ? "bg-blue-500/20 text-blue-500 rounded-md"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("anniversaries")}
            >
              Work Anniversaries
            </button>
          </div>

          {/* Tab Content */}
          <div className="overflow-y-scroll scrollbar-hide h-full">
            {activeTab === "birthdays" && (
              <div className="h-full">
                {birthdays.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {birthdays
                      .filter((employee) => {
                        const employeeDobThisYear = new Date(
                          new Date().getFullYear(),
                          employee.dob.getMonth(),
                          employee.dob.getDate()
                        );
                        return employeeDobThisYear >= new Date(); // Only show if the birthday is yet to come this year
                      })
                      .map((employee) => {
                        const today = new Date();
                        const birthdayThisYear = new Date(
                          today.getFullYear(),
                          employee.dob.getMonth(),
                          employee.dob.getDate()
                        );

                        const timeDiff = birthdayThisYear - today;
                        const remainingDays = Math.ceil(
                          timeDiff / (1000 * 60 * 60 * 24)
                        ); // Calculate days

                        return (
                          <div
                            key={employee._id}
                            className="flex items-center gap-2 justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={employee.profile || userProfile}
                                alt=""
                                className="w-8 h-8 rounded-md"
                              />
                              <strong>{employee.name}</strong>
                            </div>
                            <div>
                              {remainingDays === 1 ? (
                                <div className="text-green-500 font-bold">
                                  Tomorrow
                                </div>
                              ) : (
                                <div>
                                  {new Date(employee.dob).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  <span className="text-xs text-gray-500">
                                    ({remainingDays}d)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-neutral-950 h-full rounded-lg flex items-center justify-center text-gray-500">
                    No birthdays found for active employees.
                  </div>
                )}
              </div>
            )}
            {activeTab === "anniversaries" && (
              <div className="h-full">
                {workAnniversaries.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {workAnniversaries
                      .filter((employee) => {
                        const employeeAnniversaryThisYear = new Date(
                          new Date().getFullYear(),
                          employee.dateofjoining.getMonth(),
                          employee.dateofjoining.getDate()
                        );
                        return employeeAnniversaryThisYear >= new Date(); // Only show if the work anniversary is yet to come this year
                      })
                      .map((employee) => {
                        const today = new Date();
                        const anniversaryThisYear = new Date(
                          today.getFullYear(),
                          employee.dateofjoining.getMonth(),
                          employee.dateofjoining.getDate()
                        );

                        const timeDiff = anniversaryThisYear - today;
                        const remainingDays = Math.ceil(
                          timeDiff / (1000 * 60 * 60 * 24)
                        ); // Calculate days

                        return (
                          <div
                            key={employee._id}
                            className="flex items-center gap-2 justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={employee.profile || userProfile}
                                alt=""
                                className="w-8 h-8 rounded-md"
                              />
                              <strong>{employee.name}</strong>
                            </div>
                            <div>
                              {remainingDays === 1 ? (
                                <div className="text-green-500 font-bold">
                                  Tomorrow
                                </div>
                              ) : (
                                <div>
                                  {new Date(
                                    employee.dateofjoining
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                  })}{" "}
                                  <span className="text-xs text-gray-500">
                                    ({remainingDays}d)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-neutral-950 h-full rounded-lg flex items-center justify-center text-gray-500">
                    No work anniversaries found for active employees.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryCard;

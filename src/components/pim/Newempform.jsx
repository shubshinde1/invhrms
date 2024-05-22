import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PersonalInformation,
  EmploymentInformation,
  ContactInformation,
  EmergencyContacts,
  WorkExperience,
  Documents,
} from "./Formsteps";

export default function Newempform() {
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const Navigate = useNavigate();

  // State variables to store form data from each step
  const [formData, setFormData] = useState({
    personalInformation: {},
    employmentInformation: {},
    contactInformation: {},
    emergencyContacts: {},
    workExperience: {},
    documents: {},
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSuccessPopupOpen(true);
    // Log the combined form data
    // console.log(formData);
    if (step === steps.length) {
      // Proceed to submit the form
      console.log("Employee data is here", formData);
      // Add your form submission logic here
      // After submission, navigate to the desired page
      // setTimeout(() => {
      //   setIsSuccessPopupOpen(false);
      //   Navigate("/pim/employeelist");
      // }, 10000);
    } else {
      console.log("All steps are not completed.");
    }
  };

  // useEffect(() => {
  //   let autoCloseTimer;
  //   if (isSuccessPopupOpen) {
  //     autoCloseTimer = setTimeout(() => {
  //       setIsSuccessPopupOpen(false);
  //       Navigate("/pim/employeelist");
  //     }, 10000);
  //   }
  //   return () => clearTimeout(autoCloseTimer);
  // }, [isSuccessPopupOpen, Navigate]);

  const [step, setStep] = useState(1);
  const steps = [
    "Personal Information",
    "Employment Information",
    "Contact Information",
    "Emergency Contacts",
    "Work Experience",
    "Documents",
  ];

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Function to update form data state
  const formDataCallback = (stepName, data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [stepName.toLowerCase().replace(" ", "")]: data,
    }));
  };

  return (
    <div className="bg-white dark:bg-neutral-950 dark:text-white p-2 rounded-md h-screen overflow-scroll scrollbar-hide flex flex-col md:grid grid-cols-12 gap-4">
      <div className="  col-span-3 md:col-span-2 ">
        <div className="bg-sky-50 dark:bg-neutral-900 rounded-md sticky top-0">
          <ul className="text-sm p-2 flex flex-col gap-2 sticky top-0">
            {steps.map((stepName, index) => (
              <li
                key={index + 1}
                className={`hover:bg-blue-100 hover:dark:bg-neutral-800 py-2.5 px-1.5 rounded-md cursor-pointer ${
                  step === index + 1
                    ? "bg-blue-100 dark:bg-neutral-950 font-bold"
                    : ""
                }`}
                onClick={() => setStep(index + 1)}
              >
                {stepName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-span-9 md:col-span-10">
        <div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <PersonalInformation
                onNext={nextStep}
                formDataCallback={(data) =>
                  formDataCallback("Personal Information", data)
                }
              />
            )}
            {step === 2 && (
              <EmploymentInformation
                onPrev={prevStep}
                onNext={nextStep}
                formDataCallback={(data) =>
                  formDataCallback("Employment Information", data)
                }
              />
            )}
            {step === 3 && (
              <ContactInformation
                onPrev={prevStep}
                onNext={nextStep}
                formDataCallback={(data) =>
                  formDataCallback("Contact Information", data)
                }
              />
            )}
            {step === 4 && (
              <EmergencyContacts
                onPrev={prevStep}
                onNext={nextStep}
                formDataCallback={(data) =>
                  formDataCallback("Emergency Contacts", data)
                }
              />
            )}
            {step === 5 && (
              <WorkExperience
                onPrev={prevStep}
                onNext={nextStep}
                formDataCallback={(data) =>
                  formDataCallback("Work Experience", data)
                }
              />
            )}
            {step === 6 && (
              <Documents
                onPrev={prevStep}
                formDataCallback={(data) => formDataCallback("Documents", data)}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

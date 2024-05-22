import React, { useState } from "react";
import PersonalInformation from "./PersonalInformation";
import EmploymentInformation from "./EmploymentInformation";
import ContactInformation from "./ContactInformation";
import EmergencyContacts from "./EmergencyContacts";
import WorkExperience from "./WorkExperience";
import Documents from "./Documents";

export default function EmployeeForm() {
  const [formData, setFormData] = useState({});

  const handlePersonalInfoSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, personalInformation: data }));
  };

  const handleEmploymentInfoSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, employmentInformation: data }));
  };

  // adharcard: null,
  // pancard: null,
  // addressproof: null,
  // electricitybil: null,
  // offerlatter: null,
  // experiencelatter: null,
  // payslip1: null,
  // payslip2: null,
  // payslip3: null,

  const handleContactInfoSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, contactInformation: data }));
  };

  const handleEmergencyContactsSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, emergencyContacts: data }));
  };

  const handleWorkExperienceSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, workExperience: data }));
  };

  const handleDocumentsSubmit = (data) => {
    setFormData((prevData) => ({ ...prevData, documents: data }));
    // After receiving all form data, you can log it
    console.log(formData);
  };

  return (
    <div>
      <PersonalInformation onNext={handlePersonalInfoSubmit} />
      <EmploymentInformation onNext={handleEmploymentInfoSubmit} />
      <ContactInformation onNext={handleContactInfoSubmit} />
      <EmergencyContacts onNext={handleEmergencyContactsSubmit} />
      <WorkExperience onNext={handleWorkExperienceSubmit} />
      <Documents onNext={handleDocumentsSubmit} />
    </div>
  );
}

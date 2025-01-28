Here is an updated version of your README file with the addition of the folder structure section:

---

# invhrms Project Setup

This document provides a step-by-step guide to set up the `invhrms` project.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shubshinde1/invhrms.git
   cd invhrms
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

## Running the Project

1. **Start the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   The development server will start, and you can access the application at `http://localhost:3000`.

## Building for Production

1. **Build the Project**

   Using npm:

   ```bash
   npm run build
   ```

   Or using yarn:

   ```bash
   yarn build
   ```

   The production-ready files will be generated in the `dist` directory.

## Additional Information

- The project uses [Vite](https://vitejs.dev/) for fast and optimized development.
- ESLint rules are included to maintain code quality.
- The project supports hot module replacement (HMR) for a better development experience.

For more details, refer to the official Vite documentation and the plugins used:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

## Folder Structure

Here is an overview of the project folder structure:

```plaintext
|-- App.css
|-- App.jsx
|-- AuthContext.jsx
|-- index.css
|-- main.jsx
|-- NotFound.jsx
|-- oldApp.jsx
|-- PrivateRoute.jsx
|-- reportWebVitals.jsx
|-- api
  |-- APIEndPoints.json
|-- contexts
  |-- AuthContext.jsx
|-- dummydata
  |-- leaveData.json
  |-- MasterClientsProjects.json
  |-- timezone.json
|-- styling
  |-- material.js
|-- assets
  |-- react.svg
  |-- font
    |-- EuclidBold.ttf
    |-- EuclidMedium.ttf
    |-- EuclidRegular.ttf
  |-- images
    |-- 404.svg
    |-- 404bg.jpg
    |-- breaktime.png
    |-- calender.png
    |-- caret.png
    |-- clientAvatar.png
    |-- intime.png
    |-- invezza-logo-darkmode.png
    |-- invezza-logo.png
    |-- login.svg
    |-- norecordfound.svg
    |-- Outlook.png
    |-- profilepic.png
    |-- profilepic1.png
    |-- tasks.png
    |-- Teams.png
    |-- totalhours.png
|-- lib
  |-- consts
    |-- navigation.jsx
|-- components
  |-- AdminDashboard.jsx
  |-- Attendance.jsx
  |-- Claim.jsx
  |-- Clients.jsx
  |-- Dashboard.jsx
  |-- HRDashboard.jsx
  |-- Leave.jsx
  |-- Loading.jsx
  |-- Login.jsx
  |-- Myprofile.jsx
  |-- Notification.jsx
  |-- Pim.jsx
  |-- Projects.jsx
  |-- ProtectedRoute.jsx
  |-- Register.jsx
  |-- ResetPassword.jsx
  |-- Task.jsx
  |-- User.jsx
  |-- client
    |-- Addclient.jsx
    |-- ClientCard.jsx
    |-- ViewClient.jsx
  |-- custom
    |-- Calendar.jsx
    |-- CustomDialog.jsx
    |-- CustomDropdown.jsx
    |-- DashCalendar.jsx
    |-- OpenCalendar.jsx
    |-- TruncatedTextWithTooltip.jsx
  |-- dashboard
    |-- AttendanceChart.jsx
    |-- AttendanceHistory.jsx
    |-- Bodycards.jsx
    |-- Calendar.jsx
    |-- Greeting.jsx
    |-- ProjectBriefforemp.jsx
  |-- extra
    |-- ErrorMsg.jsx
    |-- loading.jsx
    |-- Meteors.jsx
  |-- project
    |-- ViewProject.jsx
  |-- shared
    |-- Header.jsx
    |-- Layout.jsx
    |-- LogoutMenuItem.jsx
    |-- Sidebar.jsx
  |-- projects
    |-- Addproject.jsx
  |-- userleave
    |-- ApplyLeave.jsx
    |-- LeaveHistory.jsx
    |-- UserLeave.jsx
  |-- timesheet
    |-- custom-calendar.css
    |-- CustomCalendar.jsx
    |-- TimeSheet.jsx
  |-- userprofile
    |-- ProfilePic.jsx
    |-- UserProfile.jsx
  |-- admin
    |-- leave
      |-- RefillLeaves.jsx
    |-- admindashboard
      |-- AniversaryCard.jsx
      |-- EmployeeAttendaceBrief.jsx
      |-- LeaveApplicationsCard.jsx
    |-- settings
      |-- CountrySettings.jsx
      |-- Demo.jsx
      |-- DepartmentSettings.jsx
      |-- DesignationSettings.jsx
      |-- ReportingManagerSettings.jsx
      |-- Settings.jsx
      |-- TimeSheetSettings.jsx
  |-- pim
    |-- Addemployee.jsx
    |-- EditEmployee.jsx
    |-- EmployeeData.jsx
    |-- EmployeeDetails.jsx
    |-- EmployeeForm.jsx
    |-- Employeelist.jsx
    |-- EmployeeMenutabs.jsx
    |-- Formsteps.jsx
    |-- Leave.jsx
    |-- Menutabs.jsx
    |-- Newempform.jsx
    |-- PopupMessage.jsx
    |-- Submenu.jsx
    |-- TimeSheets.jsx
    |-- View.jsx
    |-- ViewEmployee.jsx
    |-- admin
      |-- AdminAttendance.jsx
      |-- AdminInfo.jsx
      |-- AdminLeave.jsx
      |-- AdminTimeSheet.jsx
      |-- EmployeeLeaveHistory.jsx
      |-- TimesheetCalendar.jsx

```

- **public**: Contains static assets like the favicon and HTML file.
- **src**: Contains the main source code for the project.
  - **assets**: Directory for static assets like images and styles.
  - **components**: Directory for reusable React components.
  - **pages**: Directory for individual page components.
  - **App.jsx**: The main React component.
  - **main.jsx**: Entry point for the React application.
  - **index.css**: Global CSS file.
- **.gitignore**: Git ignore file to exclude certain files from version control.
- **package.json**: Contains project metadata and dependencies.
- **README.md**: Project documentation.
- **vite.config.js**: Vite configuration file.
- **yarn.lock**: Yarn lock file for dependency management.

---

You can copy and replace the content of your current README file with this updated version.

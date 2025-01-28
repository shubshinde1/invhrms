# Invezza HRMS Portal clientside Setup

This document provides a step-by-step guide to set up the `invhrms` project.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)
- [React js](https://react.dev/learn) (version 18.3.1 or higher)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shubshinde1/invhrms.git
   ```

   ```bash
   cd invhrms
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

## Running the Project

1. **Start the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   The development server will start, and you can access the application at `http://localhost:3000`.

## Building for Production

1. **Build the Project**

   Using npm:

   ```bash
   npm run build
   ```

   The production-ready files will be generated in the `dist` directory.

## Additional Information

- The project uses [Vite](https://vitejs.dev/) for fast and optimized development.
- ESLint rules are included to maintain code quality.
- The project supports hot module replacement (HMR) for a better development experience.

For more details, refer to the official Vite documentation and the plugins used:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

## Review components by folder Structure

We'll review code base by components/folders/files inside `src/` folder

```plaintext
|-- api
  |-- APIEndPoints.json
```

This is the API hub where we've all endpoints mentioned with `baseUrl` and `endpoints`

1. `baseUrl` is the main URl where project is hosted for eg: `http://localhost:3000/`
2. `endpoints` is like : `api/admin/viewusers`

<br/>
<br/>

````plaintext
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
    ```
````

This is all assets that we've used in entier project ahead.

<br/>
<br/>

```plaintext
|-- contexts
  |-- AuthContext.jsx
```

This is the configuration when user login to portal this context save user's all info in react context hook and pass this all information in entire application by props.

<br/>
<br/>

```plaintext
|-- lin
  |-- consts
    |-- navigation.jsx
```

For showing tabs to user in sidebar with different user types for eg below
<br/>

for `HR` sidebar will show only below tabs:

```plaintext
|-- Dashboard
|-- PIM
|-- Attendance
|-- Leave
|-- Profile
|-- Settings
```

for `Admin` sidebar will show only below tabs:
<br/>

```plaintext
|-- Dashboard
|-- PIM
|-- Clients
|-- Projects
|-- Settings
```

same for `Employee` and `Manager`'s login

Basicallt `navigation.jsx` file defines which tab should visible for which user by there roles defined in server.

<br/>
<br/>

```plaintext
|-- styling
  |-- material.js
```

This is define styling for some `Material UI` components in js.

<br/>
<br/>

```plaintext
|-- App.css
|-- index.css
```

This both are some custom styling for application like colors, fonts, scrollbars, and etc.

<br/>
<br/>

```plaintext
|-- App.jsx
```

Application's main file with all routing with defferent user types. this files passes the `Dark theme` colors to entier app.

<br/>
<br/>

```plaintext
|-- main.jsx
```

This file render after `index.html` in this file we've wraped our application in like below:

```plaintext
<AuthProvider>
  <App />
</AuthProvider>
```

<br/>
<br/>

```plaintext
|-- NotFound.jsx
```

When if any different user trying to access other user type's routes then this page show `404` error.

<br/>
<br/>

```plaintext
|-- reportWebVitals.jsx
```

The main purpose of this file is to monitor and report web performance metrics. It collects data on how well the web application is performing in terms of loading speed, responsiveness, and layout stability, and sends this data to a callback function for further analysis or logging.

<br/>
<br/>

Now we've main folder `components/`

```plaintext
|-- components
  |-- AdminDashboard.jsx (Main components)
  |-- Attendance.jsx (Main components)
  |-- Claim.jsx (Main components)
  |-- Clients.jsx (Main components)
  |-- Dashboard.jsx (Main components)
  |-- HRDashboard.jsx (Main components)
  |-- Leave.jsx (Main components)
  |-- Loading.jsx (Main components)
  |-- Login.jsx (Main components)
  |-- Myprofile.jsx (Main components)
  |-- Notification.jsx (Main components)
  |-- Pim.jsx (Main components)
  |-- Projects.jsx (Main components)
  |-- ProtectedRoute.jsx (Main components)
  |-- Register.jsx (Main components)
  |-- ResetPassword.jsx (Main components)
  |-- Task.jsx (Main components)
  |-- User.jsx (Main components)
  |-- client(folder) this is subgolder of above main components.
  |-- custom(folder) this is subgolder of above main components.
  |-- dashboard(folder) this is subgolder of above main components.
  |-- extra(folder) this is subgolder of above main components.
  |-- project(folder) this is subgolder of above main components.
  |-- projects(folder) this is subgolder of above main components.
  |-- shared(folder) this is subgolder of above main components.
  |-- timesheet(folder) this is subgolder of above main components.
  |-- userleave(folder) this is subgolder of above main components.
  |-- userprofile(folder) this is subgolder of above main components.
  |-- admin(folder) this is subgolder of above main components.
  |-- pim(folder) this is subgolder of above main components.
```

All `Main components` are directely render on main routes.
And all `folder` are render under main components.

## Complete Folder Structure

Here is an overview of the project folder structure:

```plaintext
|-- App.css
|-- App.jsx
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
  |-- projects
    |-- Addproject.jsx
  |-- shared
    |-- Header.jsx
    |-- Layout.jsx
    |-- LogoutMenuItem.jsx
    |-- Sidebar.jsx
  |-- timesheet
    |-- custom-calendar.css
    |-- CustomCalendar.jsx
    |-- TimeSheet.jsx
  |-- userleave
    |-- ApplyLeave.jsx
    |-- LeaveHistory.jsx
    |-- UserLeave.jsx
  |-- userprofile
    |-- ProfilePic.jsx
    |-- UserProfile.jsx
  |-- admin
    |-- admindashboard
      |-- AniversaryCard.jsx
      |-- EmployeeAttendaceBrief.jsx
      |-- LeaveApplicationsCard.jsx
    |-- leave
      |-- RefillLeaves.jsx
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

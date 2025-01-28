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

---

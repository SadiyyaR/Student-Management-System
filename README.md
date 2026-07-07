# Student Management System

A beginner-friendly full-stack CRUD application built with Node.js, Express, MongoDB, and Vanilla JavaScript with Bootstrap 5.

## Features
- Create, Read, Update, and Delete Student records
- Search functionality by Name, Register Number, or Department
- Client-side and server-side validation
- Responsive UI designed with Bootstrap 5
- Success and Error messages
- Delete confirmation dialog

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM

## Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally, or a MongoDB Atlas URI

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd student-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured correctly:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/studentDB
   ```
   *(Adjust the `MONGO_URI` if you are using a remote database).*

## Running the Application

To start the server:
```bash
npm start
```
For development with nodemon:
```bash
npm run dev
```

The application will be running at `http://localhost:3000`. Open this URL in your web browser.

## Project Structure
- `/config` - Database configuration
- `/models` - Mongoose database models
- `/controllers` - Logic for route endpoints
- `/routes` - API routes definitions
- `/public` - Static assets (CSS, JS)
- `/views` - HTML templates
- `app.js` - Main application entry point
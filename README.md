# JobTrack — Job Application Tracker

JobTrack is a full-stack web application that helps users organize and track their job applications in one place.

Users can register, log in securely, add job applications, update application details, delete records, and monitor their job search progress through a dashboard.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected dashboard
- Add new job applications
- Edit existing applications
- Delete job applications
- Track application status
- Dashboard statistics
- User-specific application records
- Form validation and error handling
- Responsive dashboard for mobile and desktop screens
- MySQL database integration

## Technologies Used

### Frontend

- React.js
- JavaScript
- Vite
- React Router DOM
- CSS

### Backend

- Node.js
- Express.js
- MySQL2
- bcryptjs
- JSON Web Token (jsonwebtoken)
- dotenv
- CORS

### Database

- MySQL 8

## Project Structure

```text
Jobtrack/
│
├── fontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── .env
│   ├── authMiddleware.js
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

Note: The frontend folder in this project is named `fontend`.

## Requirements

Before running the project, install:

- Node.js and npm
- MySQL Server
- Git
- Visual Studio Code (recommended)

## Database Setup

### 1. Create the database

Open MySQL and execute:

```sql
CREATE DATABASE jobtrack_db;

USE jobtrack_db;
```

### 2. Create the users table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Create the applications table

```sql
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    date_applied DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

The `applications` table connects each job application to its user through `user_id`.

## Installation and Setup

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Jobtrack
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### Step 2: Install frontend dependencies

Open a terminal in the project root and execute:

```bash
cd fontend
npm install
```

### Step 3: Install backend dependencies

Open another terminal and execute:

```bash
cd backend
npm install
```

If the backend dependencies are not already listed in `backend/package.json`, install the required packages using:

```bash
npm install express cors mysql2 bcryptjs jsonwebtoken dotenv
```

## Environment Configuration

Create a `.env` file inside the `backend` folder.

Add the following configuration:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=jobtrack_db
JWT_SECRET=YOUR_STRONG_RANDOM_SECRET
```

Replace the example values with your local MySQL credentials and a strong, private JWT secret.

**Important:** The variable names above must match the names used in your `db.js` and `server.js` files. If your current code uses different database environment variable names, keep them consistent.

Never upload your real `.env` file, database password, or JWT secret to GitHub.

## Running the Project

You need two terminals to run the frontend and backend.

### Terminal 1: Start the backend

```bash
cd backend
node server.js
```

The backend should run at:

```text
http://localhost:5000
```

### Terminal 2: Start the frontend

```bash
cd fontend
npm run dev
```

Vite will display the local development URL. Open the URL shown in your terminal, usually:

```text
http://localhost:5173
```

Make sure MySQL is running before starting the backend.

## Application Workflow

1. Open the application in your browser.
2. Create a user account through the registration page.
3. Log in using your registered credentials.
4. Open the protected dashboard.
5. Add a job application by entering the company, position, application date, and status.
6. Edit an application when its details change.
7. Delete applications that you no longer want to track.
8. Monitor application statistics on the dashboard.

## API Endpoints

The backend exposes the following endpoints.

| Method | Endpoint                | Purpose                                        |
| ------ | ----------------------- | ---------------------------------------------- |
| GET    | `/`                     | Check whether the backend is running           |
| GET    | `/api/test`             | Test backend connectivity                      |
| POST   | `/api/register`         | Register a new user                            |
| POST   | `/api/login`            | Authenticate a user                            |
| GET    | `/api/applications`     | Retrieve the authenticated user's applications |
| POST   | `/api/applications`     | Create a job application                       |
| PUT    | `/api/applications/:id` | Update a job application                       |
| DELETE | `/api/applications/:id` | Delete a job application                       |

Application endpoints require a valid JWT access token in the request's Authorization header.

Example:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The backend should verify the token and ensure that users can access only their own application records.

## Security

- Passwords are hashed using bcrypt before being stored.
- JWT tokens are used for authenticated API requests.
- Protected endpoints use authentication middleware.
- Environment variables are used for sensitive configuration.
- User application records are associated with user IDs.
- Database queries should use parameterized statements.

For production use, configure HTTPS, secure token storage, appropriate CORS rules, and proper session expiration and error handling.

## Future Improvements

Possible future enhancements include:

- Job application search and filtering
- Application status update notifications
- Interview scheduling and reminders
- Resume and document uploads
- Advanced analytics and reports
- Production deployment
- Automated testing

## Author

**Sayantan Maity**

B.Tech Computer Science and Engineering — Data Science

## License

This project is available for educational and portfolio purposes. Add a specific open-source license if you intend to distribute it under formal license terms.

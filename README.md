# User Authentication and Management System

This project is a mini web application for user authentication and management system built using Node.js, Express.js, and MongoDB. It provides API endpoints for user registration, login, email verification, profile update, and admin functionalities like admin login, viewing all users, and restricting user access.


## Technical Stack

- **Backend Runtime Environment:** Node.js
- **Web Application Framework:** Express.js
- **Database Management System:** MongoDB

## API Documentation

### User Portal

#### Register User
- Endpoint: `POST /api/user/register`
- Description: Registers a new user.
- Middleware:
  - `userAuthentication_IsNotLoggedIn`: Checks if the user is not already logged in.
- Body Parameters:
  - `name`: Name of the user.
  - `email`: Email address of the user.
  - `phone`: Phone number of the user.
  - `password`: Password for the user account.
  - `verificationType`: Verification method mail (otp pending as of now).
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean and `message` string.

#### Login User
- Endpoint: `POST /api/user/login`
- Description: Logs in an existing user.
- Middleware:
  - `userAuthentication_IsNotLoggedIn`: Checks if the user is not already logged in.
- Body Parameters:
  - `phone`: Phone number of the user.
  - `password`: Password for the user account.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean, `message` string, and `token` string.

#### Verify Email
- Endpoint: `GET /api/user/verify`
- Description: Verifies the user's email.
- Middleware:
  - `userAuthentication_IsNotLoggedIn`: Checks if the user is not already logged in.
- Query Parameters:
  - `token`: Verification token.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean and `message` string.

#### Update User Profile
- Endpoint: `PATCH /api/user/update`
- Description: Updates the user's profile.
- Middleware:
  - `userAuthentication_IsLoggedIn`: Checks if the user is logged in.
- Body Parameters (Optional):
  - `name`: Updated name of the user.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean, `message` string, and `token` string.

### Admin Portal

#### Admin Login
- Endpoint: `POST /api/user/admin/login`
- Description: Logs in as an admin.
- Middleware:
  - `userAuthentication_IsNotLoggedIn`: Checks if the user is not already logged in.
- Body Parameters:
  - `name`: Admin username.
  - `password`: Admin password.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean, `message` string, and `token` string.

#### View All Users
- Endpoint: `GET /api/user/all`
- Description: Retrieves all registered users.
- Middleware:
  - `adminAuthorization`: Authorizes the admin user.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean, `message` string, and `users` array.

#### Restrict Users
- Endpoint: `PATCH /api/user/block`
- Description: Restricts access for specific users.
- Middleware:
  - `adminAuthorization`: Authorizes the admin user.
- Body Parameters:
  - `userId`: ID of the user to be restricted.
- Response:
  - `status`: HTTP status code.
  - `data`: Object with `success` boolean and `message` string.


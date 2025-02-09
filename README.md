# X_API clone from Twitter

## Introduction
The X_API is a backend application built with Node.js to manage Twitter-related functionalities, including posting tweets, retrieving tweet lists, following users, and more.

## Technologies Used
- **Node.js** - JavaScript runtime environment
- **Express.js** - Backend framework
- **MongoDB/MySQL** - Database storage
- **JWT** - User authentication
- **Twitter API** - Integration with Twitter

## Installation
### 1. Clone the repository
```bash
git clone https://github.com/your-username/X_API.git
cd X_API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory and add the following content:
```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
X_API_KEY=your_twitter_api_key
X_API_SECRET=your_twitter_api_secret
```

### 4. Start the server
```bash
npm start
```
The server will run at `http://localhost:5000`

## API Endpoints
### 1. User Registration
**POST /api/user/register**
- **Body:**
  ```json
  {
    "username": "your_username",
    "email": "your_email",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "your_jwt_token"
  }
  ```

### 2. User Login
**POST /api/user/login**
- **Body:**
  ```json
  {
    "email": "your_email",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### 3. Retrieve Tweet List
**GET /api/tweets**
- **Response:**
  ```json
  [
    {
      "id": "tweet_id",
      "content": "Tweet content",
      "author": "username"
    }
  ]
  ```


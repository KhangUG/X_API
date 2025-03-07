# 🐦 Twitter Clone API

## 📌 Mô tả dự án
Twitter Clone API là một hệ thống **backend** được xây dựng bằng **Node.js** và **Express.js**, mô phỏng các tính năng chính của Twitter, bao gồm đăng tweet, thích, bình luận, retweet, theo dõi người dùng, và hệ thống thông báo.

## 🚀 Công nghệ sử dụng
- **Backend**: Node.js (Express.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, OAuth2 (Google, Facebook Login)
- **Cache & Queue**: Redis, RabbitMQ (tùy chọn)
- **Realtime**: WebSocket (Socket.io)
- **Storage**: Cloudinary / AWS S3 (lưu ảnh & video)
- **Deployment**: Docker, Kubernetes, Nginx

## 🔧 Tính năng chính  

### 1️⃣ Authentication & User Management  
- ✅ Đăng ký & Đăng nhập (Email/Password, OAuth2)  
- ✅ Xác thực người dùng bằng JWT  
- ✅ Cập nhật hồ sơ cá nhân (username, avatar, bio)  
- ✅ Theo dõi & bỏ theo dõi người dùng  

### 2️⃣ Tweet & Interaction  
- ✅ Đăng tweet với nội dung, hình ảnh, video  
- ✅ Like & Unlike tweet  
- ✅ Comment & trả lời comment  
- ✅ Retweet & Quote Tweet  
- ✅ Đếm lượt xem tweet  

### 🔗 3️⃣ Feeds & Notifications  
- ✅ Trang chủ (Home Feed): Hiển thị tweet từ người dùng đã follow  
- ✅ Thông báo (Notification): Khi có ai đó like, retweet, comment tweet của bạn  
- ✅ Trending Hashtags: Thống kê các hashtag phổ biến  

### 4️⃣ Realtime & Messaging  
- ✅ Chat trực tiếp giữa các người dùng bằng WebSocket  
- ✅ Thông báo realtime khi có like, comment, hoặc follow  

## 📂 API Endpoints

### **1️⃣ Authentication**
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | Đăng nhập bằng email & password |
| `GET`  | `/auth/me` | Lấy thông tin người dùng hiện tại |

### **2️⃣ Tweet**
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| `POST` | `/tweets` | Tạo một tweet mới |
| `GET`  | `/tweets/:id` | Lấy thông tin chi tiết của một tweet |
| `POST` | `/tweets/:id/like` | Thích hoặc bỏ thích tweet |
| `POST` | `/tweets/:id/retweet` | Retweet tweet |

### **3️⃣ User**
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| `GET`  | `/users/:id` | Lấy thông tin người dùng |
| `POST` | `/users/:id/follow` | Theo dõi hoặc bỏ theo dõi người dùng |
| `GET`  | `/users/:id/tweets` | Lấy danh sách tweet của người dùng |

## 🔧 Hướng dẫn cài đặt
### 1️⃣ Clone repo và cài đặt dependencies
```sh
git clone https://github.com/your-github/twitter-clone-api.git
cd twitter-clone-api
npm install
```
### 2️⃣ Cấu hình môi trường
Tạo file `.env` với các thông tin:
```
MONGO_URI=mongodb://localhost:27017/twitter-clone
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
CLOUDINARY_API_KEY=your_cloudinary_key
```

### 3️⃣ Chạy server
```sh
npm start
```
Server sẽ chạy tại `http://localhost:5000`.

## 🎯 Tóm lại
Twitter Clone API là một dự án hoàn chỉnh giúp bạn thể hiện kỹ năng **backend** của mình.


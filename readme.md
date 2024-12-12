# 📝 Form Builder API  

A powerful and flexible REST API for creating and managing dynamic forms, built with Node.js, Express, and MongoDB. This API supports various question types, image uploads, and response collection.  

## 🚀 Features  

- **Authentication & Authorization**  
  - JWT-based authentication  
  - Secure password hashing  
  - Token refresh mechanism  
  - Role-based access control  

- **Form Management**  
  - Create dynamic forms  
  - Multiple question types:  
    - Text input  
    - Grid questions  
    - Checkbox options  
    - Radio buttons  
    - Image questions  
  - Form preview and publishing  
  - Form expiration settings  
  - Anonymous responses option  

- **File Handling**  
  - Image upload support via ImageKit  
  - Multiple image uploads  
  - Secure file deletion  
  - File size and type validation  

- **Response Collection**  
  - Response validation  
  - Required field checking  
  - Response analytics  
  - Export capabilities  

## 🛠️ Technical Stack  

- **Backend Framework**: Express.js  
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT (JSON Web Tokens)  
- **Image Storage**: ImageKit  
- **File Upload**: Multer  
- **Validation**: Yup  
- **Security**:   
  - bcryptjs for password hashing  
  - CORS enabled  
  - Rate limiting  
  - Input sanitization  

## 📋 Prerequisites  

- Node.js (v14 or higher)  
- MongoDB  
- ImageKit account  
- npm or yarn  

## ⚙️ Environment Variables  

Create a `.env` file in the root directory:  
#Server Configuration
PORT=3000
NODE_ENV=development

#MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

#ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
  

## 🚀 Installation & Setup  

1. **Clone the repository**  

`git clone https://github.com/yourusername/form-builder-api.git`
`cd form-builder-api`
  

2. **Install dependencies**  
`npm install`
  

3. **Set up environment variables**  
`cp .env.example .env`

`Edit .env with your configuration`

4. **Start the server**  

Development
`npm run dev`

Production
`npm start`

  

## 📚 API Documentation  

### Authentication Endpoints  

http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
  

### Form Endpoints  

http
POST /api/forms # Create form
GET /api/forms # Get all forms
GET /api/forms/:id # Get single form
PUT /api/forms/:id # Update form
DELETE /api/forms/:id # Delete form

  

### Response Endpoints  

http
POST /api/forms/:id/responses # Submit response
GET /api/forms/:id/responses # Get form responses


### Upload Endpoints  

http
POST /api/uploads/single # Upload single image
POST /api/uploads/multiple # Upload multiple images
DELETE /api/uploads/:fileId # Delete image
  

## 🔒 Security Features  

- Password hashing using bcrypt  
- JWT-based authentication  
- Request validation and sanitization  
- File upload restrictions  
- CORS configuration  
- Error handling middleware  
- Rate limiting  
- MongoDB injection prevention  

## 📦 Models  

### User Model  
- Email (unique)  
- Password (hashed)  
- Name  
- Created At  

### Form Model  
- Title  
- Description  
- Questions Array  
- Creator Reference  
- Publication Status  
- Anonymous Response Setting  
- Expiration Date  

### Response Model  
- Form Reference  
- Respondent Reference (optional)  
- Answers Array  
- Submission Timestamp  

## 🤝 Contributing  

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## 📄 License  

This project is licensed under the MIT.  

## 👥 Authors  

- Your Name - Initial work - [](https://github.com/TarunSingh611)  

## 🙏 Acknowledgments  

- ImageKit for image hosting  
- MongoDB Atlas for database hosting  
- Express.js community  
- All contributors who helped with the project  

## 📞 Support  

For support, email thakurtarun936@gmail.com or create an issue in the repository.  
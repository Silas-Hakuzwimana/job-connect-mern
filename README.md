# JobConnect - MERN Stack Job Application Portal

## Project Overview

JobConnect is a MERN stack job portal connecting job seekers with employers. It supports three user roles: Admin, Job Seeker, and Company. Employers post job listings which require admin approval before becoming publicly available. Users upload resumes and profile pictures via Cloudinary. The system includes email notifications with Nodemailer and two-factor authentication (2FA) during login. Job seekers can only apply for jobs that match their qualifications, and a qualification flag is shown before applying and saved with the application.

---

## Features

### Job Seeker

- Register/Login with 2FA
- Upload profile picture and resume
- Search and apply for jobs that match qualifications
- View application status and history
- Bookmark jobs
- Receive email notifications on registration, application, and status updates

### Company (Employer)

- Register (default role is jobseeker)
- Admin approval required for company activation
- Post, edit, delete job listings
- Define job requirements
- View applications to posted jobs
- Receive notifications on account/job approvals and new applications

### Admin

- Login to admin panel
- Approve/reject companies and job listings
- Manage users, jobs, and applications
- View dashboard stats
- Send custom email notifications (optional)

---

## System Architecture

- **Frontend:** React.js SPA with React Router, Context API for state, TailwindCSS styling
- **Backend:** Express.js REST API, JWT auth with 2FA, role-based middleware, Nodemailer email notifications, Cloudinary file uploads
- **Database:** MongoDB with Mongoose ODM
- **File Storage:** Cloudinary for profile pictures and resumes
- **Email:** Nodemailer for registration, application, and status emails

---

## Folder Structure

```

backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── server.js
└── .env

frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json

```

---

## Database Schemas (Mongoose)

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'jobseeker', 'company'], default: 'jobseeker' },
  isApproved: Boolean,
  profileImage: String,
  resume: String,
  otp: String,
  otpExpiresAt: Date,
  qualifications: [String]
}
```

### Job

```js
{
  title: String,
  description: String,
  company: ObjectId,
  location: String,
  type: String,
  salaryRange: String,
  requirements: [String],
  isApproved: Boolean,
  createdAt: Date
}
```

### Application

```js
{
  job: ObjectId,
  applicant: ObjectId,
  resumeUrl: String,
  status: { type: String, enum: ['pending', 'reviewed', 'rejected'] },
  appliedAt: Date,
  isQualified: Boolean
}
```

---

## API Endpoints Overview

* `POST /api/auth/register` — Register user
* `POST /api/auth/login` — Login with OTP
* `POST /api/auth/verify-otp` — Verify OTP
* `GET /api/jobs` — List approved jobs
* `POST /api/company/jobs` — Company posts job
* `PUT /api/admin/jobs/:id` — Admin approves/rejects job
* `POST /api/jobs/:id/apply` — Apply for job (checks qualification)
* `GET /api/applications/mine` — Job seeker’s applications
* `PUT /api/applications/:id/status` — Admin/company updates status
* `POST /api/users/upload-profile` — Upload profile picture
* `POST /api/users/upload-resume` — Upload resume
* `PUT /api/users/update-qualifications` — Update qualifications
* `GET /api/admin/users` — Admin user management
* `PUT /api/admin/approve-user/:id` — Admin approve/reject user
* `POST /api/admin/send-email` — Admin sends emails

---

## Deployment

* Frontend: Build with Vite or Create React App, deploy on Vercel/Netlify
* Backend: Deploy on Render/Cyclic
* Database: MongoDB Atlas
* File Storage: Cloudinary
* Email: Nodemailer + SMTP or Gmail

---

## Future Improvements

* Real-time notifications
* Messaging between seekers and employers
* Admin analytics dashboard
* Resume builder tool
* In-app notifications
* AI-driven job matching

---

## License

[MIT](LICENSE) License.

The online pichdeck: 

https://jobconnect-project--ftj5fg6.gamma.site

---

## References

* [React](https://reactjs.org)
* [Express](https://expressjs.com)
* [Mongoose](https://mongoosejs.com)
* [MongoDB](https://www.mongodb.com)
* [Cloudinary](https://cloudinary.com)
* [TailwindCSS](https://tailwindcss.com)
* [Nodemailer](https://nodemailer.com)

---

*Developed by \Silas HAKUZWIMANA*
*Date: \On Friday, July 11th, 2025*

```

```

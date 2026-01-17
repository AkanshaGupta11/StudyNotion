# StudyNotion

StudyNotion is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS.

StudyNotion aims to provide:
* A seamless and interactive learning experience for students, making education more accessible and engaging.
* A platform for instructors to showcase their expertise and connect with learners across the globe.

## Features

* **User Authentication:** StudyNotion provides secure user registration and authentication using JWT (JSON Web Tokens). Users can sign up, log in, and manage their profiles with ease.
* **Courses and Lessons:** Instructors can create and edit courses. Students can enroll in courses, access course materials, and track their progress.
* **Progress Tracking:** StudyNotion allows students to track their progress in enrolled courses. They can view completed lessons, scores on quizzes and assignments, and overall course progress.
* **Payment Integration:** StudyNotion integrates with Razorpay for payment processing. Users can make secure payments for course enrollment and other services using various payment methods supported by Razorpay.
* **Instructor Dashboard:** Instructors have access to a comprehensive dashboard to view information about their courses, students, and income. The dashboard provides charts and visualizations to present data clearly and intuitively. Instructors can monitor the total number of students enrolled in each course, track course performance, and view their income generated from course sales.

## Tech Stack

**Frontend**
* **ReactJS:** A JavaScript library for building dynamic user interfaces.
* **Tailwind CSS:** A utility-first CSS framework used for styling and responsive design.
* **Redux:** A predictable state container for JavaScript apps, used for managing application state.
* **Vite:** A build tool that provides a faster and leaner development experience.

**Backend**
* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express.js:** A web application framework for Node.js used to build the API.
* **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
* **JWT (JSON Web Tokens):** Used for secure user authentication and authorization.
* **Bcrypt:** Used for hashing and salting passwords to ensure security.

**Database**
* **MongoDB:** A NoSQL database used to store course content, user data, and order history.

**Services & Tools**
* **Cloudinary:** A cloud-based service used for storing and managing media assets (images, videos).
* **Razorpay:** A payment gateway integrated for secure payment processing.
* **Git & GitHub:** Used for version control and source code management.
* **Postman:** Used for API testing and documentation.
  
<img width="793" height="255" alt="image" src="https://github.com/user-attachments/assets/4c5e1d18-87f5-4331-8eeb-0e5ca0a3e270" />

## ScreenShots

<img width="1908" height="873" alt="image" src="https://github.com/user-attachments/assets/658eeffc-99ca-4e8c-882e-39d47474c37d" />


<img width="1899" height="861" alt="image" src="https://github.com/user-attachments/assets/fc85ffb1-057c-48ac-8f18-020a81724707" />


## Installation

1.  Clone the repository to your local machine.
    ```bash
    git clone [https://github.com/your-username/StudyNotion.git](https://github.com/your-username/StudyNotion.git)
    ```

2.  Install the required packages.
    ```bash
    cd StudyNotion
    npm install

    cd server
    npm install
    ```

3.  Set up the environment variables:
    Create a `.env` file in the root directory and `/server`. Add the required environment variables, such as database connection details, JWT secret, and any other necessary configurations. Check `.env.example` files for more info.

4.  Start the development server.
    ```bash
    npm run dev
    ```


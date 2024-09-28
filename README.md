# Email Forwarding System

## Overview
The Email Forwarding System is a Node.js application designed to automatically forward emails from one email account to another based on specified criteria. This application helps users efficiently manage their emails by automating the forwarding process, ensuring important messages are not missed.

## Working
1.	Email Retrieval: The application connects to the source email account using the IMAP protocol to check for new unread emails.
2.	Email Forwarding: When an unread email is found, it is forwarded to the designated recipient using the SMTP protocol.
3.	Logging: Each forwarded email’s details (subject, sender, recipient) are logged into an Excel file for record-keeping.
4.	Email Management: The application marks the original email as read after it has been successfully forwarded.

## Features
•	Automatic Email Forwarding: Forwards emails automatically without manual intervention.
•	Excel Logging: Saves information about forwarded emails (sender, subject, recipient) in an Excel file for tracking.
•	User-friendly Interface: Simple web interface to interact with the email forwarding functionality.
•	Real-time Email Processing: Checks for new emails at regular intervals and processes them accordingly.
•	Mark as Read: Automatically marks forwarded emails as read in the source email account.
•	Environment Configuration: Easily configurable email settings through a .env file.

## Technologies Used
•	Node.js: JavaScript runtime used for building the application.
•	Express: Web framework to create the server.
•	Nodemailer: Library used to send emails through SMTP.
•	IMAP-simple: Library for reading emails via the IMAP protocol.
•	ExcelJS: Library for creating and managing Excel files.
•	HTML/CSS/JavaScript: Technologies for the frontend interface.

## Uses
•	Personal Email Management: Automatically forward important emails to another account without manual effort.
•	Business Applications: Forward emails from customer service accounts to team members.
•	Data Logging: Maintain records of important forwarded emails for compliance or monitoring purposes.
•	Email Automation: Reduce the manual workload associated with email forwarding.

## Installation
1.	Clone the Repository:
```
git clone https://github.com/imtushaarr/AutomatedEmailForwardingSystem.git
cd AutomatedEmailForwardingSystem
```

2.	Install Dependencies:
```
npm install
```

3.	Setup Environment Variables:
Create a .env file in the root directory and add the following variables:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FORWARD_TO=recipient-email@gmail.com
```

4.	Start the Application:
```
npm start
```

## Usage
1.	Access the Web Interface:
Open your browser and navigate to http://localhost:3000 to interact with the email forwarding system.
2.	Automatic Forwarding:
The application will regularly check for new unread emails in the source email account. If any are found, they will be forwarded to the specified recipient email address.

## Deployment
This project can be deployed on platforms such as Render, Vercel, or Netlify. Please refer to the specific platform’s documentation for deployment instructions.

## Example Deployment on Render
1.	Create a new web service on the Render dashboard.
2.	Link your GitHub repository.
3.	Set the build command to npm install and the start command to npm start.
4.	Configure any necessary environment variables in the Render settings.

## Contributing
Contributions are welcome! If you have suggestions for improvements or bug fixes, feel free to open an issue or submit a pull request.

##mContact
For inquiries or feedback, please reach out to me at: tusharguptagps@gmail.com.

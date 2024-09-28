require('dotenv').config();
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const xlsx = require('xlsx');  // Import xlsx for Excel export

const config = {
    imap: {
        user: process.env.EMAIL,
        password: process.env.PASSWORD,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false 
        },
        authTimeout: 10000
    }
};

// Define keyword forwarding map
const keywordForwardingMap = {
    'tradestock004@gmail.com': ["fees", "paid", "payment", "invoice", "bill", "billing", "finance", "late fees", "pending", "dues", "scholarship", "receipt", "transaction"], // academic_keywords

    'tradestock005@gmail.com': ["hostel", "accommodation", "dormitory", "residence", "room", "allocate", "allocation", "allote", "warden", "mess", "hostel fees", "lodging", "boarding", "room request", "room change", "hostel admission", "accomodation allotment"], // hostel_keywords

    'tradestock006@gmail.com': ["exam", "examination", "assessment", "test", "results", "grades", "marksheet", "hall ticket", "admit card", "re-evaluation", "evaluation", "answer sheet", "exam schedule", "grade sheet", "re-exam", "supplementary exam"], // examination_keywords

   'tradestock495@gmail.com': ["welfare", "student welfare", "counseling", "scholarship", "financial aid", "extracurricular", "student support", "mentorship", "student activity", "clubs", "societies", "co-curricular activities", "student grievance"] // dsw_keywords
};

const defaultForwardingAddress = process.env.FORWARD_TO || 'tradestock003@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Function to forward email
function forwardEmail(subject, message, to) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: `Fwd: ${subject}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error forwarding email:', error);
        } else {
            console.log('Email forwarded to', to, ':', info.response);
        }
    });
}

// Function to get the forwarding address based on keywords in the email subject or body
function getForwardingAddress(text) {
    for (const [email, keywords] of Object.entries(keywordForwardingMap)) {
        for (const keyword of keywords) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                return email; // Return the email if any keyword matches
            }
        }
    }
    return defaultForwardingAddress; // Return default address if no keyword matches
}

// Function to append email data to an Excel file
function appendToExcel(from, subject, body, forwardingAddress) {
    const filePath = './emailForwardingData.xlsx';

    // Check if the Excel file exists, create one if not
    let workbook;
    try {
        workbook = xlsx.readFile(filePath);
    } catch (error) {
        workbook = xlsx.utils.book_new();
    }

    // Get the worksheet or create one
    let worksheet = workbook.Sheets['Email Data'];
    if (!worksheet) {
        worksheet = xlsx.utils.aoa_to_sheet([['Sender', 'Subject', 'Body', 'Forwarding Address']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Email Data');
    }

    // Append new email data
    const newRow = [from, subject, body, forwardingAddress];
    xlsx.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });

    // Write back to the Excel file
    xlsx.writeFile(workbook, filePath);
    console.log('Email data saved to Excel.');
}

function checkForUnreadEmails() {
    imaps.connect(config).then(connection => {
        return connection.openBox('INBOX').then(() => {
            const searchCriteria = ['UNSEEN'];
            const fetchOptions = { bodies: [''] };

            return connection.search(searchCriteria, fetchOptions).then(messages => {
                if (messages.length === 0) {
                    console.log('No unread messages found.');
                    connection.end();
                    return;
                }

                const uids = [];
                let emailProcessedCount = 0;

                messages.forEach(message => {
                    const all = message.parts.find(part => part.which === '');
                    simpleParser(all.body, (err, parsed) => {
                        if (err) {
                            console.log('Error parsing email:', err);
                            emailProcessedCount++;
                            return;
                        }

                        const from = parsed.from.text;
                        const subject = parsed.subject;
                        const body = parsed.text;

                        const forwardingAddress = getForwardingAddress(subject) || getForwardingAddress(body);
                        console.log(`Forwarding email from ${from} with subject: ${subject} to ${forwardingAddress}`);
                        forwardEmail(subject, body, forwardingAddress);

                        // Save the email data to Excel
                        appendToExcel(from, subject, body, forwardingAddress);

                        uids.push(message.attributes.uid);
                        emailProcessedCount++;

                        // Check if all emails have been processed
                        if (emailProcessedCount === messages.length) {
                            markAsRead(connection, uids);
                        }
                    });
                });

                // If no emails are processed (e.g., all failed to parse), ensure marking as read is attempted
                if (messages.length === 0) {
                    connection.end();
                }
            }).catch(err => {
                console.log('Error searching for messages:', err);
                connection.end(); 
            });
        }).catch(err => {
            console.log('Error opening inbox:', err);
            connection.end(); 
        });
    }).catch(err => {
        console.log('Error connecting to email account:', err);
    });
}

function markAsRead(connection, uids) {
    if (uids.length > 0) {
        connection.addFlags(uids, '\\Seen', err => {
            if (err) {
                console.log('Error marking emails as read:', err);
            } else {
                console.log('Emails marked as read.');
            }
            connection.end(); 
        });
    } else {
        connection.end(); 
    }
}

// Check for unread emails every 2 minutes
setInterval(checkForUnreadEmails, 2 * 60 * 1000);




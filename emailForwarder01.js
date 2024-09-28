/** require('dotenv').config();
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');


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
        authTimeout: 3000
    }
};


// const keywordForwardingMap = {
//     'hostel': 'tusharguptagps@gmail.com',
//     'fees': 'puneet932004@gmail.com',
//     'action required': 'tushargupta3286@gmail.com'
// };

const keywordForwardingMap = {
    'tusharguptagps@gmail.com': ['hostel', 'accommodation', 'room', 'room allocation'],
    'puneet932004@gmail.com': ['fees', 'payment', 'invoice', 'due amount'],
    'tushargupta3286@gmail.com': ['action required', 'urgent', 'immediate attention']
};


const defaultForwardingAddress = process.env.FORWARD_TO || 'agustyacu29@gmail.com';


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


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


// function getForwardingAddress(text) {
//     for (const [keyword, address] of Object.entries(keywordForwardingMap)) {
//         if (text.toLowerCase().includes(keyword.toLowerCase())) {
//             return address;
//         }
//     }
//     return defaultForwardingAddress; 
// }

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
**/
document.getElementById('send-email-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    const toEmail = 'tradestock002@gmail.com'; // The recipient email
    const fromEmail = document.getElementById('fromEmail').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const emailData = {
        toEmail,
        fromEmail,
        subject,
        message
    };

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Failed to send email');
        }
    })
    .then(result => {
        console.log(result);
        alert('Email Forwarding System, developed By Tushar Gupta\nEmail sent successfully!');
        document.getElementById('send-email-form').reset(); // Clear the form
    })
    .catch(error => {
        console.error(error);
        alert('Failed to send email. Please try again.');
    });
});

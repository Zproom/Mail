document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');

  // Send an email when the user submits the email 
  // composition form
  document.querySelector('form').onsubmit = function() {
    send_email();

    // Don't submit the form to another page
    return false;
  }
});

// Added parameters to this function to enable
// pre-filling of the composition form when writing a reply
function compose_email(to = '', subject = '', body = '') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // When the function is called without arguments, 
  // clear out composition fields. Otherwise, accept the
  // provided arguments (i.e. when the user replies to an email)
  document.querySelector('#compose-recipients').value = to;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Display the emails in the mailbox. First, send a GET 
  // request to the mailbox's route
  fetch(`/emails/${mailbox}`)

  // Convert response to JSON data 
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);

    // Create an HTML element and event handler for each email
    emails.forEach(function(email) {
      const element = document.createElement('div');
      element.className = 'email';
      element.innerHTML = `<strong>${email.sender}</strong>`;
      element.innerHTML += `<p id='email-subject'>${email.subject}</p>`;
      element.innerHTML += `<p id='email-timestamp'>${email.timestamp}</p>`;
      element.addEventListener('click', function() {
        console.log('User opened an email!');

        // When a user clicks on an email in a mailbox, 
        // mark the email as read and call the view_email
        // function with the email's ID and mailbox as parameters
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
        .then(() => {
          view_email(email.id, mailbox);
        })

        // Error handling
        .catch(error => {
          console.log('Error:', error);
        });
      });

      // Check if the email has been read. If so, set its 
      // background color to grey (unread emails have a white
      // background)
      if (email.read) {
        element.style.background = 'grey';
      }
      document.querySelector('#emails-view').append(element);
    });
  })

  // Error handling
  .catch(error => {
    console.log('Error:', error);
  });
}

// Function that sends an email when a user submits the 
// email composition form
function send_email() {

  // Send a POST request to the /emails route
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })

  // Convert response to JSON data 
  .then(response => response.json())
  .then(result => {

    // Print result
    console.log(result);

    // Display the user's Sent mailbox
    load_mailbox('sent');
  })

  // Error handling
  .catch(error => {
    console.log('Error:', error);
  });
}

// Function that opens the contents of an email when a user
// clicks on an email in a mailbox
function view_email(emailID, mailbox) {

  // Show the email and hide other views
  document.querySelector('#email-content-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear the HTML in the email content view. Without this 
  // code, all of the previously viewed emails are also displayed
  document.querySelector('#email-content-view').innerHTML = '';

  // Send a GET request to the email ID's route
  fetch(`/emails/${emailID}`)

  // Convert response to JSON data
  .then(response => response.json())
  .then(email => {
    
    // Print email
    console.log(email);

    // Create an HTML element for the email content
    const element = document.createElement('div');
    element.className = 'email-content';
    element.innerHTML = `<p><strong>From:</strong>&nbsp${email.sender}</p>`;
    element.innerHTML += `<p><strong>To:</strong>&nbsp${email.recipients.join(", ")}</p>`;
    element.innerHTML += `<p><strong>Subject:</strong>&nbsp${email.subject}</p>`;
    element.innerHTML += `<p><strong>Timestamp:</strong>&nbsp${email.timestamp}</p>`;
    
    // Create a Reply button
    element.innerHTML +='<button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>';

    // If the email is in the user's inbox (not archived), create a 
    // button that lets the user Archive the email
    if (email.archived === false && mailbox === 'inbox') {
      element.innerHTML +='<button class="btn btn-sm btn-outline-primary" id="archive-email">Archive Email</button>';
    } else if (email.archived === true && mailbox === 'archive') {
      element.innerHTML +='<button class="btn btn-sm btn-outline-primary" id="unarchive-email">Unarchive Email</button>';
    }
    element.innerHTML += '<hr>'

    // Replace Javascript line breaks with HTML line breaks
    // so that the body text displays the same as it does
    // in the composition form  
    element.innerHTML += email.body.replace(/\n/g, '<br>');
    
    // If the user clicks on the "Archive Email" button, 
    // mark the email as archived and load the user's inbox.
    // The if and else if statements are here to prevent Javascript
    // from throwing an error and halting the program. The error occurs
    // because the (un)archive button does not appear in all mailboxes, so
    // there must be a check to see if the button exists
    if (element.querySelector('#archive-email')) {
      element.querySelector('#archive-email').addEventListener('click', function() {
        console.log('User archived an email!');
  
        // Send a PUT request to the email ID's route
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })
        .then(() => {
          load_mailbox('inbox');
        })
  
        // Error handling
        .catch(error => {
          console.log('Error:', error);
        });
      });
    
    // If the user clicks on the "Unarchive Email" button, 
    // mark the email as unarchived and load the user's inbox
    } else if (element.querySelector('#unarchive-email')) {
      element.querySelector('#unarchive-email').addEventListener('click', function() {
        console.log('User unarchived an email!');
  
        // Send a PUT request to the email ID's route
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        })
        .then(() => {
          load_mailbox('inbox');
        })
  
        // Error handling
        .catch(error => {
          console.log('Error:', error);
        });
      });
    }

    // If the user clicks on the "Reply" button, take them to an 
    // email composition form
    element.querySelector('#reply').addEventListener('click', function() {

      // If the subject line of the original email begins
      // with "Re: ", then don't change it. If not, prepend
      // the subject line with "Re: " 
      if (email.subject.includes('Re:')) {
        subject = email.subject;
      } else {
        subject = 'Re: '.concat(email.subject);
      }

      // Pre-fill the body of the reply email 
      body = '\n\n--------------------------------\n'.concat(
        `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`);
      compose_email(email.sender, subject, body);
    });
    document.querySelector('#email-content-view').append(element);
  })

  // Error handling
  .catch(error => {
    console.log('Error:', error);
  });
}

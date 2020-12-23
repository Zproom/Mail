# Mail

## Overview

Mail is a client that enables users to send and receive emails. In addition to sending emails, users can reply to emails and archive emails. The app utilizes Python (Django framework) on the back-end. On the front-end, JavaScript lets users get mail, send mail, and update emails via the app's API. The emails are stored in the app's MySQL database. They are not sent to real email servers. 

This project was originally an assignment for an online class (Web Programming with Python and JavaScript, Harvard Extension School).

## Requirements

- Python 3 (used 3.6.9)
- pip
- Django ([installation guide](https://docs.djangoproject.com/en/3.0/topics/install/)) 

## How to Use

To start using the app, complete the following steps:

1. `cd` into the `Mail` directory.
2. Run `python3 manage.py makemigrations` to make migrations for the project apps.
3. Run `python3 manage.py migrate` to apply migrations to your database.
4. Run `python3 manage.py runserver` to launch the app. You will notice that there are no emails and no other users. Create users by filling out registration forms in the app or...
5. Create one or more superusers who can create, edit, and delete any of the models in Mail by running `python3 manage.py createsuperuser`. To use the admin app, go to the URL "http://127.0.0.1:8000/admin/" and sign in with your superuser's credentials. The admin app offers a quick way to populate Mail with content. You can also create regular users by signing out and clicking the Register link at the top of the page. 

## Models

Mail includes the following models:
- User
- Email

The **User** model stores basic information about each user, such as their registration information (Django encrypts User passwords by default). This model inherits Django's AbstractUser class.

The **Email** model stores information about each email in the app. This includes the email's sender, recipient(s), body, and read/archived status. The Email model is used for both top-level emails and replies. 

## Templates

Mail comprises four HTML files, listed below.
- layout.html (layout inherited by each template)
- login.html (login page)
- register.html (new user registration page) 
- inbox.html

**inbox.html** is the page all where all other user actions are performed. Any time the user clicks a button to compose an email or view a different mailbox, they remain on this page. Rather than taking users to a new route when they click a button, the app uses JavaScript to control the interface. In this way, Mail behaves like a single page application.     
 
## Static Files

The **static** directory contains a JavaScript file and a CSS file.

- inbox.js
- styles.css

**script.js** creates a dynamic user interface for the app. In particular, it lets users compose new emails, reply to emails, and view different mailboxes using the app's API.

**styles.css** styles the app's templates. The app uses Bootstrap for additional styling (e.g. buttons).

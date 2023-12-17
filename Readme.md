# Automatic-Mail-Responder

Hello, Welcome To The Documentation Of My Automatic-Mail-Responder.

## Back-End

- **Language/Runtime Used:** Javascript, NodeJS
- **Hosted On:** Render
- **Packages Used**: googleapis(v129.0.0), nodemailer(v6.9.7)
- **⭐ Try-Yourself**: Send An Email At **s8418g@gmail.com** & Get Automatic Reply
- [Click To Visit Backend Server](https://automatic-mail-responder.onrender.com)

## GMAIL-API-Methods Used:

> **GET:** `users.labels.list` > <BR>
> It Is Used To List All Labels In A User's Mailbox.
> <BR>
> Parameters: `{` <BR>

    userId:'me',

> `}`

<BR>

> **POST:** `users.labels.create` > <BR>
> It Used To Create A New Label.
> <BR>
> Parameters: `{` <BR>

    userId:'me',
    resource: {
        name: 'nameOfLabel',
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        type: 'user',
        color: {
          backgroundColor: '#83334c',
          textColor: '#ffffff',
        }

> `}`

<BR>

> **GET:** `users.messages.list` > <BR>
> It Is Used To List All The Messages In The User's Mailbox.
> <BR>
> Parameters: `{` <BR>

    userId:'me',

> `}`

<BR>

> **GET:** `users.messages.get` > <BR>
> It Is Used To Get A Specific Message From The User's Mailbox.
> <BR>
> Parameters: `{` <BR>

    userId:'me',
    id: '18c79c312283047c'

> `}`

<BR>

> **POST:** `users.messages.modify` > <BR>
> It Is Used To Modify The Labels Of A Specific Message In The User's Mailbox.
> <BR>
> Parameters: `{` <BR>

    userId:'me',
    id: '18c79c312283047c'

> `}`

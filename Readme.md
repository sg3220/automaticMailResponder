# Automatic-Mail-Responder

Hello, Welcome To The Documentation Of My Automatic-Mail-Responder.

## Back-End

- **Language/Runtime Used:** Javascript, NodeJS
- **Hosted On:** Render
- [Click To Visit Backend Server](https://automatic-mail-responder.onrender.com)

## GMAIL-API-Methods Used:

> **POST:** `users.labels.create`
> <BR>
It Used To Create A New Label

<BR>

> Parameters: <BR> >`{` <BR>

    `userId:'me',` <BR>
    `resource: {` <BR>
        `name: 'nameOfLabel',` <BR>
        `labelListVisibility: 'labelShow',` <BR>
        `messageListVisibility: 'show',` <BR>
        `type: 'user',` <BR>
        `color: {` <BR>
          `backgroundColor: '#83334c',` <BR>
          `textColor: '#ffffff',` <BR>
        `},` <BR>

`}` <BR>

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
        } <BR>

}

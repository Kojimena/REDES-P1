# XMPP Chat

## Description

This project, is designed to leverage XMPP protocols for real-time messaging within a React application environment using Nextjs. It facilitates both individual and group messaging functionalities, ensuring robust communication channels. The project utilizes React for the frontend and connects to an XMPP server using the @xmpp/client library.

## Features

- **Register a new account on the server** : This feature allows users to create a new account on the XMPP server. 

- **Log in with an account**: This feature allows users to log in to the XMPP server with their account credentials. 

- **Log out with an account**: This feature allows users to log out of the XMPP server.

- **Delete the account from the server**: This feature allows users to delete their account from the XMPP server.

- **Display all contacts and their status**: This feature allows users to view all their contacts in a list, along with their status and presence message.

- **Add a user to contacts**: This feature allows users to add a new contact to their contact list. Then they can start a conversation with the added contact. 

- **Show user contact details**: This feature allows users to view the details of a contact, such as their presence message and status.

- **1-to-1 communication with any user/contact**: This feature allows users to send and receive messages to/from any contact in their contact list. 

- **Participate in group conversations**: This feature allows users to create a group chat and add contacts to the group. Users can send and receive messages in the group chat. And the moderator can join at any time. 

- **Set presence message**: This feature allows users to set a presence message that will be displayed to their contacts. 

- **Send/receive notifications**: This feature allows users to send/receive notifications when they receive a message from a contact, when a contact changes their status, or when a contact requests to add them to their contact list.

- **Send/receive files**: This feature allows users to send and receive files in a group chat or 1-to-1 chat.

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
    ```
2. **Navigate to the project directory:**
   ```bash
   cd redes-p1
   ```
3. **Install the dependencies:**
   ```bash
    npm install
    ```
4. **Change the server or domain name in xmpp.js file:**
   ```bash
    const client = new Client({
    service: 'ws://localhost:5280/xmpp-websocket',
    domain: 'localhost', 
    });
    ```
5. **Run the project:**
    ```bash
     npm run dev
     ```
6. **Open the browser and navigate to:**
    ```bash
    http://localhost:3000/
    ```

## Usage

1. **Register a new account on the server:**
   - Enter the required details in the registration form.
   - Click on the Register button to create a new account.
![Register](<imagesReadMe/Captura de pantalla 2024-08-20 a las 01.15.40.png>)

2. **Log in with an account:**
   - Enter the username and password of the account.
   - Click on the Login button to log in.
   - if you don't have an account, click on "already have an account" to go to the registration page.
![Login](<imagesReadMe/Captura de pantalla 2024-08-20 a las 01.17.25.png>)

3. **Log out with an account:**
   - Click on the Logout button placed on the top right corner of the screen.
4. **Delete the account from the server:**
    - Click on the Del icon placed on the top right corner of the screen.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 01.18.24.png>)

5. **Display all contacts and their status:**
   - Click on the Contacts tab to view all contacts and their status.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.31.08.png>)

6. **Add a user to contacts:**
   - Click on the Contacts tab.
   - Click on the icon to add a new contact.
   - Enter the username of the contact you want to add.
   - Click on the Add button to add the contact.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.32.10.png>)

7. **Show user contact details:**
   - Click on the Contacts tab.
   - It will display the status and presence message of the contact.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.31.08.png>)

8. **1-to-1 communication with any user/contact:**
   - Click on the contact you want to chat with.
   - Enter the message in the input field.
   - Click on the Send button to send the message.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.34.21.png>)

9. **Participate in group conversations:**
   - Click on the + icon to:
       - Create a new group.
       - Add contacts to the group.
       - Join the group.
       - Start a conversation in the group.
       (To start a conversation in the group, it is necessary to join the group first.)
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.37.40.png>)

10. **Set presence message:**
    - Click on the Profile tab.
    - Select the status from the dropdown.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.40.03.png>)

11. **Send/receive notifications:**
    - Notifications will be displayed when:
        - A contact sends a message.
        - A contact changes their status.
        - A contact requests to add you to their contact list.
        - A contact accepts your request to add them to your contact list.
   You can see the notifications in icon bell.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.41.43.png>)

12. **Send/receive files:**
   - Click on the contact or group chat.
   - Click on the file input field to select the file.
   - Click on the Send button to send the file.
   Files can be sent in 1-to-1 chat or group chat.
   Files are displayed in the chat window.
   ![alt text](<imagesReadMe/Captura de pantalla 2024-08-20 a las 20.44.13.png>)

## Technologies
- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for building server-side rendered applications.
- **@xmpp/client**: A library for connecting to an XMPP server.
- **@react-icons/all-files**: A library for using icons in React applications.

## Challenges Encountered and Lessons Learned

### Challenges
- **Connection with server:** Initially, connecting to the XMPP server using the XMPP client library was challenging, it took me about 3 days to understand how to connect to the server and send and receive stanzas. 
- **Integrating XMPP with React:** Initially, connecting the XMPP client with React presented challenges, particularly in state management and real-time user interface updates. 
- **Creating a Group Chat:** Implementing the creation of group chats and adding contacts to the group was challenging due to the lack of clear documentation and examples for group chat functionalities.
- **File Transfer:** At the beginning, implementing file transfer in group chats and 1-to-1 chats was challenging due to the complexity of handling file uploads and downloads. It required additional research and with a group of friends we decided to use AWS S3 to store the files, and then send the link to the file in the chat. For this implementation, and API was created to handle the file upload and download.

### Lessons Learned
- **Understanding XMPP Protocols:** Through this project, i learned about the XMPP protocols and how they can be used to create real-time messaging applications. I learned about the different XMPP features and how they can be implemented in a React application.
- **Stanza Handling:** I learned how to handle different types of stanzas, such as messages, presence, and IQ stanzas, and how to send and receive stanzas using the XMPP client library.
- **Real-time Communication:** I learned how to create real-time communication channels using XMPP and how to update the user interface in real-time when new messages are received or when a contact changes their status.


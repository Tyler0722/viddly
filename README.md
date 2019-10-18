# Viddly 🎥

Open Source video chat application for having fun and making friends with 
people. Built using WebRTC, React, Node, and PostgreSQL.

## Features

- **Manner Score**  
  Our goal is to make a respectful community. Users will be given the option to rate the Viddly user at the end of each call to help contribute in making a community that respects each other.

- **Video Calling**  
  Request a call to the person you want to have a conversation with and get to know them in 3 minutes and add more time to keep the it going.

- **Friend System**  
  Add whoever you're in a call with and message them anytime you just want to say hello.

- **Link Social Media Accounts**  
  After you make a new friend, check out their profile and stay connected with them on multiple platforms.

## API endpoints

- ### Users

  ### Get Authenticated User

  Returns JSON containing data of authenticated user

  - **URL**

    /api/users/me

  - **Method**

    GET

  - **Response**
    ```json
    {
      "user": {
        "id": "000000000000",
        "gender": "male",
        "profile_pic": "https://example.com/0000...",
        "first_name": "John",
        "last_name": "Dole",
        "username": "john@example.com"
      }
    }
    ```

## Installation

WIP (Work In Progress)

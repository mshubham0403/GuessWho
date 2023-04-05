# GuessWho

GuessWho is a real-time chat application that allows users to connect and communicate with each other through web sockets. It uses the Express framework, Mongoose, Socket.IO, and other libraries to set up a server that handles incoming connections and stores user and chat room information in a MongoDB database.

## Installation

To install and run GuessWho on your local machine, follow these steps:

1. Clone this repository to your local machine using :octocat: `git clone https://github.com/mshubham0403/GuessWho.git`.
2. Navigate to the root directory of the project using :file_folder: `cd GuessWho`.
3. Install the project dependencies using :hammer_and_wrench: `npm install`.
4. Start the server using :rocket: `npm start`.

Note: You will need to have Node.js and npm installed on your machine in order to run this project.

## Usage

Once you have installed and started GuessWho, you can access it by navigating to :globe_with_meridians: `http://localhost:7000` in your web browser. From there, you can create an account or log in if you already have one.

### Sign Up

To create a new account on GuessWho:

1. Click the :bust_in_silhouette: "Sign Up" button on the home page.
2. Enter your desired username and password.
3. Click "Create Account".

### Sign In

To sign in to an existing account on GuessWho:

1. Click the :key: "Sign In" button on the home page.
2. Enter your username and password.
3. Click "Sign In".

### Chat Rooms

Once you are logged in, you can join or create chat rooms by clicking on the :speech_balloon: "Chat Rooms" tab at the top of the page.

### Joining a Room

To join an existing chat room:

1. Choose to be a guesser on choice page.
2. Click on the name of the room you want to join.
3. you ill be dorected to a room ith puzzler present.
4. ait for the riddler to pose the question and try to guess the ansWer.

### Creating a Room

To create a new chat room:

1. Confirm that your role is set to "Riddler" by choosing "Be a puzzler" on choice page.
2. Click on "Create Room".
3. A room Will be created With you username as its name Wait for a guesser to join the room. 
4. Pose the question and give hints using send image file option.


### Deleting a Room

To delete a chat room:

1. Click on the "Delete Room" button on the room list page.
2. If you are the creater of that room ,the room is deleted.
3. Room list is updated.

### Sending Image Files as Hints

As a Riddler, you can send image files as hints to help the Guessers solve the puzzle. To send an image file:

1. Click on the "Upload Image" button in the chat window.
2. Select the image file you want to upload.
3. The image will be sent to the server and displayed in the chat window for all users to see.



## Contributing

If you would like to contribute to GuessWho, please follow these guidelines:

1. Fork this repository.
2. Create a new branch for your changes using :seedling: `git checkout -b [branch-name]`.
3. Make your changes and commit them using :pencil2: `git commit -m "[commit-message]"`.
4. Push your changes to your forked repository using :arrow_up: `git push origin [branch-name]`.
5. Submit a pull request from your forked repository to this repository.



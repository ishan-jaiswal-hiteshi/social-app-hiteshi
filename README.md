# Socialize@Hiteshi

Socialize@Hiteshi is a social media platform exclusively designed for employees of Hiteshi Infotech. It provides an engaging and interactive environment where users can share posts, create events, connect with colleagues, and stay updated on company happenings.

## Features

### Home Page

- Displays the latest **5 posts** (with infinite schrolling) and **Latest 5 events**.
- Provides option to Create, like, comment and update posts.

### Events Page

- Displays all events with detailed information about each event.
- Provides option to create event with name, date, location and image.

### Search

- **User Search**: Find users by their full name or username.
- **Post Search**: Search for posts using keywords or hashtags.

### Users Section

- Lists all registered users of the application.

### Profile Section

- Users can:
  - View anyone's profile.
  - Edit his profile details (e.g., profile photo, cover photo, professional details).

### Messaging

- Users can send messages to each other if they follow each other.
- Real-time messaging powered by **Socket.IO**.

### Notifications

- **Event Notifications**: A notification dot appears on the Events icon when a new event is created.
- **Post Notifications**: A notification dot is shown on the Home icon when a new post is available.
- **Message Notifications**: Real-time message alerts along with message counts on spesific user.

## Tech Stack

### Frontend

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend

- **Framework**: Node.js with Express
- **Language**: TypeScript
- **WebSocket**: Socket.IO for real-time communication

### Database

- **PostgreSQL**: Used for storing application data.

## Installation and Setup

1. **Clone the Repository:**

   ```bash
   frontend - https://github.com/ishan-jaiswal-hiteshi/social-app-hiteshi
   backend - https://github.com/ankita-arya11/Social_media_backend
   git clone frontend || backend
   cd socialize-hiteshi
   ```

2. **Install Dependencies:**

   - Install frontend dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Install backend dependencies:
     ```bash
     cd backend
     npm install
     ```

3. **Environment Variables:**

   - Create `.env` files in both `backend` directory.
   - Define required environment variables:

     - **Backend:**
       ```env
       DATABASE_URL=<PostgreSQL connection string>
       ```

4. **Run the Application:**

   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend server:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

For questions or feedback, please contact the development team.

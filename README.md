                  *FullCalendar Project*

This project is a calendar application built using React and FullCalendar. It allows users to view, add, edit, delete, and filter events. The application also includes an option to fetch global events (such as holidays) from an external API.

Table of Contents
Features
Getting Started
Prerequisites
Installation
Running the App
Usage
Adding an Event
Editing or Deleting an Event
Filtering Events
Customization
Fetching Global Events
Contributing
License
Features
View events in month, week, or day format.
Add new events by selecting a date or using the "Add Event" button.
Edit or delete existing events.
Filter events by title.
Persist user-created events using local storage.
Fetch and display global events from an external API (e.g., holidays).
Getting Started
Prerequisites
Make sure you have the following installed on your system:

Node.js (version 14 or higher)
npm (version 6 or higher)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/fullcalendar-project.git
cd fullcalendar-project
Install dependencies:

bash
Copy code
npm install
Running the App
Start the development server:

bash
Copy code
npm run dev
This will start the app on http://localhost:3000. You can open this link in your browser to view the application.

Build the app for production:

bash
Copy code
npm run build
This will generate the production-ready files in the out directory.

Usage
Adding an Event
Click the "Add Event" button.
Fill in the event details, including the title, start date, and end date.
Click "Add Event" to save the event.
Editing or Deleting an Event
Click on an existing event on the calendar.
In the modal that appears, edit the event details or click "Delete Event" to remove it.
Click "Save Changes" to apply the edits.
Filtering Events
Use the filter input at the top of the calendar to search for events by title.
The calendar will dynamically update to show only the events that match the filter.
Customization
Fetching Global Events
To enable fetching global events, such as holidays, follow these steps:

Get an API Key: Sign up for an API key from Calendarific or any other holiday API provider.

Update the API URL: Replace the placeholder URL in the fetchGlobalEvents function with your API key and desired parameters (e.g., country, year).

Uncomment the API Call: In the fetchGlobalEvents function, uncomment the fetch line to enable the API call.

javascript
Copy code
const response = await fetch(
  "https://calendarific.com/api/v2/holidays?&api_key=YOUR_API_KEY&country=IN&year=2024"
);
Reload the App: Restart the app to see the global events displayed on the calendar.

Contributing
If you'd like to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.

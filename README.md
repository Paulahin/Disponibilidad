# Backend Documentation for Disponibilidad App

## Overview
The Disponibilidad App is a web application designed to manage contact information based on different areas and sites. This backend component is built using Node.js and Express, and it connects to a MySQL database to store and retrieve contact details.

## Project Structure
```
disponibilidad-app
├── backend
│   ├── db
│   │   └── schema.sql         # SQL schema for the MySQL database
│   ├── src
│   │   ├── server.js          # Entry point for the backend application
│   │   └── controllers
│   │       └── contactsController.js # Handles contact-related requests
│   ├── package.json           # npm configuration file
│   └── README.md              # This file
├── frontend
│   ├── Dispo.html             # Main HTML file for the frontend
│   ├── styles
│   │   └── main.css           # CSS styles for the frontend
│   └── scripts
│       └── main.js            # JavaScript code for the frontend
└── README.md                  # Root README file
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd disponibilidad-app/backend
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Set Up the Database**
   - Create a MySQL database.
   - Run the SQL schema located in `db/schema.sql` to set up the necessary tables.

4. **Run the Server**
   Start the backend server with:
   ```bash
   node src/server.js
   ```

## API Usage

### Endpoints

- **GET /contacts**
  - Retrieve a list of contacts based on area and site.

- **POST /contacts**
  - Create a new contact.
  - Requires JSON body with `area`, `site`, and contact details.

- **PUT /contacts/:id**
  - Update an existing contact by ID.
  - Requires JSON body with updated contact details.

- **DELETE /contacts/:id**
  - Delete a contact by ID.

## Notes
- Ensure that the MySQL server is running and accessible.
- Modify the database connection settings in `src/server.js` as needed.

For further details, refer to the individual files and their comments.
# Race Time - by up2203511

## Key features
Race Time is a web application designed for timing and recording race events, supporting both offline local storage and online database integration. It allows users to track multiple participants, edit names, and store race results locally or in an SQLite database. Results can be viewed interactively through the interface.

### Key Feature Timer Control
Find and use this by clicking the "Start", "Stop", "Reset Timer", and "Record Time" buttons.

## Key Feature Participant Recording
You can record multiple participant finish times with customisable names. 
In the event that multiple runners are finishing all at the same time, you can press the "Record Time" button multiple times, this will save the runners as 'Participant 1', 'Participant 2' etc.

### Inline Participant Editing
Click the "Edit" button next to a participant’s name to change it.

The editable name feature lets admins correct or personalise participant names after recording. It replaces the participant label with an input field, allowing real-time editing without refreshing or re-entering data. This improves usability and data accuracy.

### Key Feature Dual Save System Offline
After the race is finished, the admin can click "Save Race".
The application detects whether the user is online. If not, results are saved into local storage through `results`.
Results are uploaded as a batch upload after the race is finished.

### Key Feature Dual Save System Online
After the race is finished, the admin can click "Save Race".
The application detects whether the user is online. If the user is online, results are stores in a persistent SQLite database through `/results/db`.
Results are uploaded as a batch upload after the race is finished.

### Key Feature Admin Viewing Race Results
Uses `/allresults` route to fetch stored race data.
The admin has the ability to view all the race results via the click of a single button. The "Load All Races" button.
The admin can see the race name next to each of the races.
The admin would then tell all the runners the race name either before or after the race, so that the runners can then access the race from their page.

Data is stored in an SQLite database with two tables: `races` and `results`. The server can reconstruct full race histories from the database, making this system suitable for record-keeping beyond a single session.

### Key Feature Runners Viewing Race Results
Runners have their own dedicated page where they can view race results.
The runners can only view the results after the race has finished.
They enter the race name into a text box and press the "Fetch Result" button.
If the admin was online at the time of saving the race it would have been saved to the databse, and so the runners must also be online when fetching the results.

### Key Feature Dynamic Results Display
Click "Load Races" to display results either from local memory or the database.

The results panel dynamically renders stored race data using DOM manipulation. It handles cases where no participants are present and separates races with unique IDs. This makes the interface readable and structured for users reviewing historical races.

### Key Feature Data Cleanup and Reset
Click "Clear Race" to reset timers and clear participants, or "Clear Screen" to clean the results list.

These buttons allow users to reset the session without reloading the page. This makes it quick to begin a new race and tidy up visual clutter between events.

## AI
AI tools (ChatGPT) were used to assist with developing some logic, particularly around SQLite integration and DOM manipulation for editing UI elements.

### Prompts to develop Express & SQLite integration
A sequence of prompts helped me set up the backend:

> How do I post multiple entries to an SQLite database using Express?

ChatGPT responded with :
"Receive an array of entries from the client (via POST).
Loop through each entry and insert it into the database."

> How do i check if something already exists in a database?

The response suggested that in the route I make two queries, one for checking if an entry in the database exists, followed by the query I wanted to run.

### Prompts to develop inline editing
To create the inline participant name editor:

> How to pass arguments to a function inside an event listener

The response allowed the "editParticipantName" function to run only when the edit button had been clicked


### What went well / what went wrong
- **Went well**: The SQLite and Express setup went very smoothly with ChatGPT's help. I was able to understand how to write parameterized queries and avoid SQL injection issues.
- **Went wrong**: Early prompts lacked enough detail, especially regarding DOM state management. Initially, ChatGPT's examples didn't track participant IDs, leading to issues overwriting data.
- **What I learned**: Prompt specificity is key. Naming what I wanted to do (e.g., “update participant name in both DOM and data array”) led to clearer suggestions. I also learned a lot about async database handling and dynamic front-end updates.


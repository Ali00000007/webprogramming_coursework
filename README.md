# Race Time - by up2203511

## Key features
Race Time is a web application designed for timing and recording race events, supporting both offline local storage and online database integration. It allows users to track multiple participants, edit names, and store race results locally or in an SQLite database. Results can be viewed interactively through the interface.

### Key Feature: Timer Control
Find and use this by clicking the *"Start"*, *"Stop"*, *"Reset Timer"*, and *"Record Time"* buttons.
I decided to include the reset function in the case that the admin accidentally presses start race, so instead of having to save an unfinished race, they can just restart it.

### Key Feature: Participant Recording
You press the *'Record Time'* button to record the time of a participant.
You can also enter the name of the participant before recording their time next to the text box that says 'Participant Name'.
In the event that multiple runners are finishing all at the same time, you can press the *"Record Time"* button multiple times. This will save the runners as *'Participant 1'*, *'Participant 2'* etc.
Initially I set up the front end such that the admin would select a runner from a drop down box, however this was deemed ineffective when there would be multiple participants finishing in close proximity to each other.

### Inline Participant Editing
Click the *"Edit"* button next to a participant’s name to change it.

The editable name feature lets admins correct or personalise participant names after recording. It replaces the participant label with an input field, allowing real-time editing without refreshing or re-entering data. This improves usability and data accuracy.
The editing feature was designed because of how participant times are recorded. If there are multiple participants finishing in close proximity to each other and you press record time for all of them, you can then go back and add their names after the race is finished so that the participants knwo who they are.

### Key Feature: Dual Save System (Offline)
After the race is finished, the admin can click *"Save Race"*.

- The application detects whether the user is offline/online.
- If offline, results are saved into local storage through the `results` route.
- Results are uploaded as a batch upload after the race is finished.

### Key Feature: Dual Save System (Online)
After the race is finished, the admin can click *"Save Race"*.

- The application detects whether the user is offline/online.
- If online, results are stored in a persistent SQLite database via the `/results/db` route.
- Results are uploaded as a batch upload after the race is finished.

### Key Feature: Admin Viewing Race Results
Uses the `/allresults` route to fetch stored race data.

- The admin has the ability to view all the race results via a single click on the *"Load All Races"* button.
- Each race displays its name, which the admin can share with runners before (if they agree onm a race name before the event) or after the event.
- Data is stored in an SQLite database with two tables: `races` and `results`.

This system supports viewing full race histories beyond a single session.

### Key Feature: Runners Viewing Race Results
Runners have their own dedicated page where they can view race results.

- Runners can only view results after the race has finished.
- They enter the race name into a text box and press the *"Fetch Result"* button.
- If the race was saved online, runners must also be online to fetch the results.

### Key Feature: Data Cleanup and Reset
Click *"Clear Race"* to reset timers and clear participants, or *"Clear Screen"* to clean the results list.

These buttons allow users to reset the session without reloading the page. This makes it quick to begin a new race and tidy up visual clutter between events.

### Key Feature: Exporting Results to CSV
This feature allows race administrators or users to download race results as a CSV file.

- When viewing a saved race's results, a user can click the *"Export"* button.
- This automatically:
  - Formats the participant data (`name` and `time`) into rows.
  - Generates a downloadable `.csv` file named after the race (e.g., `Spring5K.csv`).
  - Triggers a file download in the browser.

---

## Design Decisions

### Splitting Runners and Admin into Seperate Pages
The decision to split runners and admins into separate pages was made to clearly define and separate the roles and functionalities available to each type of user. This design ensures:
- **Role clarity**: Admins can manage race data (start/stop timers, save results, view all races), while runners have a limited set of interactions (view results).
- **Security**: Sensitive functions, such as modifying race results and accessing all race data, are restricted to admins.
- **User experience**: By giving each group a tailored interface, we reduce unnecessary complexity for runners while providing admins with the necessary controls and insights.

---

## AI
AI tools (ChatGPT) were used to assist with developing some logic, particularly around SQLite integration and DOM manipulation.

### Prompts to develop Express & SQLite integration
A sequence of prompts helped me set up the backend:

> How do I post multiple entries to an SQLite database using Express?

ChatGPT responded with:
"Receive an array of entries from the client (via POST).  
Loop through each entry and insert it into the database."

> How do I check if something already exists in a database?

The response suggested that in the route I make two queries — one for checking if an entry in the database exists, followed by the query I wanted to run.

### Prompts to develop feature to export data as a csv file

> How does exporting data to a csv fropm javascript work?

The response talked about making a blob, and then generating a link for it.
This response did not help at all because I had no idea what a blob was or how to generate a link for it.
Therefore I just went on youtube looked up a tutorial and implemented the knowledge I learnt from the tutorial to fit the needs of this project.

### Prompts to develop inline editing
To create the inline participant name editor:

> How to pass arguments to a function inside an event listener

The response allowed the `"editParticipantName"` function to run only when the *"Edit"* button had been clicked.

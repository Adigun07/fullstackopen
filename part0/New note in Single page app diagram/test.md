    	    sequenceDiagram
    participant browser
    participant server

    	Note over browser: User types the new note into the form and submits
    	Note over browser: The browser starts executing the JavaScript code that makes a post request to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: HTTP response with Status Code of 201 (created)
    deactivate server


    Note right of browser: The browser starts executing the JavaScript code that runs the redrawNotes function that creates a new ul an li elements with the notes as the text
    Note right of browser: The redrawNotes function also removes the previous ul and appends the new ul to the notesElement

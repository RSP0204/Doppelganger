 Do I have to keep the backend server      │
│    running for the processing of the         │
│    documents, and if yes, then what are the  │
│    commands to keep the backend server       │
│    running?                                  │
╰───────────────────────────────────────────────╯

✦ Yes, the backend server needs to be running
  for document processing, as it handles the
  chunking and interaction with the Gemini API.

  To keep the backend server running, navigate
  to the backend directory in your terminal and
   run the following command:
   
uvicorn backend.app:app --reload
  


  This command starts the FastAPI application     
   using Uvicorn, and the --reload flag
  ensures that the server automatically
  reloads if you make any changes to the
  backend code.

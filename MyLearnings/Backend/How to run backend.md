
The command to run the backend server is
  uvicorn backend.app:app --reload
  To be executed from Root folder
  
  uvicorn backend.app:app --reload > backend_output.log 2>&1 &


  To start the backend server on port 8001, run
  the following command in your terminal from
  the project's root directory:



   1 .venv\Scripts\activate && uvicorn backend.app:app --port 8001



  This command first activates the Python
  virtual environment and then starts the
  Uvicorn server, telling it to run the
  application on port 8001.

  It looks like you're running the command in a
  bash shell (MINGW64), which uses a different
  syntax for activating virtual environments.
  The command I provided was for the Windows
  Command Prompt.

  Please use the following command instead,
  which is the correct syntax for your shell:



   1 source .venv/Scripts/activate && uvicorn backend.app:app --port 8001
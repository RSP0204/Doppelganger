
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

   The original error was most likely caused by running the command from your
  system's global Python installation, which doesn't have the necessary packages
  installed, instead of the project's isolated virtual environment.


  To fix this, you should run uvicorn as a module through the virtual
  environment's Python interpreter. This ensures the correct packages are used.
  Here is the command you should use to start the server:


  .venv/Scripts/python.exe -m uvicorn backend.app:app --port 8001


  This command should now correctly start your FastAPI application.
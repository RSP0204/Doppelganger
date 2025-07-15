To run the FastAPI backend with a larger request body size limit, use the following command:

```
uvicorn backend.app:app --reload --limit-max-request-size 10485760
```

This sets the maximum request size to 10MB.
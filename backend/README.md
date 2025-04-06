# Vibe Agent Backend

This is the backend API for the Vibe Agent Chrome Extension.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application
│   ├── routers/         # API routes
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic models
│   └── utils/           # Utility functions
└── requirements.txt     # Python dependencies
```

## Adding New Endpoints

New endpoints will be added based on specific requirements. The structure is ready to be extended with new functionality. 
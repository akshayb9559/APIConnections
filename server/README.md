# API-Connections

A RESTful API service for managing data in MySQL database using FastAPI.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Create a MySQL database and update the database configuration in `database.py`

3. Run the application:
```bash
uvicorn main:app --reload
```

## API Endpoints

- `POST /items/` - Create a new item
- `GET /items/` - Get all items
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

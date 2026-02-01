# Speasy ChatKit Server

Python-based ChatKit server for the Speasy AI Assistant.

## Setup

### 1. Create virtual environment

```bash
cd chatkit-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for bypassing RLS)
- `OPENAI_API_KEY` - OpenAI API key for GPT-4o

### 4. Run locally

```bash
uvicorn server:app --reload --port 8000
```

The server will be available at `http://localhost:8000`.

## API Endpoints

### POST /chatkit
Main ChatKit endpoint. Handles:
- `type: "create_thread"` - Create a new conversation thread
- `type: "message"` - Send a user message
- `type: "action"` - Handle widget actions

### GET /health
Health check endpoint.

## Deployment

### Railway

1. Connect your GitHub repo to Railway
2. Set the root directory to `chatkit-server`
3. Add environment variables in Railway dashboard
4. Deploy

### Docker

```bash
docker build -t speasy-chatkit .
docker run -p 8000:8000 --env-file .env speasy-chatkit
```

## Architecture

```
chatkit-server/
├── server.py         # Main FastAPI application
├── store.py          # SQLite-based thread/message storage
├── widgets/          # Widget builder functions
│   ├── __init__.py
│   ├── content_list.py
│   ├── content_detail.py
│   └── categories.py
├── requirements.txt
├── Dockerfile
└── railway.toml
```

## Widget Types

The server returns ChatKit widgets for different content types:

- **Content List** - Grid of audio content with thumbnails, badges, durations
- **Content Detail** - Full details for a single content item
- **Categories** - List of available categories with recent counts
- **Search Results** - Filtered content based on search query

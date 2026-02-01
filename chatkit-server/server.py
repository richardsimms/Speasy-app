"""Speasy ChatKit Server - Main FastAPI application."""

import json
import os
import re
from datetime import datetime, timedelta
from typing import Any, AsyncIterator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from openai import OpenAI
from supabase import create_client, Client

from store import SQLiteStore
from widgets import (
    build_content_list_widget,
    build_content_detail_widget,
    build_categories_widget,
)
from widgets.categories import build_search_results_widget

# Load environment variables
load_dotenv()

# Initialize clients
supabase: Client = create_client(
    os.environ.get("NEXT_PUBLIC_SUPABASE_URL", ""),
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY", ""),
)

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_KEY", ""))

# Initialize store
store = SQLiteStore()

# Initialize FastAPI app
app = FastAPI(title="Speasy ChatKit Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# System prompt for the assistant
SYSTEM_PROMPT = """You are Speasy, an AI assistant for an audio newsletter platform that converts curated articles into podcast-style audio content.

## Your Role

Help users discover and listen to audio content across five categories:
- **AI** - Artificial Intelligence, Machine Learning, and LLMs
- **Business** - Startups, Strategy, and Market Trends
- **Design** - UI/UX, Product Design, and Creative Tools
- **Technology** - Software, Hardware, and Developer News
- **Productivity** - Workflows, Automation, and Tools

## How to Respond

When you call tools, a rich visual widget will be displayed to the user automatically. Your text response should:
1. Be brief and conversational - the widget shows the details
2. Highlight what's interesting or relevant to their query
3. Offer next steps or suggestions
4. Be enthusiastic about the content

## Tool Usage

- "What's new?" or "Play me something" → call list_content with limit 5
- "Show me AI news" → call list_content with category_slug "ai"
- "Find articles about Tesla" → call search_content with query "Tesla"
- "What categories are available?" → call list_categories

## Response Style

**Do:**
- Lead with content, not meta-talk
- Keep text brief since widgets show the details
- Use natural, conversational tone
- Be enthusiastic about interesting stories

**Don't:**
- Apologize for not playing audio directly
- Write long explanations of what you found
- Ask too many clarifying questions
- Mention tools, widgets, or technical details

## Important Notes

- All Speasy content has audio - items without audio aren't shown
- Duration may be unknown for some items - that's okay
- Categories in URLs are lowercase: ai, business, design, technology, productivity
"""


# Tool definitions for OpenAI function calling
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "list_content",
            "description": "List content items, optionally filtered by category",
            "parameters": {
                "type": "object",
                "properties": {
                    "category_slug": {
                        "type": "string",
                        "enum": ["ai", "business", "design", "technology", "productivity"],
                        "description": "Filter to a specific category",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of items to return (default 10, max 50)",
                        "default": 10,
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_categories",
            "description": "Get all available content categories with recent item counts",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_content",
            "description": "Search content by keywords",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search keywords",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum results (default 10)",
                        "default": 10,
                    },
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_content_detail",
            "description": "Get full details for a specific content item",
            "parameters": {
                "type": "object",
                "properties": {
                    "content_id": {
                        "type": "string",
                        "description": "Content item UUID",
                    },
                },
                "required": ["content_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_playlist_url",
            "description": "Get a playlist URL for continuous listening",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["latest", "category"],
                        "description": "Type of playlist",
                    },
                    "category_slug": {
                        "type": "string",
                        "enum": ["ai", "business", "design", "technology", "productivity"],
                        "description": "Category slug (required if type is 'category')",
                    },
                },
                "required": ["type"],
            },
        },
    },
]


async def list_content(category_slug: str | None = None, limit: int = 10) -> dict[str, Any]:
    """Fetch content items from Supabase."""
    query = supabase.table("content_items").select(
        """
        id,
        title,
        summary,
        published_at,
        source_name,
        image_url,
        author,
        key_insights,
        category:categories!category_id(id, name, slug),
        audio_files!inner(file_url, duration, format)
        """
    ).eq("status", "done")

    if category_slug:
        # Get category ID first
        cat_result = supabase.table("categories").select("id").eq("slug", category_slug).single().execute()
        if cat_result.data:
            query = query.eq("category_id", cat_result.data["id"])

    result = query.order("published_at", desc=True).limit(min(limit, 50)).execute()
    items = result.data or []

    # Calculate metadata - handle None duration values
    def get_duration(item: dict) -> int:
        audio_files = item.get("audio_files", [])
        if audio_files and len(audio_files) > 0:
            duration = audio_files[0].get("duration")
            return duration if duration is not None else 0
        return 0

    total_duration = sum(get_duration(item) for item in items)
    category_name = category_slug.title() if category_slug else "Latest"
    playlist_url = (
        f"https://www.speasy.app/category/{category_slug}?autoplay=true"
        if category_slug
        else "https://www.speasy.app/latest?autoplay=true"
    )

    return {
        "items": items,
        "metadata": {
            "category_name": category_name,
            "count": len(items),
            "duration_min": round(total_duration / 60),
            "playlist_url": playlist_url,
        },
    }


async def list_categories() -> list[dict[str, Any]]:
    """Fetch all categories with recent content counts."""
    result = supabase.table("categories").select("id, name, slug, description, image_url").order("name").execute()
    categories = result.data or []

    # Get recent counts for each category
    week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    for cat in categories:
        count_result = (
            supabase.table("content_items")
            .select("id", count="exact")
            .eq("status", "done")
            .eq("category_id", cat["id"])
            .gte("published_at", week_ago)
            .execute()
        )
        cat["recent_count"] = count_result.count or 0

    return categories


async def search_content(query: str, limit: int = 10) -> dict[str, Any]:
    """Search content by keywords."""
    # Use ilike for simple text search
    result = (
        supabase.table("content_items")
        .select(
            """
            id,
            title,
            summary,
            published_at,
            source_name,
            image_url,
            author,
            key_insights,
            category:categories!category_id(id, name, slug),
            audio_files!inner(file_url, duration, format)
            """
        )
        .eq("status", "done")
        .or_(f"title.ilike.%{query}%,summary.ilike.%{query}%")
        .order("published_at", desc=True)
        .limit(min(limit, 50))
        .execute()
    )

    return {
        "query": query,
        "results": result.data or [],
        "total_count": len(result.data or []),
    }


async def get_content_detail(content_id: str) -> dict[str, Any] | None:
    """Get full details for a content item."""
    result = (
        supabase.table("content_items")
        .select(
            """
            *,
            category:categories!category_id(id, name, slug),
            audio_files!inner(id, file_url, duration, format)
            """
        )
        .eq("id", content_id)
        .single()
        .execute()
    )

    return result.data


def get_playlist_url(playlist_type: str, category_slug: str | None = None) -> dict[str, Any]:
    """Generate a playlist URL."""
    if playlist_type == "category" and category_slug:
        url = f"https://www.speasy.app/category/{category_slug}?autoplay=true"
        name = category_slug.title()
    else:
        url = "https://www.speasy.app/latest?autoplay=true"
        name = "Latest"

    return {
        "url": url,
        "name": name,
        "type": playlist_type,
    }


async def execute_tool(name: str, args: dict[str, Any]) -> tuple[Any, dict[str, Any] | None]:
    """Execute a tool and return the result and widget."""
    if name == "list_content":
        data = await list_content(
            category_slug=args.get("category_slug"),
            limit=args.get("limit", 10),
        )
        widget = build_content_list_widget(data["items"], data["metadata"])
        return data, widget

    elif name == "list_categories":
        categories = await list_categories()
        widget = build_categories_widget(categories)
        return categories, widget

    elif name == "search_content":
        data = await search_content(
            query=args["query"],
            limit=args.get("limit", 10),
        )
        widget = build_search_results_widget(
            data["query"], data["results"], data["total_count"]
        )
        return data, widget

    elif name == "get_content_detail":
        item = await get_content_detail(args["content_id"])
        if item:
            widget = build_content_detail_widget(item)
            return item, widget
        return None, None

    elif name == "get_playlist_url":
        data = get_playlist_url(
            playlist_type=args["type"],
            category_slug=args.get("category_slug"),
        )
        # Build a simple playlist card widget
        widget = {
            "type": "Card",
            "size": "md",
            "status": {"text": f"{data['name']} Playlist", "icon": "headphones"},
            "confirm": {
                "label": f"▶ Play {data['name']}",
                "action": {
                    "type": "custom",
                    "payload": {"action": "play_all", "url": data["url"]},
                },
            },
            "children": [
                {
                    "type": "Text",
                    "value": f"🎧 {data['name']} playlist ready to play",
                    "size": "md",
                    "weight": "medium",
                },
                {
                    "type": "Caption",
                    "value": "Click the button below to start listening",
                    "size": "sm",
                },
            ],
        }
        return data, widget

    return None, None


async def process_message(thread_id: str, user_message: str) -> AsyncIterator[dict[str, Any]]:
    """Process a user message and yield response events."""
    # Get thread history
    messages = store.get_messages(thread_id)

    # Build conversation for OpenAI
    conversation = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages[-10:]:  # Last 10 messages for context
        conversation.append({"role": msg["role"], "content": msg["content"]})
    conversation.append({"role": "user", "content": user_message})

    # Store user message
    store.add_message(thread_id, "user", user_message)

    # Call OpenAI
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=conversation,
        tools=TOOLS,
        tool_choice="auto",
    )

    message = response.choices[0].message

    # Handle tool calls
    if message.tool_calls:
        for tool_call in message.tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)

            # Execute tool
            result, widget = await execute_tool(tool_name, tool_args)

            if widget:
                # Yield widget event
                yield {
                    "type": "widget",
                    "widget": widget,
                }

            # Add tool result to conversation
            conversation.append(message.model_dump())
            conversation.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result) if result else "No results found",
            })

        # Get follow-up response from OpenAI
        follow_up = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=conversation,
        )

        assistant_content = follow_up.choices[0].message.content or ""
    else:
        assistant_content = message.content or ""

    # Store and yield assistant message
    store.add_message(thread_id, "assistant", assistant_content)
    yield {
        "type": "message",
        "role": "assistant",
        "content": assistant_content,
    }


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    """Main ChatKit endpoint."""
    body = await request.json()

    # Handle different message types
    message_type = body.get("type", "message")

    if message_type == "create_thread":
        # Create a new thread
        thread = store.create_thread(user_id=body.get("user_id"))
        return JSONResponse({"thread_id": thread["id"]})

    elif message_type == "message":
        thread_id = body.get("thread_id")
        content = body.get("content", "")

        if not thread_id:
            # Create thread if not provided
            thread = store.create_thread()
            thread_id = thread["id"]

        # Process message and stream response
        async def generate():
            async for event in process_message(thread_id, content):
                yield f"data: {json.dumps(event)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )

    elif message_type == "action":
        # Handle widget actions
        action_payload = body.get("payload", {})
        action_name = action_payload.get("action")

        if action_name in ("play_item", "play_all"):
            # Return URL to open
            return JSONResponse({
                "type": "open_url",
                "url": action_payload.get("url"),
            })

        elif action_name == "filter_category":
            # Trigger a new query
            thread_id = body.get("thread_id")
            category_slug = action_payload.get("category_slug")

            async def generate():
                data = await list_content(category_slug=category_slug, limit=10)
                widget = build_content_list_widget(data["items"], data["metadata"])
                yield f"data: {json.dumps({'type': 'widget', 'widget': widget})}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(
                generate(),
                media_type="text/event-stream",
            )

        return JSONResponse({"status": "ok"})

    return JSONResponse({"error": "Unknown message type"}, status_code=400)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "speasy-chatkit"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

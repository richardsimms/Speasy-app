"""Widget builder for content detail view."""

from datetime import datetime
from typing import Any

from .content_list import format_category_name, format_duration, get_category_color


def build_content_detail_widget(item: dict[str, Any]) -> dict[str, Any]:
    """Build the content detail widget for a single item."""
    category = item.get("category") or {}
    audio_files = item.get("audio_files") or []
    duration = audio_files[0].get("duration") if audio_files else None
    duration_str = format_duration(duration)
    key_insights = item.get("key_insights") or []

    # Format published date
    published_at = item.get("published_at")
    formatted_date = None
    if published_at:
        try:
            if isinstance(published_at, str):
                dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            else:
                dt = published_at
            formatted_date = dt.strftime("%b %d, %Y")
        except (ValueError, AttributeError):
            pass

    # Build metadata items
    meta_items = []
    source = item.get("source_name")
    author = item.get("author")

    if source:
        meta_items.append(source)
    if author and author != source:
        meta_items.append(author)
    if formatted_date:
        meta_items.append(formatted_date)
    if duration_str:
        meta_items.append(f"⏱️ {duration_str}")

    # Build key insights list
    insights_children = []
    for insight in key_insights[:5]:  # Limit to 5 insights
        insights_children.append({
            "type": "Row",
            "gap": 8,
            "align": "start",
            "children": [
                {"type": "Text", "value": "•", "size": "sm"},
                {"type": "Text", "value": insight, "size": "sm"},
            ],
        })

    # Build the card children
    card_children = [
        # Category badge
        {
            "type": "Badge",
            "label": format_category_name(category.get("name")),
            "color": get_category_color(category.get("slug")),
            "variant": "soft",
            "size": "sm",
            "pill": True,
        },
        # Title
        {
            "type": "Title",
            "value": item.get("title", "Untitled"),
            "size": "2xl",
        },
        # Hero image
        {
            "type": "Image",
            "src": item.get("image_url") or "https://www.speasy.app/poster.png",
            "alt": item.get("title", "Content"),
            "width": "100%",
            "height": 200,
            "radius": "lg",
            "fit": "cover",
        },
        # Metadata line
        {
            "type": "Caption",
            "value": " • ".join(meta_items) if meta_items else "Speasy",
            "size": "sm",
        },
        # Divider
        {"type": "Divider"},
        # Summary section
        {
            "type": "Col",
            "gap": 4,
            "children": [
                {"type": "Text", "value": "Summary", "size": "md", "weight": "semibold"},
                {"type": "Text", "value": item.get("summary", "No summary available."), "size": "sm"},
            ],
        },
    ]

    # Add key insights if available
    if insights_children:
        card_children.append({
            "type": "Col",
            "gap": 4,
            "children": [
                {"type": "Text", "value": "Key Insights", "size": "md", "weight": "semibold"},
                *insights_children,
            ],
        })

    return {
        "type": "Card",
        "size": "lg",
        "status": {"text": format_category_name(category.get("name")), "icon": "headphones"},
        "confirm": {
            "label": "▶ Listen Now",
            "action": {
                "type": "custom",
                "payload": {
                    "action": "play_item",
                    "item_id": item.get("id"),
                    "url": f"https://www.speasy.app/content/{item.get('id')}",
                },
            },
        },
        "children": card_children,
    }

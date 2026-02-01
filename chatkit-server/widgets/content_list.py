"""Widget builder for content lists."""

from typing import Any


def get_category_color(slug: str | None) -> str:
    """Map category slug to ChatKit badge color."""
    colors = {
        "ai": "info",
        "business": "success",
        "design": "warning",
        "technology": "discovery",
        "productivity": "secondary",
    }
    return colors.get(slug or "", "info")


def format_category_name(name: str | None) -> str:
    """Format category name with proper capitalization."""
    if not name:
        return "General"
    # Special cases for acronyms
    if name.lower() == "ai":
        return "AI"
    return name.title()


def format_duration(seconds: int | None) -> str | None:
    """Format duration in seconds to human-readable string. Returns None if unknown."""
    if not seconds or seconds <= 0:
        return None
    minutes = round(seconds / 60)
    if minutes < 1:
        return "< 1 min"
    return f"{minutes} min"


def truncate_text(text: str | None, max_length: int = 120) -> str:
    """Truncate text at word boundary."""
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    # Find last space before max_length
    truncated = text[:max_length].rsplit(" ", 1)[0]
    return truncated + "…"


def build_content_item(item: dict[str, Any]) -> dict[str, Any]:
    """Build a single content item for ListView."""
    category = item.get("category") or {}
    audio_files = item.get("audio_files") or []
    duration = audio_files[0].get("duration") if audio_files else None
    duration_str = format_duration(duration)

    # Build the category/duration row - only show duration if known
    meta_row_children = [
        {
            "type": "Badge",
            "label": format_category_name(category.get("name")),
            "color": get_category_color(category.get("slug")),
            "variant": "soft",
            "size": "sm",
            "pill": True,
        },
    ]

    if duration_str:
        meta_row_children.append({
            "type": "Caption",
            "value": f"⏱️ {duration_str}",
            "size": "sm",
        })

    # Build source line
    source = item.get("source_name") or ""
    author = item.get("author")
    source_line = source
    if author and author != source:
        source_line = f"{source} • {author}" if source else author

    return {
        "type": "ListViewItem",
        "onClickAction": {
            "type": "custom",
            "payload": {
                "action": "play_item",
                "item_id": item.get("id"),
                "url": f"https://www.speasy.app/content/{item.get('id')}",
            },
        },
        "children": [
            {
                "type": "Row",
                "gap": 12,
                "align": "start",
                "children": [
                    # Thumbnail
                    {
                        "type": "Image",
                        "src": item.get("image_url") or "https://www.speasy.app/poster.png",
                        "alt": item.get("title", "Content"),
                        "width": 72,
                        "height": 72,
                        "radius": "md",
                        "fit": "cover",
                    },
                    # Content details
                    {
                        "type": "Col",
                        "flex": 1,
                        "gap": 4,
                        "children": [
                            # Category badge and duration
                            {
                                "type": "Row",
                                "gap": 8,
                                "align": "center",
                                "children": meta_row_children,
                            },
                            # Title
                            {
                                "type": "Text",
                                "value": item.get("title", "Untitled"),
                                "size": "md",
                                "weight": "semibold",
                                "maxLines": 2,
                            },
                            # Source and author
                            {
                                "type": "Caption",
                                "value": source_line or "Speasy",
                                "size": "sm",
                            },
                        ],
                    },
                ],
            },
        ],
    }


def build_content_list_widget(
    items: list[dict[str, Any]], metadata: dict[str, Any]
) -> dict[str, Any]:
    """Build the content list widget with all items."""
    category_name = metadata.get("category_name", "Latest")
    count = metadata.get("count", len(items))
    duration_min = metadata.get("duration_min", 0)
    playlist_url = metadata.get("playlist_url", "https://www.speasy.app/latest?autoplay=true")

    # Build subtitle - only show duration if we have it
    if duration_min and duration_min > 0:
        subtitle = f"{count} stories • {duration_min} min listening"
    else:
        subtitle = f"{count} stories ready to play"

    return {
        "type": "Card",
        "size": "lg",
        "status": {"text": f"{format_category_name(category_name)} Content", "icon": "headphones"},
        "confirm": {
            "label": "▶ Play All",
            "action": {
                "type": "custom",
                "payload": {"action": "play_all", "url": playlist_url},
            },
        },
        "children": [
            # Subtitle with count
            {
                "type": "Caption",
                "value": subtitle,
                "size": "md",
            },
            # Divider
            {"type": "Divider"},
            # Content list
            {
                "type": "ListView",
                "limit": 10,
                "children": [build_content_item(item) for item in items],
            },
        ],
    }

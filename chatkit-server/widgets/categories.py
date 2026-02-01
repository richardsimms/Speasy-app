"""Widget builder for categories view."""

from typing import Any

from .content_list import get_category_color


def build_category_item(category: dict[str, Any]) -> dict[str, Any]:
    """Build a single category item for the list."""
    recent_count = category.get("recent_count", 0)

    return {
        "type": "ListViewItem",
        "onClickAction": {
            "type": "custom",
            "payload": {
                "action": "filter_category",
                "category_slug": category.get("slug"),
                "category_name": category.get("name"),
            },
        },
        "gap": 12,
        "align": "center",
        "children": [
            {
                "type": "Row",
                "gap": 12,
                "align": "center",
                "flex": 1,
                "children": [
                    # Category image or icon placeholder
                    {
                        "type": "Box",
                        "width": 48,
                        "height": 48,
                        "radius": "md",
                        "background": {"dark": "#333", "light": "#f0f0f0"},
                        "align": "center",
                        "justify": "center",
                        "children": [
                            {
                                "type": "Text",
                                "value": get_category_emoji(category.get("slug")),
                                "size": "xl",
                            },
                        ],
                    },
                    # Category details
                    {
                        "type": "Col",
                        "flex": 1,
                        "gap": 2,
                        "children": [
                            {
                                "type": "Text",
                                "value": category.get("name", "Category"),
                                "size": "md",
                                "weight": "semibold",
                            },
                            {
                                "type": "Caption",
                                "value": category.get("description", "")[:80]
                                + ("..." if len(category.get("description", "")) > 80 else ""),
                                "size": "sm",
                                "color": {"dark": "#888", "light": "#666"},
                                "maxLines": 1,
                            },
                        ],
                    },
                    # Recent count badge
                    {
                        "type": "Badge",
                        "label": f"{recent_count} new",
                        "color": get_category_color(category.get("slug")),
                        "variant": "soft",
                        "size": "sm",
                        "pill": True,
                    },
                ],
            },
        ],
    }


def get_category_emoji(slug: str | None) -> str:
    """Get emoji for a category."""
    emojis = {
        "ai": "🤖",
        "business": "💼",
        "design": "🎨",
        "technology": "💻",
        "productivity": "⚡",
    }
    return emojis.get(slug or "", "📚")


def build_categories_widget(categories: list[dict[str, Any]]) -> dict[str, Any]:
    """Build the categories list widget."""
    return {
        "type": "Card",
        "size": "lg",
        "status": {"text": "Categories", "icon": "folder"},
        "children": [
            # Header
            {
                "type": "Col",
                "gap": 4,
                "margin": {"bottom": 16},
                "children": [
                    {
                        "type": "Title",
                        "value": "📂 Browse Categories",
                        "size": "xl",
                        "weight": "bold",
                    },
                    {
                        "type": "Caption",
                        "value": "Select a category to explore content",
                        "size": "md",
                        "color": {"dark": "#888", "light": "#666"},
                    },
                ],
            },
            # Divider
            {"type": "Divider", "spacing": 0, "margin": {"bottom": 16}},
            # Categories list
            {
                "type": "ListView",
                "children": [build_category_item(cat) for cat in categories],
            },
        ],
    }


def build_search_results_widget(
    query: str, results: list[dict[str, Any]], total_count: int
) -> dict[str, Any]:
    """Build search results widget."""
    from .content_list import build_content_item

    return {
        "type": "Card",
        "size": "lg",
        "status": {"text": "Search Results", "icon": "search"},
        "children": [
            # Header
            {
                "type": "Col",
                "gap": 4,
                "margin": {"bottom": 16},
                "children": [
                    {
                        "type": "Title",
                        "value": f"🔍 Results for \"{query}\"",
                        "size": "xl",
                        "weight": "bold",
                    },
                    {
                        "type": "Caption",
                        "value": f"Found {total_count} matching stories",
                        "size": "md",
                        "color": {"dark": "#888", "light": "#666"},
                    },
                ],
            },
            # Divider
            {"type": "Divider", "spacing": 0, "margin": {"bottom": 16}},
            # Results list
            *(
                [
                    {
                        "type": "ListView",
                        "limit": 10,
                        "children": [build_content_item(item) for item in results],
                    }
                ]
                if results
                else [
                    {
                        "type": "Col",
                        "align": "center",
                        "padding": {"y": 32},
                        "children": [
                            {
                                "type": "Text",
                                "value": "No results found",
                                "size": "md",
                                "color": {"dark": "#888", "light": "#666"},
                            },
                            {
                                "type": "Caption",
                                "value": "Try a different search term",
                                "size": "sm",
                                "color": {"dark": "#666", "light": "#999"},
                            },
                        ],
                    }
                ]
            ),
        ],
    }

export type ContentItem = {
  id: string;
  title: string;
  summary?: string;
  source_name: string;
  image_url?: string;
  author?: string;
  published_at?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  audio_files?: Array<{
    file_url: string;
    duration: number;
    format?: string;
  }>;
};

export type StructuredContent = {
  items?: ContentItem[];
  count?: number;
  category?: string;
  total_duration_minutes?: number;
  query?: string;
};

export type WidgetState = {
  selectedCategory?: string;
  sortBy?: 'newest' | 'duration';
};

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ContentDetailView } from "@/components/content-detail-view";
import { Env } from "@/libs/Env";
import { getSupabaseAdmin } from "@/libs/Supabase";

// Force dynamic rendering
export const dynamic = "force-dynamic";

type ContentDetailProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata(
  props: ContentDetailProps,
): Promise<Metadata> {
  const { id, locale } = await props.params;

  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return {
      title: "Content Not Available",
    };
  }

  const supabase = getSupabaseAdmin();
  const { data: item } = await supabase
    .from("content_items")
    .select("title")
    .eq("id", id)
    .single();

  const t = await getTranslations({
    locale,
    namespace: "Dashboard",
  });

  return {
    title: item?.title || t("meta_title"),
    description: item?.title || "Content detail",
  };
}

export default async function ContentDetail(props: ContentDetailProps) {
  const { id, locale } = await props.params;

  // Check if Supabase is configured
  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">
          Content is not available. Please check your configuration.
        </p>
      </div>
    );
  }

  const supabase = getSupabaseAdmin();

  // Fetch the content item with all related data
  const { data: item, error } = await supabase
    .from("content_items")
    .select(
      `
      id,
      title,
      summary,
      content,
      image_url,
      created_at,
      url,
      content_item_tags(
        categories(
          name
        )
      ),
      content_sources(
        name,
        url
      ),
      audio_files(
        file_url,
        duration
      )
    `,
    )
    .eq("id", id)
    .eq("status", "done")
    .single();

  if (error || !item) {
    notFound();
  }

  // Get category from tags or content source
  let categoryName = "Uncategorized";
  const firstTag = item.content_item_tags?.[0] as any;
  if (firstTag?.categories?.name) {
    categoryName = firstTag.categories.name;
  } else if (item.content_sources) {
    const source = Array.isArray(item.content_sources)
      ? item.content_sources[0]
      : item.content_sources;
    if (source?.name) {
      categoryName = source.name;
    }
  }

  const audioFile = item.audio_files?.[0];
  const source = Array.isArray(item.content_sources)
    ? item.content_sources[0]
    : item.content_sources;

  const contentData = {
    id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    imageUrl: item.image_url,
    category: categoryName,
    audioUrl: audioFile?.file_url || null,
    duration: audioFile?.duration || null,
    sourceUrl: item.url,
    sourceName: source?.name || null,
    sourceLink: source?.url || null,
    createdAt: item.created_at,
  };

  return (
    <ContentDetailView content={contentData} locale={locale} surface="home" />
  );
}

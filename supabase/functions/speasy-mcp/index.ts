// supabase/functions/speasy-mcp/index.ts
// MCP Server with Streamable HTTP transport for OpenAI ChatGPT compatibility

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, accept, mcp-session-id, mcp-protocol-version, last-event-id',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

type MCPRequest = {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: any;
};

type MCPResponse = {
  jsonrpc: '2.0';
  id?: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
};

// Helper to create SSE formatted message
function sseMessage(data: any, eventId?: string): string {
  let message = '';
  if (eventId) {
    message += `id: ${eventId}\n`;
  }
  message += `event: message\n`;
  message += `data: ${JSON.stringify(data)}\n\n`;
  return message;
}

// Helper to create SSE stream response
function createSSEResponse(body: ReadableStream): Response {
  return new Response(body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Helper to create JSON response
function createJSONResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

serve(async (req) => {
  const _url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Use service role key to bypass RLS for reading content
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    // Handle GET request - establish SSE stream for server-to-client messages
    // OpenAI may use this to poll for tool definitions
    if (req.method === 'GET') {
      const accept = req.headers.get('accept') || '';

      // If client wants SSE, return an SSE stream
      if (accept.includes('text/event-stream')) {
        // For GET requests, we can optionally provide a keep-alive SSE stream
        // But since we don't have server-initiated messages, return 405
        // Or we can return a simple stream that stays open
        const stream = new ReadableStream({
          start(controller) {
            // Send a ping to keep connection alive
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(': ping\n\n'));
          },
          cancel() {
            // Client disconnected
          },
        });
        return createSSEResponse(stream);
      }

      // Return server info for non-SSE GET requests
      return createJSONResponse({
        name: 'speasy-mcp',
        version: '1.0.0',
        description: 'Speasy MCP Server - Audio content discovery and playback',
      });
    }

    // Handle DELETE request - terminate session
    if (req.method === 'DELETE') {
      return new Response(null, {
        status: 202,
        headers: corsHeaders,
      });
    }

    // Handle POST request - process MCP messages
    if (req.method === 'POST') {
      const accept = req.headers.get('accept') || '';
      const body: MCPRequest = await req.json();
      const { method, params, id } = body;

      // Process the request
      let result;
      try {
        switch (method) {
          case 'initialize':
            result = handleInitialize();
            break;

          case 'notifications/initialized':
            // Client notification that initialization is complete
            return new Response(null, { status: 202, headers: corsHeaders });

          case 'resources/list':
            result = await handleResourcesList(supabase, params);
            break;

          case 'resources/read':
            result = await handleResourceRead(supabase, params);
            break;

          case 'tools/list':
            result = handleToolsList();
            break;

          case 'tools/call':
            result = await handleToolCall(supabase, params);
            break;

          case 'ping':
            result = {};
            break;

          default: {
            const err = new Error(`Method not found: ${method}`) as Error & { code: number };
            err.code = -32601;
            throw err;
          }
        }
      } catch (error) {
        // Handle MCP errors
        const mcpResponse: MCPResponse = {
          jsonrpc: '2.0',
          id: id ?? null,
          error: {
            code: error.code || -32603,
            message: error.message || 'Internal error',
          },
        };

        // Check if client prefers SSE
        if (accept.includes('text/event-stream')) {
          const stream = new ReadableStream({
            start(controller) {
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(sseMessage(mcpResponse, `evt-${Date.now()}`)));
              controller.close();
            },
          });
          return createSSEResponse(stream);
        }

        return createJSONResponse(mcpResponse);
      }

      const mcpResponse: MCPResponse = {
        jsonrpc: '2.0',
        id,
        result,
      };

      // Check if client prefers SSE response
      if (accept.includes('text/event-stream') && !accept.includes('application/json')) {
        const stream = new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(sseMessage(mcpResponse, `evt-${Date.now()}`)));
            controller.close();
          },
        });
        return createSSEResponse(stream);
      }

      // Default to JSON response
      return createJSONResponse(mcpResponse);
    }

    // Method not allowed
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('MCP Server Error:', error);

    const errorResponse: MCPResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: error.message || 'Internal error',
      },
    };

    return createJSONResponse(errorResponse, 500);
  }
});

function handleInitialize() {
  return {
    protocolVersion: '2024-11-05',
    capabilities: {
      resources: {
        listChanged: false,
      },
      tools: {
        listChanged: false,
      },
    },
    serverInfo: {
      name: 'speasy-mcp',
      version: '1.0.0',
    },
  };
}

async function handleResourcesList(supabase: any, _params: any) {
  const resources = [];

  // Add "Latest Mix" resource
  resources.push({
    uri: 'speasy://latest',
    name: 'Latest Mix',
    description: 'Recent content across all categories',
    mimeType: 'text/plain',
  });

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name');

  for (const cat of categories || []) {
    resources.push({
      uri: `speasy://category/${cat.slug}`,
      name: cat.name,
      description: cat.description || `Recent ${cat.name} content`,
      mimeType: 'text/plain',
    });
  }

  // Fetch recent content with audio (processed, not archived)
  const { data: recentContent } = await supabase
    .from('content_items')
    .select(
      `
      id,
      title,
      published_at,
      source_name,
      category:categories!category_id(name),
      audio_files!inner(id)
    `,
    )
    .eq('status', 'done')
    .order('published_at', { ascending: false })
    .limit(20);

  for (const item of recentContent || []) {
    const categoryTag = item.category?.name ? ` [${item.category.name}]` : '';
    resources.push({
      uri: `speasy://content/${item.id}`,
      name: `${item.title}${categoryTag}`,
      description: `${item.source_name} - ${new Date(item.published_at).toLocaleDateString()}`,
      mimeType: 'text/plain',
    });
  }

  return { resources };
}

async function handleResourceRead(supabase: any, params: any) {
  const uri = params.uri;

  if (uri === 'speasy://latest') {
    const { data: items } = await supabase
      .from('content_items')
      .select(
        `
        id,
        title,
        summary,
        published_at,
        source_name,
        category:categories!category_id(name, slug),
        audio_files!inner(file_url, duration)
      `,
      )
      .eq('status', 'done')
      .order('published_at', { ascending: false })
      .limit(10);

    const contentList = items
      ?.map((item: any, idx: number) => {
        const duration = item.audio_files?.[0]?.duration
          ? `${Math.round(item.audio_files[0].duration / 60)} min`
          : 'Duration unknown';
        const category = item.category?.name || 'Uncategorized';
        return `${idx + 1}. ${item.title} [${category}] - ${item.source_name} (${duration})`;
      })
      .join('\n');

    const totalDuration = items?.reduce((sum: number, item: any) => {
      return sum + (item.audio_files?.[0]?.duration || 0);
    }, 0);

    const content = `
# Latest Mix - Recent Content Across All Topics

${items?.length || 0} items • ~${Math.round((totalDuration || 0) / 60)} minutes total

## Items

${contentList || 'No content available'}

**Play URL:** https://www.speasy.app/latest?autoplay=true
    `.trim();

    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content,
        },
      ],
    };
  }

  const [, type, id] = uri.split('/');

  if (type === 'content') {
    const { data } = await supabase
      .from('content_items')
      .select(
        `
        *,
        category:categories!category_id(id, name, slug),
        audio_files!inner(file_url, duration, format)
      `,
      )
      .eq('id', id)
      .single();

    if (!data) {
      throw new Error('Content not found or no longer available');
    }

    const duration = data.audio_files?.[0]?.duration
      ? `${Math.round(data.audio_files[0].duration / 60)} minutes`
      : 'Duration unknown';

    const category = data.category?.name || 'Uncategorized';

    const content = `
# ${data.title}

**Category:** ${category}
**Source:** ${data.source_name}
**Published:** ${new Date(data.published_at).toLocaleDateString()}
${data.author ? `**Author:** ${data.author}` : ''}
**Duration:** ${duration}

## Summary
${data.summary || 'No summary available'}

## Key Insights
${data.key_insights ? data.key_insights.map((insight: string) => `• ${insight}`).join('\n') : 'None available'}

**Listen:** https://www.speasy.app/content/${data.id}
    `.trim();

    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content,
        },
      ],
    };
  }

  if (type === 'category') {
    const categorySlug = id;

    const { data: category } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      throw new Error('Category not found');
    }

    const { data: recentContent } = await supabase
      .from('content_items')
      .select(
        `
        id,
        title,
        summary,
        published_at,
        source_name,
        audio_files!inner(duration)
      `,
      )
      .eq('status', 'done')
      .eq('category_id', category.id)
      .order('published_at', { ascending: false })
      .limit(10);

    const contentList = recentContent
      ?.map((item: any, idx: number) => {
        const duration = item.audio_files?.[0]?.duration
          ? `${Math.round(item.audio_files[0].duration / 60)} min`
          : 'Duration unknown';
        return `${idx + 1}. ${item.title} - ${item.source_name} (${duration})`;
      })
      .join('\n');

    const totalDuration = recentContent?.reduce((sum: number, item: any) => {
      return sum + (item.audio_files?.[0]?.duration || 0);
    }, 0);

    const content = `
# ${category.name}

${category.description || ''}

## Recent Content
${recentContent?.length || 0} items • ~${Math.round((totalDuration || 0) / 60)} minutes total

${contentList || 'No recent content'}

**Play Category:** https://www.speasy.app/category/${categorySlug}?autoplay=true
    `.trim();

    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content,
        },
      ],
    };
  }

  throw new Error('Unknown resource type');
}

function handleToolsList() {
  return {
    tools: [
      {
        name: 'list_categories',
        description:
          'Get all available content categories (AI, Business, Design, Technology, Productivity)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_content',
        description:
          'List content items, optionally filtered by category. Omit category_slug for \'Latest\' mix across all categories.',
        inputSchema: {
          type: 'object',
          properties: {
            category_slug: {
              type: 'string',
              enum: ['ai', 'business', 'design', 'technology', 'productivity'],
              description:
                'Optional: filter to specific category. Omit for \'Latest\' mix.',
            },
            limit: {
              type: 'number',
              description: 'Number of items to return (default 10, max 50)',
              default: 10,
            },
          },
        },
      },
      {
        name: 'search_content',
        description:
          'Search content by keywords across titles, summaries, and content',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search keywords',
            },
            category_slug: {
              type: 'string',
              enum: ['ai', 'business', 'design', 'technology', 'productivity'],
              description: 'Optional: filter results to specific category',
            },
            limit: {
              type: 'number',
              description: 'Maximum results (default 10, max 50)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_content_detail',
        description:
          'Get full details for a specific content item including audio URL',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Content item UUID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_playlist_url',
        description:
          'Get a URL to play content. Can be \'latest\' for mixed feed or \'category\' for specific category playlist.',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['latest', 'category'],
              description:
                '\'latest\' for mixed feed across all categories, \'category\' for specific category',
            },
            category_slug: {
              type: 'string',
              enum: ['ai', 'business', 'design', 'technology', 'productivity'],
              description: 'Required when type=\'category\'',
            },
            limit: {
              type: 'number',
              description: 'Number of items in playlist (default 10)',
              default: 10,
            },
          },
          required: ['type'],
        },
      },
    ],
  };
}

async function handleToolCall(supabase: any, params: any) {
  const { name, arguments: args = {} } = params;

  if (name === 'list_categories') {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url')
      .order('name');

    if (error) {
      throw error;
    }

    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (cat: any) => {
        const { count } = await supabase
          .from('content_items')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'done')
          .eq('category_id', cat.id)
          .gte(
            'published_at',
            new Date(Date.now() - 7 * 86400000).toISOString(),
          );

        return {
          ...cat,
          recent_count: count || 0,
        };
      }),
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(categoriesWithCounts, null, 2),
        },
      ],
    };
  }

  if (name === 'list_content') {
    // Use !inner join to only get items that have audio files
    let query = supabase
      .from('content_items')
      .select(
        `
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
      `,
      )
      .eq('status', 'done');

    if (args.category_slug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', args.category_slug)
        .single();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    const limit = Math.min(args.limit || 10, 50);
    query = query.order('published_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  if (name === 'search_content') {
    // Use !inner join to only get items that have audio files
    let query = supabase
      .from('content_items')
      .select(
        `
        id,
        title,
        summary,
        published_at,
        source_name,
        image_url,
        author,
        key_insights,
        category:categories!category_id(id, name, slug),
        audio_files!inner(file_url, duration)
      `,
      )
      .eq('status', 'done');

    if (args.query) {
      query = query.or(
        `title.ilike.%${args.query}%,summary.ilike.%${args.query}%,content.ilike.%${args.query}%`,
      );
    }

    if (args.category_slug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', args.category_slug)
        .single();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    const limit = Math.min(args.limit || 10, 50);
    query = query.order('published_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              query: args.query,
              category: args.category_slug || 'all',
              results_count: data?.length || 0,
              results: data,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  if (name === 'get_content_detail') {
    // Use !inner join to ensure item has audio
    const { data, error } = await supabase
      .from('content_items')
      .select(
        `
        *,
        category:categories!category_id(id, name, slug),
        audio_files!inner(id, file_url, duration, format)
      `,
      )
      .eq('id', args.id)
      .single();

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error('Content not found or audio not available');
    }

    const enrichedData = {
      ...data,
      play_url: `https://www.speasy.app/content/${data.id}`,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(enrichedData, null, 2),
        },
      ],
    };
  }

  if (name === 'get_playlist_url') {
    if (args.type === 'latest') {
      const { data: items } = await supabase
        .from('content_items')
        .select(
          `
          id,
          title,
          category:categories!category_id(name, slug),
          audio_files!inner(duration)
        `,
        )
        .eq('status', 'done')
        .order('published_at', { ascending: false })
        .limit(args.limit || 10);

      const totalDuration = items?.reduce((sum: number, item: any) => {
        return sum + (item.audio_files?.[0]?.duration || 0);
      }, 0);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                playlist_url: `https://www.speasy.app/latest?autoplay=true&limit=${args.limit || 10}`,
                type: 'latest',
                items_count: items?.length || 0,
                total_duration_seconds: totalDuration,
                total_duration_minutes: Math.round((totalDuration || 0) / 60),
                preview_items: items?.slice(0, 5).map((item: any) => ({
                  id: item.id,
                  title: item.title,
                  category: item.category?.name || 'Uncategorized',
                  duration_seconds: item.audio_files?.[0]?.duration,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    if (args.type === 'category') {
      if (!args.category_slug) {
        throw new Error('category_slug required when type=\'category\'');
      }

      const { data: category } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', args.category_slug)
        .single();

      if (!category) {
        throw new Error(`Category '${args.category_slug}' not found`);
      }

      const { data: items } = await supabase
        .from('content_items')
        .select(
          `
          id,
          title,
          audio_files!inner(duration)
        `,
        )
        .eq('status', 'done')
        .eq('category_id', category.id)
        .order('published_at', { ascending: false })
        .limit(args.limit || 10);

      const totalDuration = items?.reduce((sum: number, item: any) => {
        return sum + (item.audio_files?.[0]?.duration || 0);
      }, 0);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                playlist_url: `https://www.speasy.app/category/${args.category_slug}?autoplay=true&limit=${args.limit || 10}`,
                type: 'category',
                category: category.name,
                category_slug: category.slug,
                items_count: items?.length || 0,
                total_duration_seconds: totalDuration,
                total_duration_minutes: Math.round((totalDuration || 0) / 60),
                preview_items: items?.slice(0, 5).map((item: any) => ({
                  id: item.id,
                  title: item.title,
                  duration_seconds: item.audio_files?.[0]?.duration,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    throw new Error('type must be \'latest\' or \'category\'');
  }

  throw new Error(`Unknown tool: ${name}`);
}

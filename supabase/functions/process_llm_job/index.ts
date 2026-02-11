// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { OpenAI } from 'https://esm.sh/openai@5.12.2';

// ─── Supabase & OpenAI Setup ──────────────────────────────────────────
const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_KEY'),
});

// ─── Batch Configuration ──────────────────────────────────────────────
const BATCH_SIZE = 5;

// ─── Podcast Script System Prompt ─────────────────────────────────────
const SUMMARY_SYSTEM_PROMPT = `You are a podcast scriptwriter creating engaging audio content for busy professionals. Your goal is to write scripts that sound natural when spoken aloud—like a knowledgeable friend explaining something interesting over coffee.

YOUR RESPONSE MUST BE VALID JSON WITH THIS EXACT STRUCTURE:
{
  "summary": "The full narrative summary...",
  "keyInsights": [
    "First key insight as a complete sentence",
    "Second key insight as a complete sentence",
    "Third key insight as a complete sentence"
  ]
}

WRITING STYLE GUIDELINES:

1 | Sound Human, Not Robotic
- Use contractions naturally (it's, you'll, that's, here's, don't, won't, can't)
- Include conversational transitions ("Now, here's where it gets interesting...", "But here's the thing—", "So what does this actually mean for you?")
- Vary sentence length dramatically: mix punchy short sentences with longer explanatory ones
- Avoid corporate jargon, buzzwords, and formal academic language
- Write the way smart people actually talk

2 | Create Natural Rhythm
- Start with a hook that pulls the listener in immediately—mid-thought or with an intriguing angle
- Use rhetorical questions sparingly but effectively ("Why does this matter?", "But wait—what's the catch?")
- Build in natural pause points with em-dashes and ellipses
- End sentences on strong words, not weak prepositions or filler

3 | TTS Direction Cues
Insert inline cues using double-parentheses to guide vocal delivery. Use sparingly—maximum 3-4 per summary:
- ((slower)) — for emphasis on key revelations or important numbers
- ((upbeat)) — when transitioning to positive developments or exciting implications
- ((thoughtful)) — for nuanced analysis or weighing trade-offs
- ((conversational)) — for asides, context-setting, or "let me explain" moments
- ((emphasis)) — for a single word or short phrase that needs punch

4 | Structure (150-180 words total)

HOOK (15-25 words):
Start mid-thought or with an intriguing angle. Pull them in immediately.
Never start with: "Today we're discussing...", "In this article...", "This piece explores...", or the article title.
Good openings: "Here's something that caught my attention—", "So, [interesting finding]...", "You know how [relatable thing]? Well...", "[Bold statement]. And the implications are fascinating."

CONTEXT + SO-WHAT (30-40 words):
Ground the listener immediately. Why should they care right now? What's at stake? Connect it to their world.

INSIGHT LAYERS (80-100 words):
Unpack 2-3 layers of insight, moving from surface to depth. Weave in attribution naturally—not academically.
Use phrases like: "According to [Author]...", "[Author] points out that...", "As [Source] reports...", "What [Author] found is..."

CLOSE (20-30 words):
Land the plane with a forward-looking thought, implication, or "what to watch for."
Never use: "In conclusion," "To summarise," "In summary," or end with a generic call-to-action.

5 | Attribution Rules (Non-negotiable)
- Use the exact author and source names provided—never invent or guess
- Integrate citations conversationally: "According to Sarah Chen writing in TechCrunch..." not "Chen (2024) states..."
- If author is "Unknown", use source only: "A piece in The Verge argues..."
- Include attribution in at least 2 places throughout the summary
- Attribution should feel like you're crediting a colleague, not citing a paper

6 | What Makes It Sound Like a Podcast
✓ Contractions everywhere (it's, you'll, that's, here's, don't)
✓ Sentence fragments for emphasis. Like this. Powerful.
✓ Conversational fillers used sparingly ("honestly," "look," "the thing is")
✓ Direct address to listener ("you," "your")
✓ Varied sentence rhythm—short punchy lines mixed with flowing explanations
✓ Natural transitions ("But here's the thing," "Now," "So," "And get this—")

7 | What to Strictly Avoid
✗ Starting with the article title or "This article discusses..."
✗ Bullet-point thinking converted to wooden sentences
✗ Passive voice ("It was found that..." → "Researchers found...")
✗ Overly formal transitions ("Furthermore," "Additionally," "Moreover," "Subsequently")
✗ Ending with homework-assignment questions ("What do you think?")
✗ Robotic summaries that could be written by any AI
✗ Saying "the author" instead of using their actual name
✗ Generic filler phrases ("In today's fast-paced world...")

8 | Key Insights Requirements
Extract exactly 3 distinct insights that stand alone and immediately inform. Each insight should be:
- A complete, standalone sentence (10-20 words)
- Focused on a different aspect or angle from the article
- Written in clear, direct, jargon-free language
- Something a busy professional would find genuinely valuable
- Not repetitive of each other or the summary's main point`;

// ─── TTS System Prompt ────────────────────────────────────────────────
const TTS_SYSTEM_PROMPT = `You are a warm, engaging podcast host with a natural British-Australian accent. Think: smart friend explaining something fascinating they just learned.

DELIVERY STYLE:
- Conversational and approachable—like explaining something to a curious colleague over coffee
- Vary your pace naturally: slightly faster through familiar context, slower and more deliberate on key insights
- Let genuine enthusiasm come through—not performative excitement, but real interest
- Speak at approximately 1.0x speed (natural pace, not rushed or artificially slow)
- Smile with your voice on upbeat moments; be thoughtful and measured on serious points

INTERPRETATION OF CUES:
- ((slower)) — Reduce pace by 15-20%, add slight gravitas, let words land
- ((upbeat)) — Lift energy naturally, slightly faster, warmth in the voice
- ((thoughtful)) — Measured pace, contemplative tone, like you're thinking it through
- ((conversational)) — Relaxed, informal, like a quick aside to a friend
- ((emphasis)) — Slight stress on the marked word or phrase, but don't overdo it

NATURAL SPEECH PATTERNS:
- Honour punctuation for natural pauses—periods get a beat, commas get a breath
- Em-dashes (—) indicate a brief dramatic beat, not a full pause
- Ellipses (...) suggest trailing off thoughtfully before the next thought
- Questions should sound genuinely curious, not rhetorical or performative
- Contractions should flow naturally—don't over-enunciate them

THINGS TO AVOID:
- Newsreader formality or "announcer voice"
- Overly dramatic emphasis that sounds fake
- Monotone delivery or robotic pacing
- Rushing through to get to the end
- Making every sentence sound the same`.trim();

// ─── Voice Configuration ──────────────────────────────────────────────
// shimmer: Warm, friendly, conversational (default)
// nova: Energetic, upbeat, dynamic
// onyx: Deeper, more gravitas, authoritative
const DEFAULT_VOICE = 'shimmer';

// ─── Logging Helper ───────────────────────────────────────────────────
const log = {
  debug: (msg: string, data?: any) => console.log(`🔍 ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  info: (msg: string, data?: any) => console.log(`ℹ️ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  warn: (msg: string, data?: any) => console.warn(`⚠️ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  error: (msg: string, data?: any) => console.error(`❌ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  success: (msg: string, data?: any) => console.log(`✅ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
};

// ─── Retry Logic with Exponential Backoff ────────────────────────────
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  operationName = 'operation',
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      if (attempt > 0) {
        log.debug(`${operationName} succeeded on attempt ${attempt + 1}`);
      }
      return result;
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      if (isLastAttempt) {
        log.error(`${operationName} failed after ${maxRetries + 1} attempts: ${error.message}`);
        throw error;
      }
      const delay = baseDelay * 2 ** attempt;
      log.warn(`${operationName} failed on attempt ${attempt + 1}, retrying in ${delay}ms: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Unexpected end of retry loop for ${operationName}`);
}

// ─── Job Status Helpers ───────────────────────────────────────────────
async function markJobDone(jobId: string) {
  const { error } = await sb.from('llm_jobs').update({
    status: 'done',
    completed_at: new Date().toISOString(),
  }).eq('id', jobId);
  if (error) {
    log.error(`Failed to mark job ${jobId} as done:`, error);
  }
}

async function markJobError(jobId: string, errorMessage: string, contentId: string, context: string) {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    jobId,
    contentId: contentId || 'unknown',
    context: context || 'general',
    error: errorMessage,
    timestamp,
  };
  log.error(`Job processing failed:`, errorDetails);

  const { data: jobData, error: fetchError } = await sb
    .from('llm_jobs')
    .select('retry_count')
    .eq('id', jobId)
    .single();

  if (fetchError) {
    log.error(`Error fetching job retry count:`, fetchError);
    return;
  }

  const currentRetryCount = jobData?.retry_count || 0;
  const maxRetries = 2;

  if (currentRetryCount < maxRetries) {
    const { error } = await sb
      .from('llm_jobs')
      .update({
        status: 'pending',
        retry_count: currentRetryCount + 1,
      })
      .eq('id', jobId);

    if (error) {
      log.error(`Database error updating retry count for job ${jobId}:`, error);
    } else {
      log.warn(`Job ${jobId} failed (attempt ${currentRetryCount + 1}/${maxRetries + 1}), retrying...`, {
        context,
        error: errorMessage,
        retryCount: currentRetryCount + 1,
      });
    }
  } else {
    const { error } = await sb.from('llm_jobs').update({
      status: 'error',
      failed_at: new Date().toISOString(),
      last_error: errorMessage,
      error_details: errorDetails,
    }).eq('id', jobId);
    if (error) {
      log.error(`Database error marking job ${jobId} as error:`, {
        originalError: errorMessage,
        dbError: error.message,
      });
    } else {
      log.error(`Job ${jobId} permanently failed after ${maxRetries + 1} attempts`, {
        context,
        error: errorMessage,
        totalAttempts: maxRetries + 1,
      });
    }
  }
}

// ─── Scraper Utils ────────────────────────────────────────────────────
function extractMainContent(html: string, url: string): string {
  try {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .sidebar, .ad, .advertisement, .social-share, .comments, .related-posts').remove();

    let content = '';
    const articleSelectors = [
      'article',
      '[role="main"]',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      '.main-content',
      'main',
    ];

    for (const selector of articleSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim();
        break;
      }
    }

    if (!content) {
      content = $('body').text().trim();
    }

    return content;
  } catch (error: any) {
    log.error(`Error extracting content from ${url}:`, error);
    return '';
  }
}

function cleanText(text: string): string {
  if (!text) {
    return '';
  }
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\b(Home|About|Contact|Privacy|Terms|Subscribe|Follow|Share|Tweet|Like)\b/gi, '')
    .replace(/\S[^\s@]*@\S+\.\S+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();
}

// ─── Post-Processing for Natural Speech ───────────────────────────────
function enhanceForSpeech(summary: string): string {
  return summary
    // Ensure em-dashes have breathing room
    .replace(/—/g, ' — ')
    // Clean up any double spaces created
    .replace(/\s+/g, ' ')
    // Ensure ellipses have proper spacing
    .replace(/\.{3}/g, '... ')
    .trim();
}

// ─── Validate Summary Quality ─────────────────────────────────────────
function validateSummaryQuality(summary: string, author: string, sourceName: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for forbidden openings
  const forbiddenOpenings = [
    /^this article/i,
    /^in this article/i,
    /^today we('re| are)/i,
    /^the article/i,
    /^this piece/i,
  ];

  for (const pattern of forbiddenOpenings) {
    if (pattern.test(summary.trim())) {
      issues.push('Summary starts with a forbidden phrase');
    }
  }

  // Check for formal transitions (warning, not blocking)
  const formalTransitions = ['furthermore', 'additionally', 'moreover', 'subsequently', 'in conclusion', 'to summarise', 'in summary'];
  for (const transition of formalTransitions) {
    if (summary.toLowerCase().includes(transition)) {
      issues.push(`Contains formal transition: "${transition}"`);
    }
  }

  // Check for contractions (good sign)
  const contractions = ['it\'s', 'you\'ll', 'that\'s', 'here\'s', 'don\'t', 'won\'t', 'can\'t', 'doesn\'t', 'isn\'t', 'aren\'t', 'we\'re', 'they\'re'];
  const hasContractions = contractions.some(c => summary.toLowerCase().includes(c));
  if (!hasContractions) {
    issues.push('No contractions found - may sound too formal');
  }

  // Check for attribution
  const hasAuthorMention = author && author !== 'Unknown' && summary.toLowerCase().includes(author.toLowerCase());
  const hasSourceMention = sourceName && summary.toLowerCase().includes(sourceName.toLowerCase());
  if (!hasAuthorMention && !hasSourceMention) {
    issues.push('Missing attribution to author or source');
  }

  // Check word count
  const wordCount = summary.split(/\s+/).length;
  if (wordCount < 120) {
    issues.push(`Summary too short: ${wordCount} words (target: 150-180)`);
  } else if (wordCount > 220) {
    issues.push(`Summary too long: ${wordCount} words (target: 150-180)`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ─── Process a Single Job ─────────────────────────────────────────────
async function processOneJob(job: { id: string; content_id: string; retry_count: number }): Promise<{ success: boolean; title?: string }> {
  const jobStartTime = Date.now();

  if (job.retry_count > 0) {
    log.info(`Processing retry attempt ${job.retry_count} for job ${job.id}`, {
      jobId: job.id,
      contentId: job.content_id,
      retryCount: job.retry_count,
    });
  }

  // Fetch content item with source information
  const { data: item, error: itemErr } = await sb
    .from('content_items')
    .select('id, title, url, content, author, source_id')
    .eq('id', job.content_id)
    .single();

  if (itemErr || !item) {
    await markJobError(job.id, itemErr?.message ?? 'item not found', job.content_id, 'content_fetch');
    return { success: false };
  }

  // Fetch source name
  let sourceName = '';
  if (item.source_id) {
    const { data: sourceData } = await sb
      .from('content_sources')
      .select('name')
      .eq('id', item.source_id)
      .single();
    sourceName = sourceData?.name || '';
  }

  log.info(`Content attribution info:`, {
    jobId: job.id,
    contentId: job.content_id,
    title: item.title,
    author: item.author || 'Unknown',
    source: sourceName || 'Unknown',
  });

  // Scrape content if needed
  let content = (item.content ?? '').trim();
  if (!content && item.url) {
    try {
      const html = await (await fetch(item.url)).text();
      content = cleanText(extractMainContent(html, item.url));
    } catch (e: any) {
      await markJobError(job.id, `Scraping failed: ${e.message}`, job.content_id, 'web_scraping');
      return { success: false };
    }
  }

  if (content.length < 100) {
    await markJobError(job.id, 'No usable content', job.content_id, 'content_validation');
    return { success: false };
  }

  // ── 1. Generate Podcast-Style Summary ─────────────────────────────
  let summary = '';
  let keyInsights: string[] = [];
  const chatStartTime = Date.now();

  try {
    const { choices } = await retryWithBackoff(
      () => openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        temperature: 0.75,
        messages: [
          {
            role: 'system',
            content: SUMMARY_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Create a podcast-style audio summary for this article. Write for the ear, not the eye—this will be spoken aloud by a TTS system.

Article Title: ${item.title}
Article URL: ${item.url}
Author: ${item.author || 'Unknown'}
Source: ${sourceName || 'Unknown'}

Article Content:
${content.slice(0, 12000)}

IMPORTANT REMINDERS:
- Use contractions naturally throughout (it's, you'll, here's, don't)
- Start with a hook, NOT the article title or "This article discusses..."
- Include attribution to ${item.author || sourceName || 'the source'} at least twice
- Vary sentence length for natural rhythm
- Write like you're explaining this to a smart friend
- Keep it 150-180 words total`,
          },
        ],
      }),
      4,
      1500,
      'OpenAI Chat Completion',
    );

    const responseText = choices[0].message.content?.trim() || '';

    // Parse JSON response
    let response;
    try {
      response = JSON.parse(responseText);
    } catch (_parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse JSON response from OpenAI');
      }
    }

    summary = response.summary || '';
    keyInsights = response.keyInsights || [];

    summary = enhanceForSpeech(summary);

    const validation = validateSummaryQuality(summary, item.author || '', sourceName);
    if (validation.issues.length > 0) {
      log.warn(`Summary quality issues for job ${job.id}:`, {
        jobId: job.id,
        issues: validation.issues,
        summaryPreview: `${summary.substring(0, 200)}...`,
      });
    }

    const chatDuration = Date.now() - chatStartTime;
    log.success(`OpenAI Chat Completion completed in ${chatDuration}ms`, {
      jobId: job.id,
      contentId: job.content_id,
      summaryLength: summary.length,
      wordCount: summary.split(/\s+/).length,
      insightsCount: keyInsights.length,
      qualityIssues: validation.issues.length,
    });
  } catch (e: any) {
    await markJobError(job.id, `OpenAI summary failed: ${e.message}`, job.content_id, 'openai_chat_completion');
    return { success: false };
  }

  // ── 2. Generate Unsplash Image ────────────────────────────────────
  let imageUrl: string | null = null;
  let queryUsed: string | null = null;
  const unsplashKey = Deno.env.get('UNSPLASH_ACCESS_KEY');

  if (unsplashKey) {
    try {
      const imageQueryStartTime = Date.now();

      const { choices: queryChoices } = await retryWithBackoff(
        () => openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates short, effective search queries for finding photography on Unsplash. Return only the query text, nothing else.',
            },
            {
              role: 'user',
              content: `Create a short Unsplash search query based on this content.

Title: "${item.title}"
Summary: "${summary.substring(0, 500)}"

Rules:
- 1–5 words maximum
- Use concrete, real-world nouns
- Photography concepts only
- Avoid abstract words like "innovation" or "success"
- Avoid images of people unless clearly relevant

Return only the query.`,
            },
          ],
        }),
        2,
        800,
        'Unsplash Query Generation',
      );

      const unsplashQuery = queryChoices[0].message.content?.trim() || '';
      queryUsed = unsplashQuery;

      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&orientation=landscape&content_filter=high&per_page=5&client_id=${unsplashKey}`;
      const unsplashResp = await retryWithBackoff(() => fetch(unsplashUrl), 2, 800, 'Unsplash API');

      if (unsplashResp.ok) {
        const unsplashData = await unsplashResp.json();
        if (unsplashData.results?.length > 0) {
          imageUrl = unsplashData.results[0].urls?.regular || null;
          const imageQueryDuration = Date.now() - imageQueryStartTime;
          log.success(`Unsplash image fetched in ${imageQueryDuration}ms`, {
            jobId: job.id,
            query: unsplashQuery,
            found: !!imageUrl,
          });
        } else {
          log.warn(`No Unsplash results for query: ${unsplashQuery}`);
        }
      } else {
        const errorText = await unsplashResp.text();
        log.warn(`Unsplash API error: ${unsplashResp.status} ${errorText}`);
      }
    } catch (e: any) {
      log.warn(`Unsplash image generation failed (non-critical): ${e.message}`);
    }
  } else {
    log.info(`UNSPLASH_ACCESS_KEY not configured, skipping image generation`);
  }

  // ── 3. Text-to-Speech ─────────────────────────────────────────────
  let audioBuf: ArrayBuffer;
  const ttsStartTime = Date.now();

  try {
    const ttsResp = await retryWithBackoff(
      () => fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('OPENAI_KEY')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          input: summary,
          voice: DEFAULT_VOICE,
          instructions: TTS_SYSTEM_PROMPT,
          response_format: 'mp3',
        }),
      }),
      2,
      800,
      'OpenAI TTS',
    );

    if (!ttsResp.ok) {
      const txt = await ttsResp.text();
      await markJobError(job.id, `TTS failed: ${ttsResp.status} ${txt}`, job.content_id, 'openai_tts');
      return { success: false };
    }

    audioBuf = await ttsResp.arrayBuffer();
    const ttsDuration = Date.now() - ttsStartTime;
    log.success(`OpenAI TTS completed in ${ttsDuration}ms`, {
      jobId: job.id,
      audioSizeBytes: audioBuf.byteLength,
      voice: DEFAULT_VOICE,
    });
  } catch (e: any) {
    await markJobError(job.id, `TTS conversion error: ${e.message}`, job.content_id, 'openai_tts');
    return { success: false };
  }

  // ── 4. Upload & Save ──────────────────────────────────────────────
  const fileName = `${crypto.randomUUID()}.mp3`;
  const { error: uploadErr } = await sb.storage
    .from('audio')
    .upload(fileName, new Uint8Array(audioBuf), { contentType: 'audio/mpeg' });

  if (uploadErr) {
    await markJobError(job.id, `Upload failed: ${uploadErr.message}`, job.content_id, 'file_upload');
    return { success: false };
  }

  const { data: urlData, error: urlErr } = sb.storage.from('audio').getPublicUrl(fileName);
  if (urlErr) {
    await markJobError(job.id, `Public URL error: ${urlErr.message}`, job.content_id, 'file_url_generation');
    return { success: false };
  }

  // Save summary, insights, image, and audio
  await sb
    .from('content_items')
    .update({
      summary,
      key_insights: keyInsights,
      image_url: imageUrl,
      query_used: queryUsed,
    })
    .eq('id', item.id);

  await sb.from('audio_files').insert({
    content_id: item.id,
    file_url: urlData.publicUrl,
    format: 'mp3',
    type: 'summary',
  });

  await markJobDone(job.id);

  const totalDuration = Date.now() - jobStartTime;
  log.success(`Job completed successfully in ${totalDuration}ms`, {
    jobId: job.id,
    contentId: job.content_id,
    title: item.title,
    totalDuration,
    hasImage: !!imageUrl,
    wordCount: summary.split(/\s+/).length,
  });

  return { success: true, title: item.title };
}

// ─── Main Handler ─────────────────────────────────────────────────────
Deno.serve(async () => {
  const batchStartTime = Date.now();

  try {
    // Fetch a batch of pending jobs, newest first so recent content gets audio sooner
    const { data: jobs, error: jobsError } = await sb
      .from('llm_jobs')
      .select('id, content_id, retry_count')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(BATCH_SIZE);

    if (jobsError) {
      return new Response(`Error fetching jobs: ${jobsError.message}`, { status: 500 });
    }

    if (!jobs?.length) {
      return new Response('idle');
    }

    log.info(`Starting batch of ${jobs.length} jobs`, {
      jobIds: jobs.map(j => j.id),
      batchSize: BATCH_SIZE,
    });

    // Mark all jobs as 'running' with started_at to prevent duplicate pickup
    // and allow zombie detection via reset_stale_llm_jobs
    const jobIds = jobs.map(j => j.id);
    const { error: updateError } = await sb
      .from('llm_jobs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .in('id', jobIds);

    if (updateError) {
      log.error('Failed to mark jobs as running:', updateError);
      return new Response(`Error marking jobs: ${updateError.message}`, { status: 500 });
    }

    // Process all jobs concurrently
    const results = await Promise.allSettled(jobs.map(job => processOneJob(job)));

    // Summarize results
    let succeeded = 0;
    let failed = 0;
    const titles: string[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        succeeded++;
        if (result.value.title) {
          titles.push(result.value.title);
        }
      } else {
        failed++;
      }
    }

    const totalDuration = Date.now() - batchStartTime;
    log.success(`Batch completed in ${totalDuration}ms: ${succeeded} succeeded, ${failed} failed`, {
      succeeded,
      failed,
      totalDuration,
      titles,
    });

    return new Response(
      JSON.stringify({ processed: succeeded, failed, duration: totalDuration }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    log.error(`Critical error: ${err.message}`);
    return new Response(`Critical error: ${err.message}`, { status: 500 });
  }
});

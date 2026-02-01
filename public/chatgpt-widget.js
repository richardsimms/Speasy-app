/**
 * Speasy ChatGPT Widget
 * Reads from window.openai.toolOutput and renders content cards
 */

(function () {
  'use strict';

  const root = document.getElementById('speasy-root');
  if (!root) {
    console.error('[Speasy] No root element found');
    return;
  }

  // Get data from ChatGPT widget runtime
  const toolOutput = window.openai?.toolOutput;
  const toolMeta = window.openai?.toolResponseMetadata;

  if (!toolOutput) {
    root.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:200px;color:#888;">
        <div style="text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎧</div>
          <div>Loading content...</div>
        </div>
      </div>
    `;
    return;
  }

  // Helper functions
  function formatDuration(seconds) {
    if (!seconds || seconds <= 0) {
      return null;
    }
    return `${Math.round(seconds / 60)} min`;
  }

  function formatCategoryName(name) {
    if (!name) {
      return '';
    }
    const upper = ['ai', 'ux', 'ui', 'api', 'css', 'html'];
    if (upper.includes(name.toLowerCase())) {
      return name.toUpperCase();
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  function escapeHtml(text) {
    if (!text) {
      return '';
    }
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Render content list
  function renderContentList(items, metadata) {
    const categoryName = metadata?.category_name || 'Latest';
    const totalItems = items?.length || 0;
    const totalDuration = items?.reduce((sum, item) => {
      const d = item.audio_files?.[0]?.duration;
      return sum + (d || 0);
    }, 0) || 0;
    const durationMin = Math.round(totalDuration / 60);

    const subtitle = durationMin > 0
      ? `${totalItems} stories · ${durationMin} min listening`
      : `${totalItems} stories ready to play`;

    const playlistUrl = categoryName === 'Latest'
      ? 'https://www.speasy.app/latest?autoplay=true'
      : `https://www.speasy.app/category/${categoryName.toLowerCase()}?autoplay=true`;

    let html = `
      <div class="speasy-card">
        <div class="speasy-header">
          <span class="speasy-icon">🎧</span>
          <span>${escapeHtml(formatCategoryName(categoryName))} Content</span>
        </div>
        <div class="speasy-subtitle">${escapeHtml(subtitle)}</div>
        <div class="speasy-divider"></div>
        <div class="speasy-list">
    `;

    for (const item of (items || []).slice(0, 10)) {
      const duration = formatDuration(item.audio_files?.[0]?.duration);
      const category = item.category?.name;
      const source = item.source_name || '';
      const author = item.author;
      const sourceLine = author && author !== source
        ? (source ? `${source} · ${author}` : author)
        : source;

      html += `
        <a href="https://www.speasy.app/content/${item.id}" target="_blank" class="speasy-item">
          <img 
            src="${escapeHtml(item.image_url || 'https://www.speasy.app/poster.png')}" 
            alt="${escapeHtml(item.title)}"
            class="speasy-thumb"
          />
          <div class="speasy-item-content">
            <div class="speasy-meta">
              ${category ? `<span class="speasy-badge">${escapeHtml(formatCategoryName(category))}</span>` : ''}
              ${duration ? `<span class="speasy-duration">⏱️ ${duration}</span>` : ''}
            </div>
            <div class="speasy-title">${escapeHtml(item.title)}</div>
            <div class="speasy-source">${escapeHtml(sourceLine || 'Speasy')}</div>
          </div>
        </a>
      `;
    }

    html += `
        </div>
        <div class="speasy-divider"></div>
        <a href="${escapeHtml(playlistUrl)}" target="_blank" class="speasy-play-all">
          ▶ Play All
        </a>
      </div>
    `;

    return html;
  }

  // Render single content detail
  function renderContentDetail(item) {
    const duration = formatDuration(item.audio_files?.[0]?.duration);
    const category = item.category?.name;
    const source = item.source_name || '';
    const author = item.author;
    const sourceLine = author && author !== source
      ? (source ? `${source} · ${author}` : author)
      : source;

    let html = `
      <div class="speasy-card">
        <div class="speasy-header">
          <span class="speasy-icon">🎧</span>
          <span>Content Detail</span>
        </div>
        <img 
          src="${escapeHtml(item.image_url || 'https://www.speasy.app/poster.png')}" 
          alt="${escapeHtml(item.title)}"
          class="speasy-hero"
        />
        <div class="speasy-meta" style="margin-top:12px;">
          ${category ? `<span class="speasy-badge">${escapeHtml(formatCategoryName(category))}</span>` : ''}
          ${duration ? `<span class="speasy-duration">⏱️ ${duration}</span>` : ''}
        </div>
        <h2 class="speasy-detail-title">${escapeHtml(item.title)}</h2>
        <div class="speasy-source">${escapeHtml(sourceLine || 'Speasy')}</div>
    `;

    if (item.summary) {
      html += `
        <div class="speasy-divider"></div>
        <p class="speasy-summary">${escapeHtml(item.summary)}</p>
      `;
    }

    if (item.key_insights?.length > 0) {
      html += `
        <div class="speasy-divider"></div>
        <div class="speasy-insights-label">Key Insights</div>
        <ul class="speasy-insights">
          ${item.key_insights.slice(0, 3).map(i => `<li>${escapeHtml(i)}</li>`).join('')}
        </ul>
      `;
    }

    html += `
        <div class="speasy-divider"></div>
        <a href="https://www.speasy.app/content/${item.id}" target="_blank" class="speasy-play-all">
          ▶ Play Now
        </a>
      </div>
    `;

    return html;
  }

  // Determine what type of content we have and render
  let html = '';

  if (toolOutput.items && Array.isArray(toolOutput.items)) {
    // Wrapped list with metadata (standard format from structuredContent)
    const metadata = {
      category_name: toolOutput.category || toolMeta?.category_name || 'Latest',
      total_items: toolOutput.count || toolOutput.items.length,
      ...toolMeta,
    };
    html = renderContentList(toolOutput.items, metadata);
  } else if (Array.isArray(toolOutput)) {
    // Legacy: direct array (shouldn't happen with new format)
    html = renderContentList(toolOutput, toolMeta);
  } else if (toolOutput.id && toolOutput.title) {
    // Single item detail
    html = renderContentDetail(toolOutput);
  } else {
    // Unknown format, show raw
    html = `<pre style="font-size:12px;overflow:auto;">${escapeHtml(JSON.stringify(toolOutput, null, 2))}</pre>`;
  }

  root.innerHTML = html;
})();

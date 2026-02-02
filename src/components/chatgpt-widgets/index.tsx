import { createRoot } from 'react-dom/client';
import { ContentListWidget } from './content-list';

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const root = document.getElementById('speasy-root');
  if (root) {
    createRoot(root).render(<ContentListWidget />);
  } else {
    console.error('Speasy: Root element #speasy-root not found');
  }
}

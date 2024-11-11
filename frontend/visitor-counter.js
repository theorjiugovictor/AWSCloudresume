// This will be replaced by the GitHub Action with the actual API URL
const API_URL = '<YOUR_API_GATEWAY_INVOKE_URL>';

async function fetchVisitorCount() {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const visitorCount = typeof data === 'number' ? data : data.count;
    document.getElementById('visitor-count').textContent = `Visitor count: ${visitorCount}`;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    document.getElementById('visitor-count').textContent = 'Error loading visitor count';
  }
}

// Add retry logic
async function initVisitorCounter(maxRetries = 3) {
  let retryCount = 0;
  const retryDelay = (attempt) => Math.min(1000 * Math.pow(2, attempt), 5000);

  while (retryCount < maxRetries) {
    try {
      await fetchVisitorCount();
      break;
    } catch (error) {
      retryCount++;
      if (retryCount === maxRetries) {
        console.error('Max retries reached:', error);
        document.getElementById('visitor-count').textContent = 'Service temporarily unavailable';
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay(retryCount)));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => initVisitorCounter());
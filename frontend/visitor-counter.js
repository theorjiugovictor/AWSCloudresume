// visitor-counter.js

// This will be replaced by the GitHub Action with the actual API URL
const API_URL = '<YOUR_API_GATEWAY_INVOKE_URL>';

async function fetchVisitorCount() {
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const visitorCount = typeof data === 'number' ? data : data.count;

		// Update just the count number, since your HTML already has the surrounding text
		const countElement = document.getElementById('visitor-count');
		if (countElement) {
			countElement.textContent = visitorCount;
		} else {
			console.error('Visitor count element not found');
		}
	} catch (error) {
		console.error('Error fetching visitor count:', error);
		const countElement = document.getElementById('visitor-count');
		if (countElement) {
			countElement.textContent = 'Error loading visitor count';
		}
	}
}

// Add retry logic with exponential backoff
async function initVisitorCounter(maxRetries = 3) {
	let retryCount = 0;
	const retryDelay = (attempt) => Math.min(1000 * Math.pow(2, attempt), 5000);

	while (retryCount < maxRetries) {
		try {
			await fetchVisitorCount();
			break;
		} catch (error) {
			retryCount++;
			console.error(`Attempt ${retryCount} failed:`, error);

			if (retryCount === maxRetries) {
				console.error('Max retries reached');
				const countElement = document.getElementById('visitor-count');
				if (countElement) {
					countElement.textContent = 'Service temporarily unavailable';
				}
				break;
			}

			// Wait before retrying
			await new Promise((resolve) =>
				setTimeout(resolve, retryDelay(retryCount))
			);
		}
	}
}

// Initialize the counter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('Initializing visitor counter...');
	initVisitorCounter();
});

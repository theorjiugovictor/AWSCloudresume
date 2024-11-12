// visitor-counter.js

// This will be replaced by the actual API Gateway URL from your Terraform output
const API_URL =
	'https://3i7vlq6kk0.execute-api.us-east-1.amazonaws.com/dev/count';

async function fetchVisitorCount() {
	try {
		// First try to GET the current count
		const getResponse = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!getResponse.ok) {
			throw new Error(`HTTP error! status: ${getResponse.status}`);
		}

		const getData = await getResponse.json();

		// Then increment the count with a POST request
		const postResponse = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ action: 'increment' }),
		});

		if (!postResponse.ok) {
			throw new Error(`HTTP error! status: ${postResponse.status}`);
		}

		const postData = await postResponse.json();

		// Use the updated count from the POST response
		const visitorCount = postData.count || postData;

		const countElement = document.getElementById('visitor-count');
		if (countElement) {
			countElement.textContent = visitorCount.toLocaleString(); // Format large numbers
		} else {
			console.error('Visitor count element not found');
		}
	} catch (error) {
		console.error('Error fetching visitor count:', error);
		const countElement = document.getElementById('visitor-count');
		if (countElement) {
			countElement.textContent = 'Error loading count';
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
			console.log(`Attempt ${retryCount} failed:`, error);

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

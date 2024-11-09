// script.js

// JavaScript to dynamically update the visitor count
// For now, we'll use a static number as a placeholder
const visitorCount = 12345; // This number can be fetched from a server-side script
document.getElementById('visitorCount').textContent = visitorCount;

async function fetchRSSFeed() {
	const rssUrl = 'https://theorjiugovictor.substack.com/feed'; // Replace with your actual RSS feed URL
	const response = await fetch(
		`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
	);
	const data = await response.json();

	// Check if the response is okay and contains items
	if (data.status === 'ok') {
		const postsContainer = document.getElementById('posts-container');

		// Loop through the RSS feed items and display them
		data.items.forEach((item) => {
			const postElement = document.createElement('div');
			postElement.className = 'blog-post';
			postElement.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.pubDate}</p>
                <p>${item.description}</p>
            `;
			postsContainer.appendChild(postElement);
		});
	} else {
		console.error('Failed to load RSS feed');
	}
}

// Call the function to fetch and display the RSS feed
fetchRSSFeed();

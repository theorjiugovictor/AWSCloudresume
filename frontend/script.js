// script.js
async function fetchRSSFeed() {
    const rssUrl = 'https://theorjiugovictor.substack.com/feed';
    const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );
    const data = await response.json();

    if (data.status === 'ok') {
        const postsContainer = document.getElementById('posts-container');

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
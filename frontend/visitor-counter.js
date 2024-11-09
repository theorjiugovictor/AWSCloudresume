function fetchVisitorCount() {
	fetch('<YOUR_API_GATEWAY_INVOKE_URL>/count', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  }
	})
	.then(response => response.json())
	.then(data => {
	  document.getElementById('visitor-count').textContent = `Visitor count: ${data}`;
	})
	.catch(error => {
	  console.error('Error fetching visitor count:', error);
	  document.getElementById('visitor-count').textContent = 'Error loading visitor count';
	});
  }
  
  document.addEventListener('DOMContentLoaded', fetchVisitorCount);

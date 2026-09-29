const axios = require('axios');

async function searchPerfume(userQuery) {
    try {
        // Replace 'YOUR_SERPER_API_KEY' with your actual key from serper.dev
        const response = await axios.post('https://google.serper.dev/search', {
            q: userQuery,
            gl: "us",
            hl: "en",
            autocorrect: true
        }, {
            headers: { 
                'X-API-KEY': 'YOUR_SERPER_API_KEY', 
                'Content-Type': 'application/json' 
            }
        });

        const firstResult = response.data.organic[0];
        const firstImage = firstResult.imageUrl || "https://placeholder.com/perfume.jpg";
        const snippet = firstResult.snippet;

        console.log("--- RESULTS FOUND ---");
        console.log("Details:", snippet);
        console.log("Image URL:", firstImage);

        return { details: snippet, image: firstImage };
    } catch (error) {
        console.error("Search failed:", error.message);
    }
}

// Test it by running: node search-tool.js
searchPerfume("Xerjoff Alexandria II perfume notes and official photo");
// Background service worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'solve_challenge') {
        handleSolve(request.data, sendResponse);
        return true; // Keep the message channel open for async response
    }
});

async function handleSolve(problemData, sendResponse) {
    try {
        const { geminiApiKey } = await chrome.storage.local.get('geminiApiKey');

        if (!geminiApiKey) {
            sendResponse({ error: 'API Key not found. Please set it in the extension popup.' });
            return;
        }

        const prompt = `
      You are an expert coding assistant.
      Solve the following coding challenge in ${problemData.language || 'Python'}.
      
      Title: ${problemData.title}
      
      Description:
      ${problemData.description}
      
      Provide ONLY the code solution. Do not include markdown formatting (like \`\`\`python) or explanations, just the raw code.
      Add comments to explain the complex parts.
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        const solution = data.candidates[0].content.parts[0].text.trim();

        // Clean up if the model returned markdown blocks despite instructions
        const cleanSolution = solution.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

        sendResponse({ solution: cleanSolution });

    } catch (error) {
        console.error('API Error:', error);
        sendResponse({ error: error.message });
    }
}

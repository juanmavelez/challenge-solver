console.log("Challenge Solver Content Script Active");

function getSelectors() {
    // Selectors for LeetCode
    // Note: These classes might change over time.
    return {
        title: 'div.text-title-large, [data-cy="question-title"]',
        description: 'div.elfjS, [data-track-load="description_content"]',
        submitBtn: 'button[aria-label="Submit"]',
        // Fallback for injection if submit button isn't found immediately
        actionContainer: '.flex.gap-2.items-center'
    };
}

function createSolveButton() {
    const btn = document.createElement('button');
    btn.innerText = '⚡ Solve with AI';
    btn.className = 'cs-solve-btn';
    btn.style.marginLeft = '10px';
    btn.style.backgroundColor = '#6e45e2'; // Distinct color
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '5px 12px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '600';

    btn.onclick = handleSolveClick;
    return btn;
}

function injectButton() {
    const selectors = getSelectors();
    const submitBtn = document.querySelector(selectors.submitBtn);

    // Prevent multiple injections
    if (document.querySelector('.cs-solve-btn')) return;

    if (submitBtn && submitBtn.parentElement) {
        const btn = createSolveButton();
        // Inject before the submit button or after it
        submitBtn.parentElement.appendChild(btn);
        console.log("Solve button injected next to Submit button.");
    } else {
        // Retry if not found yet (SPA navigation)
        // console.log("Submit button not found, retrying...");
    }
}

// Observer to handle SPA navigation and dynamic loading
const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('.cs-solve-btn')) {
        injectButton();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

async function handleSolveClick() {
    const btn = document.querySelector('.cs-solve-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Thinking...';
    btn.disabled = true;

    try {
        const problemData = scrapeProblem();
        if (!problemData) {
            alert("Could not find problem data. Please ensure you are on a problem description page.");
            return;
        }

        // Send to background script
        const response = await chrome.runtime.sendMessage({
            action: 'solve_challenge',
            data: problemData
        });

        if (response.error) {
            alert('Error: ' + response.error);
        } else {
            displaySolution(response.solution);
        }

    } catch (err) {
        console.error(err);
        alert('An error occurred: ' + err.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function scrapeProblem() {
    const selectors = getSelectors();
    const titleEl = document.querySelector(selectors.title);
    const descEl = document.querySelector(selectors.description);

    if (!titleEl || !descEl) {
        console.error("Scraping failed", { title: !!titleEl, desc: !!descEl });
        return null;
    }

    return {
        title: titleEl.innerText,
        description: descEl.innerText,
        url: window.location.href,
        language: "Python" // specific language could be detected later
    };
}

function displaySolution(solutionCode) {
    let panel = document.getElementById('cs-solution-panel');

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'cs-solution-panel';
        panel.className = 'cs-panel';
        document.body.appendChild(panel);
    }

    panel.innerHTML = `
    <div class="cs-panel-header">
      <span>AI Solution</span>
      <div>
        <button id="cs-copy-btn" style="padding: 4px 8px; margin-right: 5px; cursor: pointer;">Copy</button>
        <button id="cs-close-btn" style="padding: 4px 8px; cursor: pointer;">Close</button>
      </div>
    </div>
    <div class="cs-panel-content">
      <pre><code>${escapeHtml(solutionCode)}</code></pre>
    </div>
  `;

    document.getElementById('cs-close-btn').onclick = () => panel.remove();
    document.getElementById('cs-copy-btn').onclick = () => {
        navigator.clipboard.writeText(solutionCode);
        document.getElementById('cs-copy-btn').innerText = 'Copied!';
        setTimeout(() => document.getElementById('cs-copy-btn').innerText = 'Copy', 2000);
    };
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

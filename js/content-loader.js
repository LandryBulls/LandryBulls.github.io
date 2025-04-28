async function loadContent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            const blocks = text.trim().split(/\r?\n\r?\n/);
            const htmlContent = blocks.map(block => {
                const lines = block.split(/\r?\n/).filter(line => line.trim() !== ''); // Split block into lines, ignore empty ones
                const isList = lines.length > 0 && lines.every(line => line.trim().startsWith('*'));

                if (isList) {
                    const listItems = lines.map(line => {
                        // Remove leading '*' and trim whitespace
                        const itemContent = line.trim().substring(1).trim();
                        // Handle potential <b> tags within list items
                        return `<li>${itemContent.replace(/<b>(.*?)<\/b>/g, '<b>$1</b>')}</li>`;
                    }).join('');
                    return `<ul>${listItems}</ul>`;
                } else {
                    // Handle potential <b> tags within the paragraph block
                    // Important: Process the whole block, not line by line for paragraphs
                    const paragraphContent = block.replace(/<b>(.*?)<\/b>/g, '<b>$1</b>');
                    // Replace single newlines within a block with <br> for display
                    return `<p>${paragraphContent.replace(/\r?\n/g, '<br>')}</p>`;
                }
            }).join('');
            element.innerHTML = htmlContent;
        } else {
            console.error(`Element with ID ${elementId} not found.`);
        }
    } catch (error) {
        console.error(`Could not load content from ${filePath}:`, error);
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<p>Error loading content.</p>';
        }
    }
} 
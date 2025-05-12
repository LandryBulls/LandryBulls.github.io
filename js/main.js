document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade in sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Add hover effect to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });

    if (window.location.pathname.includes('publications.html')) {
        renderPublications();
    }
});

function contentToHtml(text) {
    return text
      .split('\n\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('')
  }

// Function to create a publication card
function createPublicationCard(publication) {
    const card = document.createElement('div');
    card.className = 'publication-item';

    const title = document.createElement('div');
    title.className = 'publication-title';
    title.textContent = publication.title;

    const authors = document.createElement('div');
    authors.className = 'publication-authors';
    // Bold the author's name in various formats
    const authorText = publication.authors.replace(
        /(Bulls, L\.|Bulls, L\. S\.|Bulls, Landry|Landry Bulls|Landry S Bulls|Bulls, Landry S\.?)/g, 
        '<strong>$1</strong>'
    );
    authors.innerHTML = authorText;

    const venue = document.createElement('div');
    venue.className = 'publication-venue';
    venue.textContent = `${publication.venue} (${publication.year})`;

    card.appendChild(title);
    card.appendChild(authors);
    card.appendChild(venue);

    // Add links if they exist
    if (publication.links && Object.keys(publication.links).length > 0) {
        const links = document.createElement('div');
        links.className = 'publication-links';
        
        for (const [type, url] of Object.entries(publication.links)) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            link.target = '_blank';
            links.appendChild(link);
        }
        
        card.appendChild(links);
    }

    return card;
}

// Function to render all publications
function renderPublications() {
    const sections = {
        'journalArticles': 'Journal Articles',
        'conferencePresentation': 'Conference Presentations',
        'conferenceProceedings': 'Conference Proceedings',
        'posters': 'Posters'
    };

    const mainSection = document.querySelector('.section');
    if (!mainSection) return;

    // Clear existing content except the main heading
    const heading = mainSection.querySelector('h1');
    mainSection.innerHTML = '';
    if (heading) mainSection.appendChild(heading);

    // Render each section
    for (const [sectionKey, sectionTitle] of Object.entries(sections)) {
        if (publications[sectionKey] && publications[sectionKey].length > 0) {
            const sectionHeading = document.createElement('h2');
            sectionHeading.innerHTML = `<strong>${sectionTitle}</strong>`;
            mainSection.appendChild(sectionHeading);

            // Sort publications by year (most recent first)
            const sortedPubs = [...publications[sectionKey]].sort((a, b) => b.year - a.year);
            
            sortedPubs.forEach(pub => {
                mainSection.appendChild(createPublicationCard(pub));
            });
        }
    }
}

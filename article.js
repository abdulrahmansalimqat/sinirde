document.addEventListener('DOMContentLoaded', () => {
    // Need a tiny delay to ensure translations and language are set by script.js
    setTimeout(renderArticle, 50);

    // If the language is changed from the navbar, redirect back to the blog index
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'lang') {
                window.location.href = 'blog.html';
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});

function renderArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const currentLang = document.documentElement.lang || 'ar';
    const t = typeof translations !== 'undefined' ? translations[currentLang] : null;

    const titleContainer = document.getElementById('article-title-container');
    const bodyContainer = document.getElementById('article-body');

    const notFoundText = t && t.blog_not_found ? t.blog_not_found : "هذا المقال غير موجود.";

    if (!postId) {
        showError(notFoundText);
        return;
    }

    const posts = JSON.parse(localStorage.getItem('bpd_blog_posts')) || [];
    const article = posts.find(p => p.id === postId);

    if (!article) {
        showError(notFoundText);
        return;
    }

    // Set document title
    document.title = `${article.title} - ${t ? t.nav_logo.replace('<span>.</span>', '.') : 'مقامر.'}`;

    // Render Header
    titleContainer.innerHTML = `
        <div class="article-meta-top fade-in-up">
            <span class="card-lang">${article.lang.toUpperCase()}</span>
            <span>${article.date}</span>
        </div>
        <h1 class="article-title-huge fade-in-up delay-1">${article.title}</h1>
    `;

    // Render Sidebar
    const sidebarContainer = document.getElementById('article-sidebar');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <span class="sidebar-label">${t && t.dir === 'ltr' ? 'PUBLISHED' : 'تاريخ النشر'}</span>
            <span class="sidebar-value">${article.date}</span>
            <span class="sidebar-label">${t && t.dir === 'ltr' ? 'LANGUAGE' : 'لغة المقال'}</span>
            <span class="sidebar-value">${article.lang.toUpperCase()}</span>
        `;
    }

    // Render Content (Convert newlines to paragraphs for better reading experience)
    const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');
    const contentHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    
    bodyContainer.innerHTML = contentHTML;

    // Trigger animations
    if (typeof revealElements === 'function') {
        revealElements();
    }
}

function showError(msg) {
    const titleContainer = document.getElementById('article-title-container');
    const bodyContainer = document.getElementById('article-body');
    
    titleContainer.innerHTML = `<h1 class="brutalist-title fade-in-up">404</h1>`;
    bodyContainer.innerHTML = `<div class="empty-state"><h2>∅</h2><p>${msg}</p></div>`;
}

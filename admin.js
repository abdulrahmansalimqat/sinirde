const STORAGE_KEY = 'bpd_blog_posts';

// Session Check
if (sessionStorage.getItem('admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

// Elements
const form = document.getElementById('post-form');
const titleInput = document.getElementById('post-title');
const excerptInput = document.getElementById('post-excerpt');
const contentInput = document.getElementById('post-content');
const langInput = document.getElementById('post-lang');
const catInput = document.getElementById('post-category');
const idInput = document.getElementById('post-id');
const tbody = document.getElementById('posts-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Load Posts
function getPosts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    renderTable();
}

// Render Data Table
function renderTable() {
    const posts = getPosts();
    tbody.innerHTML = '';
    
    // Reverse sort for table
    posts.sort((a, b) => b.id - a.id).forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.date}</td>
            <td>${post.lang ? post.lang.toUpperCase() : 'AR'} - ${post.category || 'غير مصنف'}</td>
            <td class="actions-cell">
                <span class="action-link edit-link" data-id="${post.id}">تعديل</span>
                <span class="action-link delete-link" data-id="${post.id}" style="color: #ff6b6b;">حذف</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach Event Listeners to rendered buttons
    document.querySelectorAll('.edit-link').forEach(btn => {
        btn.addEventListener('click', (e) => editPost(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-link').forEach(btn => {
        btn.addEventListener('click', (e) => deletePost(e.target.dataset.id));
    });
}

// Handle Submit (Add or Edit)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const posts = getPosts();
    const isEditing = idInput.value !== '';
    
    if (isEditing) {
        // Update
        const index = posts.findIndex(p => p.id === idInput.value);
        if(index > -1) {
            posts[index].title = titleInput.value;
            posts[index].excerpt = excerptInput.value;
            posts[index].content = contentInput.value;
            posts[index].lang = langInput.value;
            posts[index].category = catInput.value;
            // Date remains original or can be updated
        }
    } else {
        // Create
        const newPost = {
            id: Date.now().toString(),
            title: titleInput.value,
            excerpt: excerptInput.value,
            content: contentInput.value,
            lang: langInput.value,
            category: catInput.value,
            date: new Date().toLocaleDateString('ar-EG')
        };
        posts.push(newPost);
    }

    savePosts(posts);
    resetForm();
});

// Edit Post (Load into form)
function editPost(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    idInput.value = post.id;
    titleInput.value = post.title;
    excerptInput.value = post.excerpt;
    contentInput.value = post.content;
    
    if (post.lang) {
        langInput.value = post.lang;
    } else {
        langInput.value = 'ar';
    }
    
    if (post.category) {
        catInput.value = post.category;
    } else {
        catInput.value = 'personal';
    }
    
    formTitle.textContent = 'تعديل المقال';
    submitBtn.textContent = 'حفظ التعديلات';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete Post
function deletePost(id) {
    if (confirm('هل أنت متأكد من حذف هذا المقال نهائياً؟')) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        savePosts(posts);
        
        // If we deleted what we are currently editing
        if (idInput.value === id) {
            resetForm();
        }
    }
}

// Reset Form to Add Mode
function resetForm() {
    form.reset();
    idInput.value = '';
    langInput.value = 'ar';
    catInput.value = 'personal';
    formTitle.textContent = 'إضافة مقال جديد';
    submitBtn.textContent = 'نشر المقال';
    cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Check if initialized from blog.js, if not initialize empty or dummy
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    renderTable();

    // Add Logout Button Functionality
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.className = 'hover-underline';
    logoutBtn.textContent = 'تسجيل الخروج';
    logoutBtn.style.color = '#ff6b6b';
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('admin_logged_in');
        window.location.href = 'login.html';
    });
    
    // Append to top right (or next to back links)
    const headerLinks = document.querySelector('.admin-header div');
    if(headerLinks) {
        headerLinks.appendChild(logoutBtn);
    }
});

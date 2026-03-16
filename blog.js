const STORAGE_KEY = 'bpd_blog_posts';

function generateSeededPosts() {
    const langs = ['ar', 'en', 'tr', 'es', 'ru', 'fa'];
    
    // We want exactly 10 posts per language, distributed across the 7 categories
    const templates = [
        { cat: 'personal', titles: { ar: 'بين النقيضين', en: 'Between Extremes', tr: 'Uçlar Arasında', es: 'Entre Extremos', ru: 'Между крайностями', fa: 'بین افراط‌ها' }, excerpts: { ar: 'كيف أعيش في عالم لا يعترف بالوسط؟', en: 'How I live in a world with no middle ground.', tr: 'Orta yolu olmayan bir dünyada nasıl yaşarım.', es: 'Cómo vivo en un mundo sin punto medio.', ru: 'Как я живу в мире без золотой середины.', fa: 'چگونه در دنیایی بدون حد وسط زندگی می‌کنم.' } },
        { cat: 'story', titles: { ar: 'الانهيار المفاجئ', en: 'The Sudden Collapse', tr: 'Ani Çöküş', es: 'El Colapso Repentino', ru: 'Внезапный крах', fa: 'فروپاشی ناگهانی' }, excerpts: { ar: 'قصة يوم بدأ مثالياً وانتهى في الظلام.', en: 'A story of a day that started perfectly and ended in darkness.', tr: 'Mükemmel başlayan ve karanlıkta biten bir günün hikayesi.', es: 'Una historia de un día que empezó perfecto y terminó en la oscuridad.', ru: 'История дня, который начался идеально и закончился во тьме.', fa: 'داستان روزی که عالی شروع شد و در تاریکی به پایان رسید.' } },
        { cat: 'scientific', titles: { ar: 'آلية عمل اللوزة الدماغية', en: 'How the Amygdala Works', tr: 'Amigdala Nasıl Çalışır', es: 'Cómo Funciona la Amígdala', ru: 'Как работает миндалевидное тело', fa: 'آمیگدال چگونه کار می کند' }, excerpts: { ar: 'لماذا نستجيب للخطر بشكل مفرط؟', en: 'Why we overreact to perceived threats.', tr: 'Neden algılanan tehditlere aşırı tepki veriyoruz.', es: 'Por qué reaccionamos exageradamente a las amenazas percibidas.', ru: 'Почему мы слишком остро реагируем на предполагаемые угрозы.', fa: 'چرا ما به تهدیدات درک شده واکنش بیش از حد نشان می دهیم.' } },
        { cat: 'advice', titles: { ar: 'التعامل مع الفراغ', en: 'Dealing with Emptiness', tr: 'Boşlukla Başa Çıkmak', es: 'Lidiando con el Vacío', ru: 'Справляться с пустотой', fa: 'مقابله با پوچی' }, excerpts: { ar: 'خطوات عملية لملء الفراغ الداخلي.', en: 'Practical steps to fill the inner void.', tr: 'İçsel boşluğu doldurmak için pratik adımlar.', es: 'Pasos prácticos para llenar el vacío interior.', ru: 'Практические шаги по заполнению внутренней пустоты.', fa: 'مراحل عملی برای پر کردن خلاء درونی.' } },
        { cat: 'gray', titles: { ar: 'قبول الرمادي', en: 'Embracing the Gray', tr: 'Griyi Kucaklamak', es: 'Abrazando el Gris', ru: 'Принятие серого', fa: 'در آغوش کشیدن خاکستری' }, excerpts: { ar: 'كيف نتعلم رؤية الألوان المتوسطة.', en: 'Learning to see the middle colors.', tr: 'Orta renkleri görmeyi öğrenmek.', es: 'Aprender a ver los colores medios.', ru: 'Учимся видеть средние цвета.', fa: 'یادگیری دیدن رنگ های میانی.' } },
        { cat: 'madness', titles: { ar: 'صدى الأفكار', en: 'Echo of Thoughts', tr: 'Düşüncelerin Yankısı', es: 'Eco de Pensamientos', ru: 'Эхо мыслей', fa: 'پژواک افکار' }, excerpts: { ar: 'عندما يصبح العقل مكانًا صاخبًا.', en: 'When the mind becomes a noisy place.', tr: 'Zihin gürültülü bir yer olduğunda.', es: 'Cuando la mente se convierte en un lugar ruidoso.', ru: 'Когда разум становится шумным местом.', fa: 'وقتی ذهن به مکانی پر سر و صدا تبدیل می شود.' } },
        { cat: 'love', titles: { ar: 'التعلق المفرط', en: 'Extreme Attachment', tr: 'Aşırı Bağlılık', es: 'Apego Extremo', ru: 'Крайняя привязанность', fa: 'دلبستگی شدید' }, excerpts: { ar: 'الخوف من الهجر وراء الحب الجارف.', en: 'Fear of abandonment behind overwhelming love.', tr: 'Ezici aşkın ardındaki terk edilme korkusu.', es: 'Miedo al abandono detrás del amor abrumador.', ru: 'Страх одиночества за всепоглощающей любовью.', fa: 'ترس از رها شدن در پس عشق طاقت فرسا.' } },
        { cat: 'personal', titles: { ar: 'المرآة المحطمة', en: 'The Shattered Mirror', tr: 'Kırık Ayna', es: 'El Espejo Roto', ru: 'Разбитое зеркало', fa: 'آینه شکسته' }, excerpts: { ar: 'صراعي مع اضطراب الهوية.', en: 'My struggle with identity disturbance.', tr: 'Kimlik bozukluğuyla mücadelem.', es: 'Mi lucha con la alteración de la identidad.', ru: 'Моя борьба с расстройством идентичности.', fa: 'مبارزه من با اختلال هویت.' } },
        { cat: 'story', titles: { ar: 'رسالة لم ترسل', en: 'Unsent Letter', tr: 'Gönderilmemiş Mektup', es: 'Carta No Enviada', ru: 'Неотправленное письмо', fa: 'نامه ارسال نشده' }, excerpts: { ar: 'لأن الكلمات كانت حادة كالزجاج.', en: 'Because the words were as sharp as glass.', tr: 'Çünkü sözler cam kadar keskin.', es: 'Porque las palabras eran afiladas como el cristal.', ru: 'Потому что слова были острыми, как стекло.', fa: 'چون کلمات مثل شیشه تیز بودند.' } },
        { cat: 'advice', titles: { ar: 'مهارات تنظيم المشاعر', en: 'Emotion Regulation Skills', tr: 'Duygu Düzenleme Becerileri', es: 'Habilidades de Regulación Emocional', ru: 'Навыки регуляции эмоций', fa: 'مهارت های تنظیم هیجان' }, excerpts: { ar: 'كيف توقف كرة الثلج قبل أن تكبر.', en: 'How to stop the snowball before it grows.', tr: 'Kar topunu büyümeden nasıl durdururuz.', es: 'Cómo detener la bola de nieve antes de que crezca.', ru: 'Как остановить снежный ком, пока он не вырос.', fa: 'چگونه گلوله برف را قبل از بزرگ شدن متوقف کنیم.' } }
    ];

    let generated = [];
    langs.forEach(lang => {
        templates.forEach((tpl, idx) => {
            generated.push({
                id: `${idx+1}_${lang}_dyn`,
                title: tpl.titles[lang],
                excerpt: tpl.excerpts[lang],
                content: tpl.excerpts[lang] + '\n\n' + "هذا مجرد نموذج لنص المقال الكامل. يمكن للمسؤول تعديله أو كتابة ما يريده بدلاً منه عبر لوحة التحكم.",
                lang: lang,
                category: tpl.cat,
                date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : (lang==='en'?'en-US':'en-US'))
            });
        });
    });
    return generated;
}

function initializeBlog() {
    let posts = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    // Clear old invalid structures if they exist (migration to i18n and categories structure)
    // Or if we don't have exactly 60 generated posts (10 per language)
    if (!posts || !Array.isArray(posts) || posts.length < 60 || !posts[0].category) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(generateSeededPosts()));
    }
}

// Global filter state
let currentCategoryFilter = 'all';

function renderBlogPosts() {
    const feed = document.getElementById('blog-feed');
    if (!feed) return; // Not on blog page

    const currentLang = document.documentElement.lang || 'ar';
    const allPosts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Filter posts for current language AND current category
    const posts = allPosts.filter(p => {
        if (p.lang !== currentLang) return false;
        if (currentCategoryFilter !== 'all' && p.category !== currentCategoryFilter) return false;
        return true;
    });

    feed.innerHTML = ''; // Clear existing
    
    // Get translations for UI elements
    const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
    const txtEmpty = t ? t.blog_empty : "لا توجد مقالات منشورة بهذه اللغة حالياً.";
    const txtReadMore = t ? t.blog_read_more : "اقرأ المزيد";

    if (posts.length === 0) {
        feed.innerHTML = `<div class="empty-state">
            <h2>∅</h2>
            <p>${txtEmpty}</p>
        </div>`;
        return;
    }

    // Render Posts as Cards
    posts.forEach((post, index) => {
        const card = document.createElement('a');
        card.href = `article.html?id=${post.id}`;
        card.className = 'blog-card fade-in-up delay-' + (index % 3 + 1);
        
        // Use translated category name for the card badge
        const catLabel = (t && t['cat_'+post.category]) ? t['cat_'+post.category] : post.category;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-date">${post.date}</span>
                <span class="card-lang">${catLabel.toUpperCase()}</span>
            </div>
            <h2 class="card-title">${post.title}</h2>
            <p class="card-excerpt">${post.excerpt}</p>
            <div class="card-footer">
                <span class="read-more-link">${txtReadMore} <span class="arrow">&rarr;</span></span>
            </div>
        `;

        feed.appendChild(card);
    });
    
    // Important: manually trigger reveals since we dynamically added HTML
    if (typeof revealElements === 'function') {
        setTimeout(revealElements, 50);
    }
}

function setupCategoryFilters() {
    const catButtons = document.querySelectorAll('.cat-btn');
    if (!catButtons.length) return;

    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            catButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            // Set global filter
            currentCategoryFilter = e.target.getAttribute('data-cat');
            
            // Re-render
            renderBlogPosts();
        });
    });
}

// Initialization Entry Point
document.addEventListener('DOMContentLoaded', () => {
    initializeBlog();
    renderBlogPosts();
    setupCategoryFilters();
    
    // Listen for language changes dynamically via DOM Observer 
    // since script.js changes documentElement.lang
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'lang') {
                renderBlogPosts();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});

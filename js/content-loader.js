/**
 * Content Loader for Decap CMS
 * Loads JSON content files and renders them into the page
 */

const ContentLoader = {
    // Load a single JSON file
    async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.warn('Could not load:', path);
            return null;
        }
    },

    // Load all JSON files from a folder using a manifest
    async loadCollection(folder) {
        try {
            const manifest = await this.loadJSON(`/content/${folder}/_manifest.json`);
            if (!manifest || !manifest.files) return [];
            const items = await Promise.all(
                manifest.files.map(file => this.loadJSON(`/content/${folder}/${file}`))
            );
            return items.filter(Boolean);
        } catch (e) {
            console.warn('Could not load collection:', folder);
            return [];
        }
    },

    // Load site settings
    async loadSettings(name) {
        return await this.loadJSON(`/content/settings/${name}.json`);
    },

    // Render news articles into a container
    async renderNews(containerId, limit) {
        const manifest = await this.loadJSON('/content/news/_manifest.json');
        if (!manifest) return;

        const articles = await Promise.all(
            manifest.files.map(f => this.loadJSON(`/content/news/${f}`))
        );
        const sorted = articles.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
        const items = limit ? sorted.slice(0, limit) : sorted;
        const container = document.getElementById(containerId);
        if (!container || items.length === 0) return;

        container.innerHTML = items.map((item, i) => {
            const date = new Date(item.date);
            const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            const colors = ['#ff4500', '#0066cc'];
            const color = colors[i % 2];

            return `
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
                    <div style="background:#fff;overflow:hidden;transition:transform 0.3s;" onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                        <div style="height:220px;overflow:hidden;position:relative;">
                            <img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;">
                            <div style="position:absolute;top:1rem;left:1rem;">
                                <span style="background:${color};color:#fff;padding:0.25rem 0.6rem;font-family:'Montserrat',sans-serif;font-size:0.6rem;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${item.category}</span>
                            </div>
                        </div>
                        <div style="padding:1.5rem;border-top:3px solid ${color};">
                            <div class="d-flex align-items-center mb-2" style="font-family:'Montserrat',sans-serif;font-size:0.7rem;color:#999;">
                                <i class="far fa-calendar me-1"></i> ${dateStr}
                            </div>
                            <h5 style="font-family:'Oswald',sans-serif;font-size:1rem;line-height:1.4;text-transform:uppercase;letter-spacing:1px;">${item.title}</h5>
                            <p style="font-family:'Montserrat',sans-serif;font-size:0.8rem;color:#888;line-height:1.6;margin-bottom:0;">${item.summary}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render coaches into a container
    async renderCoaches(containerId) {
        const manifest = await this.loadJSON('/content/coaches/_manifest.json');
        if (!manifest) return;

        const coaches = await Promise.all(
            manifest.files.map(f => this.loadJSON(`/content/coaches/${f}`))
        );
        const sorted = coaches.filter(Boolean).sort((a, b) => (a.order || 10) - (b.order || 10));
        const container = document.getElementById(containerId);
        if (!container || sorted.length === 0) return;

        const colors = ['#ff4500', '#0066cc'];
        container.innerHTML = sorted.filter(c => !c.featured).map((coach, i) => {
            const color = colors[i % 2];
            return `
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
                    <div style="background:#fff;overflow:hidden;transition:transform 0.3s;" onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                        <div style="height:300px;overflow:hidden;position:relative;">
                            <img src="${coach.photo}" alt="${coach.name}" style="width:100%;height:100%;object-fit:cover;">
                            <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(transparent,rgba(12,35,64,0.8));"></div>
                        </div>
                        <div style="padding:1.5rem;border-top:3px solid ${color};">
                            <h4 style="font-family:'Oswald',sans-serif;margin-bottom:0.25rem;font-size:1.2rem;text-transform:uppercase;letter-spacing:1px;">${coach.name}</h4>
                            <span style="font-family:'Montserrat',sans-serif;font-size:0.75rem;color:${color};text-transform:uppercase;letter-spacing:2px;font-weight:600;">${coach.role}</span>
                            <p class="mt-2 mb-2" style="font-family:'Montserrat',sans-serif;color:#888;font-size:0.8rem;line-height:1.6;">${coach.license}. ${coach.experience}.</p>
                            <div style="border-left:2px solid #eee;padding-left:0.75rem;margin-top:0.75rem;">
                                <p style="font-size:0.75rem;color:#aaa;font-style:italic;margin-bottom:0;">"${coach.quote}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render testimonials into an owl carousel
    async renderTestimonials(containerId) {
        const manifest = await this.loadJSON('/content/testimonials/_manifest.json');
        if (!manifest) return;

        const testimonials = await Promise.all(
            manifest.files.map(f => this.loadJSON(`/content/testimonials/${f}`))
        );
        const items = testimonials.filter(Boolean);
        const container = document.getElementById(containerId);
        if (!container || items.length === 0) return;

        container.innerHTML = items.map(t => `
            <div class="text-center px-3 px-lg-5">
                <p class="text-white mb-4" style="font-family:'Montserrat',sans-serif;font-size:1.25rem;line-height:1.8;font-style:italic;max-width:700px;margin:0 auto;">
                    "${t.quote}"
                </p>
                ${t.photo ? `<img src="${t.photo}" alt="${t.name}" style="width:70px;height:70px;object-fit:cover;border:3px solid #ff4500;margin-bottom:1rem;">` : ''}
                <h5 class="text-white mb-0" style="font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:1px;">${t.name}</h5>
                <span style="font-family:'Montserrat',sans-serif;font-size:0.75rem;color:#ff4500;text-transform:uppercase;letter-spacing:2px;">${t.role}</span>
            </div>
        `).join('');

        // Re-initialize owl carousel if available
        if (typeof $.fn.owlCarousel !== 'undefined') {
            $(container).owlCarousel({
                items: 1, loop: true, autoplay: true, autoplayTimeout: 6000,
                dots: true, nav: false, animateOut: 'fadeOut'
            });
        }
    },

    // Update stats from settings
    async renderStats() {
        const stats = await this.loadSettings('stats');
        if (!stats) return;

        document.querySelectorAll('[data-stat]').forEach(el => {
            const key = el.getAttribute('data-stat');
            if (stats[key]) el.textContent = stats[key];
        });
    }
};

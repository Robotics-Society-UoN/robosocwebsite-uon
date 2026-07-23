(function () {
    const feed = document.getElementById('events-feed');
    if (!feed) return;

    const fallbackMarkup = feed.innerHTML;

    function appendText(parent, className, text, tagName = 'div') {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = text;
        parent.appendChild(element);
        return element;
    }

    function safeHttpUrl(value) {
        try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
        } catch {
            return null;
        }
    }

    function safeImagePath(value) {
        return typeof value === 'string' && /^assets\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(value) && !value.includes('..')
            ? value
            : null;
    }

    function isRenderableEvent(event) {
        return event
            && event.published === true
            && typeof event.id === 'string'
            && typeof event.title === 'string'
            && typeof event.summary === 'string'
            && typeof event.dateLabel === 'string'
            && typeof event.location === 'string';
    }

    function createEventCard(event) {
        const card = document.createElement('article');
        card.className = `event-card${event.featured ? ' event-card--featured' : ''}`;
        if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.id)) card.id = event.id;

        const header = document.createElement('div');
        header.className = 'event-card__header';

        const icon = document.createElement('i');
        icon.className = event.featured ? 'fa-solid fa-trophy' : 'fa-regular fa-calendar';
        icon.setAttribute('aria-hidden', 'true');
        header.appendChild(icon);

        const headingGroup = document.createElement('div');
        appendText(headingGroup, 'event-card__title', event.title, 'h3');
        appendText(headingGroup, 'event-card__date', event.dateLabel, 'p');
        header.appendChild(headingGroup);
        card.appendChild(header);

        const metadata = document.createElement('div');
        metadata.className = 'event-card__meta';
        if (event.timeLabel) appendText(metadata, '', event.timeLabel, 'span');
        appendText(metadata, '', event.location, 'span');
        card.appendChild(metadata);

        const imagePath = safeImagePath(event.image);
        if (imagePath) {
            const image = document.createElement('img');
            image.className = 'event-card__image';
            image.src = imagePath;
            image.alt = `${event.title} event`;
            image.loading = 'lazy';
            card.appendChild(image);
        }

        appendText(card, 'event-card__summary', event.summary, 'p');

        if (Array.isArray(event.tags) && event.tags.length) {
            const tags = document.createElement('div');
            tags.className = 'event-card__tags';
            event.tags.forEach(tag => appendText(tags, 'event-card__tag', tag, 'span'));
            card.appendChild(tags);
        }

        const href = safeHttpUrl(event.registrationUrl);
        if (href && typeof event.ctaLabel === 'string' && event.ctaLabel.trim()) {
            const link = document.createElement('a');
            link.className = 'event-card__link';
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = event.ctaLabel;
            const arrow = document.createElement('i');
            arrow.className = 'fa-solid fa-arrow-right';
            arrow.setAttribute('aria-hidden', 'true');
            link.appendChild(arrow);
            card.appendChild(link);
        }

        return card;
    }

    fetch('data/events.json', { cache: 'no-store' })
        .then(response => {
            if (!response.ok) throw new Error(`Events request returned ${response.status}`);
            return response.json();
        })
        .then(documentData => {
            const publishedEvents = (documentData.events || [])
                .filter(isRenderableEvent)
                .sort((a, b) => {
                    if (a.featured !== b.featured) return a.featured ? -1 : 1;
                    if (!a.startDate && !b.startDate) return a.title.localeCompare(b.title);
                    if (!a.startDate) return 1;
                    if (!b.startDate) return -1;
                    return Date.parse(a.startDate) - Date.parse(b.startDate);
                });

            if (!publishedEvents.length) return;
            feed.replaceChildren(...publishedEvents.map(createEventCard));
            feed.dataset.source = 'events-json';
        })
        .catch(() => {
            feed.innerHTML = fallbackMarkup;
            feed.dataset.source = 'fallback';
        });
}());

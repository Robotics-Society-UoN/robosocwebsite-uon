(() => {
  "use strict";

  const SITE_URL = "data/site.json";
  const COMMITTEE_URL = "data/committee.json";
  const ASSET_PATH = /^assets\/[A-Za-z0-9][A-Za-z0-9._/-]*$/;
  const ICON_CLASS = /^(fa-(solid|regular|brands))( fa-[a-z0-9-]+)+$/;

  const byId = (id) => document.getElementById(id);

  function safeAsset(value) {
    return typeof value === "string" && ASSET_PATH.test(value) && !value.includes("..") ? value : null;
  }

  function safeUrl(value) {
    if (typeof value !== "string") return null;
    if (/^#[A-Za-z][A-Za-z0-9_-]*$/.test(value)) return value;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
      return null;
    }
  }

  function setText(id, value) {
    const element = byId(id);
    if (element && typeof value === "string") element.textContent = value;
  }

  function appendHighlightedText(element, value) {
    const text = String(value);
    const matcher = /\[\[([^\]]+)\]\]/g;
    let cursor = 0;
    let match;
    while ((match = matcher.exec(text))) {
      element.append(document.createTextNode(text.slice(cursor, match.index)));
      const highlight = document.createElement("span");
      highlight.className = "terminal-text font-bold";
      highlight.textContent = match[1];
      element.append(highlight);
      cursor = match.index + match[0].length;
    }
    element.append(document.createTextNode(text.slice(cursor)));
  }

  function makeIcon(className) {
    const icon = document.createElement("i");
    icon.className = ICON_CLASS.test(className || "") ? `${className} terminal-text` : "fa-solid fa-circle terminal-text";
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function renderAbout(about) {
    setText("about-heading", about.heading);
    const copy = byId("about-copy");
    if (copy && Array.isArray(about.paragraphs)) {
      copy.replaceChildren();
      about.paragraphs.forEach((paragraph) => {
        const item = document.createElement("p");
        appendHighlightedText(item, paragraph);
        copy.append(item);
      });
    }

    const bullets = byId("about-bullets");
    if (bullets && Array.isArray(about.bullets)) {
      bullets.replaceChildren();
      about.bullets.forEach((bullet) => {
        const [rawLabel, ...rawText] = String(bullet).split(":");
        const item = document.createElement("div");
        item.className = "about-highlight";
        const label = document.createElement("strong");
        label.textContent = rawText.length ? rawLabel.trim() : ">";
        const text = document.createElement("span");
        text.textContent = rawText.length ? rawText.join(":").trim() : rawLabel.trim();
        item.append(label, text);
        bullets.append(item);
      });
    }

    const image = byId("about-image");
    const src = safeAsset(about.image);
    if (image && src) image.src = src;
    if (image && typeof about.imageAlt === "string") image.alt = about.imageAlt;
  }

  function renderCompetition(competition) {
    setText("competition-heading", competition.heading);
    setText("competition-body", competition.body);
    const points = byId("competition-points");
    if (points && Array.isArray(competition.points)) {
      points.replaceChildren();
      competition.points.forEach((point) => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        label.className = "terminal-text font-bold";
        label.textContent = `> ${point.label}`;
        row.append(label, document.createTextNode(` — ${point.text}`));
        points.append(row);
      });
    }
    const image = byId("competition-image");
    const src = safeAsset(competition.image);
    if (image && src) image.src = src;
    if (image && typeof competition.imageAlt === "string") image.alt = competition.imageAlt;
  }

  function renderCommittee(data) {
    const rail = byId("committee-rail");
    if (!rail || !Array.isArray(data.members)) return;
    const members = data.members.filter((member) => member.published === true && safeAsset(member.image));
    if (!members.length) return;
    rail.replaceChildren();
    members.forEach((member) => {
      const card = document.createElement("div");
      card.className = "committee-member";

      const photo = document.createElement("div");
      photo.className = "committee-photo mb-4";
      photo.setAttribute("role", "img");
      photo.setAttribute("aria-label", `${member.name}, RoboSoc ${member.role}`);
      photo.style.backgroundImage = `url("${member.image}")`;
      photo.style.backgroundSize = `${Number(member.imageScale || 1) * 100}% auto`;
      photo.style.backgroundPosition = member.imagePosition || "50% 50%";

      const name = document.createElement("div");
      name.className = "terminal-text font-bold mb-1";
      name.textContent = member.name;
      const role = document.createElement("div");
      role.className = "text-sm text-[#7FA3B0]";
      role.textContent = member.role;
      card.append(photo, name, role);
      rail.append(card);
    });
  }

  function renderFooter(footer) {
    setText("footer-contact-title", footer.contactTitle);
    setText("footer-links-title", footer.linksTitle);
    setText("footer-explore-title", footer.exploreTitle);
    setText("footer-copyright", footer.copyright);
    setText("footer-tagline", footer.tagline);

    const contact = byId("footer-contact");
    if (contact && Array.isArray(footer.contact)) {
      contact.replaceChildren();
      footer.contact.forEach((item) => {
        const row = document.createElement("div");
        row.append(makeIcon(item.icon), document.createTextNode(` ${item.text}`));
        contact.append(row);
      });
    }

    const links = byId("footer-links");
    if (links && Array.isArray(footer.links)) {
      links.replaceChildren();
      footer.links.forEach((item) => {
        const href = safeUrl(item.url);
        if (!href) return;
        const row = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.target = "_blank";
        anchor.rel = "noopener";
        anchor.className = "social-link hover:text-[#19C8E2]";
        anchor.append(makeIcon(item.icon), document.createTextNode(item.label));
        row.append(anchor);
        links.append(row);
      });
    }

    const explore = byId("footer-explore");
    if (explore && Array.isArray(footer.explore)) {
      explore.replaceChildren();
      footer.explore.forEach((item) => {
        const href = safeUrl(item.url);
        if (!href) return;
        const row = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.className = "hover:text-[#19C8E2]";
        anchor.textContent = item.label;
        row.append(anchor);
        explore.append(row);
      });
    }
  }

  function renderSite(site) {
    if (site.meta?.title) document.title = site.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && site.meta?.description) description.content = site.meta.description;

    const logoPath = safeAsset(site.brand?.logo);
    document.querySelectorAll("[data-brand-logo]").forEach((logo) => {
      if (logoPath) logo.src = logoPath;
      if (site.brand?.logoAlt) logo.alt = site.brand.logoAlt;
    });

    Object.entries(site.navigation || {}).forEach(([key, label]) => {
      document.querySelectorAll(`[data-nav="${key}"]`).forEach((node) => {
        node.textContent = label;
      });
    });
    const membership = safeUrl(site.links?.membership);
    if (membership) document.querySelectorAll('[data-link="membership"]').forEach((link) => { link.href = membership; });
    const discord = safeUrl(site.links?.discord);
    if (discord) document.querySelectorAll('[data-link="discord"]').forEach((link) => { link.href = discord; });

    renderAbout(site.about || {});
    setText("calendar-heading", site.calendar?.heading);
    renderCompetition(site.competition || {});
    setText("committee-heading", site.committee?.heading);
    setText("committee-scroll-hint", site.committee?.scrollHint);
    renderFooter(site.footer || {});
  }

  Promise.all([
    fetch(SITE_URL, { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error(`Site content request failed: ${response.status}`);
      return response.json();
    }),
    fetch(COMMITTEE_URL, { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error(`Committee request failed: ${response.status}`);
      return response.json();
    })
  ])
    .then(([site, committee]) => {
      renderSite(site);
      renderCommittee(committee);
      document.documentElement.dataset.contentSource = "github-json";
    })
    .catch((error) => {
      document.documentElement.dataset.contentSource = "html-fallback";
      console.warn("Using built-in website content because JSON content could not be loaded.", error);
    });
})();

import { access, readFile } from "node:fs/promises";

const fileUrl = new URL("../data/events.json", import.meta.url);
const document = JSON.parse(await readFile(fileUrl, "utf8"));

const requiredFields = [
  "id", "title", "summary", "startDate", "endDate", "dateLabel",
  "timeLabel", "location", "registrationUrl", "ctaLabel", "image",
  "featured", "published", "tags"
];
const allowedFields = new Set(requiredFields);
const errors = [];

if (document.version !== 1) errors.push("version must be 1");
if (!Array.isArray(document.events)) errors.push("events must be an array");

const ids = new Set();

for (const [index, event] of (document.events || []).entries()) {
  const label = `events[${index}]`;
  const keys = Object.keys(event);

  for (const field of requiredFields) {
    if (!(field in event)) errors.push(`${label}.${field} is required`);
  }
  for (const field of keys) {
    if (!allowedFields.has(field)) errors.push(`${label}.${field} is not a supported field`);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.id || "")) {
    errors.push(`${label}.id must be lowercase words separated by hyphens`);
  } else if (ids.has(event.id)) {
    errors.push(`${label}.id duplicates "${event.id}"`);
  } else {
    ids.add(event.id);
  }

  for (const field of ["title", "summary", "dateLabel", "location"]) {
    if (typeof event[field] !== "string" || !event[field].trim()) {
      errors.push(`${label}.${field} must contain text`);
    }
  }

  for (const field of ["startDate", "endDate"]) {
    const value = event[field];
    if (value !== null && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) {
      errors.push(`${label}.${field} must be an ISO date-time or null`);
    }
  }

  if (event.startDate && event.endDate && Date.parse(event.endDate) < Date.parse(event.startDate)) {
    errors.push(`${label}.endDate must not be before startDate`);
  }

  const hasRegistrationUrl = event.registrationUrl !== null;
  const hasCtaLabel = event.ctaLabel !== null;
  if (hasRegistrationUrl !== hasCtaLabel) {
    errors.push(`${label}.registrationUrl and ${label}.ctaLabel must either both be set or both be null`);
  } else if (hasRegistrationUrl) {
    try {
      const registrationUrl = new URL(event.registrationUrl);
      if (!['http:', 'https:'].includes(registrationUrl.protocol)) throw new Error();
    } catch {
      errors.push(`${label}.registrationUrl must be a full http(s) URL or null`);
    }
    if (typeof event.ctaLabel !== "string" || !event.ctaLabel.trim()) {
      errors.push(`${label}.ctaLabel must contain text when registrationUrl is set`);
    }
  }

  if (typeof event.featured !== "boolean") errors.push(`${label}.featured must be true or false`);
  if (typeof event.published !== "boolean") errors.push(`${label}.published must be true or false`);
  if (event.image !== null) {
    if (typeof event.image !== "string" || !/^assets\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(event.image) || event.image.includes("..")) {
      errors.push(`${label}.image must be a safe repository path beginning with assets/ or null`);
    } else {
      try {
        await access(new URL(`../${event.image}`, import.meta.url));
      } catch {
        errors.push(`${label}.image points to a file that does not exist: ${event.image}`);
      }
    }
  }
  if (!Array.isArray(event.tags) || event.tags.some(tag => typeof tag !== "string" || !tag.trim())) {
    errors.push(`${label}.tags must be a list of non-empty text labels`);
  }
}

if (errors.length) {
  console.error("Invalid events data:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Validated ${document.events.length} event(s).`);

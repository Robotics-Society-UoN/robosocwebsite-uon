import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const required = (value, label) => {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label} must be a non-empty string.`);
};
const assetPattern = /^assets\/[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function readJson(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

async function checkAsset(value, label) {
  if (typeof value !== "string" || !assetPattern.test(value) || value.includes("..")) {
    errors.push(`${label} must be a safe path inside assets/.`);
    return;
  }
  try {
    await access(path.join(root, value));
  } catch {
    errors.push(`${label} references a missing file: ${value}`);
  }
}

function checkUrl(value, label, allowAnchor = false) {
  if (allowAnchor && typeof value === "string" && /^#[A-Za-z][A-Za-z0-9_-]*$/.test(value)) return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    errors.push(`${label} must be a full http(s) URL${allowAnchor ? " or a safe #anchor" : ""}.`);
  }
}

function checkList(value, label, minimum = 1) {
  if (!Array.isArray(value) || value.length < minimum) {
    errors.push(`${label} must contain at least ${minimum} item(s).`);
    return false;
  }
  return true;
}

const site = await readJson("data/site.json");
const committee = await readJson("data/committee.json");

if (site) {
  if (site.version !== 1) errors.push("data/site.json version must be 1.");
  required(site.meta?.title, "site.meta.title");
  required(site.meta?.description, "site.meta.description");
  await checkAsset(site.brand?.logo, "site.brand.logo");
  required(site.brand?.logoAlt, "site.brand.logoAlt");

  for (const key of ["calendar", "unibots", "committee", "contact", "join"]) {
    required(site.navigation?.[key], `site.navigation.${key}`);
  }
  checkUrl(site.links?.membership, "site.links.membership");
  checkUrl(site.links?.discord, "site.links.discord");

  required(site.about?.heading, "site.about.heading");
  if (checkList(site.about?.paragraphs, "site.about.paragraphs")) {
    site.about.paragraphs.forEach((item, index) => required(item, `site.about.paragraphs[${index}]`));
  }
  if (checkList(site.about?.bullets, "site.about.bullets")) {
    site.about.bullets.forEach((item, index) => required(item, `site.about.bullets[${index}]`));
  }
  await checkAsset(site.about?.image, "site.about.image");
  required(site.about?.imageAlt, "site.about.imageAlt");
  required(site.calendar?.heading, "site.calendar.heading");

  required(site.competition?.heading, "site.competition.heading");
  required(site.competition?.body, "site.competition.body");
  await checkAsset(site.competition?.image, "site.competition.image");
  required(site.competition?.imageAlt, "site.competition.imageAlt");
  if (checkList(site.competition?.points, "site.competition.points")) {
    site.competition.points.forEach((item, index) => {
      required(item?.label, `site.competition.points[${index}].label`);
      required(item?.text, `site.competition.points[${index}].text`);
    });
  }

  required(site.committee?.heading, "site.committee.heading");
  required(site.committee?.scrollHint, "site.committee.scrollHint");

  const footer = site.footer || {};
  for (const key of ["contactTitle", "linksTitle", "exploreTitle", "copyright", "tagline"]) {
    required(footer[key], `site.footer.${key}`);
  }
  if (checkList(footer.contact, "site.footer.contact")) {
    footer.contact.forEach((item, index) => {
      required(item?.icon, `site.footer.contact[${index}].icon`);
      required(item?.text, `site.footer.contact[${index}].text`);
    });
  }
  if (checkList(footer.links, "site.footer.links")) {
    footer.links.forEach((item, index) => {
      required(item?.icon, `site.footer.links[${index}].icon`);
      required(item?.label, `site.footer.links[${index}].label`);
      checkUrl(item?.url, `site.footer.links[${index}].url`);
    });
  }
  if (checkList(footer.explore, "site.footer.explore")) {
    footer.explore.forEach((item, index) => {
      required(item?.label, `site.footer.explore[${index}].label`);
      checkUrl(item?.url, `site.footer.explore[${index}].url`, true);
    });
  }
}

if (committee) {
  if (committee.version !== 1) errors.push("data/committee.json version must be 1.");
  if (checkList(committee.members, "committee.members")) {
    const ids = new Set();
    for (const [index, member] of committee.members.entries()) {
      const label = `committee.members[${index}]`;
      if (typeof member.id !== "string" || !idPattern.test(member.id)) errors.push(`${label}.id must use lowercase letters, numbers and hyphens.`);
      if (ids.has(member.id)) errors.push(`${label}.id is duplicated: ${member.id}`);
      ids.add(member.id);
      required(member.name, `${label}.name`);
      required(member.role, `${label}.role`);
      required(member.course, `${label}.course`);
      await checkAsset(member.image, `${label}.image`);
      if (typeof member.imageScale !== "number" || member.imageScale < 1 || member.imageScale > 5) errors.push(`${label}.imageScale must be a number from 1 to 5.`);
      if (typeof member.imagePosition !== "string" || !/^\d{1,3}% \d{1,3}%$/.test(member.imagePosition)) errors.push(`${label}.imagePosition must look like "50% 50%".`);
      if (typeof member.published !== "boolean") errors.push(`${label}.published must be true or false.`);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated website content and ${committee.members.length} committee member(s).`);

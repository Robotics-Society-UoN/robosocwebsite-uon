# Editing RoboSoc website content

The website is intentionally file-driven. The layout, fonts, colours and responsive design stay fixed in `index.html`; committee members, events, images, links, titles and public copy can be changed here without writing code or using a database.

Only the repository owner and invited GitHub collaborators with write access can publish changes.

## General text, links and section images

Open [`site.json`](https://github.com/Robotics-Society-UoN/robosocwebsite-uon/edit/main/data/site.json), replace text between the quotation marks, then use **Commit changes**.

This file controls:

- browser title and description;
- logo and section images;
- navigation labels;
- About, Calendar, Competition and Committee section copy;
- membership, Discord and Instagram links;
- footer text and links.

Use `[[double brackets]]` inside an About paragraph to apply the existing cyan highlight, for example `Our main competition is [[UniBots]].`

## Committee members

1. Upload the new portrait into the repository's [`assets/`](../assets) folder.
2. Open [`committee.json`](https://github.com/Robotics-Society-UoN/robosocwebsite-uon/edit/main/data/committee.json).
3. Copy the object in [`committee-template.json`](./committee-template.json) into the `members` list.
4. Change the `id`, `name`, `role`, `course` and `image` values.
5. Set `published` to `true` and commit.

For a normal standalone portrait, keep `imageScale` at `1` and `imagePosition` at `50% 50%`. Increase `imageScale` to zoom in; change the two percentages to move the crop horizontally and vertically. Set `published` to `false` to hide someone without deleting their details.

## Events

1. Open [`events.json`](https://github.com/Robotics-Society-UoN/robosocwebsite-uon/edit/main/data/events.json).
2. Copy the object from [`event-template.json`](./event-template.json).
3. Paste it inside the `events` list, adding a comma after the previous event.
4. Replace the template text and set `published` to `true` when ready.
5. Commit the change.

Event fields include the public title and summary, start/end dates, display labels, location, optional registration link, optional image, tags and featured status. Set both `registrationUrl` and `ctaLabel` to `null` when an event should not show a registration action. Set `image` or an unknown date to `null` when it is not available.

## Images

- Put all public images inside `assets/`.
- Use short filenames without spaces, such as `assets/unibots-2026.jpg`.
- Enter the exact path in the JSON file, including the file extension.
- Add useful `imageAlt` text in `site.json` so screen-reader users know what the image shows.

## Safety checks

The **Validate website content** GitHub check runs on every relevant commit and pull request. It catches invalid JSON, duplicate IDs, malformed URLs, missing required fields and image paths that do not exist. If the check fails, open its log, correct the named field and commit again.

JSON punctuation matters: separate list entries with commas, keep property names in double quotes, and do not add a comma after the final entry.

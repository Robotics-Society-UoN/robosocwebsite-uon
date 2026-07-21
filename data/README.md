# Managing website events

Only the repository owner and invited collaborators with write access can publish changes.

## Add an event

1. Open [`events.json`](https://github.com/AyushGupta05/robosocwebsite-uon/edit/main/data/events.json) in GitHub's editor.
2. Copy the object from [`event-template.json`](./event-template.json).
3. Paste it inside the `events` list, adding a comma after the previous event.
4. Replace the template text with the new event's information.
5. Keep `published` set to `false` while drafting. Change it to `true` when the event is ready for the website.
6. Use GitHub's **Commit changes** button.

The **Validate events data** GitHub check catches missing fields, duplicate IDs, malformed dates and unsafe links before changes are merged.

## Field guide

- `id`: unique lowercase name using letters, numbers and hyphens only.
- `title`: public event title.
- `summary`: short public description.
- `startDate` / `endDate`: ISO 8601 date and time, or `null` when unconfirmed.
- `dateLabel` / `timeLabel`: exactly how the date and time should appear on the website.
- `location`: room, building or online venue.
- `registrationUrl`: full `https://` link.
- `ctaLabel`: link text, such as `Register now`.
- `image`: repository-relative image path or `null`.
- `featured`: highlights the card when `true`.
- `published`: only `true` events appear publicly.
- `tags`: short event categories.

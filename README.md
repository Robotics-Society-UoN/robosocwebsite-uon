# UoN Robotics Society Website

Official website for the University of Nottingham Robotics Society (RoboSoc).

## About

The site introduces RoboSoc, highlights the UniBots competition, presents the 2025–26 committee, and provides membership and society links.

## Project structure

```text
.
├── index.html
├── assets/
    ├── robosoc-logo.jpg
    ├── committee-group.png
    ├── workshop-event.jpg
    └── committee portraits
├── data/
│   ├── events.json
│   ├── event-template.json
│   └── events.schema.json
└── scripts/
    ├── events.js
    └── validate-events.mjs
```

## Run locally

Open `index.html` directly in a browser, or serve this directory with any static web server.

## Add or update events

Events are managed in [`data/events.json`](./data/events.json). Only the repository owner and invited collaborators with write access can commit changes.

1. Open the [GitHub event editor](https://github.com/AyushGupta05/robosocwebsite-uon/edit/main/data/events.json).
2. Copy the preformatted object from [`data/event-template.json`](./data/event-template.json).
3. Add it to the `events` list and replace the example text.
4. Set `published` to `true` when it should appear on the website.
5. Commit the change in GitHub.

See [`data/README.md`](./data/README.md) for every available metadata field. GitHub automatically validates the file on commits and pull requests.

## Links

- [Buy membership](https://su.nottingham.ac.uk/shop/product/24959-RB-1YEARmembership)
- [Instagram](https://www.instagram.com/uon_robotics_society/)
- [Discord](https://discord.gg/psgGx7FQn)

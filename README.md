# UoN Robotics Society Website

Official website for the University of Nottingham Robotics Society (RoboSoc). The layout, fonts, colours and mobile design live in `index.html`; all regularly changing content lives in simple JSON files.

## Update the website

You do not need a database, Supabase or an admin dashboard. Repository collaborators can update the live website using GitHub's text editor:

- [Edit general website text, links and images](https://github.com/AyushGupta05/robosocwebsite-uon/edit/main/data/site.json)
- [Edit committee members](https://github.com/AyushGupta05/robosocwebsite-uon/edit/main/data/committee.json)
- [Edit events](https://github.com/AyushGupta05/robosocwebsite-uon/edit/main/data/events.json)

Commit the edit to `main`. GitHub Pages will publish it automatically if Pages is configured for this repository. Only the owner and invited collaborators with write access can commit.

For image changes, upload the image into [`assets/`](./assets), then enter its path such as `assets/new-member.jpg` in the relevant JSON file.

See the complete [content editing guide](./data/README.md) before making the first update.

## Project structure

```text
.
├── index.html                 fixed layout and styling
├── assets/                    logos, event photos and portraits
├── data/
│   ├── site.json              general copy, links and section images
│   ├── committee.json         committee names, roles and portraits
│   ├── events.json            event listings and metadata
│   ├── *-template.json        copyable entry templates
│   └── *.schema.json          editor hints and data formats
├── scripts/
│   ├── content.js             loads site and committee content
│   ├── events.js              loads events
│   └── validate-*.mjs         checks content before publishing
└── .github/workflows/         automatic validation
```

## Run locally

Serve this directory with a static web server. Loading `index.html` directly displays its built-in fallback, while a local server also loads the JSON content files.

## Society links

- [Buy membership](https://su.nottingham.ac.uk/shop/product/24959-RB-1YEARmembership)
- [Instagram](https://www.instagram.com/uon_robotics_society/)
- [Discord](https://discord.gg/psgGx7FQn)

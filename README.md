# Portfolio Website

My personal portfolio site — self-hosted on a home server I built and run myself.

🌐 **Live:** https://donovan-gonzalez.duckdns.org:8443

<!-- Add a screenshot: save it as screenshot.png in this folder, then uncomment the line below -->
<!-- ![Portfolio screenshot](screenshot.png) -->

## Features

- **Projects & courses** — cards for my projects and CS coursework at Queens College
- **SQL Playground** — an in-browser SQLite database of my courses, projects, and skills that visitors can query directly. Built with [sql.js](https://sql.js.org) (SQLite compiled to WebAssembly), so every visitor gets their own in-memory copy and nothing touches the server
- **Grade Calculator** — weighted-average calculator with letter-grade conversion
- No frameworks or build step — plain HTML, CSS, and JavaScript

## Hosting

The site runs on my [Home Cloud Server](https://github.com/Donovan-Gonzalez/Personal-Cloud-Server-Home-Lab):

| Layer          | Tech                                   |
| -------------- | -------------------------------------- |
| Server         | Ubuntu Server on a repurposed MacBook Pro |
| Web server     | Nginx                                  |
| HTTPS          | Let's Encrypt                          |
| DNS            | DuckDNS dynamic DNS                    |
| Remote access  | Tailscale (WireGuard VPN)              |

## Deploying

`deploy.ps1` copies only the site's files (`.html`, `.css`, `.js`, images) to `/var/www/html` on the server over SSH, so scripts and repo files never end up publicly served.

```powershell
.\deploy.ps1
```

## Files

| File | Purpose |
| ---- | ------- |
| `index.html` | Main page |
| `style.css`, `courses.css` | Page and card styling |
| `sql-practice.js` / `.css` | SQL Playground (seed data lives at the top of the JS file) |
| `grade-calculator.css`, `script.js` | Grade Calculator |
| `courses.js` | Card tilt effect and notes |
| `deploy.ps1` | Deploy script |
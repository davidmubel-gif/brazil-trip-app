# Brazil Trip app

A small app for a solo trip to **São Paulo and Rio de Janeiro, 14–24 November 2026**.
It is made for a phone, and once it has been opened one time it keeps working with no internet.

**Live app:** <https://davidmubel-gif.github.io/brazil-trip-app/>
(hosted free on GitHub Pages from this project's `main` branch).

It is a "web app" (a PWA, Progressive Web App): a web page that a phone can install
on its home screen like a normal app. There is no app store, no account and no server-side database.

## What it does

The app has four tabs:

- **Explore**: 60 places (museums, parks, neighbourhoods, nightlife, day trips) with hours,
  prices, the nearest metro station, photos and notes. Places can be filtered and starred.
- **Budget**: a daily allowance in Brazilian reais (BRL), converted to Colombian pesos (COP), with an expense list.
- **Plan**: a rough plan for each day, shown as a timeline. It includes the fixed work block
  (10:00–18:00 Brazil time on weekdays, Nov 20 included), warnings when items overlap or a place is closed,
  a "Suggest times" button, and a map of the day's route (walking, or metro for longer hops).
- **Docs**: booking confirmation numbers with copy buttons, plus checklists.

## Where my data lives

**Not in these files.** Stars, notes, plans, expenses and documents are saved inside the browser
of each device (its "local storage"), and photos in the browser's own database (IndexedDB).
So these files contain no personal data and are safe to put online, but a phone and a laptop
each keep their own separate copy of your data. Photos can be moved between devices with the
"photo pack" export/import.

## The files

| File | What it is |
|---|---|
| `index.html` | The whole app: look, behaviour, the list of places, and the map library, all in one file. |
| `sw.js` | The *service worker*: a helper that saves a copy of the app (and map areas you have viewed) so it opens offline. |
| `manifest.webmanifest` | The app's name, colours and icons, used when installing it on a phone. |
| `icon-192.png`, `icon-512.png` | App icons. |
| `serve.ps1` | Starts a small web server on this computer to try the app (see below). Not needed on the phone. |

## Online services the app uses (all free, no keys)

- **OpenStreetMap** map tiles for the maps.
- **Nominatim** (OpenStreetMap search) to find each place's map pin. Results are saved on the device.
- **routing.openstreetmap.de** for walking routes. Results are saved on the device.
- **Wikimedia Commons** for free photos, with credits.
- **Google Maps** links, which open in the Google Maps app.

## Trying it on this computer

Open PowerShell in this folder and run:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open <http://localhost:8080> in a browser. Press Ctrl+C in PowerShell to stop the server.
(The page must come from a server, not from double-clicking `index.html`, or the offline
features won't work.)

## Releasing a new version (important)

1. Every time an app file changes, edit the `CACHE` line near the top of `sw.js` and raise the number
   (for example `'trip-v15'` to `'trip-v16'`). That is how phones know a new version exists.
   Without it, a phone can keep showing the old version.
2. Save a version in Git (a "commit"), then send it to GitHub:

   ```
   git push
   ```

   The live app updates within a couple of minutes. On the phone, the new version shows the
   *second* time you open the app after that (the first opening downloads it in the background).

## Before the trip: make the maps work offline

Map pictures are saved only for areas you have actually looked at (OpenStreetMap does not allow
downloading whole cities). So, on Wi-Fi before leaving, open each day's map in the Plan tab and
zoom in around the places you will visit. Those areas then show with no signal.
Photos work the same way: tap "Get photos for all places" once, on Wi-Fi.

## Version history

This folder uses **Git** to keep a history of save points ("commits"). Any earlier version can be brought back.

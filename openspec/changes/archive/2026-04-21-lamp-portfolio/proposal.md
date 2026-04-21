## Why

Ein Junior Software Developer braucht ein herausragendes Portfolio, das sowohl Design-Gespür als auch technische Kompetenz vermittelt. Ein Standard-Portfolio wird oft übersehen, aber eines mit einem hochinsteraktiven, "physischen" Leuchtsystem ("Two-Phase Lighting System") in Kombination mit einem "Blueprint"-Hintergrund wird bei Recruitern und Engineering Managern einen bleibenden Eindruck hinterlassen. 

## What Changes

- **Zweiphasiges Leuchtsystem:** Implementierung einer dynamischen Lichtlogik, die die Seite steuert.
- **Phase 1 (Navigation - Das Fließband):** Eine feste "Lampe" wirft einen vertikalen Lichtkegel. Navigations-Tabs scrollen horizontal wie auf einem Fließband durch diesen Lichtkegel, während der Rest der Seite im Verborgenen (Dunkelheit/Blueprint) bleibt.
- **Phase 2 (Content - Das freie Spotlight):** Beim Auswählen eines Tabs entsteht ein "Flash-Effekt" (Lichtzerstreuung), die Navigation tritt zurück und das Bento-Grid erscheint. Die Lampe löst sich und folgt der Maus as "Spotlight".
- **Blueprint vs. Finished:** Im Spotlight-Kegel sieht man das "fertige" Premium Dark-Mode UI (Neon, leuchtend). In den dunklen "Schattenbereichen" um die Lampe herum sieht man schwache Blueprint-Linien (Graph Paper, Dotted Lines) zur Orientierung.
- **Mobile Paradigm:** Auf mobilen Geräten ohne Maus rückt die Lampe starr in die Bildschirmmitte. Durch vertikales Scrollen ("Fahren" des Grids durch das Licht) wird jeweils das zentrierte Element beleuchtet.

## Capabilities

### New Capabilities
- `two-phase-lighting`: Core CSS/JS Engine zur Verwaltung der Masken- und Lichtkegel-Transitionen.
- `blueprint-shadows`: Dual Layer-Styling (Blueprint-Basis vs. Maskierter Finished Layer).
- `bento-layout`: Core bento-box grid Implementierung, die auf das Masking-System abgestimmt ist.
- `portfolio-content`: Strukturierung und Rendering der Projekte, Skills und About-Details.

### Modified Capabilities
None

## Impact

Dieses Konzept erfordert eine tiefgreifende Restrukturierung der UI (eventgetriebenes Masking-Layout statt statischem Raster). Das Endprodukt fokussiert sich massiv auf Visual Excellence, physische UI-Logik und verhält sich wie ein interaktiver Raum.

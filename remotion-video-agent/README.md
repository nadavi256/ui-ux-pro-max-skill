# Remotion Video Agent

Programmatic video generation built with [Remotion](https://www.remotion.dev/) — videos are defined as React components and rendered to MP4 in code.

## Setup

```bash
npm install
```

## Preview (interactive studio)

```bash
npm start
```

## Render a video

```bash
npm run build
```

Output is written to `out/video.mp4`.

## Project structure

- `src/index.ts` — Remotion entry point, registers the root component.
- `src/Root.tsx` — Declares available compositions (id, duration, fps, resolution, default props).
- `src/HelloWorld.tsx` — Sample animated composition (title + subtitle) to start from.

Add new videos by creating a component under `src/` and registering it with another `<Composition>` in `src/Root.tsx`.

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
- `public/` — Static assets (images, video clips, audio, fonts) used inside compositions.

Add new videos by creating a component under `src/` and registering it with another `<Composition>` in `src/Root.tsx`.

## Using your own images / video / audio

Drop the file into `public/` (e.g. `public/logo.png`, `public/clip.mp4`, `public/song.mp3`), then reference it from a component with `staticFile`:

```tsx
import { Img, Video, Audio, staticFile } from "remotion";

<Img src={staticFile("logo.png")} />
<Video src={staticFile("clip.mp4")} />
<Audio src={staticFile("song.mp3")} />
```

Never use a raw relative path or import — always go through `staticFile()` so it resolves correctly both in Studio and in a rendered build.

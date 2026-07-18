import type { FC } from "react";
import { AbsoluteFill, OffthreadVideo, Series, staticFile } from "remotion";

type Clip = {
  file: string;
  durationInFrames: number;
};

// Order and durations match the uploaded clips (clip-1 .. clip-8),
// measured with @remotion/renderer's getVideoMetadata at 24fps.
export const clips: Clip[] = [
  { file: "clips/clip-1.mp4", durationInFrames: 121 },
  { file: "clips/clip-2.mp4", durationInFrames: 121 },
  { file: "clips/clip-3.mp4", durationInFrames: 121 },
  { file: "clips/clip-4.mp4", durationInFrames: 121 },
  { file: "clips/clip-5.mp4", durationInFrames: 121 },
  { file: "clips/clip-6.mp4", durationInFrames: 121 },
  { file: "clips/clip-7.mp4", durationInFrames: 121 },
  { file: "clips/clip-8.mp4", durationInFrames: 193 },
];

export const reelDurationInFrames = clips.reduce(
  (sum, clip) => sum + clip.durationInFrames,
  0,
);

export const Reel: FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {clips.map((clip) => (
          <Series.Sequence
            key={clip.file}
            durationInFrames={clip.durationInFrames}
          >
            <OffthreadVideo src={staticFile(clip.file)} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

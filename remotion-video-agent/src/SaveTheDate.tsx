import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type ClipSpec = {
  file: string;
  durationInFrames: number;
  /**
   * Original embedded clip audio is muted by default per the director's
   * notes. Clips 3 & 4 are the exception — the sword-attack scream is
   * kept on purpose.
   */
  keepOriginalAudio?: boolean;
};

// Order and durations match the uploaded clips (clip-1 .. clip-8),
// measured with @remotion/renderer's getVideoMetadata (native 24fps source).
export const clips: ClipSpec[] = [
  { file: "clips/clip-1.mp4", durationInFrames: 121 },
  { file: "clips/clip-2.mp4", durationInFrames: 121 },
  { file: "clips/clip-3.mp4", durationInFrames: 121, keepOriginalAudio: true },
  { file: "clips/clip-4.mp4", durationInFrames: 121, keepOriginalAudio: true },
  { file: "clips/clip-5.mp4", durationInFrames: 121 },
  { file: "clips/clip-6.mp4", durationInFrames: 121 },
  { file: "clips/clip-7.mp4", durationInFrames: 121 },
  { file: "clips/clip-8.mp4", durationInFrames: 193 },
];

export const totalDurationInFrames = clips.reduce(
  (sum, clip) => sum + clip.durationInFrames,
  0,
);

// Special flash/zoom transition — used only between clip 7 and clip 8
// (the reveal into the final Save-the-Date card), per director's request.
const TRANSITION_FRAMES = 18;

const FlashOut: FC<{ localDurationInFrames: number }> = ({
  localDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const start = localDurationInFrames - TRANSITION_FRAMES;
  const opacity = interpolate(frame, [start, localDurationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(
    frame,
    [start, localDurationInFrames],
    [1, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <AbsoluteFill style={{ backgroundColor: "white", opacity }} />
    </AbsoluteFill>
  );
};

const FlashIn: FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, TRANSITION_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, TRANSITION_FRAMES], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <AbsoluteFill style={{ backgroundColor: "white", opacity }} />
    </AbsoluteFill>
  );
};

// Final card: "טלי & ירון" / "שמרו את התאריך" / "10.10.2026",
// entering quietly ~1s into the last scene per the brief.
const TextOverlay: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const namesIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dateOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 140,
        fontFamily: "Georgia, 'Times New Roman', serif",
        textShadow: "0 2px 18px rgba(0,0,0,0.65)",
      }}
    >
      <div
        style={{
          transform: `scale(${namesIn})`,
          color: "white",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        טלי &amp; ירון
      </div>
      <div
        style={{
          opacity: taglineOpacity,
          color: "#ffe8b8",
          fontSize: 34,
          marginTop: 12,
        }}
      >
        שמרו את התאריך
      </div>
      <div
        style={{
          opacity: dateOpacity,
          color: "white",
          fontSize: 44,
          fontWeight: 700,
          marginTop: 8,
          letterSpacing: 2,
        }}
      >
        10.10.2026
      </div>
    </AbsoluteFill>
  );
};

export const SaveTheDate: FC = () => {
  let cursor = 0;
  const offsets = clips.map((clip) => {
    const from = cursor;
    cursor += clip.durationInFrames;
    return from;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {clips.map((clip, i) => {
        const isSceneBeforeTransition = i === 6; // clip-7
        const isSceneAfterTransition = i === 7; // clip-8

        return (
          <Sequence
            key={clip.file}
            from={offsets[i]}
            durationInFrames={clip.durationInFrames}
          >
            <OffthreadVideo
              src={staticFile(clip.file)}
              volume={clip.keepOriginalAudio ? 1 : 0}
            />
            {isSceneBeforeTransition && (
              <FlashOut localDurationInFrames={clip.durationInFrames} />
            )}
            {isSceneAfterTransition && (
              <>
                <FlashIn />
                <TextOverlay />
              </>
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

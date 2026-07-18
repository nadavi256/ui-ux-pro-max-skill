import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

type ClipSpec = {
  file: string;
  durationInFrames: number;
};

// Order and durations match the uploaded clips (clip-1 .. clip-8),
// measured with @remotion/renderer's getVideoMetadata (native 24fps source).
// Original embedded clip audio is kept (unmuted) on every clip — whatever
// sound is already baked into the Higgsfield footage stays as-is.
export const clips: ClipSpec[] = [
  { file: "clips/clip-1.mp4", durationInFrames: 121 },
  { file: "clips/clip-2.mp4", durationInFrames: 121 },
  { file: "clips/clip-3.mp4", durationInFrames: 121 },
  { file: "clips/clip-4.mp4", durationInFrames: 121 },
  { file: "clips/clip-5.mp4", durationInFrames: 121 },
  { file: "clips/clip-6.mp4", durationInFrames: 121 },
  { file: "clips/clip-7.mp4", durationInFrames: 121 },
  { file: "clips/clip-8.mp4", durationInFrames: 193 },
];

export const totalDurationInFrames = clips.reduce(
  (sum, clip) => sum + clip.durationInFrames,
  0,
);

/**
 * Sound design cue sheet from the director's notes, converted from the
 * brief's seconds-based timeline to this project's actual 24fps (the source
 * clips are natively 24fps, not the 30fps the brief assumes — the seconds
 * below are correct, a literal "seconds * 30" frame conversion would not be).
 *
 * NOT wired into the render tree yet: none of these audio files exist in
 * public/audio/, and there is no music/SFX generation tool available in
 * this environment (only text-to-speech). Once a file lands at the given
 * path, add `<Audio src={staticFile(path)} startFrom={...} />` inside the
 * matching clip's <Sequence> (or, for the background track, once at the
 * top level spanning the whole composition).
 */
export const SOUND_CUES = [
  {
    path: "audio/background-music.mp3",
    description: "Orchestral epic-dramatic trailer score, full length, ~52% volume",
    clip: null,
    startSeconds: 0,
  },
  { path: "audio/sfx-wind-gust.mp3", description: "Wind gust", clip: 1, startSeconds: 0 },
  { path: "audio/sfx-ominous-rumble.mp3", description: "Dark ominous rumble, held to end of scene", clip: 1, startSeconds: 2.0 },
  { path: "audio/sfx-heavy-footsteps.mp3", description: "Heavy footsteps on stone/metal", clip: 2, startSeconds: 0 },
  { path: "audio/sfx-sword-unsheathe.mp3", description: "Metallic sword unsheathe whoosh", clip: 2, startSeconds: 2.44 },
  { path: "audio/sfx-dragon-wings.mp3", description: "Large dragon wings flapping", clip: 3, startSeconds: 0 },
  { path: "audio/sfx-dragon-roar.mp3", description: "Monster dragon roar, scene's vocal peak", clip: 3, startSeconds: 1.38 },
  { path: "audio/sfx-attack-swoosh.mp3", description: "Beast attack swoosh, leads into next scene", clip: 3, startSeconds: 3.38 },
  { path: "audio/sfx-sword-impact-1.mp3", description: "First sword strike/impact crash", clip: 4, startSeconds: 0 },
  { path: "audio/sfx-battle-cry-1.mp3", description: "Groom's battle war cry, on the attack", clip: 4, startSeconds: 0.81 },
  { path: "audio/sfx-dragon-roar-burst.mp3", description: "Second, shorter reactive dragon roar", clip: 4, startSeconds: 2.31 },
  { path: "audio/sfx-sword-impact-2.mp3", description: "Second sword strike/impact crash", clip: 5, startSeconds: 0 },
  { path: "audio/sfx-battle-cry-2.mp3", description: "Groom's second battle cry, decisive blow", clip: 5, startSeconds: 0.35 },
  { path: "audio/sfx-dragon-pained-roar.mp3", description: "Dragon's pained roar", clip: 5, startSeconds: 1.75 },
  { path: "audio/sfx-impact-boom.mp3", description: "Final impact boom, dragon weakens", clip: 5, startSeconds: 3.25 },
  { path: "audio/sfx-triumphant-boom.mp3", description: "Triumphant impact boom", clip: 6, startSeconds: 0 },
  { path: "audio/sfx-sword-whoosh.mp3", description: "Sword swing whoosh, final raise", clip: 6, startSeconds: 1.69 },
  { path: "audio/sfx-fairy-chime.mp3", description: "Gentle fairy sparkle chime, held through scene", clip: 7, startSeconds: 0 },
  { path: "audio/sfx-comedic-boing.mp3", description: "Comedic boing, synced to dragon's point", clip: 8, startSeconds: 2.56 },
  { path: "audio/sfx-small-sparkle.mp3", description: "Small sparkle, synced to the wink", clip: 8, startSeconds: 4.56 },
] as const;

// Special flash/zoom transition — used only between clip 7 and clip 8
// (the reveal into the final scene), per director's request.
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
            <OffthreadVideo src={staticFile(clip.file)} />
            {isSceneBeforeTransition && (
              <FlashOut localDurationInFrames={clip.durationInFrames} />
            )}
            {isSceneAfterTransition && <FlashIn />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

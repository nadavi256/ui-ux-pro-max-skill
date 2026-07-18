import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type HelloWorldProps = {
  titleText: string;
  subtitleText: string;
};

export const HelloWorld: FC<HelloWorldProps> = ({
  titleText,
  subtitleText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${titleSpring})`,
          color: "white",
          fontSize: 90,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {titleText}
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          color: "#c7d2fe",
          fontSize: 36,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        {subtitleText}
      </div>
    </AbsoluteFill>
  );
};

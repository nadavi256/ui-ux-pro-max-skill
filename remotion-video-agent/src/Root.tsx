import type { FC } from "react";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Reel, reelDurationInFrames } from "./Reel";

export const RemotionRoot: FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Remotion Video Agent",
          subtitleText: "Programmatic video, rendered in code",
        }}
      />
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={reelDurationInFrames}
        fps={24}
        width={720}
        height={1280}
      />
    </>
  );
};

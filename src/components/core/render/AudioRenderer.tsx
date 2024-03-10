"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDurationAudio } from "@/lib/utils";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

type AudioRendererProps = {
  url: string;
  name: string;
};

export const AudioRenderer = ({ url, name }: AudioRendererProps) => {
  const waveFormRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer>();
  const { height, ref: waveContainerRef } = useResizeDetector();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setcurrentTime] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (!height || !theme) return;
    waveSurfer.current = WaveSurfer.create({
      container: waveFormRef.current!,
      url,
      height: height,
      progressColor: "hsla(213, 95%, 79%)",
      waveColor: theme === "light" ? "hsla(213 14% 60%)" : "hsla(213 1% 83%)",
      cursorWidth: 2,
      plugins: [
        Hover.create({
          lineColor: "hsla(7 83% 59%)",
          lineWidth: 2,
          labelBackground: "#000",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });

    function onReadyListener() {
      setVolume(waveSurfer.current!.getVolume());
      setDuration(waveSurfer.current!.getDuration());
    }

    function onAudioProcessListener() {
      setcurrentTime(waveSurfer.current!.getCurrentTime());
    }

    function onPlay() {
      setIsPlaying(true);
    }

    function onPause() {
      setIsPlaying(false);
    }

    function onTimeUpdate() {
      setcurrentTime(waveSurfer.current!.getCurrentTime());
    }

    waveSurfer.current.on("ready", onReadyListener);

    waveSurfer.current.on("audioprocess", onAudioProcessListener);

    waveSurfer.current.on("play", onPlay);

    waveSurfer.current.on("pause", onPause);

    waveSurfer.current.on("timeupdate", onTimeUpdate);

    return () => {
      waveSurfer.current?.un("audioprocess", onAudioProcessListener);
      waveSurfer.current?.un("ready", onReadyListener);
      waveSurfer.current?.un("play", onPlay);
      waveSurfer.current?.un("pause", onPause);
      waveSurfer.current?.un("timeupdate", onTimeUpdate);
      waveSurfer.current?.destroy();
    };
  }, [height, url, theme]);

  const handlePlayPause = () => void waveSurfer.current?.playPause();

  const handleMute = () => {
    setIsMuted((prev) => !prev);
    waveSurfer.current?.setVolume(isMuted ? volume : 0);
  };

  const handleVolumenChange = ([newVolumen]: number[]) => {
    setVolume(newVolumen!);
    waveSurfer.current?.setVolume(newVolumen! / 1);
  };

  return (
    <div className="flex flex-col gap-10 p-2">
      <p className="mt-4 text-center text-xl font-semibold">{name}</p>
      <div className="flex-1" ref={waveContainerRef}>
        <div ref={waveFormRef} />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5" />
            )}
          </Button>

          <span>
            {formatDurationAudio(currentTime)} / {formatDurationAudio(duration)}
          </span>
        </div>
        <div className="mr-2 flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleMute}>
            {isMuted ? (
              <VolumeXIcon className="size-5" />
            ) : (
              <Volume2Icon className="size-5" />
            )}
          </Button>
          <Slider
            value={isMuted ? [0] : [volume]}
            disabled={isMuted}
            max={1}
            step={0.01}
            className="w-24"
            onValueChange={handleVolumenChange}
          />
        </div>
      </div>
    </div>
  );
};

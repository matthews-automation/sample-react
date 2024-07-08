"use client";
import cn from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatTime } from "@/core/utils";
import Play from "@/assets/icons/play.svg";
import Pause from "@/assets/icons/pause.svg";
import NoSound from "@/assets/icons/no-sound.svg";
import Sound from "@/assets/icons/sound.svg";
import IconButton from "../Buttons/IconButton";

import "./index.scss";

type Props = { video: string };

export default function InlineVideo({ video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [uiActive, setUIActive] = useState(true);
  
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseMoveRef = useRef<NodeJS.Timeout>();

  const handlePlayClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      updateProgress();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleMute = () => { 
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  const updateProgress = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setCurrentTime(currentTime);
      setDuration(duration);
      const progressPercentage = (currentTime / duration) * 100;
      setProgressPercentage(progressPercentage);
      if (progressPercentage >= 100) {
        cancelAnimationFrame(animationFrameRef.current);
        return;
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };
  const handleMouseMove = () => {
    setUIActive(true);
    clearTimeout(mouseMoveRef.current);
    mouseMoveRef.current = setTimeout(() => { setUIActive(false); }, 3500);
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadedMetadata = () => { setDuration(video.duration); };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [videoRef]);

  useLayoutEffect(() => {
    let intersectionObserver: IntersectionObserver;
    if (rootRef.current && videoRef.current) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      });
      intersectionObserver.observe(rootRef.current);
    }
    return () => {
      if (rootRef.current) intersectionObserver.unobserve(rootRef.current);
    }
  }, []);
  return (
    <div className="inline-video" ref={rootRef}>
      <video
        src={`${video}#t=0.1`}
        ref={videoRef}
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        onMouseMove={handleMouseMove}
        onClick={handlePlayClick}
      />
      <div className={cn("inline-video__controls", !uiActive && "hidden")}>
        <div className="time body-small">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="progress">
          <div className="progress__bar">
            <div
              className="progress__bar__inner"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className={cn("buttons", !uiActive && "hidden")}>
          <IconButton
            className={cn("play-button", isPlaying && "playing")}
            icon={isPlaying ? Pause : Play}
            onClick={handlePlayClick}
          />
          <IconButton
            className={cn("sound-button", isMuted && "muted")}
            icon={isMuted ? NoSound : Sound}
            onClick={handleMute}
          />
        </div>
      </div>
    </div>
  );
}

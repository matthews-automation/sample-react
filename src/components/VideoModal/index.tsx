"use client";
import gsap from "gsap";
import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Play from "@/assets/icons/play.svg";
import Pause from "@/assets/icons/pause.svg";
import Close from "@/assets/icons/close.svg";
import Captions from "@/assets/icons/captions.svg";
import NoCaptions from "@/assets/icons/no-captions.svg";
import NoSound from "@/assets/icons/no-sound.svg";
import Sound from "@/assets/icons/sound.svg";
import { useViewSize } from "@/providers/view-size";
import { useScroll } from "@/providers/scroll-pos";
import emitter from "@/core/EventBus";
import { formatTime } from "@/core/utils";
import IconButton from "../Buttons/IconButton";

import "./index.scss";

type Props = {
  data: WebGLHero["video"];
  isIOS: boolean;
};


export default function VideoModal(props: Props) {
  const { video, video_clip, video_thumbnail, video_label, title, description, captions } = props.data;
  const { isIOS } = props;
  const captionURL = captions ? captions.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL!, process.env.NEXT_PUBLIC_FE_URL!) : '';
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const nodeRef = useRef(null);
  const animationFrameRef = useRef(0);
  const isClosingRef = useRef(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uiActive, setUIActive] = useState(true);
  const [activeCue, setActiveCue] = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const [disableCaptions, setDisableCaptions] = useState(false);
  
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const { viewWidth, viewHeight, isMobile } = useViewSize();
  const { scrollPos } = useScroll();
  const [sticky, setSticky] = useState(false);

  

  const handleCursorEnter = () => {
    if (isMobile || isIOS) return;
    setSticky(true);
  };
  const handleCursorLeave = () => {
    if (isMobile || isIOS) return;
    setSticky(false);
  }

  const getSizes = useCallback((rect: DOMRect) => {
    let width = viewWidth - 48;
    let height = (width / 16) * 9;
    if (height > viewHeight - 48) {
      height = viewHeight - 48;
      width = (height / 9) * 16;
    }
    const xPos = ((viewWidth - width) / 2) - rect.left;
    const yPos = ((viewHeight - height) / 2) - rect.top;
    return { height, width, xPos, yPos };
  }, [viewHeight, viewWidth]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    cancelAnimationFrame(animationFrameRef.current);
    videoRef.current?.pause();
    setShowCaption(false);
    setIsOpened(false);
    setShowUI(false);
    isClosingRef.current = true;
    emitter.emit("HIDE_HEADER", false);
    emitter.emit("VIDEO_OPEN", false);
    gsap.to(previewRef.current, {
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setIsOpen(false);
        setShowUI(false);
        setActiveCue('');
        if (videoRef.current) {
          gsap.set(previewRef.current, { clearProps: 'all' });
          setTimeout(() => {
            if (videoRef.current) videoRef.current.currentTime = 0;
            setIsPlaying(false);
            isClosingRef.current = false;
          }, 350);
        }
      }
    });
  };
  const handleOpen = () => {
    if ((isMobile || isIOS) && videoRef.current) {
      if (isIOS) {
        videoRef.current.play();
        // @ts-expect-error
        videoRef.current.webkitEnterFullScreen();
      } else {
        videoRef.current.requestFullscreen();
      }
      return;
    }
    if (!previewRef.current) return;
    setIsOpen(true);
    const rect = previewRef.current.getBoundingClientRect();
    const { height, width, xPos, yPos } = getSizes(rect);
    emitter.emit("HIDE_HEADER", true);
    emitter.emit("VIDEO_OPEN", true);
    setIsPlaying(true);
    gsap.to(previewRef.current, {
      x: xPos,
      y: yPos,
      width,
      height,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsOpened(true);
          updateProgress();
          setShowUI(true);
        }
      }
    });
  }

  const handleUIEnter = () => {
    if (!uiRef.current) return;
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = () => {
      setUIActive(true);
      clearTimeout(timeoutId); 
      timeoutId = setTimeout(() => { setUIActive(false); }, 5000);
    };
    uiRef.current.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();
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
    setIsMuted(videoRef.current.muted)
  };

  const handleDisableCaptions = () => {
    setDisableCaptions(!disableCaptions);
  };

  const handleCueChange = (e: Event) => {
    if (!trackRef.current) return;
    const track = trackRef.current.track;
    const activeCue = track.activeCues?.[0] as VTTCue;
    if (activeCue) {
      setActiveCue(activeCue.text);
      setShowCaption(true);
    } else {
      setShowCaption(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadedMetadata = () => { setDuration(video.duration); };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [videoRef]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.track.addEventListener('cuechange', handleCueChange);
      const cues = trackRef.current.track.cues;
      if (cues) {
        Array.from(cues).forEach((cue: VTTCue) => cue.size = 80);
      }

    }
    return () => {
      if (trackRef.current) trackRef.current.track.removeEventListener('cuechange', handleCueChange);
    }
  }, [uiActive])

  useEffect(() => {
    if (!isClosingRef.current && isOpen) { handleClose(); }
  }, [viewHeight, viewWidth, scrollPos]);
  return (
    <div className="video-modal" ref={rootRef}>
      <div
        className="video-modal__preview"
        ref={previewRef}
        onMouseEnter={handleCursorEnter}
        onMouseLeave={handleCursorLeave}
      >
        <CSSTransition
          in={sticky && !isOpen}
          nodeRef={nodeRef}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <video
            src={video_clip ?? `${video_clip}#t=0.1`}
            ref={nodeRef}
            className="video-modal__preview__video-clip"
            loop
            muted
            autoPlay
            playsInline
            disablePictureInPicture
            disableRemotePlayback
          />
        </CSSTransition>
          <div className="video-modal__preview__video">
            <div className={cn("video-modal__preview__video__image", isOpen && 'hidden')}>
              <img src={video_thumbnail || ""} alt="" />
            </div>
            <video src={`${video}#t=0.1`} ref={videoRef} disablePictureInPicture disableRemotePlayback playsInline>
              <track kind={isMobile || isIOS ? 'captions' : 'metadata'} ref={trackRef} default src={captionURL || ""} />
            </video>
            <CSSTransition
              in={showCaption && !disableCaptions && !isMobile && !isIOS}
              classNames={'fade'}
              nodeRef={captionRef}
              timeout={300}
              unmountOnExit
            >
              <div className="caption-wrapper" ref={captionRef}>
                <p className={cn('caption', uiActive && 'ui-active')} dangerouslySetInnerHTML={{ __html: activeCue }} />
              </div>
            </CSSTransition>
          </div>
        <CSSTransition
          in={!isOpen}
          nodeRef={buttonRef}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <button className="video-modal__preview__play" aria-label="Play" onClick={handleOpen} ref={buttonRef}>
            <div className="play-icon">
              <Play />
            </div>
            <p className="video-label tag" dangerouslySetInnerHTML={{ __html: video_label }} />
          </button>
        </CSSTransition>
        <CSSTransition
          in={showUI}
          nodeRef={uiRef}
          timeout={300}
          onEntered={handleUIEnter}
          classNames="fade"
          unmountOnExit
        >
          <div
            className={cn("video-modal__preview__ui", !uiActive && "hidden")}  
            ref={uiRef}
            onClick={handlePlayClick}
          >
            <IconButton className="close" icon={Close} onClick={handleClose} />
            <div className="video-modal__preview__ui__controls">
              <p className="subtitle-4" dangerouslySetInnerHTML={{ __html: title }} />
              <div className="time">
                <p className="body" dangerouslySetInnerHTML={{ __html: description }} />
                <p className="time__time body-medium">{formatTime(currentTime)} / {formatTime(duration)}</p>
              </div>
              <div className="progress">
                <div className="progress__bar">
                  <div className="progress__bar__inner" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              <div className={cn("buttons", !uiActive && "hidden")}>
                <IconButton
                  className={cn("play-button", isPlaying && "playing")}
                  icon={!isPlaying ? Play : Pause}
                  onClick={handlePlayClick}
                />
                <IconButton
                  className={cn("sound-button", isMuted && "muted")}
                  icon={isMuted ? NoSound : Sound}
                  onClick={handleMute}
                />
                <IconButton
                  className={cn("caption-button", disableCaptions && "no-cap")}
                  icon={disableCaptions ? NoCaptions : Captions}
                  onClick={handleDisableCaptions}
                />
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
}

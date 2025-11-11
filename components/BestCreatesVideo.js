"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const BestCreatesVideo = ({
  title,
  url,
  className,
  originalWidth = 640,
  originalHeight = 360,
}) => {
  const [size, setSize] = useState({
    width: originalWidth,
    height: originalHeight,
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(containerWidth, originalWidth);
        const aspectRatio = originalWidth / originalHeight;
        const newHeight = Math.round(newWidth / aspectRatio);

        setSize({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(updateSize);

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [originalWidth, originalHeight]);

  return (
    <div className={className} ref={containerRef}>
      <p className="text-start text-3xl text-black dark:text-white mt-5 ml-14">
        {title}
      </p>
      <div
        className="relative"
        style={{ width: size.width, height: size.height }}
      >
        <ReactPlayer
          url={url}
          controls={true}
          width="100%"
          height="100%"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default BestCreatesVideo;

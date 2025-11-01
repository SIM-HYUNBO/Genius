// ("use client");
// `use strict`;
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Table } from "antd";

// ReactPlayer는 클라이언트 전용
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const BrunnerVideo = ({
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
  const [isClient, setIsClient] = useState(false);

  // 클라이언트에서만 렌더링 시작
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(containerWidth, originalWidth);
        const aspectRatio = originalWidth / originalHeight;
        const newHeight = Math.round(newWidth / aspectRatio);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
    };
  }, [originalWidth, originalHeight, isClient]);

  if (!isClient) return null; // SSR 단계에서는 아무것도 렌더링하지 않음

  return (
    <div className={className} ref={containerRef}>
      <p className="text-left mt-5 mb-1 general-text-bg-color w-full">
        {title}
      </p>
      <div
        className="relative"
        style={{ width: size.width, height: size.height }}
      >
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default BrunnerVideo;

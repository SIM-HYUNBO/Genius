import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Table } from "antd";

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

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(updateSize);

    if (container) resizeObserver.observe(container);

    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  }, [originalWidth, originalHeight, isClient]);

  if (!isClient) return null;

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

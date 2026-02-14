export default function VideoPlayer({ videoUrl }) {
  return (
    <video
      src={videoUrl}
      controls
      autoPlay
      style={{ width: "100%", maxHeight: "500px" }}
    />
  );
}

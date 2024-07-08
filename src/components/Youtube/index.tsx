import "./index.scss";

interface YoutubeEmbedProps {
  youtubeurl: string;
}

export default function YoutubeEmbed({ youtubeurl }: YoutubeEmbedProps) {

  return (
    <div className="video-responsive">
      <iframe
        className=""
        src={`https://www.youtube.com/embed/${youtubeurl}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  )
}
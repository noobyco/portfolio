import CardActions from "../CardActions";
const TalkCard = (props) => {
  return (
    <article className="talk-card">
      <div className="card-media">
        <img src={"/talks/" + props.image} alt={`${props.title} session`} loading="lazy" decoding="async" />
        <div className="card-media-label"><span>FROM THE STAGE</span><span>{String((props.index ?? 0) + 1).padStart(2, "0")}</span></div>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>Talks & workshops / {String((props.index ?? 0) + 1).padStart(2, "0")}</span>
        </div>
        <h2 className="card-heading">{props.title}</h2>

        <p className="card-resource-label">Continue the conversation</p>
        <CardActions title={props.title} links={[
          { url: props.videoUrl, label: "Watch talk" },
          { url: props.pptUrl, label: "View slides" },
          { url: props.blogUrl, label: "Read recap" },
          { url: props.postUrl, label: "Event post" },
        ]} />
      </div>
    </article>
  );
};

export default TalkCard;

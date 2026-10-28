import CardActions from "../CardActions";

const ProjectCard = ({
  image,
  title,
  description,
  codebaseUrl,
  projectUrl,
  videoUrl,
  status,
  index = 0,
}) => {
  return (
    <article className="project-card">
      <div className="card-media">
        <div className="card-media-label"><span>PROJECT FILE</span><span>{String(index + 1).padStart(2, "0")}</span></div>
        <img src={`/project/${image}`} alt={`${title} preview`} loading="lazy" decoding="async" />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>Selected work / {String(index + 1).padStart(2, "0")}</span>
          {status ? (
            <span className="status-chip">
              <span aria-hidden="true" />
              {status}
            </span>
          ) : null}
        </div>
        <h2 className="card-heading">{title}</h2>
        <p className="project-description">{description}</p>
        <CardActions
          title={title}
          links={[
            { url: projectUrl, label: "Explore project" },
            { url: codebaseUrl, label: "Source code" },
            { url: videoUrl, label: "Watch demo" },
          ]}
        />
      </div>
    </article>
  );
};

export default ProjectCard;

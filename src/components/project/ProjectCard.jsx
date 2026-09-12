import { MdArrowForwardIos } from "react-icons/md";

const ProjectCard = ({
  image,
  title,
  description,
  codebaseUrl,
  projectUrl,
  videoUrl,
  status,
}) => {
  const descContentLength = 100;
  const truncatedDescription =
    description.length > descContentLength
      ? `${description.slice(0, descContentLength)}...`
      : description;

  const renderLinkButton = (url, label) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-action"
    >
      {label} <MdArrowForwardIos aria-hidden="true" />
    </a>
  );

  return (
    <article className="project-card">
      <div className="card-media">
        <img src={`/project/${image}`} alt={`${title} preview`} />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>Project / Selected work</span>
          {status ? (
            <span className="status-chip">active</span>
          ) : (
            <span>Archive</span>
          )}
        </div>
        <h1 className="card-heading">{title}</h1>
        <p className="card-description">{truncatedDescription}</p>
        <div className="card-actions">
          {codebaseUrl && renderLinkButton(codebaseUrl, "Codebase")}
          {projectUrl && renderLinkButton(projectUrl, "Project")}
          {videoUrl && renderLinkButton(videoUrl, "Video")}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

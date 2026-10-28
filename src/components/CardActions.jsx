import { FiArrowUpRight } from "react-icons/fi";

export default function CardActions({ links, title }) {
  const available = links.filter(({ url }) => url);
  if (!available.length) return null;

  return (
    <div className="card-actions">
      {available.map(({ url, label }, index) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`card-action${index === 0 ? " card-action-primary" : ""}`}
          aria-label={`${label}: ${title} (opens in a new tab)`}
        >
          {label}<FiArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

import { MdArrowForwardIos } from "react-icons/md";
const TalkCard = (props) => {
  return (
    <article className="talk-card">
      <div className="card-media">
        <img src={"/talks/" + props.image} alt={`${props.title} preview`} />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>Talk / Notes</span>
          <span>Available online</span>
        </div>
        <h1 className="card-heading">{props.title}</h1>

        <div className="card-actions">
          {props.blogUrl && (
            <a href={props.blogUrl} target="_blank" className="">
              Blog <MdArrowForwardIos className="ml-1" />
            </a>
          )}
          {props.videoUrl && (
            <a href={props.videoUrl} target="_blank" className="">
              Video <MdArrowForwardIos className="ml-1" />
            </a>
          )}
          {props.postUrl && (
            <a href={props.postUrl} target="_blank" className="">
              Post <MdArrowForwardIos className="ml-1" />
            </a>
          )}
          {props.pptUrl && (
            <a href={props.pptUrl} target="_blank" className="">
              Slides <MdArrowForwardIos className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default TalkCard;

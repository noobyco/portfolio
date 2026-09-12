const Card = (props) => {
  return (
    <a
      href={props.url}
      className="contact-link"
      target="_blank"
      rel="noreferrer"
    >
      <img src={"/contacts/" + props.icon + ".svg"} alt="" width={50} />
      <h3>{props.name}</h3>
    </a>
  );
};

export default Card;

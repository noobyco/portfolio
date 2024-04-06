const Card = (props) => {
    return (
            <a href={props.url} className="flex flex-col items-center" target="_blank">
                <img src={"/contacts/" + props.icon + ".svg"}  width={50}/>
                <h3 className="text-md font-semibold text-center p-2">{props.name}</h3>
            </a>
    );
}

export default Card;
const ExperienceCard = (props) => {
    return (
        <div className="w-[90%] m-auto p-[2rem] bg-slate-200 mt-[5rem] rounded-xl">
            <div className="flex justify-start gap-[2rem] items-center">
                <img className="w-[10rem] h-fit sm:w-[10rem] object-contain object-center rounded-full overflow-hidden ring-4 ring-grey-300 p-4" src={"/experience/" + props.logo} />
                <div className="">
                    <h1 className="text-md font-bold sm:font-semibold sm:text-2xl">{props.roleName}</h1>
                    <h3>{props.startDate + " - " + props.endDate}</h3>
                </div>
            </div>
            <div className="mt-[2rem] flex gap-10 flex-col items-start">
                <p className="text-slate-700 text-xl leading-8">{props.description}</p>
                <button className="text-md ring ring-white p-2 rounded-md font-semibold">
                    <a href={props.exploreUrl} target="_blank">Explore</a>
                </button>
            </div>
        </div>
    );
}

export default ExperienceCard;

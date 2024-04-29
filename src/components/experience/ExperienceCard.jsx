import { FaAngleRight } from "react-icons/fa6";

const ExperienceCard = (props) => {
    return (
        <div className="w-[90%] m-auto p-[2rem] bg-slate-100 mt-[5rem] rounded-xl">
            <div className="flex justify-start gap-[2rem] items-center">
                <img className="w-[10rem] h-fit sm:w-[10rem] object-contain object-center rounded-full overflow-hidden ring-4 ring-grey-300 p-4" src={"/experience/" + props.logo} />
                <div className="">
                    <h1 className="text-md font-bold sm:font-semibold sm:text-2xl">{props.roleName}</h1>
                    <h3>{props.startDate + " - " + props.endDate}</h3>
                </div>
            </div>
            <div className="mt-[2rem] flex gap-10 flex-col items-start">
                <p className="text-slate-700 text-xl leading-8">{props.description}</p>
                <button className="text-md border-2 border-grey-900 p-1 flex items-center justify-between rounded">
                    <a href={props.exploreUrl} className="text-md font-semibold" target="_blank">Explore {<FaAngleRight className="inline"/>}</a>
                    
                </button>
            </div>
        </div>
    );
}

export default ExperienceCard;

import { BsArrowUpRight } from "react-icons/bs";
import { useState, useEffect } from "react";

const ProjectCard = (props) => {
    const [readActive, setReadActive] = useState(true);
    return (
        <div className="mb-[5rem]">
            <img src={"/project/" + props.image} className="min-w-[10rem] max-h-[12rem] mb-2 object-contain overflow-hidden " alt="Project" />
            <div>
                <h1 className="text-slate-900 font-base mb-[2rem] text-2xl leading-[2.5rem] underline underline-offset-4 decoration-slate-200"><a href="">{props.title}</a></h1>
                <p className="text-slate-700 text-xl leading-[2.5rem] inline ">{readActive ? props.description.slice(0, 300) : props.description}</p>
                {
                    readActive ? (<button className={readActive? "text-md ml-2 font-semibold": "hidden"} onClick={() => setReadActive((prevState)=> !prevState)}>read more...</button>) : (<button className={readActive? "hidden": "text-md ml-2 font-semibold"} onClick={() => setReadActive((prevState)=> !prevState)}>read less...</button>)
                }
                <br/>
                <button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.codebaseUrl}>Codebase <span><BsArrowUpRight className="inline mb-2"/></span></a>
                </button>
                <button className="bg-slate-100 rounded-full p-2 m-1  hover:bg-black hover:text-white">
                    <a href={props.projectUrl}>Project url <span><BsArrowUpRight className="inline mb-2"/></span></a>
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;

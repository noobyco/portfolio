import { BsArrowUpRight } from "react-icons/bs";
import { useState } from "react";

const ProjectCard = (props) => {
    const [readActive, setReadActive] = useState(true);
    const descContentLenfth = 250
    return (
        <div className="mb-[5rem]">
            <img src={"/project/" + props.image} className="min-w-[10rem] max-h-[25rem] mb-2 object-contain overflow-hidden" alt="Project image" />
            <div>
                <h1 className="text-slate-900 font-base mb-[2rem] text-2xl leading-[2.5rem] underline underline-offset-4 decoration-slate-200">{props.title}</h1>
                <p className="text-slate-700 text-xl leading-[2.5rem] inline ">{readActive ? (props.description.length > descContentLenfth? props.description.slice(0,250) : props.description ) : props.description}</p>
                {
                    readActive ? (props.description.length > descContentLenfth && <button className={readActive? "text-md ml-2 font-semibold": "hidden"} onClick={() => setReadActive((prevState)=> !prevState)}>read more...</button>) : (props.description.length > descContentLenfth && <button className={readActive? "hidden": "text-md ml-2 font-semibold"} onClick={() => setReadActive((prevState)=> !prevState)}>read less...</button>)
                }
                <br/>
                {
                    props.codebaseUrl && (<button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.codebaseUrl} target="_blank">Codebase <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }
                
                {
                    props.projectUrl && (<button className="bg-slate-100 rounded-full p-2 m-1  hover:bg-black hover:text-white">
                    <a href={props.projectUrl} target="_blank">Project <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }

                {
                    props.videoUrl && (<button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.videoUrl} target="_blank">Video <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }
                
            </div>
        </div>
    );
}

export default ProjectCard;

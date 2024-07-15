import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const ProjectCard = (props) => {
    const [readActive, setReadActive] = useState(true);
    const descContentLength = 100;
    const truncatedDescription = props.description.slice(0, descContentLength);

    return (
        <div className="mb-12 p-4 bg-white shadow-2xl rounded-lg max-w-sm mx-auto transition-transform transform hover:scale-105">
            <img 
                src={"/project/" + props.image} 
                className="w-full h-48 object-cover rounded-t-lg mb-4" 
                alt="Project image" 
            />
            <div>
                <h1 className="text-slate-900 font-semibold mb-6 text-2xl leading-snug underline underline-offset-4 decoration-slate-200">
                    {props.title}
                </h1>
                <p className="text-slate-700 text-xl leading-snug mb-4">
                    {readActive ? truncatedDescription : props.description}
                    {props.description.length > descContentLength && (
                        <button 
                            className="text-md ml-2 font-semibold text-blue-600 hover:underline" 
                            onClick={() => setReadActive(!readActive)}
                        >
                            {readActive ? "read more..." : "read less..."}
                        </button>
                    )}
                </p>
                <div className="space-x-2">
                    {props.codebaseUrl && (
                        <a 
                            href={props.codebaseUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Codebase <MdArrowForwardIos className="ml-1" />
                        </a>
                    )}
                    {props.projectUrl && (
                        <a 
                            href={props.projectUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Project <MdArrowForwardIos className="ml-1" />
                        </a>
                    )}
                    {props.videoUrl && (
                        <a 
                            href={props.videoUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Video <MdArrowForwardIos className="ml-1" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;

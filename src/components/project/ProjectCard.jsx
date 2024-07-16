import { MdArrowForwardIos } from "react-icons/md";

const ProjectCard = ({ image, title, description, codebaseUrl, projectUrl, videoUrl, status }) => {
    const descContentLength = 100;
    const truncatedDescription = description.length > descContentLength ? `${description.slice(0, descContentLength)}...` : description;

    const renderLinkButton = (url, label) => (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center"
        >
            {label} <MdArrowForwardIos className="ml-1" />
        </a>
    );

    return (
        <div className="mb-12 p-4 w-full bg-white shadow-2xl rounded-lg max-w-md mx-auto transition-transform transform hover:scale-105 cursor-pointer">
            <img 
                src={`/project/${image}`} 
                className="w-full h-48 object-cover rounded-t-lg mb-4" 
                alt="Project image" 
            />
            <div>
                <div className="flex items-center space-x-6">
                    <h1 className="text-slate-900 font-semibold mb-2 text-2xl leading-snug underline underline-offset-4 decoration-slate-200">{title}</h1>
                    {status ? (<h1 className="text-xl rounded-md px-1 text-white bg-green-500">active</h1>) : null}
                </div>

                <p className="text-slate-700 text-xl leading-snug mb-4">
                    {truncatedDescription}
                </p>
                <div className="space-x-2">
                    {codebaseUrl && renderLinkButton(codebaseUrl, "Codebase")}
                    {projectUrl && renderLinkButton(projectUrl, "Project")}
                    {videoUrl && renderLinkButton(videoUrl, "Video")}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;

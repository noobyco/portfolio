import { MdArrowForwardIos } from "react-icons/md";
const TalkCard = (props) => {
    return (
        <div className="mb-12 p-4 w-full bg-white shadow-2xl rounded-lg max-w-md mx-auto transition-transform transform hover:scale-105 cursor-pointer">
            <img 
                src={"/talks/" + props.image} 
                className="w-full h-48 object-cover rounded-t-lg mb-4" 
                alt="Meetup image" 
            />
            <div>
                <h1 className="text-slate-900 font-semibold mb-6 text-2xl leading-snug underline underline-offset-4 decoration-slate-200">
                    {props.title}
                </h1>

                <div className="space-x-2">
                    {props.blogUrl && (
                        <a 
                            href={props.blogUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Blog <MdArrowForwardIos className="ml-1" />
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
                    {props.postUrl && (
                        <a 
                            href={props.postUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Post <MdArrowForwardIos className="ml-1" />
                        </a>
                    )}
                    {props.pptUrl && (
                        <a 
                            href={props.pptUrl} 
                            target="_blank" 
                            className="hover:bg-[#F5F5F5] rounded-md font-bold px-4 py-2 m-1 inline-flex items-center">
                            Slides <MdArrowForwardIos className="ml-1" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TalkCard;

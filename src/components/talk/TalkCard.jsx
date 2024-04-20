import { BsArrowUpRight } from "react-icons/bs";

const TalkCard = (props) => {
    return (
        <div className="mb-[5rem]">
            <img src={"/talks/" + props.image} className="min-w-[10rem] max-h-[25rem] mb-2 object-contain overflow-hidden" alt="Meetup image" />
            <div>
                <h1 className="text-slate-900 font-base mb-[2rem] text-2xl leading-[2.5rem] underline underline-offset-4 decoration-slate-200">{props.title}</h1>

                {
                    props.blogUrl && (<button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.blogUrl} target="_blank">Blog <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }
                
                {
                    props.videoUrl && (<button className="bg-slate-100 rounded-full p-2 m-1  hover:bg-black hover:text-white">
                    <a href={props.videoUrl} target="_blank">Video <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }

                {
                    props.postUrl && (<button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.postUrl} target="_blank">Post <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }
                
                {
                    props.pptUrl && (<button className="bg-slate-100 rounded-full p-2 m-1 hover:bg-black hover:text-white">
                    <a href={props.pptUrl} target="_blank">Slides <span><BsArrowUpRight className="inline mb-2"/></span></a></button>)
                }
                
            </div>
        </div>
    )
}

export default TalkCard;

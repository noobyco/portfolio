import { FaAngleRight } from "react-icons/fa6";

const ExperienceCard = (props) => {
  return (
    <div className="w-[90%] m-auto p-[2rem] bg-[#F5F5F5] mt-[5rem] rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            className="w-[10rem] h-fit sm:w-[12rem] object-contain object-center rounded-full overflow-hidden ring-2 ring-gray-300 p-4"
            src={`/experience/${props.logo}`}
            alt={props.roleName} // Add alt text for accessibility
          />
          <div className="ml-4">
            <h1 className="text-xl font-bold sm:text-2xl text-gray-900">{props.roleName}</h1>
            <h3 className="text-gray-600 text-sm font-medium">
              {props.startDate} - {props.endDate}
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-[2rem] flex flex-col items-start">
        <p className="text-gray-700 text-lg leading-8 mb-4">{props.description}</p>
        <a
          href={props.exploreUrl}
          className="text-md font-semibold bg-gradient-to-r text-transparent bg-clip-text from-sky-800 to-black p-1 rounded flex items-center justify-between hover:text-black transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer" // Add rel attribute for security
        >
          Explore
          <FaAngleRight className="inline ml-2 text-black" />
        </a>
      </div>
    </div>
  );
};

export default ExperienceCard;
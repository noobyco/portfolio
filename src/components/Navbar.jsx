import { GiFastBackwardButton } from "react-icons/gi";

const Navbar = (props) => {
    return (
        <nav className="flex w-full justify-between border-solid border-b-4 border-slate-200">
            <div className="flex justify-center items-center ml-[2rem] w-fit">
                <a href="/">
                    <GiFastBackwardButton size="2rem" color="#4477CE" className="mr-[2rem] cursor-pointer"/>
                </a>

                <a className="font-semibold text-xl text-slate-600"> / {props.urlx}</a>
            </div>

            <div className="h-[5rem] w-fit flex justify-end gap-10 items-center text-md font-semibold mr-[5rem]">
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800" href="/open-source">Open Source</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800" href="/projects">Projects</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800" href="https://noobyco.hashnode.dev" target="_blank">Blogs</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800" href="/talks">Talks</a>
            </div>
        </nav>
    );
}

export default Navbar;  

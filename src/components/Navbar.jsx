'use client'
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
const Navbar = (props) => {
    const [btnState, setBtnState] = useState(false);

    return (
        <nav className="flex h-[5rem] w-full justify-between items-center">
            <div className="flex justify-center items-center ml-[2rem] space-x-5">
                <a href="/"><img src="/favicon.svg" width="25"></img></a>
                <a className="font-semibold text-xl text-slate-600"> / {props.urlx}</a>

            </div>

            <div className="flex hidden mr-[2rem] sm:block justify-around items-center text-md font-semibold">
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800 p-5" href="/open-source">Open Source</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800 p-5" href="/projects">Projects</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800 p-5" href="https://noobyco.hashnode.dev" target="_blank">Blogs</a>
                <a className="hover:text-[#4477CE] tracking-wide text text-slate-800 p-5" href="/talks">Talks</a>
            </div>

            <div className="z-[50] h-[2rem] w-fit sm:hidden mr-[3rem]">
                <button onClick={ ()=> setBtnState((prevStateBtn) => !prevStateBtn)} className="cursor-pointer">
                    { btnState ? (<RxCross1 size={30} color={"black"} />) : (<HiOutlineMenuAlt3 size={30}/>)}
                </button>
            </div>
            {btnState ? 
            
            <div className="z-[30] transition absolute top-0 left-0 h-screen w-screen flex flex-col justify-center gap-16 items-center text-4xl font-semibold bg-gradient-to-bl from-blue-800 to-black sm:hidden">
                <a className="tracking-wide text-[#F5F5F5]" href="/open-source">Open Source</a>
                <a className="tracking-wide text-[#F5F5F5]" href="/projects">Projects</a>
                <a className="tracking-wide text-[#F5F5F5]" href="https://noobyco.hashnode.dev" target="_blank">Blogs</a>
                <a className="tracking-wide text-[#F5F5F5]" href="/talks">Talks</a>
            </div>
            :
            <div className="z-[30] -translate-y-[100rem] transition absolute top-0 left-0 h-screen w-screen flex flex-col justify-center gap-16 items-center text-4xl font-semibold bg-gradient-to-bl from-blue-800 to-black sm:hidden">
            <a className="tracking-wide text-[#F5F5F5]" href="/open-source">Open Source</a>
            <a className="tracking-wide text-[#F5F5F5]" href="/projects">Projects</a>
            <a className="tracking-wide text-[#F5F5F5]" href="https://noobyco.hashnode.dev" target="_blank">Blogs</a>
            <a className="tracking-wide text-[#F5F5F5]" href="/talks">Talks</a>
        </div>

            }
        </nav>
    );
}

export default Navbar;  

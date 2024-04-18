'use client'

import { GiFastBackwardButton } from "react-icons/gi";
import { useState, useEffect} from "react";
import { FaHamburger } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";

const Navbar = (props) => {
    const [btnState, setBtnState] = useState(false);

    return (
        <nav className="flex h-[5rem] w-full justify-between items-center border-solid border-b-4 border-slate-200">
            <div className="flex justify-center items-center ml-[2rem]">
                <a href="/">
                    <GiFastBackwardButton size="2rem" color="#4477CE" className="mr-[2rem] cursor-pointer"/>
                </a>
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
                    { btnState ? (<GiCrossMark size={30} color={"black"} />) : (<FaHamburger size={30}/>)}
                </button>
            </div>
            {btnState && 
            
            <div className="absolute top-0 left-0 h-screen w-screen flex flex-col justify-center gap-10 items-center text-4xl font-semibold bg-[#4477CE]">
                <a className="hover:text-[#4477CE] tracking-wide text-black" href="/open-source">Open Source</a>
                <a className="hover:text-[#4477CE] tracking-wide text-black" href="/projects">Projects</a>
                <a className="hover:text-[#4477CE] tracking-wide text-black" href="https://noobyco.hashnode.dev" target="_blank">Blogs</a>
                <a className="hover:text-[#4477CE] tracking-wide text-black" href="/talks">Talks</a>
            </div>
            }
        </nav>
    );
}

export default Navbar;  

const About = () => {
    return (
                <div className="m-auto w-[80%] mt-[3rem] mb-[10rem]">
                    
                    <div className="flex flex-col items-center justify-start">
                        <div className="flex flex-col items-center justify-center mb-[3rem]">
                            <img className="-z-[50] object-cover rounded-xl overflow-hidden p-1 w-[15rem] sm:w-[20rem] lg:w-[24rem]" src="/profilex.png"/>
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl tracking-wide mb-3 text-center uppercase text-transparent bg-clip-text bg-gradient-to-tl from-blue-800 to-black font-bold">Shekh Md Moinuddin</h1>
                            
                        </div>
                    </div>

                    <div className="flex justify-center mt-[5rem]">
                        <span className="m-auto font-bold text-6xl leading-8 my-[1rem]">...</span>
                    </div>
                    
                    <p className="my-[3rem] text-slate-700 text-2xl leading-[2.5rem]">
                        Hey there! 👋 Myself <span className="text-slate-800 font-semibold">Shekh Md Moinuddin</span> a young tech enthusiast and a final-year undergrad student in Information Science and Engineering.
                    </p>
                    <p className="my-[3rem] text-slate-700 text-2xl leading-[2.5rem]">
                        I love diving into all things tech with a curious mind that never stops exploring. Getting my hands dirty and using kick-ass self-learning methods are my jam. Sometimes, I get so engrossed in playing with electrons that I go a bit crazy, but hey, that's the thrill of it, right? 🤪 Exploring the binary world, tinkering with bits and bytes, and firing commands is just so darn exciting!
                    </p>
                    <p className="my-[3rem] text-slate-700 text-2xl leading-[2.5rem]">

                        And you know what else gets me hungry for more? Raspberry Pi and microcontrollers! They're like delicious treats that I can't get enough of. Trust me, they make the perfect combination, just like mayo on a sandwich. 😉
                    </p>
                </div>
    );
}

export default About;
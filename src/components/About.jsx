

const About = () => {
    return (

            <div>
                <div className="mt-[6rem] sm:w-[80%] mx-[2rem] mb-[10rem]">
                    <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-wide">Full Stack Developer.</h1>
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
                <div className="flex flex-col items-center justify-center my-[5rem]">

                    <img className="w-[12rem] h-[12rem] -z-[50] object-cover rounded-xl overflow-hidden ring-4 ring-grey-300 p-1 sm:w-[20rem] sm:h-[20rem]" src="/profile.jpg"/>
                    <span className="m-auto font-bold text-6xl leading-8 my-[1rem]">...</span>
                </div>
                
            </div>
    );
}

export default About;

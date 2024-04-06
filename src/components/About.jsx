

const About = () => {
    return (
        <div>
            {/* <div class="bg-contain bg-center" style={{backgroundImage: "/profile.jpg"}}></div> */}
            <img className="w-[20rem] h-[20rem] object-cover rounded-full overflow-hidden ring-4 ring-grey-300 p-1 absolute right-[5rem]" src="/profile.jpg"/>
            {/* <div className="">
            </div> */}
            <div className="mt-[8rem] w-[60%] ml-[2rem] mb-[10rem]">
                {/* <img src="/icons/pulse.svg" className="w-fit h-full translate-y-300 absolute"/> */}
                <h1 className="text-8xl font-bold tracking-wide">Full Stack Developer.</h1>
                <div className="mt-[2rem] text-slate-700 text-xl leading-8">
                    <span className="text-slate-800 font-semibold">Shekh Md Moinuddin</span> is a technical Explorer, love to 
                </div>
                <p className="mt-[2rem] text-slate-700 text-xl leading-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto molestias quibusdam nesciunt id praesentium voluptas quia, alias velit voluptatibus quae quo commodi, obcaecati rem sint qui perspiciatis minus quas sed! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nesciunt nemo, neque rerum omnis enim. Exercitationem aliquam cumque eum sint error ut, consectetur tempore soluta culpa nemo aut quisquam molestiae.</p>

                
            </div>
        </div>
    );
}

export default About;

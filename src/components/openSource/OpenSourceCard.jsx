import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
const OpenSourceCard = () => {
    const [prs, setPrs] = useState([]);


    useEffect(() => {
        const fetchPrs = async () => {
            try{
                const res = await fetch("https://api.github.com/search/issues?q=author:noobyco+type:pr&sort=asc", {
                    headers: {
                        Accept: "application/vnd.github.text-match+json"
                    }
                })
                const data = await res.json();
                setPrs(data.items);
            }catch{
                console.log("Error fetching data")
            }
        }
        fetchPrs();
    }, [])

    return (
        <div>
            <h1 className="text-center text-2xl">Open source Contributions</h1>

            <div className="mt-[2rem]">
                {
                    prs.map((pr, index) => {
                        return (
                            <a href={pr.html_url} target="_blank">
                                <div key={index} className="border-2 border-black m-1 p-4 hover:bg-slate-200 flex justify-between items-center">
                                    <div className="text-wrap h-fit">
                                        <h1 className="font-semibold">{pr.title}</h1>
                                        <p>{`#${pr.number} ${pr.state}`}</p>
                                    </div>
                                        <FaAngleRight />
                                </div>
                            </a>
                        )
                    })
                }
            </div>

        </div>
    );
}

export default OpenSourceCard;

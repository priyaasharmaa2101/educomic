'use client'
import { CheckIcon,   } from "lucide-react";
import { motion } from "motion/react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HeroSection() {

    const navigate = useNavigate()
     const { user } = useAuth() 
    const specialFeatures = [
        "Interactive comic style text",
        "Fast generation",
        "Flashcards",
        "Quizes",
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-6 rounded-2xl  border border-none "
          >
            <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32">
                <div className="absolute top-30 -z-10 left-1/4 size-72  bg-purple-600 blur-[300px]"></div>
                
                <div className="text-5xl/17 md:text-6xl/21 font-medium max-w-3xl text-center mt-44">
                    AI Comic Style Image  {" "}
                    <span className="move-gradient px-3 rounded-xl text-nowrap">Generator.</span>
                </div>

                <div className="text-base text-center text-slate-200 max-w-lg mt-6">
                    Stop wasting time on boring text. Get comic style text and comic with our advanced AI.</div>
                <div className="flex items-center gap-4 mt-8">
                    <button onClick={()=>navigate(user ? '/generate' : '/login')}  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-7 h-11">
                        Generate now
                    </button>
                    {/* <button className="flex items-center gap-2 border border-purple-900 hover:bg-purple-950/50 transition rounded-full px-6 h-11">
                        <VideoIcon strokeWidth={1} />
                        <span>See how it works</span>
                    </button> */}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
                    {specialFeatures.map((feature, index) => (
                        <div className="flex items-center gap-2" key={index}>
                            <CheckIcon className="size-5 text-purple-600" />
                            <span className="text-slate-400">{feature}</span>
                        </div>
                    ))}
                </div>
                
            </div>
        </motion.div>
    );
}
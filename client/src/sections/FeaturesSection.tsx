'use client'

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const featuresData = [
    {
        icon: "assets/zap-icon.svg",
        title: "AI Storytelling",
        description: "Topic-to-Comic AI : Enter any topic to instantly generate a full script and custom images in your favorite genre from Superhero , Sci-Fi , Fantasy to Thriller.",
    },
    {
        icon: "assets/thumb-icon.svg",
        title: "Active Recall",
        description: "Flashcards & Quizzes : Reinforce your learning with AI-generated Flashcards and a dynamic 5-question quiz tailored specifically to your chosen topic.",
    },
    {
        icon: "assets/shape-icon.svg",
        title: "Performance Insights",
        description: "Score & Feedback : Get instant results with a detailed Performance Score and personalized AI feedback to help you master every concept.",
    },
    
];

export default function FeaturesSection() {
    return (
        <>
            
            <div id="features" className=" px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen">
                <motion.div 
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                    <div className="text-center font-medium text-purple-600 mt-28 px-10 py-2 rounded-full bg-purple-950/70 w-max mx-auto">
                        Features
                    </div>
                    <div className="text-3xl font-semibold text-center mx-auto mt-4">
                        Why use our generator?
                    </div>
                    <div className="text-slate-300 text-center mt-2 max-w-xl mx-auto">
                        Transform complex topics into captivating comic narratives.
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-16 px-6 ">
                        {featuresData.map((feature, index) => (
                            <div key={index} className={`${index === 1 ? 'p-px rounded-[13px] bg-linear-to-br ' : ''}`}>
                                <div className="p-6 rounded-xl space-y-4  border border-slate-800 bg-slate-950 max-w-80 w-full min-h-70 h-full">
                                    
                                    <img src={feature.icon} alt={feature.title} />
                                    <h3 className="text-base font-medium text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 line-clamp-5 pb-4">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                    <div className="mt-40 relative mx-auto max-w-5xl">
                        <div className="absolute -z-50 size-100 -top-10 -left-20 aspect-square rounded-full bg-purple-500/40 blur-3xl"></div>
                        <p className="text-slate-300 text-lg text-left max-w-3xl">
                            PrebuiltUI helps you build faster by transforming your design vision into fully functional, production-ready UI components.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
                            <div className="md:col-span-2">
                                <img className="h-full w-auto" src="assets/feature_image.jpg" alt="features showcase 4" width={1000} height={500} />
                            </div>
                            <div className="md:col-span-1"
                            >
                                <h3 className="text-[24px]/7.5 text-slate-300 font-medium mt-6">Boost your knowledge with comic based AI comics </h3>
                                <p className="text-slate-300 mt-2">Stop getting confused . Our AI creates comic proven to capture attention</p>
                                {/* <a href="https://prebuiltui.com" className="group flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 transition">
                                    Start Generating Free
                                    <ArrowUpRight className="size-5 group-hover:translate-x-0.5 transition duration-300" />
                                </a> */}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
        </>
        
    );
}
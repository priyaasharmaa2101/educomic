'use client'
import { useEffect, useState } from "react";
import { ArrowRightIcon, MailIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
    // Manage Formspree submission status
    const [status, setStatus] = useState<"" | "SUBMITTING" | "SUCCESS" | "ERROR">("");

    // Automatically clear status messages after 5 seconds
    useEffect(() => {
        if (status === "SUCCESS" || status === "ERROR") {
            const timer = setTimeout(() => {
                setStatus("");
            }, 4000); 

            return () => clearTimeout(timer); 
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("SUBMITTING");
        
        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            // Replace YOUR_FORMSPREE_FORM_ID with the ID from your Formspree dashboard
            const response = await fetch("https://formspree.io/f/xwvzqzdo", {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus("SUCCESS");
                form.reset(); // Clears form inputs on success
            } else {
                setStatus("ERROR");
            }
        } catch (error) {
            setStatus("ERROR");
        }
    };

    return (
        <div className="px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="text-center font-medium text-purple-600 mt-28 px-10 py-2 rounded-full bg-purple-950/70 w-max mx-auto">
                Contact
            </div>
            <div className="text-3xl font-semibold text-center mx-auto mt-4">
                Let's Shape the Future of Learning
            </div>
            <div className="text-slate-300 text-center mt-2 max-w-xl mx-auto">
                We’re on a mission to turn complex concepts into engaging stories. Have a suggestion, feature request, or just want to chat about AI? We'd love to hear from you.
            </div>
            
            {/* Swapped onSubmit handler to use our async handleSubmit function */}
            <form onSubmit={handleSubmit} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full'>
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <p className='mb-2 font-medium'>Your name</p>
                    <div className='flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-purple-500 bg-transparent'>
                        <UserIcon className='size-5 text-slate-500' />
                        <input required name='name' type="text" placeholder='Enter your name' className='w-full p-3 bg-transparent outline-none' />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <p className='mb-2 font-medium'>Email id</p>
                    <div className='flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-purple-500 bg-transparent'>
                        <MailIcon className='size-5 text-slate-500' />
                        <input required name='email' type="email" placeholder='Enter your email' className='w-full p-3 bg-transparent outline-none' />
                    </div>
                </motion.div>

                <motion.div className='sm:col-span-2'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <p className='mb-2 font-medium'>Message</p>
                    <textarea required name='message' rows={8} placeholder='Enter your message' className='focus:border-purple-500 resize-none w-full p-3 outline-none rounded-lg border border-slate-700 bg-transparent' />
                </motion.div>

                {/* Container to display submit button and message status side-by-side */}
                <motion.div 
                    className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-4 pt-2"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <button 
                        type='submit' 
                        disabled={status === "SUBMITTING"}
                        className='w-full sm:w-max flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-10 py-3 rounded-full transition-colors'
                    >
                        {status === "SUBMITTING" ? "Sending..." : "Submit"}
                        <ArrowRightIcon className="size-5" />
                    </button>

                    {/* Status notifications */}
                    {status === "SUCCESS" && (
                        <span className="text-green-400 text-sm font-medium animate-fade-in">
                            🎉 Message sent successfully! We'll be in touch.
                        </span>
                    )}
                    {status === "ERROR" && (
                        <span className="text-red-400 text-sm font-medium">
                            ❌ Failed to send message. Please try again.
                        </span>
                    )}
                </motion.div>
            </form>
        </div>
    );
}
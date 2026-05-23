import { Mail } from "lucide-react"
import { motion } from "framer-motion" // Import this
import LenisScroll from "../components/LenisScroll"
import SoftBackDrop from "../components/SoftBackDrop"

const Contact = () => {
  return (
    <>
      <SoftBackDrop/>
      <LenisScroll/>
      <div className="pt-24 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pb-28 lg:pb-8">
          
          {/* Animation Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl text-center font-bold text-zinc-100 mb-1 ">Built by Students, For Students</h2>
            <p className="max-w-2xl mx-auto text-center text-zinc-400 mb-4">
              EduComic is a collaborative project driven by a passion for making education visual and engaging. We are Samriddhi Agrawal and Priya Sharma, two Computer Science students turning abstract concepts into interactive comics. We’re constantly iterating on our AI models, and your feedback is the fuel that keeps our project growing.
            </p>

            {/* The new text you wanted */}
            <p className="text-center text-purple-400 font-medium mb-4 italic">
              "We’re working hard to make learning fun. Drop us a message—we’d love to hear your thoughts or feature requests!"
            </p>
            <p className=" px-36 text-center text-zinc-400 mb-1 ">EduComic is a collaborative project driven by a passion for making education visual and engaging. We are Samriddhi Agrawal and Priya Sharma, two Computer Science students turning abstract concepts into interactive comics. We’re constantly iterating on our AI models, and your feedback is the fuel that keeps our project growing.</p>

            <div className="grid grid-cols-2 ">

                <div className="px-3 py-2 group h-80 m-8 relative   rounded-2xl bg-white/6 border border-white/10 transition-all hover:border-purple-500/50 hover:bg-purple-500/12 shadow-xl overflow-hidden">

                  <h1  className=" text-xl text-center mt-3"><span className="font-bold">SAMRIDDHI AGRAWAL  </span><span className="text-zinc-300">|  Full-Stack Developer</span> </h1>

                  <p className="text-center text-xs text-zinc-200">CS Engineering Student</p>

                  <p className="text-center m-5 text-zinc-100">Drives the platform's architecture and full-stack development. Specializes in building a seamless, responsive UI/UX and integrating complex features into a polished, high-performance MERN environment.</p>

                  <a className=" inline-block bg-purple-700 px-3 py-2 rounded-2xl mt-3 mx-5 hover:bg-purple-900" href="https://www.linkedin.com/in/samriddhi-agrawal-473a60328/" target="_blank"

                  rel="noopener noreferrer">Connect to Samriddhi on linkedin</a>

                  <a

                    href="mailto:samriddhiagrawal2903@gmail.com"

                    className="flex items-center gap-3 mx-6 mt-4 w-50 rounded-2xl border py-1 px-2 text-zinc-400 hover:text-purple-400 transition-colors duration-200"

                  >

                    <Mail className="w-5 text-purple-400 h-5" />

                    <span>mail samriddhi here</span>

                  </a>

                </div>



                <div className="px-3 py-2 group h-80 m-8 relative  rounded-2xl bg-white/6 border border-white/10 transition-all hover:border-purple-500/50 hover:bg-purple-500/12 shadow-xl overflow-hidden">

                  <h1  className=" text-xl text-center mt-3"><span className="font-bold">PRIYA SHARMA  </span><span className="text-zinc-300">| AI Backend Developer</span> </h1>

                  <p className="text-center text-xs text-zinc-200">CS Engineering Student</p>

                  <p className="text-center m-5 text-zinc-100">Drives the platform's AI engine and MongoDB database. Responsible for engineering generative pipelines that transform static educational text into interactive content, including AI-generated imagery, flashcards, and automated quizzes.</p>

                  <a className=" inline-block bg-purple-700 px-3 py-2 rounded-2xl mt-3 mx-5 hover:bg-purple-900" href="https://www.linkedin.com/in/priya-sharma-588715290/" target="_blank"

                  rel="noopener noreferrer">Connect to Priya on linkedin</a>

                  <a

                    href="mailto:priyaasharmaa2101@gmail.com"

                    className="flex border py-1 px-2 rounded-2xl items-center gap-3 mx-6 w-45 mt-4 text-zinc-400 hover:text-purple-400 transition-colors duration-200"

                  >

                    <Mail className="w-5 h-5 text-purple-400" />

                    <span>mail priya here</span>

                  </a>

                </div>



            </div>
          </motion.div>
        </main>
      </div>
    </>
  )
}

export default Contact
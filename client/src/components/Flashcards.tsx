import { useState,useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const Flashcards = ({ topic, onComplete,onBack, onDataLoaded }: { topic: string, onComplete: () => void, onBack: () => void,  onDataLoaded?: (flashcards: any[]) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([{ q: "", a: "" }]);

useEffect(() => {
  fetch("http://localhost:8000/generate-flashquiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_text: topic, genre: "educational" }),
  })
    .then((res) => res.json())
    // With:
.then((data) => {
  const parsed = data.flashcards ?? [];
  if (parsed.length > 0) {
    setCards(parsed.map((c: { question: string; answer: string }) => ({ q: c.question, a: c.answer })));

    // ✅ Save flashcards to DB
    onDataLoaded?.(parsed.map((c: any) => ({
      question: c.question,
      answer: c.answer,
    })));
  }
})
    .catch((err) => console.error("Flashcard fetch failed:", err));
}, [topic]);

  
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Flashcards</h2>
        <p className="text-zinc-400 mt-2 text-sm">Review the concepts before the quiz</p>
      </div>
      
      {/* The Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative w-100 h-70 cursor-pointer perspective-1000 group"
      >
        {/* The Flapper */}
        <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Side */}
          <div className="absolute inset-0 bg-zinc-900 border-2 border-white/10 group-hover:border-purple-500/50 rounded-3xl flex flex-col items-center justify-center p-8 text-center backface-hidden shadow-2xl">
            <span className="text-[12px] uppercase tracking-widest text-purple-400 mb-4 font-bold">Question</span>
            <p className="text-zinc-100 text-xl font-medium leading-relaxed">{cards[currentIndex].q}</p>
            <div className="mt-6 text-zinc-500 flex items-center gap-2 text-xs">
               <RotateCcw className="size-3" /> Click to see answer
            </div>
          </div>

          {/* Back Side - rotate-y-180 is crucial here */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-900 to-indigo-950 border-2 border-purple-400/50 rounded-3xl flex flex-col items-center justify-center p-8 text-center backface-hidden shadow-2xl rotate-y-180">
            <span className="text-[10px] uppercase tracking-widest text-purple-200 mb-4 font-bold">Answer</span>
            <p className="text-white text-lg font-medium leading-relaxed">
              {cards[currentIndex].a}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all active:scale-95 ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed border-white/5 text-zinc-600' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            <ArrowLeft className="size-4" />
            <span>Prev</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            disabled={currentIndex === cards.length - 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all active:scale-95 ${currentIndex === cards.length - 1 ? 'opacity-20 cursor-not-allowed border-white/5 text-zinc-600' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            <span>Next</span>
            <ArrowRight className="size-4 text-purple-400" />
          </button>
        </div>

        
        <div className="flex items-center gap-6">
         <button
             onClick={onBack}
              className="text-zinc-500 hover:text-white text-sm transition-colors font-medium"
    >
              ← Back to Comic
         </button>

         <button 
           onClick={onComplete} 
           className="text-zinc-500 hover:text-white text-sm transition-colors font-medium"
    >
           Skip to Quiz
         </button>

            <button 
                onClick={onComplete}
                className={`px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 ${currentIndex === cards.length - 1 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40 scale-105' : 'bg-white/10 text-zinc-300 hover:bg-white/20'}`}
            >
                {currentIndex === cards.length - 1 ? "Finish & Start Quiz!" : "Ready for Quiz?"}
            </button>
        </div>
        
        <p className="text-zinc-600 text-[10px] tracking-widest uppercase font-mono">
          Card {currentIndex + 1} of {cards.length}
        </p>
      </div>
    </div>
  );
};

export default Flashcards;
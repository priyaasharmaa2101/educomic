import { motion } from "motion/react";
import { useState, useEffect } from "react";

const QuizSection = ({ topic, onFinish, onBack, onDataLoaded }: { topic: string; onFinish: (score: number,  questions: any[], answers: string[], selectedIndexes: number[]) => void; onBack: () => void; onDataLoaded?: (quiz: any[]) => void  }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  
  const [answers, setAnswers] = useState<{letter: string, selectedIndex: number}[]>([]);
  
  const [questions, setQuestions] = useState([
    { q: "", options: ["", "", "", ""], correct: 0 }
  ]);

  useEffect(() => {
    fetch("http://localhost:8000/generate-flashquiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson_text: topic, genre: "educational" }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.quiz ?? [];
       
// With this:
if (parsed.length > 0) {
  const mapped = parsed.map((q: {
    question: string;
    options: string[];
    correct_answer: string;
  }) => ({
    q: q.question,
    options: q.options,
    correct: ["A", "B", "C", "D"].indexOf(q.correct_answer),
  }));
  setQuestions(mapped);

  // ✅ Save quiz to DB
  onDataLoaded?.(parsed.map((q: any) => ({
    question: q.question,
    options: q.options,
    correct: ["A", "B", "C", "D"].indexOf(q.correct_answer),
  })));
}
      })
      .catch((err) => console.error("Quiz fetch failed:", err));
  }, [topic]);

  const handleSelect = (index: number) => setSelected(index);

  const handleNext = () => {
    const isCorrect = selected === questions[currentQ].correct;
    const newScore = score + (isCorrect ? 1 : 0);
    const letter = ["A", "B", "C", "D"][selected ?? 0];
    const newAnswers = [...answers, { letter, selectedIndex: selected ?? 0 }];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
        setScore(newScore);
        setCurrentQ(currentQ + 1);
        setSelected(null);
    } else {
        const formatted = questions.map((q) => ({
            question: q.q,
            options: q.options,
            correct_answer: ["A", "B", "C", "D"][q.correct],
            correctIndex: q.correct,
        }));
         onFinish(newScore, formatted, newAnswers.map(a => a.letter), newAnswers.map(a => a.selectedIndex));
    }
};

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(null);
    }
  };

  const isLast = currentQ === questions.length - 1;

  return (
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <div className="max-w-xl mx-auto p-8 bg-black/40 border border-white/10 rounded-3xl">
        <div className="mb-6">
          <span className="text-purple-400 text-sm font-bold uppercase">
            Question {currentQ + 1} of {questions.length}
          </span>
          <h3 className="text-xl text-white font-semibold mt-2">{questions[currentQ].q}</h3>
        </div>

        <div className="grid gap-3 mb-8">
          {questions[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected === i
                  ? "bg-purple-600/40 border-purple-500 text-white"
                  : "bg-white/5 border-white/10 hover:bg-purple-600/20 hover:border-purple-500/50 text-zinc-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Prev / Next / Submit */}
        
     <div className="flex items-center justify-between">
       <button
         onClick={currentQ === 0 ? onBack : handlePrev}
         className="flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all active:scale-95 bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          ← Prev
        </button>

           <button
             onClick={handleNext}
              disabled={selected === null}
              className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
               selected === null
              ? "opacity-30 cursor-not-allowed bg-white/10 text-zinc-500"
              : isLast
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
              : "bg-white/10 text-white hover:bg-white/20"
              }`}
                >
                {isLast ? "Submit Quiz 🎉" : "Next →"}
            </button>
       </div>
     </div>
      
    </motion.div>
  );
};

export default QuizSection;
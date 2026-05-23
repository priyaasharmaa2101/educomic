import { motion } from "motion/react";
import { useState, useEffect } from "react";

const QuizFeedback = ({ score, quizQuestions, quizAnswers, selectedIndexes, onBackToQuiz, onFeedbackLoaded }: {
    score: number;
    quizQuestions: any[];
    quizAnswers: string[];
    selectedIndexes: number[];
    onBackToQuiz: () => void;
    onFeedbackLoaded?: (feedback: string) => void;
}) => {
    const isHigh = score >= 4;
    const [feedback, setFeedback] = useState("Loading feedback...");

    useEffect(() => {
        fetch("http://localhost:8000/generate-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quiz_questions: quizQuestions,
                student_answers: quizAnswers
            }),
        })
            .then((res) => res.json())
          .then((data) => {
    const fb = data.feedback ?? "Great effort!";
    setFeedback(fb);

    // ✅ Save feedback to DB
    onFeedbackLoaded?.(fb);
})
.catch(() => {
    const fb = "Great effort! Keep learning!";
    setFeedback(fb);
    onFeedbackLoaded?.(fb);
});})

    return (
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        <div className="text-center space-y-6 py-10">
          <div className="inline-block p-6 rounded-full bg-purple-600/20 border border-purple-500">
            <span className="text-4xl font-bold text-white">{score} / 5</span>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {isHigh ? "Great Job, Hero!" : "Keep Practicing!"}
            </h2>

            {/* AI Feedback */}
            <div className="p-5 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-left">
              <h4 className="text-purple-400 font-bold text-sm mb-2">📝 Feedback</h4>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{feedback}</p>
            </div>

            {/* Review Answers */}
            <div className="space-y-3 text-left">
                <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Review Answers</h4>
                {quizQuestions.map((q, i) => {
                    const isCorrect = quizAnswers[i] === q.correct_answer;
                    return (
                        <div key={i} className={`p-4 rounded-2xl border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <p className="text-white text-sm font-medium mb-2">{q.question}</p>
                            <div className="space-y-1">
                                {q.options.map((opt: string, j: number) => {
                                    const isSelected = selectedIndexes[i] === j;
                                    const isRight = j === q.correctIndex;
                                    return (
                                        <div key={j} className={`text-xs px-3 py-1.5 rounded-lg ${
                                            isRight ? 'bg-green-500/20 text-green-400 font-bold'
                                            : isSelected && !isCorrect ? 'bg-red-500/20 text-red-400'
                                            : 'text-zinc-500'
                                        }`}>
                                            {isRight ? '✓' : isSelected && !isCorrect ? '✗' : '•'} {opt}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Buttons */}
            <button
                onClick={onBackToQuiz}
                className="mt-6 w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/10"
            >
                ← Back to Quiz
            </button>
            <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition"
            >
                Create Another Comic
            </button>
          </div>
        </div>
      </motion.div>
    );
};

export default QuizFeedback;

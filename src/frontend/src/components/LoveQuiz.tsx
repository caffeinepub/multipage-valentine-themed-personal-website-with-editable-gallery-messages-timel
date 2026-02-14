import { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '../backend';

interface LoveQuizProps {
  questions: QuizQuestion[];
}

export default function LoveQuiz({ questions }: LoveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-romantic text-center animate-fadeIn">
          <h3 className="font-script text-3xl text-primary mb-4">Quiz Complete!</h3>
          <p className="text-5xl font-bold text-primary mb-4">{percentage}%</p>
          <p className="text-lg text-foreground/80 mb-6">
            You got {score} out of {questions.length} questions correct!
          </p>
          <button
            onClick={handleRestart}
            className="rose-gold-gradient text-white px-8 py-3 rounded-xl font-medium hover:shadow-romantic transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-romantic animate-fadeIn">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <h3 className="text-2xl font-semibold text-foreground">{question.question}</h3>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = option === selectedAnswer;
            
            let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
            
            if (!isAnswered) {
              buttonClass += 'border-border hover:border-primary hover:bg-accent/50';
            } else if (isSelected) {
              buttonClass += isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-950'
                : 'border-red-500 bg-red-50 dark:bg-red-950';
            } else if (isCorrect) {
              buttonClass += 'border-green-500 bg-green-50 dark:bg-green-950';
            } else {
              buttonClass += 'border-border opacity-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}

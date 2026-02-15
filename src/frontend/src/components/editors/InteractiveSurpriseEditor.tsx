import { useState, useEffect } from 'react';
import { useGetDraftInteractiveSurpriseConfig } from '../../hooks/useQueries';
import { useSetInteractiveSurpriseConfig } from '../../hooks/useEditMutations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';
import type { QuizQuestion, FlipCard, InteractiveSurpriseConfig } from '../../backend';
import { toast } from 'sonner';
import { getUserFriendlyErrorMessage } from '../../utils/authzError';

export default function InteractiveSurpriseEditor() {
  const { data: config, isLoading } = useGetDraftInteractiveSurpriseConfig();
  const saveConfig = useSetInteractiveSurpriseConfig();

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [flipCards, setFlipCards] = useState<FlipCard[]>([]);

  useEffect(() => {
    if (config) {
      setQuizQuestions(config.quizQuestions || []);
      setFlipCards(config.flipCards || []);
    }
  }, [config]);

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: string | string[]) => {
    const updated = [...quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizQuestions(updated);
  };

  const handleUpdateQuestionOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...quizQuestions];
    const options = [...updated[qIndex].options];
    options[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setQuizQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handleAddFlipCard = () => {
    setFlipCards([...flipCards, { front: '', back: '' }]);
  };

  const handleUpdateFlipCard = (index: number, field: keyof FlipCard, value: string) => {
    const updated = [...flipCards];
    updated[index] = { ...updated[index], [field]: value };
    setFlipCards(updated);
  };

  const handleDeleteFlipCard = (index: number) => {
    setFlipCards(flipCards.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const newConfig: InteractiveSurpriseConfig = {
        quizQuestions,
        flipCards
      };
      await saveConfig.mutateAsync(newConfig);
      toast.success('Interactive surprise config saved!');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error(getUserFriendlyErrorMessage(error));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Quiz Questions */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Quiz Questions</h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>

        {quizQuestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No quiz questions yet.</p>
        ) : (
          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 bg-accent/20 rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Label>Question {qIndex + 1}</Label>
                    <Input
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Enter question..."
                      className="mt-2"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {q.options.map((option, oIndex) => (
                      <Input
                        key={oIndex}
                        value={option}
                        onChange={(e) => handleUpdateQuestionOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}...`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={q.correctAnswer}
                    onChange={(e) => handleUpdateQuestion(qIndex, 'correctAnswer', e.target.value)}
                    placeholder="Enter the correct answer..."
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flip Cards */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Flip Cards</h3>
          <button
            onClick={handleAddFlipCard}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        {flipCards.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No flip cards yet.</p>
        ) : (
          <div className="space-y-4">
            {flipCards.map((card, index) => (
              <div key={index} className="p-4 bg-accent/20 rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-foreground">Card {index + 1}</p>
                  <button
                    onClick={() => handleDeleteFlipCard(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <Label>Front</Label>
                  <Textarea
                    value={card.front}
                    onChange={(e) => handleUpdateFlipCard(index, 'front', e.target.value)}
                    placeholder="Front text..."
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Back</Label>
                  <Textarea
                    value={card.back}
                    onChange={(e) => handleUpdateFlipCard(index, 'back', e.target.value)}
                    placeholder="Back text..."
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saveConfig.isPending}
        className="w-full rose-gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-romantic transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saveConfig.isPending ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}

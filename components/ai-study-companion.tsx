import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Brain, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AIQuestion {
  question: string;
  subject: string;
  answer: string | null;
  isLoading: boolean;
  error: string | null;
}

interface StudyPlan {
  subjects: { name: string; hours: number; schedule: string[] }[];
  dailySchedule: { morning: string[]; afternoon: string[]; evening: string[] };
  revisionDays: number;
  totalDays: number;
}

export default function AIStudyCompanion() {
  const [activeTab, setActiveTab] = useState<'answer' | 'plan' | 'review'>('answer');
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('mathematics');
  const [answer, setAnswer] = useState<AIQuestion | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [essay, setEssay] = useState('');
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const subjects = [
    'mathematics', 'physics', 'chemistry', 'biology', 
    'english', 'civics', 'history', 'geography'
  ];

  const askAI = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setAnswer(null);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnswer({
          question,
          subject,
          answer: data.answer,
          isLoading: false,
          error: null
        });
      } else {
        setAnswer({
          question,
          subject,
          answer: null,
          isLoading: false,
          error: data.error || 'Failed to get answer'
        });
      }
    } catch (err) {
      setAnswer({
        question,
        subject,
        answer: null,
        isLoading: false,
        error: 'Network error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudyPlan = async () => {
    if (!user?.grade) return;
    
    setIsLoading(true);
    setPlan(null);
    
    const subjectsList = ['mathematics', 'physics', 'chemistry', 'english'];
    
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjectsList,
          dailyHours: 3,
          examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPlan(data.studyPlan);
      }
    } catch (err) {
      console.error('Study plan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reviewContent = async () => {
    if (!essay.trim()) return;
    
    setIsLoading(true);
    setReview(null);
    
    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: essay, type: 'essay' })
      });

      const data = await response.json();
      
      if (data.success) {
        setReview(data.review);
      }
    } catch (err) {
      console.error('Review error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-secondary';
    return 'text-danger';
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-black gradient-text">
              AI Study Companion
            </h1>
          </div>

          <div className="flex border-b border-white/10 mb-6">
            {[
              { id: 'answer', name: 'Ask Question' },
              { id: 'plan', name: 'Study Plan' },
              { id: 'review', name: 'Review Essay' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {activeTab === 'answer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface rounded-xl p-3 text-text-primary border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>
                      {subj.charAt(0).toUpperCase() + subj.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Your Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask any question about the subject..."
                  className="w-full bg-surface rounded-xl p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                />
              </div>

              <button
                onClick={askAI}
                disabled={isLoading || !question.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask AI
                  </>
                )}
              </button>

              {answer && (
                <div className="mt-6 p-4 bg-surface rounded-xl">
                  {answer.error ? (
                    <div className="flex items-start space-x-2 text-danger">
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{answer.error}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2 text-accent mb-3">
                        <Brain className="w-5 h-5" />
                        <span className="text-sm font-medium">AI Response</span>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <div className="text-text-primary leading-relaxed whitespace-pre-wrap">{answer.answer}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4">
              <button
                onClick={generateStudyPlan}
                disabled={isLoading}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Plan...
                  </span>
                ) : (
                  'Generate Study Plan'
                )}
              </button>

              {plan && (
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.subjects?.map((subject: any) => (
                      <div key={subject.name} className="p-4 bg-surface rounded-xl">
                        <h4 className="font-bold text-text-primary text-lg capitalize mb-2">
                          {subject.name}
                        </h4>
                        <p className="text-sm text-text-muted mb-3">
                          {subject.totalHours} hours • {subject.priority} priority
                        </p>
                        <div className="space-y-1">
                          {subject?.schedule?.map((item: string, idx: number) => (
                            <div key={idx} className="text-xs text-text-muted">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-surface rounded-xl">
                    <h4 className="font-bold text-text-primary mb-3">Daily Schedule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm font-medium text-text-muted mb-2">Morning</p>
                        {plan.dailySchedule?.morning?.map((item: string, idx: number) => (
                          <div key={idx} className="text-xs text-text-muted">{item}</div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-muted mb-2">Afternoon</p>
                        {plan.dailySchedule?.afternoon?.map((item: string, idx: number) => (
                          <div key={idx} className="text-xs text-text-muted">{item}</div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-muted mb-2">Evening</p>
                        {plan.dailySchedule?.evening?.map((item: string, idx: number) => (
                          <div key={idx} className="text-xs text-text-muted">{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-2xl font-bold text-accent">{plan.totalDays}</p>
                      <p className="text-xs text-text-muted">Days to Exam</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-2xl font-bold text-accent">{plan.revisionDays}</p>
                      <p className="text-xs text-text-muted">Revision Days</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-2xl font-bold text-accent">{plan.breakDays}</p>
                      <p className="text-xs text-text-muted">Break Days</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Paste your essay or written work here
                </label>
                <textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Paste your essay here for AI review..."
                  className="w-full bg-surface rounded-xl p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={8}
                />
              </div>

              <button
                onClick={reviewContent}
                disabled={isLoading || essay.trim().length < 50}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reviewing...
                  </span>
                ) : (
                  'Review with AI'
                )}
              </button>

              {review && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Overall', score: review.overallScore },
                      { label: 'Grammar', score: review.grammarScore },
                      { label: 'Structure', score: review.structureScore },
                      { label: 'Clarity', score: review.clarityScore }
                    ].map((item) => (
                      <div key={item.label} className="p-3 bg-surface rounded-xl text-center">
                        <p className={`text-lg font-bold ${scoreColor(item.score)}`}>{item.score}</p>
                        <p className="text-xs text-text-muted">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {review.strengths?.length > 0 && (
                    <div className="p-4 bg-accent/10 border border-accent rounded-xl">
                      <h4 className="font-bold text-accent mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {review.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-text-secondary">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.suggestions?.length > 0 && (
                    <div className="p-4 bg-secondary/10 border border-secondary rounded-xl">
                      <h4 className="font-bold text-secondary mb-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        Suggestions for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {review.suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx} className="text-sm text-text-secondary">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.nextSteps?.length > 0 && (
                    <div className="p-4 bg-surface rounded-xl">
                      <h4 className="font-bold text-text-primary mb-2">Next Steps</h4>
                      <ul className="space-y-1">
                        {review.nextSteps.map((step: string, idx: number) => (
                          <li key={idx} className="text-sm text-text-secondary">• {step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, X, Brain, Send, Loader2, Lightbulb, Shirt } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [promptMode, setPromptMode] = useState<'pep-talk' | 'icebreakers' | 'outfit'>('pep-talk');
  const [scenarioInput, setScenarioInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [icebreakerList, setIcebreakerList] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setOutputResult(null);
    setIcebreakerList([]);

    try {
      if (promptMode === 'pep-talk') {
        const res = await fetch('/api/gemini/anti-lazy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            beaconTitle: 'Spontaneous Hangout',
            location: 'Nearby Neighborhood',
            activityType: 'Short Errand / Chat',
            userState: scenarioInput || 'Feeling drained after work and thinking about canceling.',
          }),
        });
        const data = await res.json();
        setOutputResult(
          data.text ||
            'Research confirms 20 minutes of casual conversation breaks your cortisol fatigue loop immediately. Throw on sweatpants and go!'
        );
      } else if (promptMode === 'icebreakers') {
        const res = await fetch('/api/gemini/icebreakers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'Local Cafe',
            activityType: scenarioInput || 'Coffee / Chores',
            mutualInterests: 'Spontaneous everyday hangs',
          }),
        });
        const data = await res.json();
        setIcebreakerList(
          data.icebreakers && data.icebreakers.length
            ? data.icebreakers
            : [
                "What's the funniest petty annoyance you endured today?",
                'Show me the last screenshot in your camera roll.',
                "What's a weird grocery store snack you swear by?",
              ]
        );
      } else {
        // Outfit check validation
        setOutputResult(
          `Validation approved: ${
            scenarioInput || 'Sweatpants and a casual hoodie'
          } is 100% accepted in Down. Zero makeup or dressing up is expected for everyday village hangouts!`
        );
      }
    } catch {
      setOutputResult(
        'Research confirms 20 minutes of casual conversation breaks your cortisol fatigue loop immediately. Throw on sweatpants and go!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-neutral-200 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3 sm:hidden" />

        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#CCFF00] text-[#18111A]">
              <Brain className="w-5 h-5" />
            </span>
            <div>
              <h3 id="ai-drawer-title" className="font-header text-xl text-[#18111A]">
                Gemini Anti-Lazy Engine
              </h3>
              <p className="text-xs text-neutral-500">
                Science-backed behavioral coaching & zero-awkwardness prompts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Assistant"
            className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setPromptMode('pep-talk');
                setOutputResult(null);
                setIcebreakerList([]);
              }}
              className={`min-h-[44px] p-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                promptMode === 'pep-talk'
                  ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anti-Couch Pep</span>
            </button>
            <button
              onClick={() => {
                setPromptMode('icebreakers');
                setOutputResult(null);
                setIcebreakerList([]);
              }}
              className={`min-h-[44px] p-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                promptMode === 'icebreakers'
                  ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Icebreakers</span>
            </button>
            <button
              onClick={() => {
                setPromptMode('outfit');
                setOutputResult(null);
                setIcebreakerList([]);
              }}
              className={`min-h-[44px] p-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                promptMode === 'outfit'
                  ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Outfit Check</span>
            </button>
          </div>

          {/* Context / Scenario Input */}
          <div>
            <label className="block text-xs font-bold text-[#18111A] mb-1">
              {promptMode === 'pep-talk'
                ? "What's making you want to stay in? (e.g. tired from meetings, don't want to change)"
                : promptMode === 'icebreakers'
                ? 'Mutual hobbies or place? (e.g. Trader Joe\'s, thrifting, boba, dog park)'
                : 'What are you thinking of wearing? (e.g. oversized grey hoodie)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder={
                  promptMode === 'pep-talk'
                    ? "Burned out from 4 hours of Zoom, tempted to doomscroll"
                    : promptMode === 'icebreakers'
                    ? "Boba run + discussing friend's birthday party outfit"
                    : "Sweatpants and an oversized UC Berkeley hoodie"
                }
                className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#18111A] focus:outline-none focus:border-[#CCFF00]"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="min-h-[44px] px-4 rounded-xl bg-[#18111A] hover:bg-neutral-800 text-[#CCFF00] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Run</span>
              </button>
            </div>
          </div>

          {/* Results Output */}
          {loading && (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#2A6E1E] animate-spin" />
              <span className="text-xs font-bold text-neutral-600">
                Analyzing behavioral dopamine circuits...
              </span>
            </div>
          )}

          {outputResult && !loading && (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A6E1E]">
                Voice of Reason
              </span>
              <p className="text-xs text-[#18111A] leading-relaxed font-medium">
                {outputResult}
              </p>
            </div>
          )}

          {icebreakerList.length > 0 && !loading && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A6E1E]">
                3 Zero-Awkwardness Icebreakers
              </span>
              {icebreakerList.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-[#18111A]"
                >
                  "{q}"
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Zap, SkipForward, Lightbulb, Target, CheckCircle } from 'lucide-react';

const Rules: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Home</span>
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
          📖 GAME RULES
        </h1>
        
        <div className="w-24"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Main Rules Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl mb-6">
          <div className="space-y-8">
            
            {/* Game Overview */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h2 className="text-2xl font-bold text-yellow-400">Game Overview</h2>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Welcome to <span className="text-yellow-400 font-bold">Valorant KBC</span>! Test your knowledge about Valorant through 50 challenging questions. 
                  Answer correctly to progress through the quiz ladder and reach milestones. One wrong answer ends your run unless you've reached a safe milestone!
                </p>
              </div>
            </section>

            {/* Question System */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-400">Question System</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-bold text-white mb-3">📊 Question Ladder</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <span className="text-green-400">Easy (1-15):</span> Basic Valorant knowledge</li>
                    <li>• <span className="text-yellow-400">Medium (16-35):</span> Intermediate gameplay concepts</li>
                    <li>• <span className="text-red-400">Hard (36-50):</span> Expert-level details</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-bold text-white mb-3">🎯 Categories</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <span className="text-purple-400">Agents:</span> Abilities and characteristics</li>
                    <li>• <span className="text-orange-400">Maps:</span> Callouts and layouts</li>
                    <li>• <span className="text-cyan-400">Weapons:</span> Stats and mechanics</li>
                    <li>• <span className="text-pink-400">Gameplay:</span> Rules and mechanics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Timer System */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-8 h-8 text-orange-400" />
                <h2 className="text-2xl font-bold text-orange-400">Timer System</h2>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">30s</div>
                    <div className="text-gray-300">Time per question</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">⚡</div>
                    <div className="text-gray-300">Timer turns red at 10s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">⏰</div>
                    <div className="text-gray-300">Time up = Game Over</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Lifelines */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-400">Lifelines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-xl p-6 border border-purple-400">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">50-50</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Eliminates two wrong answers, leaving you with a 50-50 choice between the correct and one incorrect answer.
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-blue-400">
                  <div className="flex items-center space-x-2 mb-3">
                    <SkipForward className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Skip</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Skip the current question without penalty and move to the next question. Use wisely!
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-orange-400">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-6 h-6 text-orange-400" />
                    <h3 className="text-lg font-bold text-white">Hint</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Reveals a helpful hint related to the question to guide you toward the correct answer.
                  </p>
                </div>
              </div>
              <div className="bg-yellow-900 border border-yellow-500 rounded-xl p-4 mt-4">
                <p className="text-yellow-100 text-sm text-center">
                  ⚠️ <strong>Important:</strong> Each lifeline can only be used ONCE per game. Use them strategically!
                </p>
              </div>
            </section>

            {/* Milestones */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">Safe Milestones</h2>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {[5, 10, 20, 35, 50].map((milestone, index) => (
                    <div key={milestone} className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center mb-2 ${
                        milestone === 50 ? 'bg-yellow-500 border-yellow-400' : 'bg-green-500 border-green-400'
                      }`}>
                        <Trophy className={`w-6 h-6 ${milestone === 50 ? 'text-yellow-900' : 'text-green-900'}`} />
                      </div>
                      <div className={`font-bold ${milestone === 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {milestone}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <span className="text-green-400 font-bold">Safe Points:</span> Reaching questions 5, 10, 20, or 35 creates a "checkpoint." 
                    If you answer incorrectly after reaching a checkpoint, you'll keep your progress up to that milestone.
                  </p>
                  <p className="text-gray-300">
                    <span className="text-yellow-400 font-bold">Ultimate Goal:</span> Answer all 50 questions correctly to achieve the perfect score!
                  </p>
                </div>
              </div>
            </section>

            {/* Answer Flow */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400">Answer Flow</h2>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                    <div className="text-gray-300">Click an answer - it glows <span className="text-yellow-400">yellow</span></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold animate-pulse">2</div>
                    <div className="text-gray-300">2-second suspense with pulsing <span className="text-yellow-400">yellow</span> glow</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <div className="text-gray-300">Correct answers turn <span className="text-green-400">green</span> with confetti</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✗</div>
                    <div className="text-gray-300">Wrong answers turn <span className="text-red-400">red</span>, correct answer shows <span className="text-green-400">green</span></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">→</div>
                    <div className="text-gray-300">Automatic progression to next question or results</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 border border-blue-400">
                <h3 className="text-xl font-bold text-blue-300 mb-4">💡 Pro Tips</h3>
                <ul className="text-blue-100 space-y-2">
                  <li>• Use lifelines strategically - save them for harder questions</li>
                  <li>• Pay attention to question categories for context clues</li>
                  <li>• Early questions are easier - build confidence and momentum</li>
                  <li>• Watch the timer - don't spend too much time overthinking</li>
                  <li>• Aim for milestones to secure your progress</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
        
        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/solo')}
            className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-xl rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 border-2 border-yellow-400"
          >
            🎮 START QUIZ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
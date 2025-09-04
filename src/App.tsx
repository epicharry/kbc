import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SoloGame from './pages/SoloGame';
import Multiplayer from './pages/Multiplayer';
import MultiplayerLobby from './pages/MultiplayerLobby';
import MultiplayerGame from './pages/MultiplayerGame';
import MultiplayerResults from './pages/MultiplayerResults';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Rules from './pages/Rules';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solo" element={<SoloGame />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/multiplayer-lobby" element={<MultiplayerLobby />} />
          <Route path="/multiplayer-game" element={<MultiplayerGame />} />
          <Route path="/multiplayer-results" element={<MultiplayerResults />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
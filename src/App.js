import { useState } from 'react';
import './App.css';
import IdentityCard from './components/IdentityCard';
import GwangjuDialogue from './components/GwangjuDialogue';

function App() {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);

  const cards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    initialName: `Person ${i + 1}`,
    revealedName: i === 0 ? "Gwangju Survivor" : `Actual Name ${i + 1}`,
    revealedPhoto: i === 0
      ? "https://upload.wikimedia.org/wikipedia/commons/3/34/Anonymous_emblem.svg"
      : `https://via.placeholder.com/150?text=Person+${i + 1}`
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Guess the Identity</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <IdentityCard
            key={card.id}
            initialName={card.initialName}
            revealedName={card.revealedName}
            revealedPhoto={card.revealedPhoto}
            isRevealed={revealedCards.includes(index)}
            onReveal={() => setActiveDialogueIndex(index)}
          />
        ))}
      </div>

      {/* Show the dialogue ONLY if the clicked card is the Gwangju survivor */}
      {activeDialogueIndex === 0 && (
        <GwangjuDialogue
          onGuess={(correct) => {
            if (correct) {
              alert("You revealed the Gwangju Survivor.");
              setRevealedCards((prev) => [...prev, 0]);  // Mark card as revealed
              setActiveDialogueIndex(null);              // Close dialogue
            }
          }}
        />
      )}
    </div>
  );
}

export default App;

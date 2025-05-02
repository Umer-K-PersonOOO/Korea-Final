import { useState } from "react";

const MOVEMENT_OPTIONS = [
  "Feminism",
  "Anti-Feminism",
  "Nationalism",
  "Labor Activism",
  "Neoliberalism",
];

export default function GameModal({ card, onGuess, onClose }) {
  const [selectedHint, setSelectedHint] = useState(null);
  const [selectedGuess, setSelectedGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selectedGuess === card.correctMovement;

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    onGuess(card.id, isCorrect);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Guess the Movement</h2>
        <p className="text-lg italic mb-6">{card.quote}</p>

        {!selectedHint && (
          <>
            <p className="font-semibold mb-2">Choose one hint:</p>
            <div className="flex flex-col gap-2">
              {["Speaker Role", "Timeline", "Platform"].map((hint) => (
                <button
                  key={hint}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-left"
                  onClick={() => setSelectedHint(hint)}
                >
                  {hint}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedHint && !selectedGuess && (
          <>
            <p className="mt-6 font-semibold">Now, make your guess:</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {MOVEMENT_OPTIONS.map((movement) => (
                <button
                  key={movement}
                  className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200"
                  onClick={() => setSelectedGuess(movement)}
                >
                  {movement}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedGuess && !showResult && (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
            >
              Submit Guess
            </button>
          </div>
        )}

        {showResult && (
          <div className="mt-6">
            <p
              className={`text-xl font-bold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "Correct!"
                : `Incorrect. It was ${card.correctMovement}.`}
            </p>
            <button
              onClick={handleContinue}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

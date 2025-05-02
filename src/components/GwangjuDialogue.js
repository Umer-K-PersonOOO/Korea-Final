import { useState, useEffect } from "react";
import { FaQuestionCircle, FaLightbulb, FaCog } from "react-icons/fa";

const dialogueScript = [
  "The ██████████ was an era when the deaths of hundreds and the cries of tens of thousands were ignored and rationalized. Voices seeking truth were violated. The majority turned their backs, silent under terror and falsehood.",
  "Intellect, conscience, and morality were pushed aside by violence. Songs captured the despair: 'The day is dark and the night is long... our brothers are tired of falsehood and deception.'",
  "Even God could not speak or hear. Was He dead, crying in an alley, or buried under garbage? Birds, too, had abandoned ██████████. One student cried out, 'Could there ever be another moment in modern Korean history where hope and despair intersected so extremely?'",
];

// Prewritten hints and responses
const hints = [
  {
    player: "Sounds rough, but what do you think of the minjung movement?",
    identity:
      "Minjung movement? I am not sure if I know what you are talking about.",
  },
  {
    player: "Who is to be blamed for this?",
    identity:
      "Who of course! The government, the military, the U.S! They were all complicit. But I also must blame us intellectuals. We were too passive, too afraid to speak out.",
  },
];

export default function GwangjuDialogue({ onGuess }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGuessInput, setShowGuessInput] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintTyping, setHintTyping] = useState(false);
  const [outOfLines, setOutOfLines] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Typewriter effect for the current identity line
  useEffect(() => {
    if (!isTyping && currentLine < dialogueScript.length) {
      const newLine = dialogueScript[currentLine];
      setChatHistory((prev) => [
        ...prev,
        { speaker: "identity", text: "", isOriginal: true },
      ]);
      setTypingText("");
      setCharIndex(0);
      setIsTyping(true);
    }
  }, [currentLine]);

  useEffect(() => {
    if (!isTyping && outOfLines && !hasWon && !hintTyping && !isWaiting) {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text: "Enough... why can't you understand what I'm talking about?",
        },
      ]);
    }
  }, [outOfLines, isTyping, hasWon, hintTyping, isWaiting]);

  useEffect(() => {
    if (isTyping && charIndex < dialogueScript[currentLine]?.length) {
      const timeout = setTimeout(() => {
        const nextChar = dialogueScript[currentLine][charIndex];
        setTypingText((prev) => prev + nextChar);
        setCharIndex((prev) => prev + 1);

        // Update the last identity message in the chat history as it types
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            speaker: "identity",
            text: typingText + nextChar,
            isOriginal: true,
          };
          return updated;
        });
      }, 30);

      return () => clearTimeout(timeout);
    } else if (isTyping && charIndex >= dialogueScript[currentLine]?.length) {
      setIsTyping(false);
    }
  }, [charIndex, isTyping]);

  const submitChoice = (choice) => {
    setChatHistory((prev) => [...prev, { speaker: "player", text: choice }]);

    if (choice.toLowerCase() === "gwangju") {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Gwangju.\n\n" +
            "You see what so many tried to ignore. The Gwangju Uprising was not only suffering and loss, but a cry for dignity and truth. Even if the world turned its back, we did not.\n\n" +
            "I hope Gwangju continues to inspire those who long for justice, even if I may never see that day myself.\n\n" +
            "- Im Ch’oru, on the Gwangju movement",
        },
        {
          speaker: "system",
          text: "The conversation grows quiet.",
        },
      ]);
      setHasWon(true);
    } else {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text: "That is not the movement I was part of.",
        },
      ]);
    }
  };

  const handleHint = async () => {
    if (hasWon || isTyping || hintTyping) return; // Block during typing

    if (hintIndex < hints.length) {
      const nextHint = hints[hintIndex];
      setHintTyping(true);

      // Player's question appears instantly
      setChatHistory((prev) => [
        ...prev,
        { speaker: "player", text: nextHint.player },
        { speaker: "hint", text: "" }, // HINT speaker type
      ]);

      setHintIndex(hintIndex + 1);

      const response = nextHint.identity;
      for (let i = 0; i < response.length; i++) {
        await delay(30);
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            speaker: "hint",
            text: response.slice(0, i + 1),
          };
          return updated;
        });
      }

      setHintTyping(false);

      setIsWaiting(true);
      await delay(1000);

      if (currentLine < dialogueScript.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else {
        setOutOfLines(true);
      }

      setIsWaiting(false);
    } else {
      setChatHistory((prev) => [
        ...prev,
        { speaker: "identity", text: "I have no more to reveal." },
      ]);

      setIsWaiting(true);
      await delay(1000);
      if (currentLine < dialogueScript.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else {
        setOutOfLines(true);
      }
      setIsWaiting(false);
    }
  };

  const submitGuess = async () => {
    const answer = input.trim().toLowerCase();
    setChatHistory((prev) => [...prev, { speaker: "player", text: input }]);

    if (answer.includes("gwangju")) {
      // Correct answer
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Gwangju.\n\n" +
            "You see what so many tried to ignore. The Gwangju Uprising was not only suffering and loss, but a cry for dignity and truth. Even if the world turned its back, we did not.\n\n" +
            "I hope Gwangju continues to inspire those who long for justice, even if I may never see that day myself.\n\n" +
            "- Im Ch’oru, on the Gwangju movement",
        },
        {
          speaker: "system",
          text: "The conversation grows quiet.",
        },
      ]);
      setHasWon(true); // Disable further actions
    } else {
      setIsWaiting(true);
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text: "That is not the movement I was part of.",
        },
      ]);

      await delay(1000);

      if (currentLine < dialogueScript.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else {
        setOutOfLines(true);
      }

      setIsWaiting(false);
    }

    setInput("");
    setShowGuessInput(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg w-[90%] h-[90%] flex flex-col">
        {/* Exit button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => window.location.reload()} // Simple page reload to reset
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm"
          >
            Exit
          </button>
        </div>

        {/* Chat history */}
        <div className="overflow-y-auto pr-4 mb-1 max-h-[70vh]">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`leading-snug text-lg ${
                entry.speaker === "identity"
                  ? entry.isOriginal
                    ? "text-left text-white mb-1"
                    : "text-left text-yellow-400 mb-1"
                  : entry.speaker === "hint"
                  ? "text-left text-yellow-400 mb-1"
                  : entry.speaker === "player"
                  ? "text-right text-cyan-400 mb-1"
                  : "text-center text-gray-400 italic mb-1"
              }`}
            >
              <span>{entry.text}</span>
            </div>
          ))}
        </div>

        {/* Action row + guess input */}
        {!isTyping && !hintTyping && !isWaiting && !hasWon && !outOfLines && (
          <div
            className="
      flex gap-4 mt-2 justify-end flex-wrap
      transition-opacity duration-500 opacity-100 pointer-events-auto
    "
          >
            {/* If guessing, show input to the left */}
            {showGuessInput && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2"
                  placeholder="Your guess..."
                />
                <button
                  onClick={submitGuess}
                  className="px-4 py-2 bg-red-700 rounded text-white hover:bg-red-800"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Guess Button */}
            <button
              onClick={() => setShowGuessInput(true)}
              className="w-20 h-20 bg-red-700 hover:bg-red-800 rounded-lg flex flex-col items-center justify-center"
              title="Make a Guess"
            >
              <FaQuestionCircle size={32} />
              <span className="text-xs">Guess</span>
            </button>

            {/* Hint Button */}
            <button
              onClick={handleHint}
              className="w-20 h-20 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex flex-col items-center justify-center"
              title="Ask for Hint"
            >
              <FaLightbulb size={32} />
              <span className="text-xs">Hint</span>
            </button>

            {/* Action Button */}
            <button
              disabled
              className="w-20 h-20 bg-gray-600 rounded-lg flex flex-col items-center justify-center opacity-50 cursor-not-allowed"
              title="Special Action (Coming Soon)"
            >
              <FaCog size={32} />
              <span className="text-xs">Action</span>
            </button>
          </div>
        )}

        {outOfLines && !hasWon && (
          <div className="flex flex-col gap-2 mt-4 text-lg">
            <span className="text-gray-300">
              Choose what movement I was part of:
            </span>
            <div className="flex gap-4 flex-wrap">
              {["Gwangju", "Minjung", "The Yangban", "The Korean War"].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => submitChoice(option)}
                    className="px-4 py-2 bg-blue-700 rounded text-white hover:bg-blue-800"
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

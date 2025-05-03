import { useState, useEffect } from "react";
import { FaQuestionCircle, FaLightbulb, FaCog } from "react-icons/fa";

const dialogueScript = [
  "Our Republic stands at a crossroads. Threats gather not just beyond our borders, but within — disguised as students, workers, even journalists. They agitate, spreading disorder in hopes of weakening our unity.",
  "Freedom without order is an illusion. To safeguard democracy, firm action is necessary. A house divided cannot stand; neither can a nation divided resist those who wish to see it fall.",
  "The youth must not be swayed by slogans of chaos. Laborers must reject those who would destroy the very industries that sustain them. Disorder will be met with swift response.",
  "Unity, discipline, and the labor of the people are our shield. Vigilance is not fear, and sacrifice is not oppression. These are the price of national survival.",
];

const hints = [
  {
    player: "Why target students and workers?",
    identity:
      "Because enemies hide among them, using noble causes as cover for subversion.",
  },
  {
    player: "Isn’t harsh control dangerous for democracy?",
    identity: "Control is not oppression. It is the defense of freedom itself.",
  },
];

export default function ParkChungHeeDialogue({ onGuess, onExit }) {
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
  const [fastForward, setFastForward] = useState(false);
  const [forceNormalSpeed, setForceNormalSpeed] = useState(false);
  const [usedSpecial, setUsedSpecial] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setForceNormalSpeed(false);
    if (!isTyping && currentLine < dialogueScript.length) {
      setFastForward(false);
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
          text: "How can you not know who I am?",
        },
      ]);
    }
  }, [outOfLines, isTyping, hasWon, hintTyping, isWaiting]);

  useEffect(() => {
    if (isTyping && charIndex < dialogueScript[currentLine]?.length) {
      const timeout = setTimeout(
        () => {
          const nextChar = dialogueScript[currentLine][charIndex];
          setTypingText((prev) => prev + nextChar);
          setCharIndex((prev) => prev + 1);

          setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              speaker: "identity",
              text: typingText + nextChar,
              isOriginal: true,
            };
            return updated;
          });
        },
        forceNormalSpeed ? 20 : fastForward ? 1 : 20
      );

      return () => clearTimeout(timeout);
    } else if (isTyping && charIndex >= dialogueScript[currentLine]?.length) {
      setIsTyping(false);
    }
  }, [charIndex, isTyping]);

  const resetDialogue = () => {
    setChatHistory([]);
    setCurrentLine(0);
    setTypingText("");
    setCharIndex(0);
    setHintIndex(0);
    setInput("");
    setIsTyping(false);
    setShowGuessInput(false);
    setIsWaiting(false);
    setHintTyping(false);
    setOutOfLines(false);
    setFastForward(false);
    setForceNormalSpeed(false);
  };

  const submitChoice = (choice) => {
    setForceNormalSpeed(true);
    setChatHistory((prev) => [...prev, { speaker: "player", text: choice }]);
    if (
      choice.toLowerCase().includes("emergency") ||
      choice.toLowerCase().includes("park")
    ) {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Emergency Rule under Park Chung-hee.\n\n" +
            "Freedom must be sacrificed when national survival is at stake.\n\n" +
            "In the face of communism, unity and order were our strongest weapons.\n\n" +
            "- Park Chung-hee, 1975",
        },
        { speaker: "system", text: "The conversation grows quiet." },
      ]);
      setHasWon(true);
      onGuess(true);
    } else {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text: "No, that is not me.",
        },
      ]);
    }
  };

  const handleHint = async () => {
    if (hasWon || isTyping || hintTyping) return;

    if (hintIndex < hints.length) {
      const nextHint = hints[hintIndex];
      setHintTyping(true);

      setChatHistory((prev) => [
        ...prev,
        { speaker: "player", text: nextHint.player },
        { speaker: "hint", text: "" },
      ]);

      setHintIndex(hintIndex + 1);

      const response = nextHint.identity;
      for (let i = 0; i < response.length; i++) {
        await delay(20);
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
    }
  };

  const submitGuess = async () => {
    if (!input.trim()) return;
    const answer = input.trim().toLowerCase();
    setChatHistory((prev) => [...prev, { speaker: "player", text: input }]);

    if (answer.includes("emergency") || answer.includes("park") || answer.includes("chung") || answer.includes("hee")) {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Emergency Rule under Park Chung-hee.\n\n" +
            "Freedom must be sacrificed when national survival is at stake.\n\n" +
            "In the face of communism, unity and order were our strongest weapons.\n\n" +
            "- Park Chung-hee, 1975",
        },
        { speaker: "system", text: "The conversation grows quiet." },
      ]);
      setHasWon(true);
      onGuess(true);
    } else {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text: "No, that is not me.",
        },
      ]);
      setIsWaiting(true); // <--- ADD THIS

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
      <div
        className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg w-[90%] h-[90%] flex flex-col"
        onClick={() => setFastForward(true)}
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              if (!hasWon) resetDialogue();
              onExit();
            }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm"
          >
            Exit
          </button>
        </div>

        <div className="overflow-y-auto pr-4 mb-1 max-h-[70vh]">
          {chatHistory.map((entry, index) =>
            entry.isRecord ? (
              <div
                key={index}
                className="border border-gray-600 bg-gray-700 p-3 rounded mb-2 text-sm text-gray-300"
              >
                <div className="font-bold mb-1">{entry.text.title}</div>
                <div className="mb-1">{entry.text.body}</div>
                <div className="italic text-gray-400">{entry.text.footer}</div>
              </div>
            ) : (
              <div
                key={index}
                className={`leading-snug text-lg ${
                  entry.speaker === "identity"
                    ? entry.isOriginal
                      ? "text-left text-yellow-400 mb-1"
                      : "text-left text-yellow-400 mb-1"
                    : entry.speaker === "hint"
                    ? "text-left text-yellow-400 mb-1"
                    : entry.speaker === "player"
                    ? "text-right text-cyan-400 mb-1"
                    : "text-center text-gray-400 italic mb-1"
                }`}
              >
                {typeof entry.text === "string" && <span>{entry.text}</span>}
              </div>
            )
          )}
        </div>

        {!isTyping && !hintTyping && !isWaiting && !hasWon && !outOfLines && (
          <div className="flex gap-4 mt-2 justify-end flex-wrap">
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
                  disabled={!input.trim()}
                  className={`px-4 py-2 rounded text-white ${
                    input.trim()
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            )}

            <button
              onClick={() => setShowGuessInput(true)}
              className="w-20 h-20 bg-red-700 hover:bg-red-800 rounded-lg flex flex-col items-center justify-center"
            >
              <FaQuestionCircle size={32} />
              <span className="text-xs">Guess</span>
            </button>

            <button
              onClick={handleHint}
              className="w-20 h-20 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex flex-col items-center justify-center"
            >
              <FaLightbulb size={32} />
              <span className="text-xs">Hint</span>
            </button>

            <button
              onClick={async () => {
                if (!usedSpecial) {
                  setUsedSpecial(true);
                  setChatHistory((prev) => [
                    ...prev,
                    {
                      speaker: "system",
                      isRecord: true,
                      text: {
                        title: "Presidential Address Draft, 1974",
                        body: "Speech outlines the necessity of national unity and firm action against internal disruption. Emphasizes vigilance, labor, and discipline as foundations of security.",
                        footer: "Confidential Staff Memorandum",
                      },
                    },
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
              }}
              disabled={usedSpecial}
              className={`w-20 h-20 ${
                usedSpecial
                  ? "bg-gray-600 opacity-50"
                  : "bg-green-700 hover:bg-green-800"
              } rounded-lg flex flex-col items-center justify-center`}
            >
              <FaCog size={32} />
              <span className="text-xs">Records</span>
            </button>
          </div>
        )}

        {outOfLines && !hasWon && (
          <div className="flex flex-col gap-2 mt-4 text-lg">
            <span className="text-gray-300">
              Choose what event this describes:
            </span>
            <div className="flex gap-4 flex-wrap">
              {[
                "Park Chung-hee",
                "Syngman Rhee",
                "Yoon Suk-yeol",
                "Kim Dae-jung ",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => submitChoice(option)}
                  className="px-4 py-2 bg-blue-700 rounded text-white hover:bg-blue-800"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

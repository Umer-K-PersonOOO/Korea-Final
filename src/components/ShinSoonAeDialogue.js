import { useState, useEffect } from "react";
import { FaQuestionCircle, FaLightbulb, FaCog } from "react-icons/fa";

const dialogueScript = [
  "I never graduated elementary school. We were too poor. So when the ████████ offered free middle school education, I went.",
  "My eyes were always on the needle, afraid to look up. At the ███████, people called me Miss Shin Soon-ae. They treated me with dignity. I found friends and purpose.",
  "We occupied the ████████ despite threats, police guns, and curfews. In the end, they gave in. That victory was for all of us.",
  "But in 1981, the government shut down our ████████. I became a fugitive for two years. I was harassed and even offered bribes to betray my beliefs. I refused. Even now, our sacrifices are forgotten.██████████ and Park Chung Hee became rich, but ██████ like us received no compensation or recognition.",
  "Today, ██████ are divided. Regular ██████ should stand with irregular ██████, but many don’t. The struggle must continue.",
];

const hints = [
  {
    player: "What did you hope to achieve?",
    identity:
      "Mostly, we just wanted some control over our lives. Even a little change mattered back then.",
  },
  {
    player: "Was it dangerous to speak out?",
    identity:
      "Some people thought it wasn’t worth the risk. But I couldn’t stay silent forever.",
  },
  {
    player: "How did others see your efforts?",
    identity:
      "At first, many ignored or feared us. Later, some began to see why we tried.",
  },
];

export default function ShinSoonAeDialogue({ onGuess, onExit }) {
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
          text: "It seems we need to spread our message further...",
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
    if (choice.toLowerCase().includes("labor")) {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Labor Activism.\n\n" +
            "We fought not just for wages, but for dignity. We refused to be machines. Even under threats, curfews, and persecution, we stood together.\n\n" +
            "Though our sacrifices were never fully recognized, the struggle for justice continues.\n\n" +
            "- Shin Soon-ae, Cheonggye union organizer",
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
          text: "That is not the movement I was part of.",
        },
      ]);

      // 🔥 Advance to next line or end
      if (currentLine < dialogueScript.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else {
        setOutOfLines(true);
      }
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

    if (answer.includes("labor") || answer.includes("union")) {
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: "identity",
          text:
            "Yes... Labor Activism.\n\n" +
            "We were not machines. We were proud workers who demanded dignity.\n\n" +
            "- Shin Soon-ae, Cheonggye union organizer",
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
          text: "That is not the movement I was part of.",
        },
      ]);
      setIsWaiting(true);  // <--- ADD THIS

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
                        title: "Workplace Compliance Memo - Late 1970s",
                        body: "An internal report notes increasing worker absenteeism linked to off-site educational activities. Management expresses concern over potential coordination among employees.",
                        footer:
                          "Private Factory Archive, Pyeonghwa Market Collection",
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
              Choose what movement I was part of:
            </span>
            <div className="flex gap-4 flex-wrap">
              {[
                "Union Activist",
                "Student Democracy",
                "Gender Equality",
                "Consumer Nationalism",
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

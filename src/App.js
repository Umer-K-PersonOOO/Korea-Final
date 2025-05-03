import { useState } from "react";
import "./App.css";
import IdentityCard from "./components/IdentityCard";
import GwangjuDialogue from "./components/GwangjuDialogue";
import ShinSoonAeDialogue from "./components/ShinSoonAeDialogue";
import SNUManifestoDialogue from "./components/SNUManifestoDialogue";
import ComfortWomenDialogue from "./components/ComfortWomenDialogue";
import JejuUprisingDialogue from "./components/JejuUprisingDialogue";
import ParkChungHeeDialogue from "./components/ParkChungHeeDialogue";
import GoldForTheFatherlandDialogue from "./components/GoldForTheFatherlandDialogue";
import EducationPressureDialogue from "./components/EducationPressureDialogue";
import CorporateMeritocracyDialogue from "./components/CorporateMeritocracyDialogue";

function App() {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);

  const cards = [
    {
      id: 0,
      initialName: "Person 1",
      revealedName: "Gwangju Activist (Im Ch’oru)",
    },
    {
      id: 1,
      initialName: "Person 2",
      revealedName: "Shin Soon-ae (Labor Activist)",
    },
    {
      id: 2,
      initialName: "Person 3",
      revealedName: "Minjung movement (SNU Student)",
    },
    {
      id: 3,
      initialName: "Person 4",
      revealedName: "Lee Yong-soo (Comfort Woman)",
    },
    {
      id: 4,
      initialName: "Person 5",
      revealedName: "Jeju Uprising (Jeju peace park)",
    },
    {
      id: 5,
      initialName: "Person 6",
      revealedName: "Park Chung-hee",
    },
    {
      id: 6,
      initialName: "Person 7",
      revealedName: "Citizen Donor (Gold Campaign)",
    },
    {
      id: 7,
      initialName: "Person 8",
      revealedName: "Korean Parent (Education Pressure)",
    },
    {
      id: 8,
      initialName: "Person 9",
      revealedName: "Corporate Reformer",
    },
  ];

  const dialogues = [
    GwangjuDialogue,
    ShinSoonAeDialogue,
    SNUManifestoDialogue,
    ComfortWomenDialogue,
    JejuUprisingDialogue,
    ParkChungHeeDialogue,
    GoldForTheFatherlandDialogue,
    EducationPressureDialogue,
    CorporateMeritocracyDialogue,
  ];

  return (
    <div className="bg-gray-900 ">
      <div className="min-h-screen bg-gray-900 text-gray-200 p-8 container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Discover the Identity of diffrent Korean Activists, Movements, and
          Leaders!
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-6 text-lg">
          Click on a person to start a dialogue. Ask questions, request hints,
          or reveal official records to gather clues.
          <br />
          <span className="text-cyan-400">Blue text</span> shows your questions,
          <span className="text-yellow-400"> yellow text</span> shows hints or
          paraphrased responses, and
          <span className="text-white"> white text</span> is the character's
          original words.
          <br />
          When you're ready, submit a guess. Be careful — not all answers are
          obvious.
        </p>

        <div className="grid grid-cols-3 gap-6 justify-items-center">
          {cards.map((card, index) => (
            <IdentityCard
              key={card.id}
              initialName={card.initialName}
              revealedName={card.revealedName}
              revealedPhoto={
                revealedCards.includes(index)
                  ? `/icons/person${index + 1}.jpg`
                  : `https://via.placeholder.com/150?text=Person+${index + 1}`
              }
              isRevealed={revealedCards.includes(index)}
              onReveal={() => setActiveDialogueIndex(index)}
            />
          ))}
        </div>

        {activeDialogueIndex !== null &&
          (() => {
            const DialogueComponent = dialogues[activeDialogueIndex];
            return (
              <DialogueComponent
                onGuess={(correct) => {
                  if (correct) {
                    setRevealedCards((prev) =>
                      prev.includes(activeDialogueIndex)
                        ? prev
                        : [...prev, activeDialogueIndex]
                    );
                  }
                }}
                onExit={() => setActiveDialogueIndex(null)}
              />
            );
          })()}
      </div>
      <div className="mt-2 text-center text-gray-300 text-base max-w-4xl mx-auto leading-relaxed">
        <p className="mb-3 font-bold text-lg">Sources</p>
        <p>
          1. Namhee Lee, <em>The Making of Minjung</em>
        </p>
        <p>
          2. Online article "70s Women Workers" (
          <a
            href="https://solidaritystorieskr.wordpress.com/2014/05/08/70s-women-workers/"
            className="underline text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            link
          </a>
          )
        </p>
        <p>
          3. Chungmoo Choi, "Dangerous Women: Gender and Korean Nationalism"
          (1998)
        </p>
        <p>
          4. Jeju 4.3 Peace Foundation (
          <a
            href="http://jeju43peace.org/"
            className="underline text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            link
          </a>
          )
        </p>
        <p>
          5. So Jin Park & Nancy Abelmann, "Class and Cosmopolitan Striving:
          Mothers’ Management of English Education in South Korea,"{" "}
          <em>Anthropological Quarterly</em> 77(4):645-672 (2004)
        </p>
      </div>
    </div>
  );
}

export default App;

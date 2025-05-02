import { useState } from "react";
import "./App.css";
import IdentityCard from "./components/IdentityCard";

import GwangjuDialogue from "./components/GwangjuDialogue";
import ShinSoonAeDialogue from "./components/ShinSoonAeDialogue";
import SNUManifestoDialogue from "./components/SNUManifestoDialogue";
import ComfortWomenDialogue from "./components/ComfortWomenDialogue";
import SpecGenerationDialogue from "./components/SpecGenerationDialogue";
import QueerMovementDialogue from "./components/QueerMovementDialogue";
import MigrantLaborDialogue from "./components/MigrantLaborDialogue";
import ParkChungHeeDialogue from "./components/ParkChungHeeDialogue";
import GoldForTheFatherlandDialogue from "./components/GoldForTheFatherlandDialogue";
import EducationPressureDialogue from "./components/EducationPressureDialogue";
import HellJoseonDialogue from "./components/HellJoseonDialogue";
import CorporateMeritocracyDialogue from "./components/CorporateMeritocracyDialogue";

function App() {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);

  const cards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    initialName: `Person ${i + 1}`,
    revealedName:
      i === 0
        ? "Gwangju Survivor"
        : i === 1
        ? "Shin Soon-ae (Labor Activist)"
        : i === 2
        ? "SNU Student (1960)"
        : i === 3
        ? "Lee Yong-soo (Comfort Woman)"
        : i === 4
        ? "Kim Jaram (Spec Generation)"
        : i === 5
        ? "Yook Woo-dang (Queer Activist)"
        : i === 6
        ? "MTU Migrant Worker"
        : i === 7
        ? "Park Chung-hee (Conservative)"
        : i === 8
        ? "Citizen Donor (Gold Campaign)"
        : i === 9
        ? "Korean Parent (Education Pressure)"
        : i === 10
        ? "Park Su-ah (Hell Joseon)"
        : "Corporate Reformer (Samsung)",

    revealedPhoto:
      revealedCards.includes(i) && i === 0
        ? "/icons/250px-LimChulWoo.jpg"
        : revealedCards.includes(i)
        ? `/icons/person${i + 1}.jpg`
        : `https://via.placeholder.com/150?text=Person+${i + 1}`
  }));

  const dialogues = [
    GwangjuDialogue,
    ShinSoonAeDialogue,
    SNUManifestoDialogue,
    ComfortWomenDialogue,
    SpecGenerationDialogue,
    QueerMovementDialogue,
    MigrantLaborDialogue,
    ParkChungHeeDialogue,
    GoldForTheFatherlandDialogue,
    EducationPressureDialogue,
    HellJoseonDialogue,
    CorporateMeritocracyDialogue
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Guess the Identity
      </h1>
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

      {activeDialogueIndex !== null && (() => {
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
  );
}

export default App;

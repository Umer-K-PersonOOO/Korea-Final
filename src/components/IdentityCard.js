export default function IdentityCard({
  initialName,
  revealedName,
  revealedPhoto,
  isRevealed,
  onReveal,
}) {
  return (
    <div className="max-w-sm w-full bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 border border-gray-700">
      <img
        src={
          isRevealed
            ? revealedPhoto
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Question_book-new.svg/1200px-Question_book-new.svg.png"
        }
        alt="Profile"
        className="w-32 h-32 object-cover rounded-full border"
      />
      <h2 className="text-xl font-semibold">
        {isRevealed ? revealedName : initialName}
      </h2>
      {!isRevealed && (
        <button
          onClick={onReveal}
          className="mt-2 px-4 py-1 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded"
        >
          Start Dialogue
        </button>
      )}
    </div>
  );
}

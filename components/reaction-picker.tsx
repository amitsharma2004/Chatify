"use client";

import { useState } from "react";
import { Smile } from "lucide-react";

const EMOJI_SET = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

interface ReactionPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function ReactionPicker({ onEmojiSelect }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded p-1 opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
        title="Add reaction"
      >
        <Smile className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-20 mb-2 flex gap-1 rounded-lg border border-border bg-background p-2 shadow-lg">
            {EMOJI_SET.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="rounded p-1 text-xl transition-transform hover:scale-125 hover:bg-secondary"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

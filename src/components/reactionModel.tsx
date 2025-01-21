import React, { useState } from "react";
import LoveEmojiPath from "../assets/reactions/love_emoji.png";
import LaughingEmojiPath from "../assets/reactions/laughing.png";
import ThumbsEmojiPath from "../assets/reactions/thumbsup.png";
import AngryEmojiPath from "../assets/reactions/angry.png";
import WowEmojiPath from "../assets/reactions/wow.png";
import HeartEmoji from "../assets/reactions/heart.png";

import Image from "next/image";

export const reactions = [
  { id: 1, path: HeartEmoji },
  { id: 2, path: LoveEmojiPath },
  { id: 3, path: LaughingEmojiPath },
  { id: 4, path: ThumbsEmojiPath },
  { id: 5, path: WowEmojiPath },
  { id: 6, path: AngryEmojiPath },
];

type ReactionModelProps = {
  setShowReaction: (value: boolean) => void;
  setIsLike: (value: boolean) => void;
  selectedReactionId: number;
  setSelectedReactionId: React.Dispatch<React.SetStateAction<number>>;
};

const ReactionModel: React.FC<ReactionModelProps> = ({
  setShowReaction,
  selectedReactionId: selectedReaction,
  setSelectedReactionId: setSelectedReaction,
  setIsLike,
}) => {
  return (
    <div
      className="bg-[#374151] flex px-1 z-10 items-center h-10 rounded-full  absolute -bottom-[9px] -left-1"
      onMouseEnter={() => setShowReaction(true)} // Keep the model visible
      onMouseLeave={() => setShowReaction(false)}
    >
      {reactions.map((item) => {
        return (
          <button
            key={item.id}
            className={`h-7 w-7 p-[4px] mx-[5px] flex justify-center items-center rounded-full hover:bg-[grey] ${
              selectedReaction === item.id
                ? "bg-[white] h-7 w-7 p-1 hover:bg-[white]"
                : ""
            }`}
            onClick={() => {

              setSelectedReaction(item.id);
              setShowReaction(false);
              setIsLike(true);
            
            }}
          >
            <Image
              src={item.path}
              className="w-full h-full"
              alt="reaction images"
            />
          </button>
        );
      })}
    </div>
  );
};

export default ReactionModel;

import React, { useState } from "react";

interface UserProfileProps {
  fullName?: string;
  size: number;
}

const UserProfilePicture: React.FC<UserProfileProps> = ({
  fullName = "Hiteshi User",
  size,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const generateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      const char = str?.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash;
    }
    return hash;
  };

  const nameParts = fullName?.trim().split(" ") || [];
  const firstName = nameParts[0] || "Hiteshi";
  const lastName =
    nameParts?.length > 1 ? nameParts?.slice(1).join(" ") : "User";

  const initials = `${firstName?.charAt(0).toUpperCase()}${lastName
    ?.charAt(0)
    .toUpperCase()}`;

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const colorIndex = Math?.abs(generateHash(fullName)) % colors?.length;
  const selectedColor = colors[colorIndex];

  const imageSize = `${size}px`;

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {!imageLoaded && (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxFIGZTCDVxnV5EcAxwEik-tGmTdim5vyyAw&s"
          alt="Default loading"
          style={{
            width: imageSize,
            height: imageSize,
            objectFit: "cover",
            borderRadius: "50%",
          }}
          onLoad={() => setImageLoaded(true)}
        />
      )}
      {imageLoaded && (
        <div
          className={`flex items-center justify-center rounded-full ${selectedColor}`}
          style={{ width: imageSize, height: imageSize }}
        >
          <span
            className="text-white font-bold"
            style={{ fontSize: `${size / 2}px` }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;

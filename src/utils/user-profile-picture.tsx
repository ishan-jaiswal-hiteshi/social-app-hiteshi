import React from "react";

interface UserProfileProps {
  fullName?: string;
  size: number;
}

const UserProfilePicture: React.FC<UserProfileProps> = ({
  fullName = "Hiteshi",
  size,
}) => {
  const nameParts = fullName?.trim().split(" ");
  const firstName = nameParts[0];
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Hiteshi";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  const getRandomBgColor = () => {
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
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const imageSize = `${size}px`;

  return (
    <div
      className={`flex items-center justify-center rounded-full ${getRandomBgColor()}`}
      style={{ width: imageSize, height: imageSize }}
    >
      <span
        className="text-white font-bold"
        style={{ fontSize: `${size / 2}px` }}
      >
        {initials}
      </span>
    </div>
  );
};

export default UserProfilePicture;

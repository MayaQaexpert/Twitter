"use client";

import Image from "next/image";
import { useState } from "react";

export default function TweetBox() {
  const [tweet, setTweet] = useState("");

  const sendTweet = () => {
    if (!tweet.trim()) return;
    alert(`Tweet posted: ${tweet}`);
    setTweet("");
  };

  return (
    <div className="flex space-x-3 border-b border-gray-200 p-3">
      {/* 👤 User Image */}
      <Image
        src="https://media.licdn.com/dms/image/D4E03AQEna1ddNOyEeg/profile-displayphoto-shrink_800_800/0/1719568062911?e=1762992000&v=beta&t=FFY2wGP4AtQM2BxwmYuRUFgCrL_qExR-BIpVrhsHCws"
        alt="User"
        width={45}
        height={45}
        className="rounded-full"
      />

      {/* 📝 Input + Button */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="What's happening?"
          className="w-full outline-none text-lg placeholder-gray-500"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={sendTweet}
            className="bg-blue-500 text-white font-semibold px-4 py-1 rounded-full hover:bg-blue-600 transition"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}

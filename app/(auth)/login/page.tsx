import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-screen">
      <div className="relative w-1/2 h-full">
        {/* <Image
          src="/img/login_image.JPG"
          alt="image"
          layout="fill"
          objectFit="cover"
        /> */}
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <div>
          <h1 className="text-center mb-4 text-6xl font-bold">Welcome!</h1>
          <p className="text-lg text-center text-gray-300">How about you quickly enter to see all the features!</p>
        </div>
      </div>
    </div>
  );
};

export default Page;

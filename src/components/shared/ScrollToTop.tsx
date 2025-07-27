"use client"
import React, { useEffect, useState } from "react";
import { ChevronUpIcon } from "lucide-react";
import { Button } from "../ui/button";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  const toggleShow = () => {
    if (scrollY > 1000) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleShow);
    return () => window.removeEventListener("scroll", toggleShow);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      size={"icon"}
      className={`${
        showButton && "show-button"
      } scroll-top fixed right-3 md:bottom-28 bottom-8 w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg hover:-translate-y-1 cursor-pointer z-10 `}
      onClick={scrollToTop}
    >
      <ChevronUpIcon className="size-6" />
    </Button>
  );
};

export default ScrollToTop;

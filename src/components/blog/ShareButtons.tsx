"use client"
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    // This runs only on client-side after component mounts
    setCurrentUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.info("Link copied to clipboard!");
  };

  return (
    <div className="border-t pt-6">
      <h4 className="mb-4 text-lg font-medium">Share this post</h4>
      <div className="flex space-x-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <button
          onClick={copyToClipboard}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          aria-label="Copy link"
          disabled={!currentUrl}
        >
          <LinkIcon size={18} />
        </button>
      </div>
    </div>
  );
}
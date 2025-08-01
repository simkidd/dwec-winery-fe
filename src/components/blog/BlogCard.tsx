import { IBlogPost } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import { CalendarDays, Clock, ImageIcon } from "lucide-react";
import Image from "next/image";
import { AnimatedLink } from "../shared/AnimatedLink";
import { Badge } from "../ui/badge";
import { formatCategory } from "@/utils/helpers";

const BlogCard = ({
  post,
  variant = "default",
}: {
  post: IBlogPost;
  variant?: "default" | "featured";
}) => {
  const hasImage = post.image?.imageUrl;

  return (
    <article
      className={`group relative h-full min-h-[480px] overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl ${
        variant === "featured" ? "md:min-h-[540px]" : ""
      } ${!hasImage ? "bg-gradient-to-br from-gray-900 to-gray-800" : ""}`}
    >
      {/* Full-bleed image with overlay - only show if image exists */}
      {hasImage ? (
        <div className="absolute inset-0">
          <Image
            src={post.image?.imageUrl || ""}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={
              variant === "featured"
                ? "100vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
            priority={variant === "featured"}
          />
          {/* Gradient overlay - bottom to top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      ) : (
        // Fallback content when no image
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-card text-gray-400">
          <div className="text-center p-6 flex flex-col items-center opacity-50">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="">No image available</p>
          </div>
        </div>
      )}

      {/* Content container */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-6 ${
          hasImage ? "text-white" : "dark:text-stone-200"
        }`}
      >
        {/* Category tag */}
        <div className="mb-2">
          <Badge
            className={`rounded-full font-medium backdrop-blur-sm ${
              hasImage ? "bg-primary/90" : "bg-gray-700/90"
            }`}
          >
            {formatCategory(post.category)}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className={`mb-3 font-bold leading-tight ${
            variant === "featured" ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          <AnimatedLink
            href={`/blog/${post.slug}`}
            className={`hover:text-primary-200 ${
              !hasImage ? "hover:text-stone-200" : ""
            }`}
          >
            {post.title}
          </AnimatedLink>
        </h3>

        {/* Excerpt */}
        <p
          className={`mb-4 line-clamp-2 ${
            variant === "featured" ? "text-lg" : "text-base"
          } `}
        >
          {post.excerpt}
        </p>

        {/* Meta information */}
        <div className={`flex flex-col gap-2 text-sm `}>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {post.publishedAt
                ? formatDate(new Date(post?.publishedAt), "MMM dd, yyyy")
                : "Not published"}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {post.readTime || "--"} min read
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

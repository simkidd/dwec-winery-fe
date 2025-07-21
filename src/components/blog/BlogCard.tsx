import { IBlogPost } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { AnimatedLink } from "../shared/AnimatedLink";
import { Badge } from "../ui/badge";

const BlogCard = ({
  post,
  variant = "default",
}: {
  post: IBlogPost;
  variant?: "default" | "featured";
}) => {
  return (
    <article
      className={`group relative h-full min-h-[480px] overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl ${
        variant === "featured" ? "md:min-h-[540px]" : ""
      }`}
    >
      {/* Full-bleed image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={post.image?.imageUrl || ""}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            variant === "featured" ? "100vw" : "(max-width: 768px) 100vw, 50vw"
          }
          priority={variant === "featured"}
        />
        {/* Gradient overlay - bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        {/* Category tag */}
        <div className="mb-2">
          <Badge className="rounded-full bg-primary/90 font-medium backdrop-blur-sm">
            {post.tags && post.tags[0]}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className={`mb-3 font-bold leading-tight text-white ${
            variant === "featured" ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          <AnimatedLink href={`/blog/${post.slug}`} className="hover:text-primary-200">
            {post.title}
          </AnimatedLink>
        </h3>

        {/* Excerpt */}
        <p
          className={`mb-4 line-clamp-2 ${
            variant === "featured" ? "text-lg" : "text-base"
          } text-gray-100`}
        >
          {post.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-col gap-2 text-sm text-gray-200">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {post.createdAt
                ? formatDate(new Date(post?.publishedAt), "MMM dd, yyyy")
                : ""}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Featured badge */}
      {variant === "featured" && (
        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          Featured
        </div>
      )}
    </article>
  );
};

export default BlogCard;

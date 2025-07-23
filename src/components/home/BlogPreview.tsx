"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import BlogCard from "../blog/BlogCard";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import usePosts from "@/hooks/usePosts";

const BlogPreview = () => {
  const { posts } = usePosts({
    page: 1,
    limit: 3,
    isPublished: true,
    featured: true,
  });

  if (posts.length === 0) return null;

  return (
    <section className="bg-stone-50 dark:bg-stone-900 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        >
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Our Blog
            </h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl">
              A good drink starts a conversation
            </p>
          </div>

          <Button asChild variant={"link"} className="hidden md:flex group">
            <Link href={"/blog"} className="flex items-center gap-1">
              <span className="text-primary dark:text-stone-300 group-hover:text-primary transition-colors">
                View More Blog
              </span>
              <ChevronRight className="h-5 w-5 text-primary dark:text-stone-400 group-hover:text-primary transition-colors" />
            </Link>
          </Button>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {posts.map((post) => (
            <motion.div
              key={post._id}
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View More Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button
            variant="outline"
            className="gap-2 border-stone-300 dark:border-stone-700 hover:border-primary"
            asChild
          >
            <Link href={"/blog"}>
              <span className="text-stone-800 dark:text-stone-200">
                View More Blog
              </span>
              <ChevronRight className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;

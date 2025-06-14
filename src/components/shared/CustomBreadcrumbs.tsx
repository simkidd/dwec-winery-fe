"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbItem = {
  name: string;
  href: string;
};

type CustomBreadcrumbsProps = {
  product?: {
    name: string;
    category?: {
      name: string;
      slug: string;
    };
  };
  blogPost?: {
    title: string;
    // category?: string;
  };
};

const CustomBreadcrumbs = ({ product, blogPost }: CustomBreadcrumbsProps) => {
  const pathname = usePathname();

  // Generate breadcrumbs based on product data or path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" }, // Always include Home
    ];

    // Handle blog post breadcrumbs
    if (blogPost) {
      breadcrumbs.push(
        { name: "Blog", href: "/blog" },
        // ...(blogPost.category
        //   ? [
        //       {
        //         name: blogPost.category,
        //         href: `/blog/category/${blogPost.category.toLowerCase()}`,
        //       },
        //     ]
        //   : []),
        { name: blogPost.title, href: pathname }
      );
      return breadcrumbs;
    }

    // If we have product data with category, use that
    if (product?.category) {
      breadcrumbs.push(
        {
          name: product.category.name,
          href: `/category/${product.category.slug}`,
        },
        { name: product.name, href: pathname }
      );
      return breadcrumbs;
    }

    // Fallback to path-based breadcrumbs
    const paths = pathname.split("/").filter(Boolean);

    let accumulatedPath = "";
    for (let i = 0; i < paths.length; i++) {
      accumulatedPath += `/${paths[i]}`;
      breadcrumbs.push({
        name: formatBreadcrumbName(paths[i]),
        href: accumulatedPath,
      });
    }

    return breadcrumbs;
  };

  const formatBreadcrumbName = (name: string): string => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs();
  const isLast = (index: number) => index === breadcrumbs.length - 1;

  return (
    <div className="w-full py-4 bg-background border-b">
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {isLast(index) ? (
                    <BreadcrumbPage className="font-medium">
                      {crumb.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={crumb.href}
                        className="hover:text-primary transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast(index) && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CustomBreadcrumbs;

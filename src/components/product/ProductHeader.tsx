"use client"
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BreadcrumbItem = {
  name: string;
  href: string;
};

const ProductHeader = () => {
  const pathname = usePathname();
  
  // Generate breadcrumbs from the current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    let accumulatedPath = '';
    for (let i = 0; i < paths.length; i++) {
      accumulatedPath += `/${paths[i]}`;
      breadcrumbs.push({
        name: formatBreadcrumbName(paths[i]),
        href: accumulatedPath,
      });
    }
    
    return breadcrumbs;
  };

  // Format the breadcrumb name to be more readable
  const formatBreadcrumbName = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = generateBreadcrumbs();
  const isLast = (index: number) => index === breadcrumbs.length - 1;

  return (
    <div className="w-full py-4 bg-background border-b">
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
            
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

export default ProductHeader;
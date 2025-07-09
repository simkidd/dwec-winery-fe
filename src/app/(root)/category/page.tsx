import CategoriesGrid from "@/components/product/CategoriesGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

const pageTitle = "Category";

export const metadata: Metadata = {
  title: pageTitle,
};

const CategoriesPage = () => {
  return (
    <div className="">
      <CustomBreadcrumbs />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 py-8 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Our Collections of Drinks
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6">
            Discover our premium selection of beverages curated for every taste
            and occasion
          </p>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-sm sm:text-base"
          >
            Explore Seasonal Specials
          </Button>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <CategoriesGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-secondary/10 py-8 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Can&apos;t find what you need?
          </h2>
          <p className="text-muted-foreground mb-4 sm:mb-6">
            We&apos;re expanding our collection
          </p>
          <Button size="sm" className="rounded-full text-sm sm:text-base">
            Request Product
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;

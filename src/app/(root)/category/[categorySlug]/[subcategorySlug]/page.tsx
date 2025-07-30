import CategoryProductGrid from "@/components/product/CategoryProductGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { ISubCategory } from "@/interfaces/product.interface";
import { getSubcategoryBySlug } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

const SubcategoryPage = async ({
  params,
}: {
  params: Promise<{ subcategorySlug: string }>;
}) => {
  const { subcategorySlug } = await params;
  const data = await getSubcategoryBySlug(subcategorySlug);
  const subcategory = data.subCategory as ISubCategory;

  if (!subcategory) {
    return notFound();
  }

  return (
    <div>
      <CustomBreadcrumbs />
      <div
        className={cn(
          "w-full h-40 lg:h-60 relative flex items-center",
          ` bg-no-repeat bg-cover bg-center`
        )}
        style={{ backgroundImage: `url(${subcategory.category.image})` }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold text-white">{subcategory.name}</h1>
          <p className="text-white/90 mt-2 max-w-2xl">
            {subcategory.category.name}
          </p>
        </div>
      </div>

      <div>
        <CategoryProductGrid
          category={subcategory.category}
          subcategory={subcategory}
        />
      </div>
    </div>
  );
};

export default SubcategoryPage;

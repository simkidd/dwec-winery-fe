import SubcategoriesGrid from "@/components/product/SubcategoriesGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { ICategory } from "@/interfaces/product.interface";
import { getAllCategories, getCategoryBySlug } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { config } from "@/utils/config";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) => {
  try {
    const { categorySlug } = await params;
    const data = await getCategoryBySlug(categorySlug);
    const category = data.category as ICategory;

    if (!category) {
      throw new Error("Category not found");
    }

    return {
      title: category.name,
      description: category.description,
      canonical: `${config.SITE_URL}/category/${category.slug}`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/category/${category.slug}`,
        title: category.name,
        description: category.description,
        images: [
          {
            url: category.image,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        cardType: "summary_large_image",
        title: category.name,
        description: category.description,
        image: category.image,
      },
    };
  } catch (error) {
    console.error("Failed to fetch category metadata:", error);

    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
      canonical: `${config.SITE_URL}/category-not-found`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/category-not-found`,
        title: "category Not Found",
        description: "The requested category could not be found.",
        images: [],
      },
      twitter: {
        cardType: "summary",
        title: "category Not Found",
        description: "The requested category could not be found.",
        image: "",
      },
    };
  }
};

export const generateStaticParams = async () => {
  let categories = [];
  try {
    const data = await getAllCategories();

    categories = data.categories;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return categories.map((cat: any) => ({
      // id: post?._id,
      slug: cat?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const CategoryProducts = async ({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) => {
  const { categorySlug } = await params;
  const data = await getCategoryBySlug(categorySlug);
  const category = data.category as ICategory;

  if (!category) {
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
        style={{ backgroundImage: `url(${category.image})` }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          {category.description && (
            <p className="text-white/90 mt-2 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <SubcategoriesGrid category={category} />

      {/* <CategoryProductGrid category={category} /> */}
    </div>
  );
};

export default CategoryProducts;

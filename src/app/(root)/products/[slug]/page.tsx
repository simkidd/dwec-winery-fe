import ProductDetails from "@/components/product/ProductDetails";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { IProduct } from "@/interfaces/product.interface";
import { getAllProducts, getProductBySlug } from "@/lib/api/products";
import { config } from "@/utils/config";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  try {
    const { slug } = await params;
    const data = await getProductBySlug(slug);
    const product = data.product as IProduct;

    if (!product) {
      notFound();
    }

    return {
      title: product.name,
      description: product.description,
      canonical: `${config.SITE_URL}/products/${product.slug}`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/products/${product.slug}`,
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.images[0],
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        cardType: "summary_large_image",
        title: product.name,
        description: product.description,
        image: product.images[0],
      },
    };
  } catch (error) {
    console.log(error);
    notFound();
  }
};

export const generateStaticParams = async () => {
  let products = [];
  try {
    const data = await getAllProducts({
      limit: 100,
    });

    products = data.products;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.map((product: any) => ({
      // id: post?._id,
      slug: product?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  const product: IProduct = data.product;

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <CustomBreadcrumbs product={product} />
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;

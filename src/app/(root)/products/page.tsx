import ProductsGrid from "@/components/product/ProductsGrid";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import { Metadata } from "next";

const pageTitle = "Drinks";

export const metadata: Metadata = {
  title: pageTitle,
};

const Products = () => {
  return (
    <div>
      <CustomBreadcrumbs />
      <ProductsGrid />
    </div>
  );
};

export default Products;

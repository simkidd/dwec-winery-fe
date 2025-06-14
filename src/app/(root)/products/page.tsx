import ProductsGrid from '@/components/product/ProductsGrid'
import CustomBreadcrumbs from '@/components/shared/CustomBreadcrumbs'

const Products = () => {
  return (
    <div>
      <CustomBreadcrumbs />
      <ProductsGrid />
    </div>
  )
}

export default Products
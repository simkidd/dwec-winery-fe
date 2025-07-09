import AdsCatalog from "@/components/product/AdsCatalog";

const AdsProductsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { slug } = await params;
  const { id } = await searchParams;

  return (
    <div>
      <div className="container mx-auto px-4 py-16">
        <AdsCatalog slug={slug} id={id as string} />
      </div>
    </div>
  );
};

export default AdsProductsPage;

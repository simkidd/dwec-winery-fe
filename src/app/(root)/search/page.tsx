import SearchResults from "@/components/product/SearchResults";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import React from "react";

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { q } = await searchParams;

  return (
    <div>
       <CustomBreadcrumbs />
       <PageHeader title={`Search results for "${q}"`} />
      <div className="container mx-auto px-4 py-16">
        <SearchResults query={q as string} />
      </div>
    </div>
  );
};

export default SearchResultPage;

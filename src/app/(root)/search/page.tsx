import SearchResults from "@/components/product/SearchResults";
import React from "react";

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { q } = await searchParams;

  return (
    <div>
      <SearchResults query={q as string} />
    </div>
  );
};

export default SearchResultPage;

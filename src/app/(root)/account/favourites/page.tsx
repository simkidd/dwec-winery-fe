import Favourites from "@/components/account/Favourites";
import { Metadata } from "next";

const pageTitle = "Saved items";

export const metadata: Metadata = {
  title: pageTitle,
};

const FavouritesPage = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Favourites />
      </div>
    </div>
  );
};

export default FavouritesPage;

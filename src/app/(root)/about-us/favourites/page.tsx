// "use client";
// import { Heart, HeartOff, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
// import PageHeader from "@/components/shared/PageHeader";
// import { useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import EmptyState from "@/components/shared/EmptyState";
// import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
// import ProductCard from "@/components/home/ProductCard";

// const FavouritesPage = () => {
//   const router = useRouter();
//   const { favorites } = useAppSelector((state) => state.favorites);
//   const { toggleFavorite } = useToggleFavorite();

//   const handleAddToCart = (productId: string) => {
//     // Add to cart logic here
//     toast.success("Added to cart!");
//   };

//   return (
//     <div>
//       <CustomBreadcrumbs />
//       <PageHeader title="Your Favorites" />

//       <div className="container mx-auto px-4 py-8">
//         {favorites.length === 0 ? (
//           <EmptyState
//             icon={<HeartOff className="h-12 w-12 text-muted-foreground" />}
//             title="No favorites yet"
//             description="Save your favorite items to see them here"
//             action={
//               <Button onClick={() => router.push("/products")}>
//                 Browse Products
//               </Button>
//             }
//           />
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-medium">
//                 {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
//                 saved
//               </h2>
//               <Button variant="ghost" className="text-destructive">
//                 Clear all
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {favorites.map((product) => (
//                 <Card key={product._id} className="group relative">
//                   <ProductCard product={product} />
//                   <div className="absolute top-2 right-2 flex gap-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
//                       onClick={() => toggleFavorite(product._id)}
//                     >
//                       <Heart className="h-4 w-4 fill-current" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
//                       onClick={() => handleAddToCart(product._id)}
//                     >
//                       <ShoppingCart className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FavouritesPage;

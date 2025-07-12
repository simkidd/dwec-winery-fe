import BlogPreview from "@/components/home/BlogPreview";
import ExploreCategories from "@/components/home/ExploreCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreCategories />
      {/* <FeaturesSection /> */}
      <WhyShopWithUs />
      <FeaturedProducts />
      <BlogPreview />
    </div>
  );
};

export default HomePage;

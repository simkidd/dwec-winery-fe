import AppDownloadSection from "@/components/home/AppDownloadSection";
import BlogPreview from "@/components/home/BlogPreview";
import ExploreCategories from "@/components/home/ExploreCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";
import BannerSection from "@/components/home/BannerSection";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreCategories />
      <FeaturedProducts />
      <BannerSection position="featured" className="mt-8 mb-4" />
      <BlogPreview />
      <WhyShopWithUs />
      <AppDownloadSection />
    </div>
  );
};

export default HomePage;

import AdsManager from "@/components/ads/AdsManager";
import PageHeader from "@/components/shared/PageHeader";

const AdsManagerPage = () => {
  return (
    <div>
      <PageHeader
        title="Ads & Banners Manager"
        description="Create, edit, and manage promotional banners and advertisements"
      />

      <div className="mt-6">
        <AdsManager />
      </div>
    </div>
  );
};

export default AdsManagerPage;

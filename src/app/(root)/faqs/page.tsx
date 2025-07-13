import FaqContent from "@/components/home/FaqContent";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";

const FAQPage = () => {
  return (
    <div className="">
      <CustomBreadcrumbs />
      <PageHeader
        title="Concierge Support"
        description="Expert answers to your questions about our premium collection"
      />

      <FaqContent />
    </div>
  );
};

export default FAQPage;

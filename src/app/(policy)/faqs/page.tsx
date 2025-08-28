import FaqContent from "@/components/home/FaqContent";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import ImageBg from "../../../../public/images/yellow-question-mark.jpg";

const FAQPage = () => {
  return (
    <div className="">
      <div className="hidden lg:flex">
        <CustomBreadcrumbs />
      </div>
      <PageHeader
        title="Concierge Support"
        description="Expert answers to your questions about our premium collection"
        image={ImageBg}
      />

      <FaqContent />
    </div>
  );
};

export default FAQPage;

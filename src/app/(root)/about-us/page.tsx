import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader
        title="About Dwec"
        description="Learn our story, mission, and values"
      />

      {/*  */}
      <section className="bg-primary text-white">
        <div className="grid grid-cols-2 container mx-auto px-4">
          <div className="flex flex-col justify-center gap-4">
            <h2 className="font-bold text-4xl pb-2">Shop on Dwec Winery</h2>
            <p>The trusted</p>

            <div>
              <Button asChild variant={'ghost'} className="rounded-sm cursor-pointer bg-white text-black">
                <Link href={"/products"}>Shop Now</Link>
              </Button>
            </div>
          </div>
          <div>
            <Image src={""} alt="" width={300} height={300} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

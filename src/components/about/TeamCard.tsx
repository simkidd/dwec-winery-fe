// TeamCard.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, TwitterIcon } from "lucide-react";

export default function TeamCard({ member }: { member: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-64">
        <Image 
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-gray-600 mb-4">{member.role}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <TwitterIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <LinkedinIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
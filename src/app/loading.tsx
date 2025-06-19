import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-6 rounded-lg flex items-center gap-2">
        <Loader2Icon className="animate-spin h-6 w-6" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default Loading;

import Logo from "@/components/shared/Logo";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-6 rounded-lg flex items-center gap-2 animate-bounce">
        <Logo />
      </div>
    </div>
  );
};

export default Loading;

import Link from "next/link";
import { ComponentProps } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link>;

export const AnimatedLink = ({
  className = "",
  ...props
}: AnimatedLinkProps) => {
  return (
    <Link
      {...props}
      className={`
        transition-all 
        duration-300 
        ease-in-out
        bg-[length:0_2px] 
        bg-no-repeat 
        bg-left-bottom 
        bg-gradient-to-r 
        from-primary 
        to-primary
        hover:bg-[length:100%_2px]
        hover:duration-250
        hover:ease-[cubic-bezier(0.785,0.135,0.15,0.86)]
        no-underline
        ${className}
      `}
    />
  );
};

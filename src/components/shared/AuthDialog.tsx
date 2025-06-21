"use client";
import { hideAuthDialog } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Lock } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const AuthDialog = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { showAuthDialog, authDialogMessage } = useAppSelector(
    (state) => state.product
  );

  const redirectUrl = `${pathname}?${searchParams.toString()}`;

  return (
    <Dialog
      open={showAuthDialog}
      onOpenChange={() => dispatch(hideAuthDialog())}
    >
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <Lock className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {authDialogMessage}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => dispatch(hideAuthDialog())}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button asChild className="flex-1 cursor-pointer">
            <Link
              href={{
                pathname: "/login",
                query: { redirect: redirectUrl },
              }}
              onClick={() => dispatch(hideAuthDialog())}
              className="flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

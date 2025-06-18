"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { hideAuthDialog } from "@/store/features/products/product.slice";
import { usePathname, useSearchParams } from "next/navigation";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{authDialogMessage}</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(hideAuthDialog())}
            >
              Cancel
            </Button>
            <Button asChild>
              <Link
                href={{
                  pathname: "/login",
                  query: { redirect: redirectUrl },
                }}
                onClick={() => dispatch(hideAuthDialog())}
              >
                Login
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

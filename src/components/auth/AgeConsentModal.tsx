"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const AgeConsentModal = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">Age Verification</DialogTitle>
          <DialogDescription className="text-center">
            Please confirm your age to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full h-14 flex-col gap-1 hover:bg-green-50 hover:border-green-300 cursor-pointer"
            onClick={onConfirm}
          >
            <span className="font-semibold">I am 18 or older</span>
            <span className="text-sm font-normal text-muted-foreground">
              Continue to sign up
            </span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 flex-col gap-1 hover:bg-red-50 hover:border-red-300 cursor-pointer"
            onClick={onCancel}
          >
            <span className="font-semibold">I am under 18</span>
            <span className="text-sm font-normal text-muted-foreground">
              Exit registration
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeConsentModal;

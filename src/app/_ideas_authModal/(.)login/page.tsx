"use client";

import UserAuthForm from "@/components/auth/UserAuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = (v: boolean) => {
    if (!v) {
      setTimeout(() => router.back(), 100);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <UserAuthForm />
      </DialogContent>
    </Dialog>
  );
}

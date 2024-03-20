import { UploadModal } from "@/components/core/UploadModal";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { buttonVariants } from "@/components/ui/button";
import { getLastChatFromUser } from "@/data/messages";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardChatPage() {
  const session = (await getSession())!;
  const chat = await getLastChatFromUser(session.user.id);

  if (!chat)
    return (
      <DashboardContainer className="justify-center text-center">
        <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
          ...
        </span>
        <h2 className="font-heading my-2 text-2xl font-bold">
          You don&apos;t have any file uploaded yet
        </h2>
        <p>Try to upload something new to chat with it</p>
        <div className="mt-8 flex justify-center gap-2">
          <UploadModal />
          <Link
            href="/dashboard/uploads"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Go to upload page
          </Link>
        </div>
      </DashboardContainer>
    );

  redirect("/dashboard/chat/" + chat.id);
}

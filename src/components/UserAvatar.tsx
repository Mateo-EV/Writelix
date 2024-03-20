import { type User } from "@/server/db/schema";
import { type AvatarProps } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";

type UserAvatarProps = AvatarProps & {
  user: Pick<User, "image" | "name">;
};

export const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      <Image
        alt="user-picture"
        src={user.image ?? ""}
        fill
        className="aspect-square h-full w-full"
      />
      {!user.image && (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <UserIcon className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

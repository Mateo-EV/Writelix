import { type User } from "@/server/db/schema";
import { type AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserIcon } from "lucide-react";

type UserAvatarProps = AvatarProps & {
  user: Pick<User, "image" | "name">;
};

export const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      <AvatarImage
        alt="user-picture"
        src={user.image ?? ""}
        referrerPolicy="no-referrer"
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

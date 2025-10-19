import { cva } from "class-variance-authority";

export const friendshipBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1",
  {
    variants: {
      status: {
        self: "bg-blue-50 text-blue-700 border-blue-200",
        friend: "bg-green-50 text-green-700 border-green-200",
        pending_sent: "bg-orange-50 text-orange-700 border-orange-200",
        pending_received: "bg-purple-50 text-purple-700 border-purple-200",
      },
    },
  }
);

export type FriendshipBadgeStatus =
  | "self"
  | "friend"
  | "pending_sent"
  | "pending_received";

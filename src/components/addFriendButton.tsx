import { UserRoundPlus } from "lucide-react";
import { Button } from "./ui/button";

export default function AddFriendButton() {
  return (
    <Button variant={"outline"} size={"icon"} className="cursor-pointer">
      <UserRoundPlus />
    </Button>
  );
}

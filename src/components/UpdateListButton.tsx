import { Pen } from "lucide-react";
import { Button } from "./ui/button";

export default function UpdateListButton() {
  return (
    <Button className="cursor-pointer" size={"icon"}>
      <Pen />
    </Button>
  );
}

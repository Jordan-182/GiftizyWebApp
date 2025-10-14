"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Item } from "./ui/item";

interface FriendCodeProps {
  friendCode: string;
}

export default function FriendCode({ friendCode }: FriendCodeProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!navigator.clipboard) {
      alert(
        "La fonctionnalité de copie n'est pas disponible dans votre navigateur."
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
    }
  };

  return (
    <div className="mb-2 flex gap-2 items-center justify-center sm:justify-start">
      Code ami :
      <Item variant={"muted"} className="p-1 w-28 flex justify-between">
        <p>
          {copied ? (
            <span>Copié!</span>
          ) : (
            <span className="tracking-widest">{friendCode}</span>
          )}
        </p>
        <Button
          size={"icon"}
          variant={"outline"}
          className="cursor-pointer h-5 w-5"
          onClick={handleCopy}
        >
          <Copy />
        </Button>
      </Item>
    </div>
  );
}

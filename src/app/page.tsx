import GetStartedButton from "@/components/GetStartedButton";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="text-6xl font-bold">Homepage</h1>
        <GetStartedButton />
      </div>
    </div>
  );
}

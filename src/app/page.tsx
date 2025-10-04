import GetStartedButton from "@/components/GetStartedButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[80dvh]">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="text-6xl font-bold">Homepage</h1>
        <GetStartedButton />
      </div>
    </div>
  );
}

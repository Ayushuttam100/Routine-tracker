import LeetCodeLogger from "@/components/LeetCodeLogger";

export const metadata = {
  title: "LeetCode Logger",
  description: "Log and track LeetCode problems",
};

export default function LoggerPage() {
  return (
    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <LeetCodeLogger />
    </div>
  );
}

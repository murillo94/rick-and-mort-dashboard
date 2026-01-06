import { Typography } from "@/ui/typography";
import { Nav } from "./_components/nav";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-start gap-12 sm:gap-14 sm:p-16 p-4">
        <Typography variant="title">Rick and Morty Dashboard</Typography>
        <Nav />
        {children}
      </main>
    </div>
  );
}

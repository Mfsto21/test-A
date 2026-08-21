import { requireSessionAndHome } from "@/lib/current-home";
import { Nav } from "@/components/nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, home } = await requireSessionAndHome();

  return (
    <div className="min-h-screen">
      <Nav homeName={home.name} role={session.role} userName={session.name} />
      <main>{children}</main>
    </div>
  );
}

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
      <Nav
        homeName={home.name}
        role={session.role}
        userName={session.name}
        logoUrlLight={home.builder.logoUrlLight}
        logoUrlDark={home.builder.logoUrlDark}
      />
      <main>{children}</main>
    </div>
  );
}

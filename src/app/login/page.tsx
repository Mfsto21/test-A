import { getLoginBranding } from "@/lib/public-branding";
import { BuilderWordmark } from "@/components/logo-mark";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const { heroImageUrl, logoIconUrl, logoWordmarkUrl } = await getLoginBranding();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-6">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
        />
      ) : (
        <div className="bg-grain pointer-events-none absolute inset-0" />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: heroImageUrl
            ? "linear-gradient(180deg, rgba(21,19,15,0.4) 0%, rgba(21,19,15,0.62) 50%, rgba(21,19,15,0.9) 100%)"
            : undefined,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(169,121,63,0.25), transparent 55%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="motion-safe:animate-fade-up mb-10 flex flex-col items-center">
          <BuilderWordmark
            tone="light"
            layout="stacked"
            logoIconUrl={logoIconUrl}
            logoWordmarkUrl={logoWordmarkUrl}
          />
        </div>

        <div
          className="motion-safe:animate-fade-up rounded-2xl border border-paper/10 bg-gradient-to-b from-paper/[0.06] to-paper/[0.02] p-8 shadow-soft ring-1 ring-inset ring-paper/10 backdrop-blur-sm"
          style={{ animationDelay: "100ms" }}
        >
          <p className="mb-1 text-[11px] uppercase tracking-widest2 text-bronze-400">
            Private Residence Access
          </p>
          <h1 className="mb-6 font-serif text-2xl text-paper">
            Welcome back.
          </h1>

          <LoginForm />
        </div>

        <p
          className="motion-safe:animate-fade-up mt-8 text-center text-[11px] uppercase tracking-widest2 text-paper/30"
          style={{ animationDelay: "200ms" }}
        >
          Northern &amp; Southern California · Lic #1069037
        </p>
      </div>
    </main>
  );
}

import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { postMessage } from "@/lib/actions/messages";
import { PageShell, SectionIntro } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function AskMjfPage() {
  const { session, home } = await requireSessionAndHome();

  const messages = await prisma.message.findMany({
    where: { homeId: home.id },
    orderBy: { createdAt: "asc" },
    include: { author: true },
  });

  const send = postMessage.bind(null, home.id);

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Ask MJF"
        title={
          <>
            A direct line to your builder, <em className="italic text-bronze-600">kept forever.</em>
          </>
        }
        lede="Every question and every answer stays with your home's permanent record — never lost in a text thread or an inbox."
      />

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border hairline bg-paper-50 p-6 sm:p-8">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-700/50">
            No questions yet. Ask MJF anything about your home.
          </p>
        )}

        {messages.map((m) => {
          const mine = m.authorId === session.sub;
          const isBuilder = m.author.role === "BUILDER";
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md rounded-2xl px-4 py-3 ${
                isBuilder ? "bg-ink-900 text-paper" : "bg-bronze-500/12 text-ink-900"
              }`}>
                <div className={`text-[10px] uppercase tracking-wide ${isBuilder ? "text-bronze-400" : "text-bronze-600"}`}>
                  {m.author.name} · {isBuilder ? "MJF Team" : "Homeowner"}
                </div>
                <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed">{m.body}</p>
                <div className={`mt-1.5 text-[10px] ${isBuilder ? "text-paper/40" : "text-ink-700/40"}`}>
                  {formatDate(m.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form action={send} className="sticky bottom-6 mt-6 flex gap-3 rounded-2xl border hairline bg-paper p-3 shadow-card">
        <textarea
          name="body"
          required
          rows={1}
          placeholder="Ask a question about your home…"
          className="flex-1 resize-none rounded-lg bg-transparent px-3 py-2 text-[14px] outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
        >
          Send
        </button>
      </form>

      <p className="mt-6 text-center text-[12px] text-ink-700/40">
        <span className="font-medium uppercase tracking-widest2 text-bronze-600">Future — </span>
        An AI assistant will one day answer instantly from your home's own
        records, and route anything it can't answer straight to MJF.
      </p>
    </PageShell>
  );
}

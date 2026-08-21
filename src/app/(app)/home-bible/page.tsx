import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { addDocument } from "@/lib/actions/documents";
import { Card, Eyebrow, PageShell, Pill, SectionIntro } from "@/components/ui";

const CATEGORY_ORDER = ["Plans", "Selections", "Equipment", "Warranty", "Vendor", "Maintenance"];

export default async function HomeBiblePage() {
  const { session, home } = await requireSessionAndHome();

  const documents = await prisma.document.findMany({
    where: { homeId: home.id },
    orderBy: { createdAt: "desc" },
  });

  const addDoc = addDocument.bind(null, home.id);

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    documents: documents.filter((d) => d.category === category),
  })).filter((g) => g.documents.length > 0 || session.role === "BUILDER");

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Home Bible"
        title={
          <>
            The permanent record of <em className="italic text-bronze-600">your home.</em>
          </>
        }
        lede="Plans, selections, equipment, warranties, vendors, and maintenance — organized in one place, meant to stay with your home for the life of your ownership."
      />

      {session.role === "BUILDER" && (
        <Card className="mt-8 p-6">
          <Eyebrow>MJF Team — Add a Record</Eyebrow>
          <form action={addDoc} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Document / item name" required className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <select name="category" required className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400">
              <option value="">Category…</option>
              {CATEGORY_ORDER.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input name="fileUrl" placeholder="File URL (optional)" className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <input name="notes" placeholder="Notes" className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <button type="submit" className="col-span-full ml-auto rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600">
              Add to Home Bible
            </button>
          </form>
        </Card>
      )}

      <div className="mt-10 space-y-10">
        {grouped.map(({ category, documents }) => (
          <div key={category}>
            <Eyebrow>{category}</Eyebrow>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documents.map((doc) => (
                <Card key={doc.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-[14px] font-medium text-ink-900">{doc.name}</p>
                    {doc.notes && <p className="mt-0.5 text-[12px] text-ink-700/60">{doc.notes}</p>}
                  </div>
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
                    >
                      View →
                    </a>
                  ) : (
                    <Pill>Pending</Pill>
                  )}
                </Card>
              ))}
              {documents.length === 0 && (
                <p className="text-[13px] text-ink-700/50">Nothing here yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-10 p-6">
        <Eyebrow>On the Horizon</Eyebrow>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-700/70">
          Future chapters of the Home Bible: an AI Home Butler that can answer
          from your home's actual records — "where's my water shutoff,"
          "when does my warranty expire" — and a Home Health Score with
          proactive maintenance reminders.
        </p>
      </Card>
    </PageShell>
  );
}

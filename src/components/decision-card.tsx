"use client";

import { useState, useTransition } from "react";
import { Card, Eyebrow, Pill } from "@/components/ui";
import { UploadField } from "@/components/upload-field";
import {
  chooseDecisionOption,
  setDecisionStatus,
  addDecisionOption,
  setDecisionFile,
} from "@/lib/actions/decisions";

type Option = {
  id: string;
  vendorName: string;
  amount: number | null;
  scope: string | null;
  inclusions: string | null;
  exclusions: string | null;
  notes: string | null;
  recommended: boolean;
  fileUrl: string | null;
};

type DecisionLike = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  fileUrl: string | null;
  status: string;
  important: boolean;
  selectedOptionId: string | null;
  options: Option[];
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function DecisionCard({ decision, canEdit }: { decision: DecisionLike; canEdit: boolean }) {
  const [pending, startTransition] = useTransition();
  const [addingOption, setAddingOption] = useState(false);
  const [attachingFile, setAttachingFile] = useState(false);
  const addOption = addDecisionOption.bind(null, decision.id);
  const attachFile = setDecisionFile.bind(null, decision.id);

  const statusTone = decision.status === "approved" ? "moss" : decision.status === "declined" ? "neutral" : "bronze";

  return (
    <Card className={`p-7 ${decision.important ? "border-bronze-500/40 bg-bronze-500/[0.04]" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill>{decision.category}</Pill>
            {decision.important && <Pill tone="bronze">Important to You</Pill>}
          </div>
          <h3 className="mt-2.5 font-serif text-2xl text-ink-900">{decision.title}</h3>
          {decision.description && (
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-700/80">
              {decision.description}
            </p>
          )}
        </div>
        <Pill tone={statusTone as "moss" | "neutral" | "bronze"}>
          {decision.status === "pending" ? "Awaiting Your Approval" : decision.status}
        </Pill>
      </div>

      {decision.options.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {decision.options.map((opt) => {
            const chosen = decision.selectedOptionId === opt.id;
            return (
              <div
                key={opt.id}
                className={`rounded-xl border p-5 transition ${
                  chosen ? "border-bronze-500 bg-bronze-500/[0.06]" : "hairline"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-lg text-ink-900">{opt.vendorName}</p>
                    {opt.amount != null && (
                      <p className="mt-0.5 text-xl font-medium text-ink-900">
                        {currency.format(opt.amount)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {opt.recommended && <Pill tone="bronze">MJF Recommends</Pill>}
                    {chosen && <Pill tone="moss">Selected</Pill>}
                  </div>
                </div>

                {opt.scope && <p className="mt-3 text-[13px] leading-relaxed text-ink-700/80">{opt.scope}</p>}

                <div className="mt-3 space-y-1.5 text-[12px]">
                  {opt.inclusions && (
                    <p className="text-ink-700/70">
                      <span className="font-medium text-moss">Includes</span> — {opt.inclusions}
                    </p>
                  )}
                  {opt.exclusions && (
                    <p className="text-ink-700/70">
                      <span className="font-medium text-ink-900/60">Excludes</span> — {opt.exclusions}
                    </p>
                  )}
                  {opt.notes && <p className="italic text-ink-700/60">{opt.notes}</p>}
                </div>

                {opt.fileUrl && (
                  <a
                    href={opt.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-[12px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
                  >
                    View Proposal Document →
                  </a>
                )}

                {!chosen && (
                  <button
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => chooseDecisionOption(decision.id, opt.id))
                    }
                    className="mt-4 w-full rounded-lg border border-ink-900 py-2 text-[11px] font-medium uppercase tracking-wide text-ink-900 transition hover:bg-ink-900 hover:text-paper"
                  >
                    Choose This Proposal
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {decision.options.length === 0 && (
        <>
          {decision.fileUrl ? (
            <a
              href={decision.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border hairline px-4 py-2 text-[12px] uppercase tracking-wide text-ink-800 transition hover:border-ink-900"
            >
              View Document →
            </a>
          ) : (
            !canEdit && (
              <p className="mt-5 text-[12px] italic text-ink-700/50">
                No document attached yet.
              </p>
            )
          )}

          {decision.status === "pending" && (
            <div className="mt-4 flex gap-3">
              <button
                disabled={pending}
                onClick={() => startTransition(() => setDecisionStatus(decision.id, "approved"))}
                className="rounded-lg bg-ink-900 px-5 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
              >
                Approve
              </button>
              <button
                disabled={pending}
                onClick={() => startTransition(() => setDecisionStatus(decision.id, "declined"))}
                className="rounded-lg border hairline px-5 py-2 text-[11px] font-medium uppercase tracking-wide text-ink-700 transition hover:border-ink-900 hover:text-ink-900"
              >
                Decline
              </button>
            </div>
          )}

          {canEdit && (
            <div className="mt-4">
              <button
                onClick={() => setAttachingFile((v) => !v)}
                className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
              >
                {attachingFile ? "Close" : decision.fileUrl ? "Replace Document" : "+ Attach Document"}
              </button>
              {attachingFile && (
                <form action={attachFile} className="mt-3 flex flex-wrap items-center gap-2">
                  <UploadField
                    name="fileUrl"
                    defaultValue={decision.fileUrl ?? ""}
                    accept="image/*,.pdf"
                    placeholder="Paste a URL, or upload a drawing / PDF"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {canEdit && (
        <div className="mt-6 border-t hairline pt-4">
          <button
            onClick={() => setAddingOption((v) => !v)}
            className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
          >
            {addingOption ? "Close" : "+ Add Vendor Proposal"}
          </button>
          {addingOption && (
            <form action={addOption} className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <input name="vendorName" placeholder="Vendor / contractor name" required className="rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <input name="amount" type="number" step="0.01" placeholder="Amount ($)" className="rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <input name="scope" placeholder="Scope of work" className="col-span-full rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <input name="inclusions" placeholder="Inclusions" className="rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <input name="exclusions" placeholder="Exclusions" className="rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <input name="notes" placeholder="Notes" className="col-span-full rounded-md border hairline bg-paper px-2.5 py-2 text-sm outline-none focus:border-bronze-400" />
              <UploadField
                name="fileUrl"
                accept="image/*,.pdf"
                placeholder="Paste a URL, or upload the proposal PDF"
              />
              <label className="flex items-center gap-2 text-[12px] text-ink-700">
                <input type="checkbox" name="recommended" /> MJF recommends this option
              </label>
              <button type="submit" className="ml-auto rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600">
                Add Proposal
              </button>
            </form>
          )}
        </div>
      )}
    </Card>
  );
}

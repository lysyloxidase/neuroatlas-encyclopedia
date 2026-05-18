"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { verifyDoi, type DoiVerification } from "@/lib/doi-verify";
import type { Citation as CitationType } from "@/lib/types";

interface CitationProps {
  citation: CitationType;
}

export function Citation({ citation }: CitationProps) {
  const [verification, setVerification] = useState<DoiVerification | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (verification || loading) return;
    setLoading(true);
    try {
      setVerification(await verifyDoi(citation.doi));
    } finally {
      setLoading(false);
    }
  }

  return (
    <a
      className="citation"
      href={`https://doi.org/${citation.doi}`}
      onFocus={handleVerify}
      onMouseEnter={handleVerify}
      rel="noreferrer"
      target="_blank"
      title={citation.title ?? citation.doi}
    >
      <span className="doi">{citation.doi}</span>
      <ExternalLink aria-hidden="true" size={14} />
      <span className="citation-status" aria-live="polite">
        {loading
          ? "checking CrossRef"
          : verification?.valid
            ? "verified"
            : verification
              ? "unverified"
              : citation.year}
      </span>
    </a>
  );
}

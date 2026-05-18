export interface DoiVerification {
  doi: string;
  valid: boolean;
  status: number;
  title?: string;
  publisher?: string;
}

type Fetcher = typeof fetch;

export async function verifyDoi(
  doi: string,
  fetcher: Fetcher = fetch,
): Promise<DoiVerification> {
  const normalized = doi.trim().replace(/^https?:\/\/doi.org\//i, "");
  const response = await fetcher(
    `https://api.crossref.org/works/${encodeURIComponent(normalized)}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    return { doi: normalized, valid: false, status: response.status };
  }

  const payload = (await response.json()) as {
    message?: {
      title?: string[];
      publisher?: string;
    };
  };

  return {
    doi: normalized,
    valid: true,
    status: response.status,
    title: payload.message?.title?.[0],
    publisher: payload.message?.publisher,
  };
}

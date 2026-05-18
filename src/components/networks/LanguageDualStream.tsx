import networks from "@/data/networks.json";

interface Stream {
  name: string;
  route: string[];
  function: string;
}

interface LanguageNetwork {
  streams: Stream[];
  lateralization: {
    rightHandersLeftPercent: number;
    leftHandersLeftPercent: number;
    bilateralPercent: number;
    rightHemispherePercent: number;
  };
}

const language = (
  networks as unknown as Array<LanguageNetwork & { slug: string }>
).find((network) => network.slug === "language")!;

export function LanguageDualStream() {
  return (
    <section className="card" data-testid="language-dual-stream">
      <h3>Dual-Stream Language Model</h3>
      <div className="grid">
        {language.streams.map((stream) => (
          <article className="micro-tile" key={stream.name}>
            <strong>{stream.name}</strong>
            <p className="mono">{stream.function}</p>
            <p>{stream.route.join(" -> ")}</p>
          </article>
        ))}
      </div>
      <p className="muted">
        Arcuate fasciculus disruption in the dorsal stream is the classic
        tract-level scaffold for conduction aphasia.
      </p>
      <p className="mono">
        Language lateralization:{" "}
        {language.lateralization.rightHandersLeftPercent}% right-handers left
        hemisphere; {language.lateralization.leftHandersLeftPercent}%
        left-handers left hemisphere; {language.lateralization.bilateralPercent}
        % bilateral; {language.lateralization.rightHemispherePercent}%
        right-hemispheric.
      </p>
    </section>
  );
}

import hcpToBrodmann from "@/data/crosswalks/hcp_to_brodmann.json";
import hcpToDk from "@/data/crosswalks/hcp_to_dk.json";
import hcpToJulich from "@/data/crosswalks/hcp_to_julich.json";

export interface HcpCrosswalk {
  hcp_area: string;
  brodmann?: number;
  julich_brain?: string;
  dk?: string;
  confidence: "robust" | "plausible" | "speculative";
}

const merged = new Map<string, HcpCrosswalk>();

for (const item of hcpToBrodmann as HcpCrosswalk[]) {
  merged.set(item.hcp_area, { ...merged.get(item.hcp_area), ...item });
}

for (const item of hcpToJulich as HcpCrosswalk[]) {
  merged.set(item.hcp_area, { ...merged.get(item.hcp_area), ...item });
}

for (const item of hcpToDk as HcpCrosswalk[]) {
  merged.set(item.hcp_area, { ...merged.get(item.hcp_area), ...item });
}

export function getHcpCrosswalk(hcpArea: string): HcpCrosswalk | undefined {
  return merged.get(hcpArea);
}

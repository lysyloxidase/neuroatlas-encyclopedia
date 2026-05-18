import { assertFourAtlasBackbone, createAtlasRenderLayer, listAtlases, type AtlasKey } from "@/lib/atlas-loader";

describe("atlas loader", () => {
  it("defines exactly four atlas backbones with renderable layers", () => {
    expect(() => assertFourAtlasBackbone()).not.toThrow();
    expect(listAtlases()).toHaveLength(4);

    for (const atlas of listAtlases()) {
      const layer = createAtlasRenderLayer(atlas.key as AtlasKey);
      expect(layer.labelMapPath).toMatch(/^\/volumes\//);
      expect(layer.textureUniform).toContain(atlas.key);
    }
  });
});

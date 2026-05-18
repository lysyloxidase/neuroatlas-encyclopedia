import type { Structure } from "@/lib/types";

export function ConnectivityTable({ structure }: { structure: Structure }) {
  return (
    <section className="card" id="connectivity">
      <h3>Connectivity</h3>
      <table className="meta-table">
        <tbody>
          <tr>
            <th>Afferent cortical</th>
            <td>{structure.inputs.afferent_cortical.join(", ")}</td>
          </tr>
          <tr>
            <th>Afferent subcortical</th>
            <td>{structure.inputs.afferent_subcortical.join(", ")}</td>
          </tr>
          <tr>
            <th>Afferent modulatory</th>
            <td>{structure.inputs.afferent_modulatory.join(", ")}</td>
          </tr>
          <tr>
            <th>Efferent cortical</th>
            <td>{structure.outputs.efferent_cortical.join(", ")}</td>
          </tr>
          <tr>
            <th>Efferent subcortical</th>
            <td>{structure.outputs.efferent_subcortical.join(", ")}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

import type { Structure } from "@/lib/types";

export function ImagingProfile({ structure }: { structure: Structure }) {
  return (
    <section className="card" id="imaging">
      <h3>Imaging Profile</h3>
      <table className="meta-table">
        <tbody>
          <tr>
            <th>T1</th>
            <td>{structure.imaging.t1_signal}</td>
          </tr>
          {structure.imaging.t2_signal ? (
            <tr>
              <th>T2</th>
              <td>{structure.imaging.t2_signal}</td>
            </tr>
          ) : null}
          <tr>
            <th>fMRI tasks</th>
            <td>{structure.imaging.fmri_tasks.join(", ")}</td>
          </tr>
          {structure.imaging.pet_tracers ? (
            <tr>
              <th>PET tracers</th>
              <td>{structure.imaging.pet_tracers.join(", ")}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

export type Vec3 = [number, number, number];

export function mniToDisplay([x, y, z]: Vec3): Vec3 {
  return [x / 90, y / 126, z / 72];
}

export function ccfToMicron([x, y, z]: Vec3, voxelSizeMicron = 25): Vec3 {
  return [x * voxelSizeMicron, y * voxelSizeMicron, z * voxelSizeMicron];
}

export function centroidDistance(a: Vec3, b: Vec3): number {
  const [dx, dy, dz] = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

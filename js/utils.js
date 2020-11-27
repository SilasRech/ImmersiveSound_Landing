function calculateAngles(vector) {

  rotation_vector[0] = THREE.Math.radToDeg( Math.atan2(vector.z,vector.x) );
  rotation_vector[1] = THREE.Math.radToDeg( Math.atan2(vector.y,vector.z) );
  rotation_vector[2] = THREE.Math.radToDeg( Math.atan2(vector.x,vector.y) );

  return rotation_vector;   // The function returns the product of p1 and p2
}

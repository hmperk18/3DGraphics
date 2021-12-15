"use strict";
var Primitives = {};
Primitives.Cube = class {
    static getMesh(gl) {
        if (MeshCache["cube"] !== undefined) {
            return MeshCache["cube"];
        }

        let verts = [-0.5, 0.5, 0.5, //Front
        -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,

            0.5, 0.5, -0.5, //Back
            0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,

        -0.5, 0.5, -0.5, //Top
        -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

        -0.5, -0.5, 0.5, //Bottom
        -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,

            0.5, 0.5, 0.5, //Right
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,

        -0.5, 0.5, -0.5, //Left
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5];

        let normals = [0.0, 0.0, 1.0, //Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, -1.0, //Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            0.0, 1.0, 0.0, //Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            0.0, -1.0, 0.0, //Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            1.0, 0.0, 0.0, //Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            -1.0, 0.0, 0.0, //left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0];

        let indices = [0, 1, 2, //Front
            2, 3, 0,

            4, 5, 6, //Back
            6, 7, 4,

            8, 9, 10, //Top
            10, 11, 8,

            12, 13, 14, //Bottom
            14, 15, 12,

            16, 17, 18, //Right
            18, 19, 16,

            20, 21, 22, //left
            22, 23, 20];

        MeshCache["cube"] = GLUtils.createMesh(gl, "cube", gl.TRIANGLES, verts, normals, indices);
        return MeshCache["cube"];
    }
}

Primitives.Quad = class {
    static getMesh(gl) {
        if (MeshCache["quad"] !== undefined) {
            return MeshCache["quad"];
        }
        let verts = [-0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0];

        let normals = [0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0];

        let indices = [0, 1, 2,
            2, 3, 0];
        MeshCache["quad"] = GLUtils.createMesh(gl, "quad", gl.TRIANGLES, verts, normals, indices);
        return MeshCache["quad"];
    }
}

Primitives.Sphere = class {
    static getMesh(gl) {
        if (MeshCache["sphere"] !== undefined) {
            return MeshCache["sphere"];
        }

        // from: http://www.songho.ca/opengl/gl_sphere.html
        let sectorCount = 20; // horizontal count
        let stackCount = 20; // vertical count
        let radius = 1; // vertical count

        let verts = [];
        let normals = [];
        let texcoords = [];

        let x, y, z, xy;                          // vertex position
        let nx, ny, nz, lengthInv = 1.0 / radius; // vertex normal
        let s, t;                                 // vertex texCoord

        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;

        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;       // starting from pi/2 to -pi/2
            xy = radius * Math.cos(stackAngle);             // r * cos(u)
            z = radius * Math.sin(stackAngle);              // r * sin(u)

            // add (sectorCount+1) vertices per stack
            // the first and last vertices have same position and normal, but different texcoords
            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;           // starting from 0 to 2pi

                // vertex position (x, y, z)
                x = xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
                y = xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)
                verts.push(x);
                verts.push(z);
                verts.push(y); // swaped order from source

                // normalized vertex normal (nx, ny, nz)
                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                normals.push(nx);
                normals.push(nz);
                normals.push(ny); // swaped out y and z from source

                // vertex tex coord (s, t) range between [0, 1]
                s = j / sectorCount;
                t = i / stackCount;
                texcoords.push(s);
                texcoords.push(1 - t); // inversed the uvs from source
            }
        }
        // generate CCW index list of sphere triangles
        // k1--k1+1
        // |  / |
        // | /  |
        // k2--k2+1
        let indices = [];
        // let lineIndices = [];
        let k1, k2;
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if (i != 0) {
                    indices.push(k1);
                    indices.push(k2);
                    indices.push(k1 + 1);
                }

                // k1+1 => k2 => k2+1
                if (i != (stackCount - 1)) {
                    indices.push(k1 + 1);
                    indices.push(k2);
                    indices.push(k2 + 1);
                }

                // // store indices for lines
                // // vertical lines for all stacks, k1 => k2
                // lineIndices.push(k1);
                // lineIndices.push(k2);
                // if(i != 0)  // horizontal lines except 1st stack, k1 => k+1
                // {
                //     lineIndices.push(k1);
                //     lineIndices.push(k1 + 1);
                // }
            }
        }
        MeshCache["sphere"] = GLUtils.createMesh(gl, "sphere", gl.TRIANGLES, verts, normals, indices);
        return MeshCache["sphere"];
    }
}

Primitives.Tetrahedron = class {
    static getMesh(gl) {
        if (MeshCache["tetrahedron"] !== undefined) {
            return MeshCache["tetrahedron"];
        }

        let ax, ay, az,
            bx, by, bz,
            cx, cy, cz,
            dx, dy, dz;

        ax = 0.0; ay = 1.0; az = 0.0;
        bx = 0.0; by = -(1 / 3); bz = Math.sqrt(8 / 9);
        cx = -Math.sqrt(2 / 3); cy = -(1 / 3); cz = -Math.sqrt(2 / 9);
        dx = Math.sqrt(2 / 3); dy = -(1 / 3); dz = -Math.sqrt(2 / 9);

        let verts = [ax, ay, az, // left
            bx, by, bz,
            cx, cy, cz,
            ax, ay, az, // front (or back, depending on how you look at it)
            cx, cy, cz,
            dx, dy, dz,
            ax, ay, az, // right
            dx, dy, dz,
            bx, by, bz,
            bx, by, bz, // down
            cx, cy, cz,
            dx, dy, dz];

        let nLx, nLy, nLz;  // normal left
        let nBx, nBy, nBz;  // normal front (or back, depending on how you look at it)
        let nRx, nRy, nRz;  // normal right
        let nDx, nDy, nDz;  // normal down

        // nL abc => ab bc // ba bc
        // nB acd => ac cd // ca cd
        // nR adb => ad db // da db
        // nD bcd => bc cd // cb cd


        let ba = new Vector3(ax - bx, ay - by, az - bz);
        let bc = new Vector3(cx - bx, cy - by, cz - bz);
        let ca = new Vector3(ax - cx, ay - cy, az - cz);
        let cd = new Vector3(dx - cx, dy - cy, dz - cz);
        let da = new Vector3(ax - dx, ay - dy, az - dz);
        let db = new Vector3(bx - dx, by - dy, bz - dz);
        let cb = new Vector3(bx - cx, by - cy, bz - cz);

        let nL = ba.cross(bc);
        nLx = nL.x;
        nLy = nL.y;
        nLz = nL.z;

        let nB = ca.cross(cd);
        nBx = nB.x;
        nBy = nB.y;
        nBz = nB.z;

        let nR = da.cross(db);
        nRx = nR.x;
        nRy = nR.y;
        nRz = nR.z;

        let nD = cb.cross(cd);
        nDx = nD.x;
        nDy = nD.y;
        nDz = nD.z;



        //TODO: Calculate the values for the normals for each vertex
        // COMPLETE

        let normals = [nLx, nLy, nLz, // normal left
            nLx, nLy, nLz,
            nLx, nLy, nLz,
            nBx, nBy, nBz, // normal front (or back, depending on how you look at it)
            nBx, nBy, nBz,
            nBx, nBy, nBz,
            nRx, nRy, nRz, // normal right
            nRx, nRy, nRz,
            nRx, nRy, nRz,
            nDx, nDy, nDz, // normal down
            nDx, nDy, nDz,
            nDx, nDy, nDz];


        let indices = [0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11];

        MeshCache["tetrahedron"] = GLUtils.createMesh(gl, "tetrahedron", gl.TRIANGLES, verts, normals, indices);
        return MeshCache["tetrahedron"];
    }
}

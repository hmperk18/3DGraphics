"use strict";
var Primitives = {};
Primitives.Cube = class{
    static getMesh(gl){
        if(MeshCache["cube"] !== undefined){
            return MeshCache["cube"];
        }

        let verts =    [-0.5, 0.5, 0.5, //Front
                        -0.5,-0.5, 0.5,
                         0.5,-0.5, 0.5,
                         0.5, 0.5, 0.5,

                         0.5, 0.5,-0.5, //Back
                         0.5,-0.5,-0.5,
                        -0.5,-0.5,-0.5,
                        -0.5, 0.5,-0.5,

                        -0.5, 0.5,-0.5, //Top
                        -0.5, 0.5, 0.5,
                         0.5, 0.5, 0.5,
                         0.5, 0.5,-0.5,

                        -0.5,-0.5, 0.5, //Bottom
                        -0.5,-0.5,-0.5,
                         0.5,-0.5,-0.5,
                         0.5,-0.5, 0.5,

                         0.5, 0.5, 0.5, //Right
                         0.5,-0.5, 0.5,
                         0.5,-0.5,-0.5,
                         0.5, 0.5,-0.5,

                        -0.5, 0.5,-0.5, //Left
                        -0.5,-0.5,-0.5,
                        -0.5,-0.5, 0.5,
                        -0.5, 0.5, 0.5];

        let normals =  [0.0, 0.0, 1.0, //Front
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,

                        0.0, 0.0,-1.0, //Back
                        0.0, 0.0,-1.0,
                        0.0, 0.0,-1.0,
                        0.0, 0.0,-1.0,

                        0.0, 1.0, 0.0, //Top
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,

                        0.0,-1.0, 0.0, //Bottom
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,

                        1.0, 0.0, 0.0, //Right
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,

                       -1.0, 0.0, 0.0, //left
                       -1.0, 0.0, 0.0,
                       -1.0, 0.0, 0.0,
                       -1.0, 0.0, 0.0];

        let texcoords = [0.0, 1.0, //Front
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,

                        0.0, 1.0, //Back
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,

                        0.0, 1.0, //Top
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,

                        0.0, 1.0, //Bottom
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,

                        0.0, 1.0, //Right
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,

                        0.0, 1.0, //Left
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0];

        let indices =  [0, 1, 2, //Front
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

        MeshCache["cube"] = GLUtils.createMesh(gl, "cube", gl.TRIANGLES, verts, normals, texcoords, indices);
        return MeshCache["cube"];
    }
}

Primitives.Quad = class{
    static getMesh(gl){
        if(MeshCache["quad"] !== undefined){
            return MeshCache["quad"];
        }
        let verts =    [-0.5, 0.5, 0.0,
                        -0.5,-0.5, 0.0,
                         0.5,-0.5, 0.0,
                         0.5, 0.5, 0.0];

        let normals =  [0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0];

        let texcoords = [0.0, 1.0,
                         0.0, 0.0,
                         1.0, 0.0,
                         1.0, 1.0];

        let indices =  [0, 1, 2,
                        2, 3, 0];
        MeshCache["quad"] = GLUtils.createMesh(gl, "quad", gl.TRIANGLES, verts, normals, texcoords, indices);
        return MeshCache["quad"];
    }
}

Primitives.Sphere = class {
    static getMesh(gl){
        if(MeshCache["sphere"] !== undefined){
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

        for(let i = 0; i <= stackCount; ++i)
        {
            stackAngle = Math.PI / 2 - i * stackStep;       // starting from pi/2 to -pi/2
            xy = radius * Math.cos(stackAngle);             // r * cos(u)
            z = radius * Math.sin(stackAngle);              // r * sin(u)

            // add (sectorCount+1) vertices per stack
            // the first and last vertices have same position and normal, but different texcoords
            for(let j = 0; j <= sectorCount; ++j)
            {
                sectorAngle = j * sectorStep;           // starting from 0 to 2pi

                // vertex position (x, y, z)
                x = xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
                y = xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)
                verts.push(y); // swaped order from source
                verts.push(z);
                verts.push(x);

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
                texcoords.push(1-t); // inversed the uvs from source
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
        for(let i = 0; i < stackCount; ++i)
        {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for(let j = 0; j < sectorCount; ++j, ++k1, ++k2)
            {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if(i != 0)
                {
                    indices.push(k1);
                    indices.push(k2);
                    indices.push(k1 + 1);
                }

                // k1+1 => k2 => k2+1
                if(i != (stackCount-1))
                {
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
        MeshCache["sphere"] = GLUtils.createMesh(gl, "sphere", gl.TRIANGLES, verts, normals, texcoords, indices);
        return MeshCache["sphere"];
    }
}

Primitives.Tetrahedron = class{
    static getMesh(gl){
        if(MeshCache["tetrahedron"] !== undefined){
            return MeshCache["tetrahedron"];
        }
        let ax, ay, az,
            bx, by, bz,
            cx, cy, cz,
            dx, dy, dz;

        ax =  0.0;            ay =   1.0;  az =  0.0;
        bx =  0.0;            by = -(1/3); bz =  Math.sqrt(8/9);
        cx = -Math.sqrt(2/3); cy = -(1/3); cz = -Math.sqrt(2/9);
        dx =  Math.sqrt(2/3); dy = -(1/3); dz = -Math.sqrt(2/9);

        let verts =    [ax, ay, az, // left
                        bx, by, bz,
                        cx, cy, cz,
                        ax, ay, az, // back
                        cx, cy, cz,
                        dx, dy, dz,
                        ax, ay, az, // right
                        dx, dy, dz,
                        bx, by, bz,
                        bx, by, bz, // down
                        cx, cy, cz,
                        dx, dy, dz];

        // calculate normals
        let nLx, nLy, nLz;  // normal left
        let nBx, nBy, nBz;  // normal back
        let nRx, nRy, nRz;  // normal right
        let nDx, nDy, nDz;  // normal down

        // all points have the same distance, and we can get the normals
        // from the opposite point of the side we calulate the normal for.
        // we just have to invert the point and normalize it.
        let length = Math.sqrt(ax*ax+ay*ay+az*az);

        nLx = -dx / length;
        nLy = -dy / length;
        nLz = -dz / length;

        nBx = -bx / length;
        nBy = -by / length;
        nBz = -bz / length;

        nRx = -cx / length;
        nRy = -cy / length;
        nRz = -cz / length;

        nDx = -ax / length;
        nDy = -ay / length;
        nDz = -az / length;

        let normals =  [nLx, nLy, nLz,
                        nLx, nLy, nLz,
                        nLx, nLy, nLz,
                        nBx, nBy, nBz,
                        nBx, nBy, nBz,
                        nBx, nBy, nBz,
                        nRx, nRy, nRz,
                        nRx, nRy, nRz,
                        nRx, nRy, nRz,
                        nDx, nDy, nDz,
                        nDx, nDy, nDz,
                        nDx, nDy, nDz];

        let texcoords =[0.5, 1.0,
                        1.0, 0.0,
                        0.0, 0.0,
                        0.5, 1.0,
                        1.0, 0.0,
                        0.0, 0.0,
                        0.5, 1.0,
                        1.0, 0.0,
                        0.0, 0.0,
                        0.5, 1.0,
                        1.0, 0.0,
                        0.0, 0.0];

        let indices =  [0, 1, 2,
                        3, 4, 5,
                        6, 7, 8,
                        9,10,11];


        MeshCache["tetrahedron"] = GLUtils.createMesh(gl, "tetrahedron", gl.TRIANGLES, verts, normals, texcoords, indices);
        return MeshCache["tetrahedron"];
    }
}

Primitives.Plane = class{
    static getMesh(gl, xRes=10, zRes=10){
        let meshName = "plane" + xRes + "x" + zRes;
        if(MeshCache[meshName] !== undefined){
            return MeshCache[meshName];
        }

        if(xRes < 2) xRes = 2;
        if(zRes < 2) zRes = 2;

        let scaleX = 4;
        let scaleZ = 4;

        let verts = [];
        let normals =  [];
        let texcoords =[];
        let indices =  [];

        // make verts, normals and uvs
        for(let z = 0; z < zRes; z++){
            let posZ = scaleZ/2.0 - scaleZ*(z/(zRes-1));
            for(let x = 0; x < xRes; x++){
                let posX = -scaleX/2.0 + scaleX*(x/(xRes-1));
                verts.push(posX);
                verts.push(0.0);
                verts.push(posZ);

                normals.push(0.0);
                normals.push(1.0);
                normals.push(0.0);

                texcoords.push(x/(xRes-1));
                texcoords.push(z/(zRes-1));
            }
        }

        // make indices
        for(let x = 0; x < xRes - 1; x++){
            for(let z = 0; z < zRes - 1; z++){
                let bottomleft = x + xRes*z;
                let bottomright = x + xRes*z + 1;
                let topleft = x + xRes*(z+1);
                let topright = x + 1 + xRes*(z+1);

                indices.push(bottomleft);
                indices.push(bottomright);
                indices.push(topleft);

                indices.push(topleft);
                indices.push(bottomright);
                indices.push(topright);
            }
        }

        MeshCache[meshName] = GLUtils.createMesh(gl, meshName, gl.TRIANGLES, verts, normals, texcoords, indices);
        return MeshCache[meshName];
    }
}

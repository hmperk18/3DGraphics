class GridAxis{
    static getMesh(gl){
        if(MeshCache["grid"] !== undefined){
            return MeshCache["grid"];
        }

        let verts = [];
        let size = 1.9;                 //Width and Height of the GridAxis
        let lineCount = 10;             //How many lines vertical and horizontal
        let step = size/lineCount;      //distance between each line
        let half = size/2;              //halfsize of the grid for easy access during calculations

        let p; // temporary varibale to store positin during calculations
        for(let i = 0; i <= lineCount; i++){
            if(i === lineCount/2) continue; // dont draw center axis lines
            //Vertical line
			p = -half + (i * step);
			verts.push(p);		//x1
			verts.push(0);		//y1
			verts.push(half);	//z1
			verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			verts.push(p);		//x2
			verts.push(0);		//y2
			verts.push(-half);	//z2
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			//Horizontal line
			p = half - (i * step);
			verts.push(-half);	//x1
			verts.push(0);		//y1
			verts.push(p);		//z1
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			verts.push(half);	//x2
			verts.push(0);		//y2
			verts.push(p);		//z2
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb
        }
			//x axis
			verts.push(-1.1);	//x1
			verts.push(0.0);	//y1
			verts.push(0.0);	//z1
            verts.push(1.0);	//cr
            verts.push(0.0);	//cg
            verts.push(0.0);	//cb

			verts.push(1.1);	//x2
			verts.push(0.0);	//y2
			verts.push(0.0);	//z2
            verts.push(1.0);	//cr
            verts.push(0.0);	//cg
            verts.push(0.0);	//cb

			//y axis
			verts.push(0);      //x1
			verts.push(-1.1);	//y1
			verts.push(0);		//z1
            verts.push(0.0);	//cr
            verts.push(1.0);	//cg
            verts.push(0.0);	//cb

			verts.push(0);		//x2
			verts.push(1.1);	//y2
			verts.push(0);		//z2
            verts.push(0.0);	//cr
            verts.push(1.0);	//cg
            verts.push(0.0);	//cb

			//z axis
			verts.push(0);		//x1
			verts.push(0);		//y1
			verts.push(-1.1);	//z1
            verts.push(0.0);	//cr
            verts.push(0.0);	//cg
            verts.push(1.0);	//cb

			verts.push(0);		//x2
			verts.push(0);		//y2
			verts.push(1.1);	//z2
            verts.push(0.0);	//cr
            verts.push(0.0);	//cg
            verts.push(1.0);	//cb

        // set up mesh container
        let mesh = {};
        mesh.drawMode = gl.LINES;

        mesh.vertexComponentLen = 6;
		mesh.vertexCount = verts.length / mesh.vertexComponentLen;

        // set up buffers
        mesh.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

        // clean up
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        MeshCache["grid"] = mesh;
        return mesh;
    }

    constructor(gl){
        this.mesh = GridAxis.getMesh(gl);
        this.transform = new Transform();
    }

    render(shader, camera){

        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;
        let cameraPosition = camera.getPosition();

        this.transform.updateMatrix();

        gl.useProgram(shader.program);

        // set model, view and projection matrices in the vertex shader
        gl.uniformMatrix4fv(shader.uniformLoc.modelMatrix, false, this.transform.modelMatrix.transpose().toFloat32());
        gl.uniformMatrix4fv(shader.uniformLoc.viewMatrix, false, viewMatrix.toFloat32());
        gl.uniformMatrix4fv(shader.uniformLoc.projectionMatrix, false, projectionMatrix.toFloat32());

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.positionBuffer);

        //Enable Attribute location and set Attribute Pointer
        gl.enableVertexAttribArray(shader.attribLoc.position);
        let strideLen = Float32Array.BYTES_PER_ELEMENT * this.mesh.vertexComponentLen; //Stride Length is the Vertex Size for the buffer in Bytes
        gl.vertexAttribPointer(shader.attribLoc.position,           //Attribute location
                                3,                                  //How big is the vector by number count
                                gl.FLOAT,                           //What type of number are we passing in
                                false,                              //Do we need to normalize the data
                                strideLen,                          //stride (how big is one chunk of data, 0 if onyl one kind of data in the buffer)
                                0);                                 //stride offsets by how much

        gl.enableVertexAttribArray(shader.attribLoc.vertexColor);
        gl.vertexAttribPointer(shader.attribLoc.vertexColor,
                                3,
                                gl.FLOAT,
                                false,
                                strideLen,				            //
                                Float32Array.BYTES_PER_ELEMENT * 3  //skip first 3 floats in our vertex chunk, its like str.substr(3,1) in theory.
        );

        gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);
        return this;
	}
}

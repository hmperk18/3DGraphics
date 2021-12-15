"use strict";
class Model{
	transform;
	mesh;
    material;

	constructor(transform, meshData, material){
        this.transform = transform;
		this.mesh = meshData;
        this.material = material || {tint:[1,1,1,1]};
	}

    //...................................................
	//Methods
    //...................................................
	update(){
		this.transform.updateMatrix();
		return this;
	}

    render(shader, camera, lightingData){

        gl.useProgram(shader.program);

        this.setUniformData(shader, camera, lightingData);

        this.setVertexArrays(gl, shader)

        // if the mesh has an index buffer, use index(element) based drawing.
        if(this.mesh.indexCount){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufIndex);
            gl.drawElements(this.mesh.drawMode, this.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
        }
        // otherwise use regular drawing.
        else {
            gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);
        }

        return this;
	}

    setVertexArrays(gl, shader){
        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.positionBuffer);
        gl.enableVertexAttribArray(shader.attribLoc.position);
        gl.vertexAttribPointer(shader.attribLoc.position,3,gl.FLOAT,false,0,0);

        // normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.enableVertexAttribArray(shader.attribLoc.normal);
        gl.vertexAttribPointer(shader.attribLoc.normal,3,gl.FLOAT,false,0,0);
    }

    setUniformData(shader, camera, lightingData){

        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;
        let cameraPosition = camera.getPosition();

        // set model, view and projection matrices in the vertex shader
        gl.uniformMatrix4fv(shader.uniformLoc.modelMatrix, false, this.transform.modelMatrix.toFloat32());
        gl.uniformMatrix4fv(shader.uniformLoc.viewMatrix, false, viewMatrix.toFloat32());
        gl.uniformMatrix4fv(shader.uniformLoc.projectionMatrix, false, projectionMatrix.toFloat32());

        // set tint color, if a corresponding uniform exists in the shader.
        if(shader.uniformLoc.tint)
            gl.uniform4fv(shader.uniformLoc.tint, new Float32Array(this.material.tint));

        // set model inverse transpose to enable lighting calulations using normals
        if(shader.uniformLoc.modelInverseTransposeMatrix)
            gl.uniformMatrix3fv(shader.uniformLoc.modelInverseTransposeMatrix, false,
                Matrix4x4.inverseTranspose3x3(this.transform.modelMatrix).toFloat32());

        // lighting
        if(shader.uniformLoc.viewPos)
            gl.uniform3fv(shader.uniformLoc.viewPos, cameraPosition.toFloat32());
        // if the shader supports directional lighting
        if(shader.uniformLoc.directionalLight)
            gl.uniform3fv(shader.uniformLoc.directionalLight, lightingData.directionalLight.toFloat32());
        if(shader.uniformLoc.directionalColor)
            gl.uniform3fv(shader.uniformLoc.directionalColor, lightingData.directionalColor.toFloat32());
        // if the shader supports point lighting
        if(shader.uniformLoc.pointLight)
            gl.uniform3fv(shader.uniformLoc.pointLight, lightingData.pointLight.toFloat32());
        if(shader.uniformLoc.pointLightColor)
            gl.uniform3fv(shader.uniformLoc.pointLightColor, lightingData.pointLightColor.toFloat32());
        // if the shader supports ambient lighting
        if(shader.uniformLoc.ambientColor)
            gl.uniform3fv(shader.uniformLoc.ambientColor, lightingData.ambientColor.toFloat32());
        // if the shader supports specular highlights
        if(shader.uniformLoc.shininess)
            gl.uniform1f(shader.uniformLoc.shininess, this.material.shininess);
    }
}

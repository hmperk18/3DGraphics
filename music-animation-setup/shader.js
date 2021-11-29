"use strict";
//--------------------------------------------------
// Global attribute and uniform constants
//--------------------------------------------------
// these allow us to work with by standard defined attribute and uniform names
// throughout the application. Every shader will have to follow this naming
// convention. Use these constants for uniform and attribute location lookup.
// Location objects are saved in the shaders attribLoc and uniformLoc values.
const A_POSITION_NAME	= "a_position";
const A_VERTEXCOLOR_NAME= "a_vertexcolor";
const A_NORMAL_NAME     = "a_normal";
const A_TEXCOORD_NAME   = "a_texcoord";

// transformations
const U_MODEL_MATRIX_NAME      = "u_matrixM";
const U_VIEW_MATRIX_NAME       = "u_matrixV";
const U_PROJECTION_MATRIX_NAME = "u_matrixP";
const U_MODEL_INVERSE_TRANSPOSE_MATRIX_NAME = "u_matrixInvTransM";

// lighting
const U_VIEW_POSITION_NAME               = "u_viewPos";
const U_DIRECTIONAL_LIGHT_WORLD_DIR_NAME = "u_directionalLight";
const U_DIRECTIONAL_LIGHT_COLOR_NAME     = "u_directionalColor";
const U_POINT_LIGHT_POSITION_NAME        = "u_pointLight";
const U_POINT_LIGHT_COLOR_NAME           = "u_pointLightColor";
const U_AMBIENT_COLOR_NAME               = "u_ambientColor";
const U_SHININESS_NAME          = "u_shininess";

// color and texture
const U_TINT_NAME = "u_tint";
const U_MAINTEX_NAME = "u_mainTex";

class Shader{
	gl;
	attribLoc; // an object to hold standardized attribute locations for any shader
	uniformLoc; // an object to hold standardized uniform locations for any shader
	program;

	constructor(gl, vertShaderSrc, fragShaderSrc){
		this.program = GLUtils.createShaderProgram(gl,vertShaderSrc,fragShaderSrc,true);

		if(this.program != null){
			this.gl = gl;
			gl.useProgram(this.program);
			this.attribLoc = Shader.getStandardAttribLocations(gl,this.program);
			this.uniformLoc = Shader.getStandardUniformLocations(gl,this.program);
		}
	}

	//...................................................
	//Methods
    //...................................................
	activate(){
		gl.useProgram(this.program);
		return this;
	}
	deactivate(){
		gl.useProgram(null);
		return this;
	}

	//function helps clean up resources when shader is no longer needed.
	dispose(){
		//unbind the program if its currently active
		if(gl.getParameter(gl.CURRENT_PROGRAM) === this.program){
			gl.useProgram(null);
		}
		gl.deleteProgram(this.program);
	}

    //Get the locations of standard attributes that we will mostly be using. Location will = -1 if attribute is not found.
    static getStandardAttribLocations(gl, program){
        return {
            position:    gl.getAttribLocation(program, A_POSITION_NAME),
            vertexColor: gl.getAttribLocation(program, A_VERTEXCOLOR_NAME),
            normal:      gl.getAttribLocation(program, A_NORMAL_NAME),
            texcoord:    gl.getAttribLocation(program, A_TEXCOORD_NAME)
        };
    }

    //Get the locations of standard Uniforms that we will mostly be using. Location will = -1 if uniform is not found.
    static getStandardUniformLocations(gl, program){
        return {
            // transformations
            modelMatrix:      gl.getUniformLocation(program, U_MODEL_MATRIX_NAME),
            viewMatrix:       gl.getUniformLocation(program, U_VIEW_MATRIX_NAME),
            projectionMatrix: gl.getUniformLocation(program, U_PROJECTION_MATRIX_NAME),
            modelInverseTransposeMatrix : gl.getUniformLocation(program, U_MODEL_INVERSE_TRANSPOSE_MATRIX_NAME),
            //color
            tint:               gl.getUniformLocation(program, U_TINT_NAME),
            // lighting
            viewPos:          gl.getUniformLocation(program, U_VIEW_POSITION_NAME),
            directionalLight: gl.getUniformLocation(program, U_DIRECTIONAL_LIGHT_WORLD_DIR_NAME),
            directionalColor: gl.getUniformLocation(program, U_DIRECTIONAL_LIGHT_COLOR_NAME),
            pointLight:       gl.getUniformLocation(program, U_POINT_LIGHT_POSITION_NAME),
            pointLightColor:  gl.getUniformLocation(program, U_POINT_LIGHT_COLOR_NAME),
            ambientColor:     gl.getUniformLocation(program, U_AMBIENT_COLOR_NAME),
            shininess:        gl.getUniformLocation(program, U_SHININESS_NAME),
            // texturing
            mainTexture:      gl.getUniformLocation(program, U_MAINTEX_NAME)
        };
    }
}

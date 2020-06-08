#version 300 es

precision highp float;
//attribute vec3 a_position;
//attribute vec4 a_color;

layout (location = 0) in vec2 aPos;
//layout (location = 1) in vec3 aColor;
layout (location = 2) in vec2 aTexCoord;

uniform mat4 transform;
//uniform mat4 cc_matWorld;

//out vec4 v_color;
out vec2 v_uv0;

void main () {
    gl_Position = transform * vec4(aPos, 0.0f, 1.0f);
    v_uv0 = vec2(aTexCoord.x, 1.0f - aTexCoord.y);
//    v_color = a_color;
}

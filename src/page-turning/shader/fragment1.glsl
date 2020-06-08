#version 300 es
precision highp float;
in vec2 v_uv0;
out vec4 FragColor;

uniform sampler2D texture1;

const float PI = 3.141592653589793;
float cylinderRadius =  1.0 / PI / 2.0;
float time = 0.1f;
float scale = 0.0f;

void main() {
    vec2 Tex = v_uv0;
    FragColor = texture(texture1, Tex);
}

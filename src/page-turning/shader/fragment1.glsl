#version 300 es
precision highp float;
in vec2 v_uv0;
out vec4 FragColor;

uniform sampler2D texture1;

const float PI = 3.141592653589793;
const float cylinderRadius =  1.0 / PI / 2.0;
float time = 0.0f;
float scale = 0.2f;

vec4 zoom(vec2 uv, float scale) {
    vec2 zv = vec2(uv.x * (1.0 - scale / 0.5) + scale, uv.y * (1.0 - scale / 0.5) + scale);
    return texture(texture1, zv);
}

vec4 jz(vec2 uv) {
    float wz = 1.0 - time;
    float zc = cylinderRadius * PI / 2.0;
    float zcwz = (uv.x - wz) / cylinderRadius * zc;
    float color = 0.0;
    if (zcwz > cylinderRadius) {
        color = 0.5;
    }
    float uvX = zcwz + wz;
    if (uvX > 1.0) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else if (uvX < zc * 2.0) {
        uvX = uv.x;
    }
//    if (uvX )
    return vec4(texture(texture1, vec2(uvX, uv.y)).rgb + color, 0.0);
}

void main() {
    const float angle = 30.0 * PI / 180.0;
    float c = cos(-angle);
    float s = sin(-angle);

    vec2 Tex = v_uv0;
//    FragColor = texture(texture1, Tex);// jz(Tex);// zoom(Tex, scale);
    FragColor = jz(Tex);
}

#version 300 es
precision highp float;
in vec2 v_uv0;
out vec4 FragColor;

uniform sampler2D texture1;

const float PI = 3.141592653589793;
const float cylinderRadius =  1.0 / PI / 2.0;
uniform float time;
float scale = 0.2f;

vec4 zoom(vec2 uv, float scale) {
    vec2 zv = vec2(uv.x * (1.0 - scale / 0.5) + scale, uv.y * (1.0 - scale / 0.5) + scale);
    return texture(texture1, zv);
}

vec4 jz(vec2 uv) {
    float wz = 1.0 - time;
    float by = cylinderRadius * PI;
    float color = 0.0;
//    float x = cos(((180 * (1.0 - wz)) / (Math.PI * cylinderRadius) - 90) * Math.PI / 180) * cylinderRadius;
    if (uv.x - wz > cylinderRadius) {
        return vec4(0.0, 0.0, 0.0, 0.0);
    }
    float x = (acos((uv.x - wz) / cylinderRadius) * 180.0 / PI + 90.0) * PI * cylinderRadius / 180.0;
    if (x + wz > 1.0) {
        x = (asin((uv.x - wz) / cylinderRadius) * 180.0 / PI) * PI * cylinderRadius / 180.0;
        if (uv.x - wz > 0.0) {
            x = x + wz;
        } else {
            x = uv.x;
        }
    } else {
        x = x + wz;
        color = 0.5;
    }
    if (uv.x < wz - cylinderRadius) {
        x = uv.x;
        color = 0.0;
    }
    if (x != uv.x) {
//        color = 0.5;
    }
    return vec4(texture(texture1, vec2(x, uv.y)).rgb + color, 0.0);
}

void main() {
    const float angle = 30.0 * PI / 180.0;
    float c = cos(-angle);
    float s = sin(-angle);

    vec2 Tex = v_uv0;
//    FragColor = texture(texture1, Tex);// jz(Tex);// zoom(Tex, scale);
    FragColor = jz(Tex);
//    FragColor = vec4(v_uv0.x, 0.0, 0.0, 0.0);
}

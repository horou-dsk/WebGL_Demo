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
//    float x = (uv.x - wz) * PI;
    if (x + wz > 1.0) {
        x = (asin((uv.x - wz) / cylinderRadius) * 180.0 / PI) * PI * cylinderRadius / 180.0;
//        x = (uv.x - wz) * PI / 2.0;
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

bool tb(vec2 xy) {
    return xy.x < 0.0 || xy.x > 1.0 || xy.y < 0.0 || xy.y > 1.0;
}

vec4 jz1(vec2 uv, float xc, mat3 rrotation) {
    float wz = xc;
    // 半周长
    float by = cylinderRadius * PI;
    float color = 0.0;
    //    float x = cos(((180 * (1.0 - wz)) / (Math.PI * cylinderRadius) - 90) * Math.PI / 180) * cylinderRadius;
    if (uv.x - wz > cylinderRadius) {
        return vec4(0.0, 0.0, 0.0, 0.0);
    }
    float x = (acos((uv.x - wz) / cylinderRadius) * 180.0 / PI + 90.0) * PI * cylinderRadius / 180.0;
    //    float x = (uv.x - wz) * PI;
    if (x + wz > 1.0) {
        x = (asin((uv.x - wz) / cylinderRadius) * 180.0 / PI) * PI * cylinderRadius / 180.0;
        //        x = (uv.x - wz) * PI / 2.0;
        if (uv.x - wz > 0.0) {
            if (x + wz > 1.0) return vec4(0.0, 0.0, 0.0, 0.0);
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
    vec2 uvPos = (rrotation * vec3(x, uv.y, 1.0)).xy;
    if (tb(uvPos)) {
        uvPos = v_uv0;
        color = 0.0;
    }
    return vec4(texture(texture1, uvPos).rgb + color, 0.0);
}

vec4 ccc(vec2 uv, float xc, mat3 rrotation) {
    float color = 0.0;
    if (uv.x > xc - cylinderRadius && uv.x < xc + cylinderRadius) {
        color = 0.5;
    }
    vec3 uvPos = rrotation * vec3(uv, 1.0);
    return vec4(texture(texture1, uvPos.xy).rgb + color, 0.0);
}

void main() {
    const float angle = -65.0 * PI / 180.0;
    float c = cos(-angle);
    float s = sin(-angle);

    mat3 rotation = mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1
    );

    c = cos(angle);
    s = sin(angle);
    // 反向旋转
    mat3 rrotation = mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1
    );

    vec3 Tex = rotation * vec3(v_uv0, 1.0);
//    vec3 uv = Tex * rotation;// (vec3(Tex.xy, 1.0) * rrotation).xy;
    float xc = cos(angle); // - time * 1.0 / cos(angle);
    //    FragColor = texture(texture1, Tex);// jz(Tex);// zoom(Tex, scale);
//    FragColor = jz1(Tex.xy, xc, rrotation);
//    FragColor = vec4(Tex.y, 0.0, 0.0, 0.0);
    FragColor = ccc(Tex.xy, xc, rrotation);
    /*if (tb(uv.xy)) {
        FragColor = vec4(0.0);
        return;
    }
    FragColor = texture(texture1, uv.xy);*/
}

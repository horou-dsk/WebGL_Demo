#version 300 es

precision highp float;
//in vec4 v_color;
in vec2 v_uv0;
out vec4 FragColor;

uniform sampler2D texture1;
uniform sampler2D targetTex;
uniform float time;
const float MIN_AMOUNT = -0.16;
const float MAX_AMOUNT = 1.3;
const float PI = 3.141592653589793;
const float scale = 512.0;
const float sharpness = 3.0;
const float cylinderRadius = 1.0 / PI / 2.0;

vec3 hitPoint(float hitAngle, float yc, vec3 point, mat3 rrotation) {
    float hitPoint = hitAngle / (2.0 * PI);
    point.y = hitPoint;
    return rrotation * point;
}

vec4 antiAlias(vec4 color1, vec4 color2, float distance) {
    distance *= scale;
    if (distance < 0.0) return color2;
    if (distance > 2.0) return color1;
    float dd = pow(1.0 - distance / 2.0, sharpness);
    return ((color2 - color1) * dd) + color1;
}

float distanceToEdge(vec3 point) {
    float dx = abs(point.x > 0.5 ? 1.0 - point.x : point.x);
    float dy = abs(point.y > 0.5 ? 1.0 - point.y : point.y);
    if (point.x < 0.0) dx = -point.x;
    if (point.x > 1.0) dx = point.x - 1.0;
    if (point.y < 0.0) dy = -point.y;
    if (point.y > 1.0) dy = point.y - 1.0;
    if ((point.x < 0.0 || point.x > 1.0) && (point.y < 0.0 || point.y > 1.0)) return sqrt(dx * dx + dy * dy);
    return min(dx, dy);
}

vec4 seeThrough(float cylinderAngle, float yc, vec2 p, mat3 rotation, mat3 rrotation) {
    float hitAngle = PI - (acos(yc / cylinderRadius) - cylinderAngle);
    vec3 point = hitPoint(hitAngle, yc, rotation * vec3(p, 1.0), rrotation);
    if (yc <= 0.0 && (point.x < 0.0 || point.y < 0.0 || point.x > 1.0 || point.y > 1.0)) {
        return texture(targetTex, v_uv0);
    }
    if (yc > 0.0) return texture(texture1, p);
    vec4 color = texture(texture1, point.xy);
    vec4 tcolor = vec4(0.0);
    return antiAlias(color, tcolor, distanceToEdge(point));
}

vec4 seeThroughWithShadow(float amount, float cylinderAngle, float yc, vec2 p, vec3 point, mat3 rotation, mat3 rrotation) {
    float shadow = distanceToEdge(point) * 30.0;
    shadow = (1.0 - shadow) / 3.0;
    if (shadow < 0.0) shadow = 0.0;
    else shadow *= amount;
    vec4 shadowColor = seeThrough(cylinderAngle, yc, p, rotation, rrotation);
    shadowColor.r -= shadow;
    shadowColor.g -= shadow;
    shadowColor.b -= shadow;
    return shadowColor;
}

vec4 backside(float yc, vec3 point) {
    vec4 color = texture(texture1, point.xy);
    float gray = (color.r + color.b + color.g) / 15.0;
    gray += (8.0 / 10.0) * (pow(abs(1.0 - abs(yc / cylinderRadius)), abs(2.0 / 10.0)) / 2.0 + (5.0 / 10.0));
    color.rgb = vec3(gray);
    return color;
}

vec4 behindSurface(float amount, float cylinderAngle, float yc, vec3 point, mat3 rrotation) {
    float shado = (1.0 - ((-cylinderRadius - yc) / amount * 7.0)) / 6.0;
    shado *= 1.0 - abs(point.x - 0.5);
    yc = (-cylinderRadius - cylinderRadius - yc);
    float hitAngle = (acos(yc / cylinderRadius) + cylinderAngle) - PI;
    point = hitPoint(hitAngle, yc, point, rrotation);
    if (yc < 0.0 && point.x >= 0.0 && point.y >= 0.0 && point.x <= 1.0 && point.y <= 1.0 && (hitAngle < PI || amount > 0.5)){
        shado = 1.0 - (sqrt(pow(abs(point.x - 0.5), 2.0) + pow(abs(point.y - 0.5), 2.0)) / (71.0 / 100.0));
        shado *= pow(abs(-yc / cylinderRadius), 3.0);
        shado *= 0.5;
    } else
    shado = 0.0;
    return vec4(texture(targetTex, v_uv0).rgb - shado, 0.0);
}

void main() {
    const float angle = 30.0 * PI / 180.0;
    float c = cos(-angle);
    float s = sin(-angle);

    // 绕z轴旋转， 坐标系顺时针
    mat3 rotation = mat3(
    c, s, 0,
    -s, c, 0,
//    0, 0, 1
     0.12, 0.258, 1
    );

    c = cos(angle);
    s = sin(angle);

    // 绕z轴旋转， 坐标系逆时针
    mat3 rrotation = mat3(
    c, s, 0,
    -s, c, 0,
//    0, 0, 1
     0.15, -0.5, 1
    );

    vec3 point = rotation * vec3(v_uv0, 1.0);
    float amount = time * (MAX_AMOUNT - MIN_AMOUNT) + MIN_AMOUNT;
    float cylinderAngle = 2.0 * PI * amount;
    float yc = point.y - amount;
    /*if (yc < -cylinderRadius) {
        FragColor = behindSurface(amount, cylinderAngle, yc, point, rrotation);
        return;
    }*/
    if (yc > cylinderRadius) {
        FragColor = texture(texture1, v_uv0);
        return;
    }
    float hitAngle = (acos(yc / cylinderRadius) + cylinderAngle) - PI;
    float hitAngleMod = mod(hitAngle, 2.0 * PI);
    if ((hitAngleMod > PI && amount < 0.5) || (hitAngleMod > PI/2.0 && amount < 0.0)) {
        FragColor = seeThrough(cylinderAngle, yc, v_uv0, rotation, rrotation);
        return;
    }
    point = hitPoint(hitAngle, yc, point, rrotation);
    if (point.x < 0.0 || point.y < 0.0 || point.x > 1.0 || point.y > 1.0) {
        FragColor = seeThroughWithShadow(amount, cylinderAngle, yc, v_uv0, point, rotation, rrotation);
        return;
    }
    vec4 color = backside(yc, point);
    /*vec4 otherColor;
    if (yc < 0.0) {
        float shado = 1.0 - (sqrt(pow(abs(point.x - 0.5), 2.0) + pow(abs(point.y - 0.5), 2.0)) / 0.71);
        shado *= pow(abs(-yc / cylinderRadius), 3.0);
        shado *= 0.5;
        otherColor = vec4(0.0, 0.0, 0.0, shado);
    } else {
        otherColor = texture(texture1, v_uv0);
    }
    color = antiAlias(color, otherColor, cylinderRadius - abs(yc));
    vec4 cl = seeThroughWithShadow(amount, cylinderAngle, yc, v_uv0, point, rotation, rrotation);
    float dist = distanceToEdge(point);
    FragColor = antiAlias(color, cl, dist);*/
    FragColor = color;
}

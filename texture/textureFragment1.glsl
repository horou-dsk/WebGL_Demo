#version 300 es
precision mediump float;
out vec4 FragColor;
//in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D texture1;
//uniform sampler2D texture2;
//uniform float visible;

void main() {
//    FragColor = mix(texture(texture1, TexCoord), texture(texture2, vec2(1.0 - TexCoord.x, TexCoord.y)), visible);
    FragColor = texture(texture1, TexCoord);
//    FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);
}

#version 300 es
precision mediump float;

out vec4 FragColor;

in vec4 TEX0;

uniform sampler2D Texture;

void main()
{
    FragColor = texture(Texture, TEX0.xy);
}

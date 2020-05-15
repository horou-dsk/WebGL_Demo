#version 300 es
layout (location = 0) in vec2 aPos;
//layout (location = 1) in vec3 aColor;
layout (location = 2) in vec2 aTexCoord;

//out vec3 ourColor;
out vec2 TexCoord;

//uniform mat4 transform;

void main()
{
    gl_Position = vec4(aPos, 0.0f, 1.0f);
//    ourColor = aColor;
    TexCoord = vec2(aTexCoord.x, 1.0f - aTexCoord.y);
}

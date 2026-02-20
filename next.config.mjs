/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@ffmpeg-installer', '@ffprobe-installer', 'gifsicle'],
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        middlewareClientMaxBodySize: '20mb'
    }
}

export default nextConfig

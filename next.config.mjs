/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: ['utfs.io'],
        remotePatterns:[
            {
                protocol: 'http',
                hostname: 'utfs.io',
                port:''
            }
        ]
    }
};

export default nextConfig;

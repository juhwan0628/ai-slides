// Cross-platform, loopback-only convenience for local image-slot editing.
process.env.HOST='127.0.0.1';
process.env.AI_SLIDES_LOCAL_UPLOAD='1';
const {startServer}=await import('../server/app.js');
startServer();

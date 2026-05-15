// node generate-cluster-heroes.js
// Generates one hero image per cluster for the main page grid

const crypto = require('crypto');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const getEnv = k => env.match(new RegExp(`^${k}=(.+)`, 'm'))?.[1]?.trim();

const GEMINI_KEY = getEnv('GEMINI_API_KEY');
const CLD_CLOUD  = getEnv('CLOUDINARY_CLOUD_NAME');
const CLD_KEY    = getEnv('CLOUDINARY_API_KEY');
const CLD_SECRET = getEnv('CLOUDINARY_API_SECRET');

const CLUSTERS = [
  { id: 'agriculture',   prompt: 'Close-up of lush green wheat stalks and golden grain at magic hour, rich warm harvest light, shallow depth of field, cinematic bokeh, vibrant saturated colors, professional nature photography' },
  { id: 'arts',          prompt: 'Bold splashes of vivid paint in red, yellow, and blue on a dark canvas, close-up abstract art with dramatic lighting, creative energy, professional fine art photography' },
  { id: 'finance',       prompt: 'Looking up at a towering glass skyscraper reflecting golden sunrise, dramatic low-angle architectural shot, sleek modern lines, deep blue sky, professional architectural photography' },
  { id: 'health',        prompt: 'Close-up of gloved medical professional hands holding a stethoscope over clean white scrubs, warm clinical lighting, soft bokeh background, professional healthcare photography' },
  { id: 'human',         prompt: 'Warm overhead shot of diverse hands joined together in a circle, community and unity, soft warm natural light, shallow focus, professional documentary photography' },
  { id: 'it',            prompt: 'Extreme close-up of illuminated circuit board with glowing blue and cyan traces, dark background, macro photography, dramatic tech lighting, professional product photography' },
  { id: 'manufacturing', prompt: 'Bright orange sparks from metal grinding in dark industrial workshop, dramatic long-exposure sparks arcing across frame, professional industrial photography' },
];

async function generateImage(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: '1:1' }
      })
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0,300)}`);
  return (await res.json()).predictions[0].bytesBase64Encoded;
}

function cldSign(params) {
  const str = Object.keys(params).sort().map(k=>`${k}=${params[k]}`).join('&') + CLD_SECRET;
  return crypto.createHash('sha256').update(str).digest('hex');
}

async function uploadToCloudinary(base64, publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const form = new FormData();
  form.append('file', `data:image/png;base64,${base64}`);
  form.append('public_id', publicId);
  form.append('timestamp', String(timestamp));
  form.append('api_key', CLD_KEY);
  form.append('signature', cldSign(params));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLD_CLOUD}/image/upload`, { method:'POST', body:form });
  if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${(await res.text()).slice(0,300)}`);
  return (await res.json()).secure_url;
}

async function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

async function main() {
  const results = {};
  console.log(`Generating ${CLUSTERS.length} cluster hero images...\n`);
  for (const c of CLUSTERS) {
    const publicId = `field-experience/clusters/${c.id}/hero`;
    try {
      process.stdout.write(`  ${c.id}... `);
      const base64 = await generateImage(c.prompt);
      const url = await uploadToCloudinary(base64, publicId);
      results[c.id] = url;
      console.log(`✓ ${url}`);
    } catch (err) {
      results[c.id] = null;
      console.log(`✗ ${err.message}`);
    }
    await sleep(1500);
  }
  fs.writeFileSync('cluster-hero-urls.json', JSON.stringify(results, null, 2));
  console.log('\nDone. URLs saved to cluster-hero-urls.json');
}

main().catch(console.error);

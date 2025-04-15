import type { APIRoute } from 'astro';
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: import.meta.env.VERCEL_TOKEN,
});

export const GET: APIRoute = async () => {
  try {
    const createResponse = await vercel.deployments.createDeployment({
      requestBody: {
        name: 'recent-developments-dashboard',
        target: 'production',
        gitSource: {
          type: 'github',
          repoId: '964910633',
          ref: 'main',
          org: 'morimorig3',
        },
      },
    });

    console.log(`Deployment created: ID ${createResponse.id} and status ${createResponse.status}`);
    return new Response(JSON.stringify({ success: true, createResponse }), {
      status: 200,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
};

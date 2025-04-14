import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vercelのデプロイメントをトリガー
    const response = await fetch('https://api.vercel.com/v1/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'recent-developments-dashboard',
        files: [],
        project: process.env.VERCEL_PROJECT_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('Deployment failed');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Deployment failed' }), {
      status: 500,
    });
  }
};

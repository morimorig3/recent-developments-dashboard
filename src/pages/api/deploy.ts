import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'recent-developments-dashboard',
        project: import.meta.env.VERCEL_PROJECT_ID,
        target: 'production',
        gitSource: {
          type: 'github',
          repoId: import.meta.env.VERCEL_GIT_REPO_ID,
          ref: 'main',
          sha: import.meta.env.VERCEL_GIT_COMMIT_SHA,
        },
        files: [],
        projectSettings: {
          buildCommand: 'npm run build',
          installCommand: 'npm install',
          outputDirectory: 'dist',
          framework: 'astro',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const deployment = await response.json();
    return new Response(JSON.stringify({ success: true, deployment }), {
      status: 200,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
};

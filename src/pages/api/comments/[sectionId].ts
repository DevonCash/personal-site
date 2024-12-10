import type { APIRoute } from "astro";
import { Octokit } from "@octokit/rest";

export const prerender = false;

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

export const GET: APIRoute = async ({ params }) => {
  try {
    const { data: issues } = await octokit.issues.listForRepo({
      owner: "your-username",
      repo: "your-repo",
      labels: "anonymous-comment",
      state: "open",
    });

    const sectionComments = issues
      .filter((issue) => issue.body?.includes(`sectionId: ${params.sectionId}`))
      .map((issue) => ({
        id: issue.id,
        name: issue.title.split("from: ")[1]?.split("\n")[0] || "Anonymous",
        content: issue.body?.split("\n\n")[1],
        selectedText: issue.body?.match(/Selected Text: "(.*?)"/)?.[1] || "",
        timestamp: issue.created_at,
      }));

    return new Response(JSON.stringify(sectionComments));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load comments" }), {
      status: 500,
    });
  }
};

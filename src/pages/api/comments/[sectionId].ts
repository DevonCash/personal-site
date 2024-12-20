import type { APIRoute } from "astro";
import { Octokit } from "@octokit/rest";

export const prerender = false;

if (!import.meta.env.GITHUB_TOKEN) {
  console.warn(
    "GITHUB_TOKEN is required: https://github.com/settings/tokens/new"
  );
}

const repo = {
  owner: "DevonCash",
  repo: "personal-site",
};

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

export const GET: APIRoute = async ({ params }) => {
  try {
    const { data: issues } = await octokit.issues.listForRepo({
      ...repo,
      labels: "anonymous-comment",
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

    console.log(sectionComments);
    return new Response(JSON.stringify(sectionComments));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load comments" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.json();

  // Check honeypot
  if (formData.honeypot) {
    return new Response(JSON.stringify({ error: "Invalid submission" }), {
      status: 400,
    });
  }

  // Email required
  const emailHash = formData.email
    ? await crypto.subtle.digest(
        "sha-256",
        new TextEncoder().encode(formData.email)
      )
    : null;

  try {
    await octokit.issues.create({
      ...repo,
      title: `[Anonymous Comment] ${formData.selectedText
        ?.toString()
        .substring(0, 50)}...`,
      body: `
Anonymous Comment from: ${formData.name || "Anonymous"}

${formData.content}

Selected Text: "${formData.selectedText}"

<!-- metadata
${JSON.stringify(
  {
    timestamp: formData.timestamp,
    email: emailHash
      ? Array.from(new Uint8Array(emailHash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      : null,
  },
  null,
  2
)}
-->
      `,
      labels: ["anonymous-comment", "needs-review"],
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to submit comment" }), {
      status: 500,
    });
  }
};

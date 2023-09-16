import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version: "ad59ca21177f9e217b9075e7300cf6e14f7e5b4505b87b9689dbd866e9768969",

      // This is the text prompt that will be submitted by a form on the frontend
      input: {
        prompt: req.body.prompt,
        negative_prompt: req.body.negative_prompt,
        height: req.body.height,
        width: req.body.width,
        prompt_strength: req.body.prompt_strength,
      },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
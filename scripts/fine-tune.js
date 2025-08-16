#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import OpenAI from "openai";
import fetch from 'node-fetch';

async function main() {
  // Hardcoded API key
  const apiKey = "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";

  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/fine-tune.js <path to JSONL file>");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  console.log("Uploading training file:", filePath);
  const file = await openai.files.create({
    file: fs.createReadStream(path.resolve(process.cwd(), filePath)),
    purpose: "fine-tune",
  });
  console.log("File uploaded with ID:", file.id);

  console.log("Starting fine-tune job with gpt-3.5-turbo via REST...");
  const endpoint = "https://api.openai.com/v1/fine-tunes";
  console.log(`Calling fine-tune endpoint: ${endpoint}`);
  const responseFine = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-3.5-turbo", training_file: file.id, n_epochs: 4 }),
  });
  const contentType = responseFine.headers.get("content-type");
  if (!responseFine.ok || !contentType?.includes("application/json")) {
    const text = await responseFine.text();
    console.error(`Fine-tune failed (status ${responseFine.status}):`);
    console.error(text);
    process.exit(1);
  }
  const jobData = await responseFine.json();
  console.log("Fine-tune job response:", jobData);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { Agentica } from "@agentica/core";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import typia from "typia";

import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";

dotenv.config();

export const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "GoogleDocs Connector",
      protocol: "class",
      application: typia.llm.application<
        Omit<GoogleDocsService, "update">,
        "chatgpt"
      >(),
      execute: new GoogleDocsService({
        clientId: process.env.GOOGLE_DOCS_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_DOCS_CLIENT_SECRET!,
        secret: process.env.GOOGLE_DOCS_REFRESH_TOKEN!,
      }),
    },
  ],
});

const main = async () => {
  console.log(await agent.conversate("What can you do?"));
};

main();

import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2021-08-16"
});

const notionDatabaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: `${req.method} requests are not allowed` });
  }
  try {
    const { title, purpose } = JSON.parse(req.body);
    await notion.pages.create({
      parent: {
        database_id: notionDatabaseId
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        },
        Purpose: {
          rich_text: [
            {
              text: {
                content: purpose
              }
            }
          ]
        }
      }
    });
    res.status(201).json({ msg: "Success" });
  } catch (error) {
    res.status(500).json({ msg: "There was an error" });
  }
}

import { useLoaderData, redirect } from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { Client } from "@notionhq/client";

type BooksData = {
  id: string;
  title: string;
  purpose: string;
  purchase_date: string;
};

export const loader: LoaderFunction = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: "2021-08-16"
  });

  const notionDatabaseId = process.env.NOTION_DATABASE_ID
    ? process.env.NOTION_DATABASE_ID
    : "";

  const response = await notion.databases.query({
    database_id: notionDatabaseId
  });
  const data: BooksData[] = response.results.map((page: any) => {
    return {
      id: page.id,
      title: page.properties.Title.title[0].text.content,
      purpose: page.properties.Purpose.rich_text[0].text.content,
      purchase_date: page.properties["Purchase date"].date.start
    };
  });
  return data;
};

export let action: ActionFunction = async ({ request }) => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: "2021-08-16"
  });

  const notionDatabaseId = process.env.NOTION_DATABASE_ID
    ? process.env.NOTION_DATABASE_ID
    : "";

  let form = await request.formData();
  const title = form.get("title") || "";
  const purpose = form.get("purpose") || "";
  const purchase_date = form.get("purchase_date") || "";
  if (
    typeof title !== "string" ||
    typeof purpose !== "string" ||
    typeof purchase_date !== "string"
  ) {
    throw new Error(`Form not submitted correctly.`);
  }

  const data = { title, purpose, purchase_date };

  let book = await notion.pages.create({
    parent: {
      database_id: notionDatabaseId
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: data.title
            }
          }
        ]
      },
      Purpose: {
        rich_text: [
          {
            text: {
              content: data.purpose
            }
          }
        ]
      },
      "Purchase date": {
        date: {
          start: data.purchase_date
        }
      }
    }
  });
  return redirect(`/books`);
};

export default function Books() {
  const data = useLoaderData<BooksData[]>();
  return (
    <div className="bg-indigo-50 min-h-screen md:px-20 pt-6 sm:block lg:flex ">
      <div className=" bg-white rounded-md px-6 py-10 max-w-4xl mx-auto mb-5">
        <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
          ??? ??????
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {data.map((book) => {
            return (
              <div
                key={book.id}
                className="bg-blue-600 pt-1 px-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-xl shadow-lg w-52"
              >
                <div className="p-2">
                  <p className="text-white text-center font-semibold h-12">
                    {book.title}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-200 text-sm text-left italic">
                      "{book.purpose}"
                    </p>
                    <p className="text-white text-xs text-right">
                      {book.purchase_date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form method="post">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-500 mb-10">
            ??? ??????
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-lx">
                ??? ??????:
              </label>
              <input
                type="text"
                placeholder="??? ????????? ???????????????"
                id="title"
                name="title"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="block mb-2 text-lg">
                ?????? ??????:
              </label>
              <textarea
                id="purpose"
                name="purpose"
                cols={30}
                rows={10}
                placeholder="??????????????? ????????? ???????????????"
                className="w-full  p-4 text-gray-600 bg-indigo-50 outline-none rounded-md"
              ></textarea>
            </div>
            <div>
              <label htmlFor="purchase_date" className="block mb-2 text-lg">
                ?????????:
              </label>
              <input
                id="purchase_date"
                name="purchase_date"
                type="date"
                className="w-full  p-4 text-gray-600 bg-indigo-50 outline-none rounded-md"
              ></input>
            </div>
            <button
              type="submit"
              className="px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  "
            >
              ????????????
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

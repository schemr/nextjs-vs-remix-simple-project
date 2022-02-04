import type { NextPage } from "next";

const Books: NextPage = () => {
  const hendleSubmitBook = async (event: any) => {
    event.preventDefault();
    const formBody = {
      title: event.target.title.value,
      purpose: event.target.purpose.value
    };
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify(formBody)
    });
    // Success if status code is 201
    if (res.status === 201) {
      alert("등록이 완료되었습니다.");
    } else {
      console.log(res.statusText);
    }
  };
  return (
    <form onSubmit={hendleSubmitBook}>
      <div className="bg-indigo-50 min-h-screen md:px-20 pt-6">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
            책 정보
          </h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-lx">
                책 이름:
              </label>
              <input
                type="text"
                placeholder="책 이름을 넣어주세요"
                id="title"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="block mb-2 text-lg">
                구매 이유:
              </label>
              <textarea
                id="purpose"
                cols={30}
                rows={10}
                placeholder="구입하게된 이유를 적어주세요"
                className="w-full  p-4 text-gray-600 bg-indigo-50 outline-none rounded-md"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  "
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Books;

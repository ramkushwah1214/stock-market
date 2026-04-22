import axios from "axios";

async function test() {
  try {
    const res = await axios.post("http://localhost:3000/api/chat", {
      messages: [
        { sender: "user", text: "What is TCS?" }
      ]
    });
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Failed:", err.response?.data || err.message);
  }
}

test();

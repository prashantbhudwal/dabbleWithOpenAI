import { OpenAIApi, Configuration } from "openai";
import { ChatCompletionRequestMessage } from "openai";
import { OpenAIOptions } from "./types";

const options: OpenAIOptions = {
  MODEL: "gpt-3.5-turbo",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 300,
  N: 1,
  STREAM: false,
};
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const model = new OpenAIApi(configuration);

export default async function getCompletion(
  messages: ChatCompletionRequestMessage[]
) {
  const { MODEL, TEMPERATURE, MAX_TOKENS } = options;
  const completion = await model.createChatCompletion({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: messages,
  });
  return completion.data.choices[0].message;
}

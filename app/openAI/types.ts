export type OpenAIOptions = {
  MODEL: string; // ID of the model to use (e.g., "gpt-3.5-turbo")
  PROMPT?: string; // Prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays
  SUFFIX?: string | null; // Suffix that comes after a completion of inserted text
  MAX_TOKENS?: number; // Maximum number of tokens to generate in the completion
  TEMPERATURE?: number; // Sampling temperature to use, between 0 and 2. Higher values make the output more random, while lower values make it more focused and deterministic
  TOP_P?: number; // Nucleus sampling parameter, model considers the results of the tokens with top_p probability mass
  N?: number; // Number of completions to generate for each prompt
  STREAM?: boolean; // Whether to stream back partial progress
  LOGPROBS?: number | null; // Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens
  ECHO?: boolean; // Echo back the prompt in addition to the completion
  STOP?: string | string[] | null; // Up to 4 sequences where the API will stop generating further tokens
  PRESENCE_PENALTY?: number; // Penalize new tokens based on whether they appear in the text so far
  FREQUENCY_PENALTY?: number; // Penalize new tokens based on their existing frequency in the text so far
  BEST_OF?: number; // Generates best_of completions server-side and returns the "best" (the one with the highest log probability per token)
  LOGIT_BIAS?: Record<number, number> | null; // Modify the likelihood of specified tokens appearing in the completion
  USER?: string | null; // Unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse
};

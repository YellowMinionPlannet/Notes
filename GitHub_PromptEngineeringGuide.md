[Prompt Engineering Guide](https://www.promptingguide.ai/introduction/settings)

# Introduction
## LLM Settings

There are some common settings you will encounter when using different LLM providers.

* Temperature - if the value is low, then the logic is more predictable, which means next word is strongly logical to the previous one.  
* Top P - *nucleus sampling* the range of vocabulary. high top p means more creative vocabulary is included to generate answer.
* Max Length - The *stop sequence* is a string that stops the model from generating tokens.
* Frequency Penalty - The *frequency penalty* controls how frequently the word would appear
* Presence Penalty - The *presence penalty*, the same work appears 2 or more times are treated the same penalty. This also prevent answer to be repeating.


## Basics of Prompting
The result of LLM is depending on how much information you provide and how well-crafted the prompt is. 

Sample of a Simple Prompt:

*Prompt*
```
The sky is
```

*Output*
```
blue
```

Within the Chat mode within Playground of ChatGPT, there are 3 rolls.

1. System, you give general logic or behavior guide in here.
2. User, you give specific prompt here
3. Assistant, gives you the answer.

Prompt Formatting:

It could follow several formats: 

1. One sentence of question/instruction, and result will be one answer.
2. Several pairs of questions and answers, and follows a final question, and result in an answer.

Sample:
*Prompt*
```
This awesome! // Positive
This is bad! // Negative
Wow that movie was rad! // Positive
What a horrible show! //
```

*Output*
```
Nagative
```
## Prompt Elements

A prompt could consists 4 elements:
1. Instruction - Specific task or instruction you want the model to perform.
2. Context - external info / additional context can steer the model to better responses.
3. Input Data - The question.
4. Output Indicator - Type / Format of the output.

Sample:
*Prompt*
```
Classify the text into neutral, negative, or positive
Text: I think the food was okay.
Sentiment:
```

*Output*
```
positive
```

## General Tips for Designing Prompts

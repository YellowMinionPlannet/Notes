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

1. Instruction

Use `###` to mark instruction, or use `"""` to mark context

2. Specificity

Imprecise Sample:
```
Explain the concept prompt engineering. Keep the explanation short, only a few sentences, and don't be too descriptive.
```

Better Sample:
```
Use 2-3 sentences to explain the concept of prompt engineering to a high school student.
```

3. To do or not to do?
Instead using "DO NOT", try to use positive advice/ requirements to the LLM to show what to do.

Negative Prompt:
```
The following is an agent that recommends movies to a customer. DO NOT ASK FOR INTERESTS. DO NOT ASK FOR PERSONAL INFORMATION.
```

Better Prompt:
```
The following is an agent that recommends movies to a customer. The agent is responsible to recommend a movie from the top global trending movies. It should refrain from asking users for their preferences and avoid asking for personal information. If the agent doesn't have a movie to recommend, it should respond "Sorry, couldn't find a movie to recommend today.".
```

4. Be specific about desired context, outcome, length, fromat, style, etc.
5. Start with zero-shot, then few-shot, neither of them worked, then fine-tune.

Sample of Zero-shot
```
Extract keywords from the below text.
Text: {text}
Keywords:
```

Sample of Few-shot
```
Extract keywords from the corresponding texts below.

Text 1: Stripe provides APIs that web developers can use to integrate payment processing into their websites and mobile applications.
Keywords 1: Stripe, payment processing, APIs, web developers, websites, mobile applications
##
Text 2: OpenAI has trained cutting-edge language models that are very good at understanding and generating text. Our API provides access to these models and can be used to solve virtually any task that involves processing language.
Keywords 2: OpenAI, language models, text processing, API.
##
Text 3: {text}
Keywords 3:
```
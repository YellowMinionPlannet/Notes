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

## Examples of Prompts

**This section not only has good sample of prompts, but also demos what LLMs is capable to do, these samples are typical tasks that LLMs are good at.**

### Text Summarization
To summarize / explain / describe what a complex paragraph is talking about.

Sample:
```
Antibiotics are a type of medication used to treat bacterial infections. They work by either killing the bacteria or preventing them from reproducing, allowing the body’s immune system to fight off the infection. Antibiotics are usually taken orally in the form of pills, capsules, or liquid solutions, or sometimes administered intravenously. They are not effective against viral infections, and using them inappropriately can lead to antibiotic resistance.

Explain the above in one sentence:
```
### Information Extraction

Sample:

```
Author-contribution statements and acknowledgements in research papers should state clearly and specifically whether, and to what extent, the authors used AI technologies such as ChatGPT in the preparation of their manuscript and analysis. They should also indicate which LLMs were used. This will alert editors and reviewers to scrutinize manuscripts more carefully for potential biases, inaccuracies and improper source crediting. Likewise, scientific journals should be transparent about their use of LLMs, for example when selecting submitted manuscripts.

Mention the large language model based product mentioned in the paragraph above:
```

### Question Answering
Sample:
```
Answer the question based on the context below. Keep the answer short and concise. Respond "Unsure about answer" if not sure about the answer.

Context: Teplizumab traces its roots to a New Jersey drug company called Ortho Pharmaceutical. There, scientists generated an early version of the antibody, dubbed OKT3. Originally sourced from mice, the molecule was able to bind to the surface of T cells and limit their cell-killing potential. In 1986, it was approved to help prevent organ rejection after kidney transplants, making it the first therapeutic antibody allowed for human use.

Question: What was OKT3 originally sourced from?
Answer:
```

### Text Classification

Decide sentiment of input, etc.

Sample:
```
Classify the text into neutral, negative or positive. 
Text: I think the food was okay. 
Sentiment:
```

### Conversation
Sample:
```
The following is a conversation with an AI research assistant. The assistant tone is technical and scientific.
Human: Hello, who are you?
AI: Greeting! I am an AI research assistant. How can I help you today?
Human: Can you tell me about the creation of blackholes?
AI:
```

```
The following is a conversation with an AI research assistant. The assistant answers should be easy to understand even by primary school students.
Human: Hello, who are you?
AI: Greeting! I am an AI research assistant. How can I help you today?
Human: Can you tell me about the creation of black holes?
AI: 
```

### Code Generation

Samples:

```
"""
Table departments, columns = [DepartmentId, DepartmentName]
Table students, columns = [DepartmentId, StudentId, StudentName]
Create a MySQL query for all students in the Computer Science Department
"""
```

### Reasoning

Samples:

```
What is 9,000 * 9,000?
```

```
The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1. 
Solve by breaking the problem into steps. First, identify the odd numbers, add them, and indicate whether the result is odd or even. 
```
# Concept of Generative AI

It is trained by big mount of data, studying the pattern of definitions, and use those patterns to generate new content. And the new content is expressed by human understandable language.

- Adobe FireFly - Photo manipulation, extend pictures, change color, object removing etc.
- Soundful - generate music
- Runwayyml - generate video

WARNING: fake video, manipulated video content.

# Variational Autoencoders (VAEs)

## Autoencoders

- Learn patterns from input data(images) and generate captured data and compress those data into numbers.(encoding)
- The patterns/features they learned/captured called latent representations of data
- Captured data is called Latent data space
- They input data and output data (encode and decode) but never generate new content.

## Variational Autoencoders

- Generate similar but different output every single time you request.

- For example, they learn the feature of real faces, which includes eyes, nose, mouth, eyebrow, ears etc. with that knowledge they create new faces with different probability from randomly sampled data.

- the true strength is to detect anomalies(something not follow normal patterns), because it's trained by data that are "normal".

# Transformers

- Processing sequential data, text streams, audio, video
- used in NLP (Natural language processing)
- Understand context of words
- trained by sequential data, which the data is ordered and correlated, correlated, one thing affect another, or one thing depends on another
- For example, in daily conversation, sequential data, is the sequential words, context is the word relation
- Text tokenization, they break the sequential data into text tokens, which is smaller chunks
- Pre-training and fine-tuning, which are two important stages of transformers.

There are BERT and GPT,

- GPT, generative pre-training transformers.
- Bidirectional Encoder Representations from Transformers (BERT)

## Pre-training

They learned language structure by large dataset, either GPT and BERT is different way of pre-training.

## Fine tuning

Fine-tune labeled data for specific task, save time and use less data.

- Pre-training gives model a foundation knowledge and Fine tuning give more specific domain.

## Architecture

### self-attention

when capture features(patterns) from language, it uses self-attention, and feed-foreward

ChatGPT uses transformer, which is the core, to understand context of words.

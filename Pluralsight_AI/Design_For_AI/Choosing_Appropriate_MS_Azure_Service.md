# Understanding Storage for Azure AI Solutions
## Different Types of Storage due to purposes
- Short-term storage
  - Mainly for unprocessed data and incomming data stream to stay
- Medium-term storage
  - Where raw data get filtered and transformed
- Long-term storage
  - Store result of processed data
  - Need to be accessed fast
- Archival Storage  


## Understanding Processing in Azure AI Solutions
### Azure Cognitive Services and Azure Machine Learning
![alt text](image.png)

So the processing means the intelligence part of the whole project.

In this picture, it's the LUIS and QnA Maker, this part could be subsittute into other services.

### Choosing an Azure AI Processing Methodology
Choose Cognitive Services if that general functionality already satisfy your need. It provides pre-built APIs, pre-trained model, and pre-defined algorithm, if you need customized APIs,  customized training input for model, and your own algorithm, go for ML. 

![alt text](image-1.png)

#### about short-term storage
Why we need Short-term storage, where raw data is being cleaned?

It's because we need source data maintain untouched. So we need a temporary place to ingest source data and clean them.

## Understanding Azure AI Services and Models(ML understanding)

Online hunting for project named `zooniverse`
![DLvsML](image-2.png)

In summary, Machine Learning is more like classification using numerical expression, and it's more light weighted. The result more likely a numerical value, comparing to Deep Learning producding strings and other types of result.

## Exploring Machine Learning Frameworks

### Why ML frameworks

1. It wraps up the complicated and professional process of Data Science related process, such as building a model, into a user-friendly interface. So everyone can be the "Data-Scientist".
2. Cross-platform
3. Capability of containerization, eg. docker

#### frameworks
- scikit-learn: NumPy and SciPy
- tensorFlow: DL in python
- PyTorch: scale scikit to DL
- Keras: APIs run top of others
- `https://docs.microsoft.com/en-us/python/api/overview/azure/ml/intro`

![alt text](image-3.png)

### Understanding ONNX
- ONNX, Open Neural Network Exchange

It plays as an adaptor/convertor to integrate models built by different frameworks.

![alt text](image-4.png)

### Azure Cognitive Services: Decision and Language


#### The first category service of Cognitive Services: Decision Services

- Apply a decision matrix to user interaction that can **handle different situiations.**
- Content Moderator: filtering offensive or inappropriate content
- Personalizer: user-specific recognition, response corresponding to differnt user.

#### Second category: Language Services
- Language understanding(LUIS): Enable apps to understand what people say.
- QnA Maker: Conversational Interactivity from backedn data
- Text Analytics: Detect **sentiment** and key phrase in text, social media message to analyze positive or negative
- Translator, multi-language supports

#### Speech services
- Cotana, speak to bot, bot speak back.

#### Vision services
- Visual inputs

#### Search services
- Typing suggestion
- **Entity Search**, Need more investigation
- Spell check
![alt text](image-5.png)
# 2: Analyzing Metrics
## Big Picture: What is Site Reliability Engineering (SRE)
Q: What Is Reliability?

A: The application can be used when and how it is expected to

- Availability
- Performance
- Latency
- Security

Difference between SRE and Developers:

|SRE|Developers|
|-|-|
|Focus on feedback and observing on the production side|Focus on errors and observing on the code(development stage) side|
|Need to embrace risk to improve performance|Need to avoid errors as much as possible|

## Exploring Metric Charts and Dashboards

### Azure Monitor
a central location to gather information from your application, infrastructure, and Azure resources

|Metrics|Logs|
|-|-|
|Data that measure how the system is performing at a certain time|Messages about certain events in a system|

### Monitor Metrics
- Visualize metrics in dashboard
- Analyze
- Alert, inform you when threshold is met
- Automation

Go to `portal.azure.com`, Monitor and Metrics.

## Implementing Application Health Checks

### Application Insights, a feature in monitor 

#### URL Ping Test
a feature that is able to send http request to a specific URL to test availability.

it will tell you the request duration and success rate.

#### Dependent Request
Test availability of images, sripts, or style files

What else you can do:
- Enable retrys
- Test frequency
- Configure test locations(where to send test requests)
- Create alerts

### Demo
Monitor => Insights => Applications => Investigate => Availability => Add test

## Exploring System Load and Failure Conditions

### What is Failure Mode Analysis?


- Fault point: place in the architecture that can fail
- Fault mode: pattern of that failure

- Assess Rate Risk and Severity: is there data loss?

- Determine response: what should be done for such failure?

### How to Plan for Failure
- Understand how the application works
- Criticality of this application
- Is there dependency of this application

### How can we reduce failure
- Fault domain (different rack)
- Zones (different availability zones)
- Cross-region 
- Scaling on the instances

### Performance Testing
1. Load Testing, normal/heavy load
2. Stress Testing, overload system
3. Spikes

## Discovering Application Insights Smart Detection and Dynamic Thresholds

Q: Why we use this feature?

A: Because as the time flows, the defined baseline metrics might updates too.

- Dynamic Thresholds, use ML to decide how to update the baseline metrics

- Application Insights Smart Detection, use ML to detect anomalies.

Smart Detection Categories:
- Failure, send alert real time, after meets min data amount and 24 hours
- Performance, send alert everyday, after meets min data and 8 days

## Deciding Which Dependencies to Set Alerts On

Application Insights => Application Map

# 3 Designing and Implementing a Source Control Strategy

## Submodules

Importing a external git repo as submodule, the key file is `.gitmodules`. You will not have the actual code of that submoduled repo until you `git submodule add` and `git submodule init` `git submodule update`

## Discovering Scalar
- Scalar, help to maintain a large git repo, when it becomes so big.
  - reduce data transfer
  - Reduce command runtime

Use:
  - `scalar clone` to create a repo
  - `scalar register` to register a existing repo

##
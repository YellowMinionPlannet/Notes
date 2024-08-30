# Big Picture: What is Site Reliability Engineering (SRE)
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

# Exploring Metric Charts and Dashboards

## Azure Monitor
a central location to gather information from your application, infrastructure, and Azure resources

|Metrics|Logs|
|-|-|
|Data that measure how the system is performing at a certain time|Messages about certain events in a system|

## Monitor Metrics
- Visualize metrics in dashboard
- Analyze
- Alert, inform you when threshold is met
- Automation

Go to `portal.azure.com`, Monitor and Metrics.

# Implementing Application Health Checks

## Application Insights, a feature in monitor 

### URL Ping Test
a feature that is able to send http request to a specific URL to test availability.

it will tell you the request duration and success rate.

### Dependent Request
Test availability of images, sripts, or style files

What else you can do:
- Enable retrys
- Test frequency
- Configure test locations(where to send test requests)
- Create alerts

## Demo
Monitor => Insights => Applications => Investigate => Availability => Add test
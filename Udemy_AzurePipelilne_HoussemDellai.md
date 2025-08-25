In azure pipeline, we can do different kind of tasks, all these tasks' source code is in [GitHub](https://github.com/microsoft/azure-pipelines-tasks).

For example, for dotnetcli, we can get into `DotNetCoreCLIV2/dotnetcore.ts` to check the implementation.

# Section 2: Azure DevOps architecture
Azure DevOps is a SaaS provided by Azure, and it contains mainly two parts:
1.  The front end and backend and database, which compose the whole webpage application
2.  the build agents

For the agents, they are just build pipelines running in VMs. These agents can be run in Linux, Windows, or MacOS. There are 2 types of agents:
1. Micosoft hosted agents:
    They are hosted on Azure, just like Azure DevOps SaaS, you can have 1800 mins of free usage build time. And the agents are scalable and managed by Microsoft, and also the VMs which are environment these agents running on are also managed by Microsoft
2. Self hosted agents:
    You can make these agents run on your own VM which could be located at your own private networks.
    - build agents can also run in container

Azure DevOps can also run on Azure DevOps Server, which can be hosted on your own premise server.


# Section 3: YAML Pipelines: Stages, Jobs and Steps
- Job: contains multiple tasks
- Stage: contains multiple jobs
[Full Version of Offical Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops)


# Readings, [Official Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops)
## Pipeline basics
### Key concepts

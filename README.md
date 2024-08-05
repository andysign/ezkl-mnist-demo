<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ZKML MNIST Local Demo](#zkml-mnist-local-demo)
  - [ZKML MNIST Local Demo: Overview](#zkml-mnist-local-demo-overview)
  - [ZKML MNIST Local Demo: About The Underlying ZK Lib](#zkml-mnist-local-demo-about-the-underlying-zk-lib)
  - [ZKML MNIST Local Demo: Software and Libraries Requirements](#zkml-mnist-local-demo-software-and-libraries-requirements)
  - [ZKML MNIST Local Demo: Detailing the Full-Stack Setup](#zkml-mnist-local-demo-detailing-the-full-stack-setup)
  - [ZKML MNIST Local Demo: How To Start The Demo](#zkml-mnist-local-demo-how-to-start-the-demo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ZKML MNIST Local Demo

## ZKML MNIST Local Demo: Overview

This project aims to demonstrate how a particular technology that falls under the umbrella term of **Verifiable Compute** works, particularly **Verifiable ML** is the technology this project is focusing on, this concept is also known as **Zero-Knowledge Machine Learning** (abbreviated **ZKML**) — ZKML refers to the creation of **[zero-knowledge proof](https://en.wikipedia.org/wiki/Zero-knowledge_proof)** for the inference step of **ML** models, allowing the _**prover**_ to demonstrate to the _**verifier**_ the correctness of the computations, in this case an AI computation, without revealing any additional information.

It is essentially a project that contains: a full-stack **MNIST** digit recognition app that produces **Zero-Knowledge Proofs** (**ZKP**s) with the ability to also verify them, and it includes two services for training the ML model ( fund in a separate repository, namely **[ezkl-mnist-modeller](https://github.com/CDECatapult/ezkl-mnist-modeller)** ), a local initiator/prover/verifier service, as well as two front-ends (for two fictitious actors, such as a potential AI company specialised ML inference plus proof of inference, plus the client of said company).

Moreover, this project makes intensive use of EZKL, a tool for **ML** and **ZK** cryptography developed by **[Zkonduit](https://github.com/zkonduit)**. It is heavily inspired by the **[EZKL MNIST](https://obvious-fireplant-451.notion.site/MNIST-Tutorial-3d6c49b5dd234a22856afa2e785ca241)** tutorial made by the same group of developers. The main difference is that this codebase is more flexible: on-chain proof verification has been removed, the **[Lilith ZKML](https://docs.ezkl.xyz/#proving-backend-lilith)** proving cluster (also known as **Archon**) has been stripped out, and the **NextJs** interface contains additional steps to better illustrate what's happening under the hood.

---

## ZKML MNIST Local Demo: About The Underlying ZK Lib

**[EZKL](https://ezkl.xyz/)** (pronounced _Easy KL_) is the underlying library (aka toolkit) that chosen as the base layer for this project, as it seems to be fairly mature and well **[documented](https://docs.ezkl.xyz/)**. **EZKL** helps prove the authenticity of **AI** / **ML** models; it does that by generating a **[zero-knowledge proof](https://xthemadgenius.medium.com/9b7f6ef1c708)** that a model produced certain results, without having to reveal private data or the model itself.

---

## ZKML MNIST Local Demo: Software and Libraries Requirements

<!--

When it comes to the hardware and OS required, it is important to state that this demo requires a **MacBook Pro** ( with **M1** or **M2** cpu ) and it also runs on **MacOs** ( **Sonoma 14.5** ) as no other machines / operating systems have been tested.

In terms of software requirements, **Docker** version **25.0.2** or higher would be highly recommended to have ( **`brew cask install docker`** ).

Also, obviously, **DockerCompose** should also be present, as in, it is highly recommended to have compose version v2.24.3-desktop.1 or higher ( **`sudo -s`** followed by **`curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`** ).

**For running the project without virtualisation, the requirements are**:

An extra small dependency is required, called **JQ**, the widely-used command-line JSON parser, ideally v1.7.1 or higher ( just use **`brew install jq`** to install it ).

As we are talking about A.I. models, virtually everything apart from the front-end is written in Python therefor, what's needed is ideally **Python** version **3.10.14** or higher together with **PIP** version **24.1** or higher.

Since, the front-end is written in NextJs, what's needed for the front-end is ideally **NodeJs** version **v20.15.0** or higher with **NPM** version **10.7.0** or higher ( **`brew install node`** ).

Note that running _outside_ Docker is **OPTIONAL** and this way of running the the services, especially the Python service is recommended for when and increase performance is needed (one should see more or less a 2x performance increase).

-->

The requirements in terms of hardware and OS are:

* **MacBook Pro** with **M1** or **M2** cpu ( no other machines have been used for testing )
* **MacOs** updated to **Sonoma 14.5** or higher ( as no other operating systems have been used for testing )

The software requirements are:

* **Docker**: version 25.0.2 or higher ( **`brew cask install docker`** )
* **Docker Compose**: version v2.24.3-desktop.1 or higher ( **`sudo -s` followed by `curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`** )

The requirements for running **without virtualisation** are:

* **JQ**: version 1.7.1 or higher ( **`brew install jq`** )
* **Python**: version 3.10.14 or higher ( **`brew install python@3.10`** )
	+ **PIP**: version 24.1 or higher
* **NodeJs**: version v20.15.0 or higher ( **`brew install node`** )
	+ **NPM**: version 10.7.0 or higher

Note: Running _outside_ Docker is **optional**, therefore a minimum dependency list is required, however the recommended way of running for when and increase performance is needed is without docker, at least for the Python layer (up to **2x** performance increase).

---

## ZKML MNIST Local Demo: Detailing the Full-Stack Setup

This codebase is made out the backend (which is the API build around EZKL library) and the frontend (which is build out of two GUIs). Those stack elements, by default, have the ability to run independently, that is, without the need of the other repository (ezkl-mnist-modeller).

The API and the two GUIs that constitute the application are containerised using **Docker** and orchestrated using **Docker Compose** in an over-arching YAML file (**`docker-compose.yaml`**). This is highlighted in the table below:

| Service        	| Description                                                                                                                                                             	| Port   	| Link                                        	|
|----------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|--------	|---------------------------------------------	|
| `zk-initiator` 	| A FastAPI wrapper around EZKL that trough its end-points allows the initialisation of a ZK setup, allows for the creation of ZK proof and also the verification of them 	| `8001` 	| **[localhost:8001](http://localhost:8001)** 	|
| `zk-client`    	| Provides the NextJs GUI for the clients, as in the party that is doing the inference and depends on others for computing results / proofs.                              	| `3000` 	| **[localhost:3000](http://localhost:3000)** 	|
| `zk-company`   	| Provides the NextJs GUI for the company, as in the party computing the inference, aka witness and the proof.                                                            	| `3001` 	| **[localhost:3001](http://localhost:3001)** 	|

---

## ZKML MNIST Local Demo: How To Start The Demo

To start the demo, follow these steps:

```sh
docker-compose up -d
```

Note that you can add a service name at the end of the above ( **`docker-compose up -d zk-initiator`**, **`docker-compose up -d zk-client`**, **`docker-compose up -d zk-company`** ), otherwise you will be spinning up all services. Also, this doesn't include building / re-building the images therefore, to do that use: **`docker-compose up --build -d`**.

To monitor the logs of the application, run: **`docker-compose logs zk-initiator zk-client zk-company --tail 10`**.

This command will show you the last 10 lines of the logs for each service. You can adjust the **`--tail`** parameter accordingly or even add it to watch with: **`watch -ct docker-compose logs zk-initiator zk-client zk-company --tail 10`**.

Last, but not least, to stop and remove all containers, run **`docker-compose down --remove-orphans -v`** or in order to jump inside one of the containers, use: **`docker exec -it zk-initiator sh`** OR **`docker exec -it zk-company sh`** OR **`docker exec -it zk-client sh`**.

---

## ZKML MNIST Local Demo: System Architecture Diagram

To get a good understanding at first glance, as much as possible, please see the high-level diagram.

The advanced demo of the EZKL zk-ml library which includes the _modeller_, the _initialisation_ or _initiator_, the  _prover_ and, last but not least, the  _verifier_.

Diagram:

```
┌───────────────────────────────────────┐    ┌──────────────┐
│                                       │    │              │
│ Modeller  (zk-modeller)  Port_8888    │ ─► │ Shared       │
│                                       │    │              │
│ ┌───────────────────────────────────┐ │ ◄─ │ folder /     │
│ │                                   │ │    │              │
│ │ JupyterNotebook                   │ │    │ volume       │
│ │                                   │ │    │              │
│ │                                   │ │    │ hostMachine  │
│ │                                   │ │    │              │
│ │                                   │ │    │ ./data-ml/   │
│ │                                   │ │    │              │
│ │                                   │ │    │              │
│ │                                   │ │    │              │
│ └───────────────────────────────────┘ │    │              │
│                                       │    │              │
└───────────────────────────────────────┘    └──────────────┘

 │  ▲
 │  │
 ▼  │

┌───────────────────────────────────────┐    ┌──────────────┐
│                                       │    │              │
│ Initiator                             │ ─► │ Shared       │
│                                       │    │              │
│ EZKL Cli or Py Lib                    │ ◄─ │ folder /     │
│                                       │    │              │
│                                       │    │ volume       │
│                                       │    │              │
│                                       │    │              │
│                                       │    │              │
│                                       │    │              │
│                                       │    │              │
│                                       │    │              │
│                                       │    │              │
└───────────────────────────────────────┘    └──────────────┘

 │  ▲
 │  │
 ▼  │

┌───────────────────────────────────────┐    ┌──────────────┐    ┌──────────────────────────────┐
│                                       │    │              │    │                              │
│ Prover                                │ ─► │ Shared       │ ─► │ UI                           │
│                                       │    │              │    │                              │
│ EZKL Cli or Py Lib                    │ ◄─ │ folder /     │ ◄─ │ Nginx OR ExpressJS           │
│                                       │    │              │    │                              │
│                                       │    │ volume       │    │ Serving React / Static HTML  │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
└───────────────────────────────────────┘    └──────────────┘    │                              │
                                                                 │                              │
 │  ▲                  │                                ◄─────   │                              │
 │  │                  └───────►    ┌──────────►                 │                              │
 ▼  │                               │                   ◄─────   │                              │
                                                                 │                              │
┌───────────────────────────────────────┐    ┌──────────────┐    │                              │
│                                       │    │              │    │                              │
│ Verifier                              │ ─► │ Shared       │ ─► │                              │
│                                       │    │              │    │                              │
│ EZKL Cli or Py Lib                    │ ◄─ │ folder /     │ ◄─ │                              │
│                                       │    │              │    │                              │
│                                       │    │ volume       │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
│                                       │    │              │    │                              │
└───────────────────────────────────────┘    └──────────────┘    └──────────────────────────────┘
```

Folder Structure

```
├── data-ml/
├── data-ml-zk-init/
├── data-ml-zk-prover/
├── data-ml-zk-verifier/
├── src/
└── README.md
```

---

Added System Arch Diagram.

This has been made using.

**[https://asciiflow.com/](https://asciiflow.com/)**

If needed this could be made into a simple SVG diagram with Figma.

---

---

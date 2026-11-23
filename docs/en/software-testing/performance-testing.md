# What is performance testing?

> Published November 23, 2026 | Updated November 23, 2026
>
> By [IBM Think](https://www.ibm.com/cn-zh/think/topics/performance-testing)

![performance-testing](/images/software-testing/performance-testing.avif)

## Definition of performance testing

Performance testing evaluates the performance of a system or application by applying loads of varying magnitude.

Key criteria include speed (how fast the system runs), stability (its ability to run without crashing), scalability (its capacity to handle smoothly increasing load), and responsiveness (how quickly it reacts to user commands).

Software performance underpins everyday computer use, and performance defects can undo every effort a company makes to improve the user experience. If developers supervise performance testing inadequately, or test too infrequently, they introduce performance bottlenecks. The system then struggles to handle the expected load even during ordinary traffic periods—and the problem becomes far more severe when sudden peaks add extra demand.

Such challenges can jeopardize every public-facing operation a company runs. Building a durable reputation for quality usually takes a long time. Yet that reputation can suffer quickly and permanently once the public begins to question whether a system or application operates reliably. End-user patience is becoming an increasingly scarce resource. So by the time performance problems take center stage, a company's reputation is often already at stake and the stakes are high.

## Six steps of performance testing

Let's start by defining the method used in most performance testing scenarios. Six multipart steps define a typical performance testing process.

### 1. Define performance criteria and requirements

The first step is to set useful parameters, such as outlining the application's performance goals.

Then establish acceptable performance criteria—response time, throughput, resource utilization, and error rates, for example.

This is also the stage where people identify key performance indicators (KPIs) to support performance requirements and business priorities.

### 2. Design and plan the tests

Not every test suits every scenario. Developers or other testers must clarify the analytical goal of the test.

First, they scope the primary use cases and design test cases that reflect real user interaction. The next step is to specify the test data and workload that will be used during testing.

With those variables locked down, testers choose performance testing tools, test scripts, and techniques. This step includes setting up quality gates—thresholds that control admission to later production stages based on code quality.

Performance testing also checks bandwidth capacity, confirming that data transfer rates are sufficient to handle workload traffic.

### 3. Establish the test environment

Before the performance testing process formally begins, one last step is required. Testers build a test environment that accurately simulates the system's real production environment, then confirm that the application under test (AUT) has been deployed in it.

Final preparations include integrating monitoring tools to capture the performance metrics the system generates during testing.

### 4. Execute the tests

Now that test parameters are clearly defined, it's time to execute. Testers or an automated testing process run the selected test scenarios together with the performance testing tools.

Testers usually monitor system performance in real time to understand throughput, response time, and resource usage. Throughout the test, they watch for performance bottlenecks or other performance-related anomalies as reflected in the test metrics.

### 5. Study the results

Next, testers evaluate the performance data collected during testing. They study the data carefully and look for areas of performance that need improvement.

Testers then compare those results against the performance baselines established in the first step. This comparison shows where results deviate from expected performance and where bottlenecks are likely to appear.

### 6. Optimize, test, repeat

After analysis of the test data reveals performance issues, developers update the system in code. They use code optimization, resource upgrades, or configuration changes to mitigate those issues.

Once changes are in place, developers repeat the software testing sequence to confirm the changes were applied successfully, iterating until performance results match the defined baselines.

## Who benefits from performance testing?

Performance testing probes deep "under the hood" of a system to check output effectiveness, which is why software development teams are the most frequent users of this method. The first group of beneficiaries includes professionals directly involved in the development process: developers, quality assurance (QA) engineers, and DevOps teams. Each party gets what it needs from performance testing:

- **Developers** use performance testing to find performance issues early in the software development lifecycle (SDLC), so they can prioritize development changes and implement them more effectively.

- **QA teams** rely on performance testing to assess whether an application's speed, functional stability, and scalability meet the bar under different loads.

- **DevOps** staff can combine performance testing with continuous integration and continuous delivery (CI/CD) pipelines to automatically verify that each change a developer makes does not degrade system behavior.

The next group are not developers, but they still work close to the foundation, where managing system components is a major part of the job:

- **Project managers** use performance testing to assess risk and measure the potential system impact of changes.

- **Chief technology officers (CTOs)** or employees with similar responsibilities need performance testing to help them work out how to translate changing requirements into long-term growth.

- **Company owners** work to protect revenue streams. Performance testing confirms that load times are fast enough and that unresponsive customer service will not disrupt revenue flow.

But it isn't only company management that runs performance tests. Many organizations and businesses use performance testing across companies of all sizes and for a variety of purposes:

- **Large enterprises** that frequently experience high-traffic cycles rely on performance testing to confirm their applications can handle heavy workloads. This method matters most to businesses that depend heavily on large online user platforms.

- **Small businesses (and startups)** should build performance testing into their growth planning. It warns them about future bottlenecks that could hold back their success.

- **Companies of any size** preparing to release a new application would be wise to use performance testing to predict problems in real operating scenarios. The same applies to companies making significant IT system changes.

- **Financial institutions** carry enormous responsibility and face strict industry regulation. They typically use performance testing to help maintain baseline standards, especially during periods of high transaction volume.

## Types of performance testing

Developers use different types of performance testing to obtain specific data that supports a specific testing strategy. These are the main types.

### Load testing

Load testing shows how a system performs under the expected load. Its goal is to reveal how the system behaves under normal conditions, with regular workloads and average numbers of concurrent users.

**Example:** for an e-commerce site, testers simulate site users completing steps such as browsing products, adding items to a cart, and paying for a purchase.

### Scalability testing

Load testing shows whether a system can support regular load conditions. Scalability puts the system under stress by increasing the volume of data or the user load it must handle, showing whether it can keep serving as it scales up.

**Example:** in vertical scaling, developers might add CPU and memory to a database server so it can accept a larger volume of data queries.

### Stress testing

Stress testing resembles the crush-depth tests a submarine crew performs. By pushing the system to its known operating limits—and beyond them—it precisely measures the maximum the system can bear before reaching its breaking point.

**Example:** failover testing is an extreme form of stress testing. Its goal is to test how long a system takes to resume operation by simulating a component failure.

### Spike testing

This type targets sudden, sharp surges in user traffic or data transfer volume. The system must absorb the spike while maintaining normal operation.

**Example:** a company operating a website must prepare not only for outages but also for the surge of users trying to reach the site simultaneously once it comes back online. It must also assess whether the system can handle the sudden increase in demand. Spike testing measures how smoothly that goes.

### Capacity testing

Performance testing usually focuses on user traffic, while capacity testing focuses on the system's ability to handle massive volumes of data. Can it process the data completely and store it without loss?

**Example:** healthcare organizations must maintain enormous amounts of patient information, and the law requires them to retrieve patient records and related medical data at any time. A continuous influx of data can overload the system. Capacity testing verifies whether it can sustain incremental data intake over time.

### Endurance testing

Think of it as long-haul performance testing. Endurance testing (also called soak testing) aims to catch hidden problems such as data corruption and memory leaks that appear after prolonged operation.

**Example:** social media platforms run around the clock, and sustained use can create problems for platform stability, data storage, and user accounts. Endurance testing shows you how the platform is operating today and gives you indicators for future performance.

## Widely used performance testing tools

Developers and testers can choose from a wide range of performance testing tools. These are the two most popular:

- **JMeter**: developed by Apache, JMeter is a widely used open-source performance testing tool. It generates virtual users through thread groups to simulate real traffic scenarios, including user overload. These extreme scenarios are defined as studies of the system under test (SUT). JMeter reports key metrics: response time, which measures how fast the SUT responds; error rate, which records the proportion of failed requests; and throughput, the number of requests the SUT can handle in a given period.

- **LoadRunner**: like JMeter, LoadRunner can create massive numbers of virtual users. It then generates simulated activity for those users—such as message passing between components or user interface interaction—and stores those interactions in test scripts. LoadRunner reportedly reached more than 2,600 enterprises using Micro Focus LoadRunner for performance testing and quality assurance by 2025.

- **RoadRunner**: "PHP" once stood for "personal home page" and later became "hypertext preprocessor." It now refers to a server-side scripting language, meaning developers execute code on the server rather than in the client web browser. The open-source RoadRunner (not to be confused with the similarly pronounced LoadRunner) can serve as a PHP application server and process manager. It eliminates the need for startup load time and limits latency, simplifying application performance. RoadRunner provides a dynamic analysis framework for Java programs running concurrently, along with an application programming interface (API) for evaluating event streams.

## How AI is affecting performance testing

As with nearly everything related to computing, artificial intelligence (AI) is now pushing the efficiency of software testing to entirely new levels, making the overall performance testing process faster, more accurate, and easier to automate.

Specifically, AI can adopt shorter test cycles, reducing the time needed to run tests. With its extremely fine precision, it notices subtler performance variations that human testers cannot perceive. Through predictive analysis, AI can evaluate operating trends and historical data to forecast when and where bottlenecks are likely to appear next—and it can use that prediction to adjust test parameters.

But by far the most important thing AI has done for performance testing is help it at scale by enabling automation. The notable feature of this automation is that it can run the entire performance testing process—the whole thing.

AI can not only automate test execution but also write the test scripts used for execution. It can interpret results in the background and provide guidance for remediating problematic situations.

One of the most interesting and promising effects of AI on performance testing is the growing adoption of human-AI collaboration. This arrangement recognizes that human instinct and knowledge still have an important role to play. In some situations, following human impulse remains the highest guiding principle.

Some experts are convinced that future performance testing depends on this hybrid approach, which combines computer thinking and processing power with the human sense of context and nuance.

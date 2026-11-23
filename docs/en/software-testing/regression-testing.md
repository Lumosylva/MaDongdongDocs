# What is regression testing?

> Published November 23, 2026 | Updated November 23, 2026
>
> By [IBM Think](https://www.ibm.com/think/topics/regression-testing)

![regression-testing](/images/software-testing/regression-testing.avif)

## Definition of regression testing

Regression testing is a software testing strategy used to confirm that code modifications do not damage existing functionality or introduce new errors.

It is usually carried out after a bug fix, rerunning tests to make sure functionality still works as expected once new code has been added.

Part of what makes regression testing distinctive is that it can freely span every stage of software development testing. You can perform it whenever you want, or need, to step back and confirm that newly introduced code does not harm overall functionality or the efficiency of a workflow.

## Who should use regression testing?

Any organization that continuously updates code needs a regression testing approach. Code updates are so pervasive that no accurate total can be compiled.

Yet thanks to technologies such as artificial intelligence (AI) and continuous integration/continuous delivery (CI/CD) pipelines, many businesses are raising the frequency of code changes—and some update daily. That means demand for regression testing keeps accumulating.

One key area where regression testing takes center stage is quality assurance (QA) work. The missions of regression testing and QA teams are very similar: optimize the user experience and deliver high-quality data and the safest possible software.

The only difference lies in how much each approach focuses on the whole picture. Regression testing uses a more precise scope, concentrating on the changes made most recently, while QA assesses the entire system and how it operates.

## Eight steps of regression testing

The role of regression testing techniques is to prevent code changes from being incompatible with the hosting system. Taking such measures matters a great deal for keeping the system optimized.

Regression testing usually follows this sequence of steps, or a similar one:

1. **Introduce the code change**: add new code to the source, modify existing code, or optimize current functionality.
2. **Assess potential impact**: analyze the application and identify the areas that the change may affect.
3. **Select test cases**: DevOps teams select test cases from the regression test suite, paying particular attention to those covering critical functionality. They can include unit tests (for individual modules), functional tests (to verify operation), or integration tests (to ensure components work together).
4. **Prioritize the test cases**: when multiple test cases are selected, the team prioritizes them, organizing them by importance and potential impact.
5. **Run the test cases**: execute tests manually or with automated regression testing tools. Whichever method is used—manual or automated—it relies on test scripts, the structured templates that guide testers.
6. **Report and analyze the results**: review test results and the supporting data. If defects or failures appear, notify the development team immediately.
7. **Fix and retest**: developers make the necessary fixes in the existing test cases and retest the previously flagged issues to confirm the solution.
8. **Repeat as needed**: keep the regression testing loop running to ensure the web application behaves as expected.

## Types of regression testing

For a seemingly simple topic, there is a large number of regression testing techniques available, and each method offers its own distinct perspective.

### Unit regression testing

As the name suggests, this form focuses on system components or modules—the "units"—checking whether an error was introduced within a single unit.

**Example:** when a developer adds a "forgot password" feature to a website, unit regression testing verifies that the existing login mechanism still works after the new feature is added.

### Partial regression testing

When the goal is to find out whether recent changes affect only a subset of the updated system, partial regression testing identifies that subset and performs the appropriate diagnostics.

**Example:** suppose a website is integrating a new payment gateway. Partial regression testing might evaluate only the local behavior of the new feature, without testing loosely related functionality.

### Complete regression testing

In some cases—after a major code change, for example—more comprehensive testing is required. Complete regression testing retests the entire system or application to ensure continued functional integrity.

**Example:** after website developers decide to add a featured products gallery, the company must run complete regression testing across the new gallery feature and all existing test cases.

### Selective regression testing

Selective regression testing introduces a predictive element. Testers use experience to judge which areas a code change is likely to affect, then select test cases from the suite accordingly.

**Example:** when mobile application developers find they need to integrate and update parts of the user interface, they can use selective regression testing to keep the interface stable.

### Progressive regression testing

Hybrid testing takes a comprehensive approach, evaluating new and existing functionality together. Progressive regression testing detects defects introduced by new features one item at a time.

**Example:** before releasing a new update to an existing software product, companies typically run progressive regression testing to ensure the newest version stays consistent with the previous versions in the series.

### Corrective regression testing

Corrective regression testing centers on data consistency. It reruns test cases to verify that results stay consistent, and it is usually performed when the codebase has not changed.

**Example:** what gets added to software is not always a new feature. Sometimes a modification is introduced to refine the code so it runs better. Corrective regression testing applies to code refactoring, ensuring the refactor does not introduce errors.

### Retest-all regression testing

Retest-all regression testing is considered testing after the final stage. It involves the development team testing every regression test case that has already passed, to ensure the parts interact correctly.

**Example:** retest-all regression testing is typically used to check changes that accompany major shifts in software architecture—for instance, a financial application adopting a new framework, which implies significant operational change.

### Automated regression testing

The test types above can take a long time, so automated testing tools are often used to speed things up. Even with large systems, test execution can become significantly faster.

**Example:** after a backend update, automated regression testing can verify that application programming interface (API) endpoints continue to return correct data and responses, confirming overall health.

### Manual regression testing

Some test scenarios require human understanding, which is where manual regression testing comes in. It is well known to take longer, because human testing carries a particular sensitivity when it comes to conveying what the work involves.

**Example:** websites need to remain attractive and consistent across platforms. Manual regression testing can verify a site's responsiveness after layout adjustments.

### Selenium regression testing

This form of regression testing takes advantage of the open-source Selenium web automation framework. Selenium regression testing strengthens software stability by detecting regressions early and ensuring new changes do not break existing code. It is especially useful when code changes continuously, as in continuous integration.

**Example:** an airline reservation system adds a feature that supports debit card payments in addition to the credit card payments it previously supported. Selenium can verify that the credit card payment flow still works as expected.

### Non-functional regression testing

Software quality must be evaluated against multiple variables beyond the software development lifecycle (SDLC). Non-functional regression testing aims to verify that software is highly secure and supports a good user experience.

**Example:** a website developer adds a new feature and then wants to determine how it affects operating speed. Non-functional regression testing checks load time. If load time increased, that indicates a regression.

## What techniques does regression testing use?

Another key value of regression testing is that it can combine with other testing approaches to produce effects greater than the sum of their parts. Here are a few examples:

- **Exploratory testing**: exploratory testing can be combined with regression testing to produce richer analysis. The two work differently—regression testing verifies expected system behavior through scripted tests, while exploratory testing discovers unexpected problems through unscripted exploration. Even so, the two approaches complement each other and can validate one another. Some companies fuse them into "exploratory regression testing," which gives developers both direction and flexibility. Exploratory testing also helps improve existing test cases or create new ones, broadening overall coverage.

- **Continuous testing**: regression testing is often used alongside continuous testing. As the name suggests, continuous testing requires test practices to be integrated throughout the SDLC, and it is an established part of regression testing. Without continuous testing, regression testing cannot truly deliver the value it was designed for. Combining the two produces "continuous regression," which lets testers focus more freely on high-priority test environments where defects are likely.

- **End-to-end testing**: another technique that pairs well with regression testing is end-to-end testing, which validates a system's complete workflow by simulating real user scenarios. E2E testing focuses on the user experience and on components such as interfaces, backends, and related databases. Regression testing and E2E are highly complementary—regression testing can include complete E2E test cases, while E2E testing surfaces issues that regression testing then fixes.

## Regression testing and AI

The breadth of AI's impact is striking. The technology industry invests in AI far more than other sectors do, and regression testing is one of the processes AI has revolutionized in terms of speed.

"Accelerate" is the right word, because the main way AI enhances regression testing is by maximizing the speed at which conclusions of all kinds can be reached. AI is also improving the accuracy of test data, however.

Specifically, AI uses its algorithms to build relevant test cases by analyzing historical test data, user behavior, and code changes. This helps prioritize tests according to predicted impact. When AI runs those tests, they run faster and produce results sooner.

AI even improves the essence and quality of regression testing through defect detection methods and self-healing tests, keeping automated testing effective even in continuous development environments. Ultimately, AI improves regression testing by optimizing decisions and automating tasks, which lowers costs and speeds time to market.

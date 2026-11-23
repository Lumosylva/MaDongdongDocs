# What is functional testing?

> Published November 23, 2026 | Updated November 23, 2026
>
> By [IBM Think](https://www.ibm.com/cn-zh/think/topics/functional-testing)

![functional-testing](/images/software-testing/functional-testing.webp)

## Functional testing defined

Functional testing is a type of software testing that validates whether an application's features behave as expected against the specified requirements.

There are many types of software testing within the software development process, and each method approaches the product from a slightly different angle. Functional testing sits closest to the user experience: its core question is whether the software's features actually work as intended and as specified.

As part of the software development lifecycle, software quality is typically assessed across multiple dimensions. In functional testing, testers verify the underlying capabilities and confirm that the features effectively support business requirements. The execution this involves lets development and operations teams compare actual test results against expected results.

Testing is an essential part of the development process, and functional testing lets quality assurance teams validate quality before the fact, giving them a clear picture of how a workflow may behave when it goes live.

## How does functional testing work?

Focus shifts depending on the testing types chosen within an overall strategy. Functional testing assesses overall compatibility between software modules, which directly affects related concerns such as intended user interaction and the feasibility of the user interface.

The test environment that functional testing provides is a form of black-box testing: testers cannot peer into internal operation the way white-box testing allows, but instead receive a pass/fail report that indicates whether the system and its pipeline behave as expected.

### Six steps of functional testing

Functional testing usually follows a six-step workflow:

1. Identify the functions the software must perform.
2. Create input data based on the functional requirements.
3. Determine expected output from the functional specification.
4. Execute the test cases.
5. Evaluate how closely the actual output matches the expected output.
6. Decide whether the application performs correctly against the requirements.

## Types of functional testing

Just as there are many software testing models, functional testing comes in different categories. The list is long, and only some are covered here; these types span a broad set of niches, listed alphabetically below.

### Ad hoc testing

Testers often perform ad hoc testing after the formal testing process. This informal exploratory testing is guided entirely by the tester's skill and intuition. It has no fixed structure and relies on instinct to drive the technique used.

**Example:** "buddy testing" — a developer and a tester work together to improve a module or application. In this kind of ad hoc testing, the tester typically identifies defects awaiting fixes, while the developer focuses on implementing them.

### API testing

Application programming interfaces (APIs) underpin software development and connect different applications or systems. API testing ensures interface connection points behave as needed, and it also monitors user permissions and the way data is managed through APIs.

**For example:** "headless testing" suits cases that have no user interface or UI input fields. Sharing input data with the interface service or application often yields the best detection through API testing.

### Complex test scenarios

Many organizations want their testing to mirror the real user experience. For those businesses, complex test scenarios provide the required precision—though greater complexity demands more upfront work to execute.

**For example:** online order processing looks seamless, but behind it lies a long chain of flows to test—whether items drop into the cart easily, whether discount logic integrates quickly, and whether checkout runs without friction.

### Integration testing

Integration testing is often run alongside unit testing, which yields earlier defect detection and broader test coverage. Beyond confirming that data formats match, integration testing reveals how microservices operate and perform.

**For example:** if an order management system integrates with a payment processor, integration testing can predict failure points between the two entities and give developers a low-cost blueprint for fixing integration issues early.

### Regression testing

Ideally, once functional tests pass they keep passing. Reality differs: in software development, new code changes can inadvertently introduce errors. Regression testing keeps the system at a stable baseline.

**For example:** any code change triggers some form of regression testing, covering related updates such as post-fix adjustments, the introduction of new features, or verification after a software upgrade.

### Sanity testing

Sanity testing is a quick, agile check that verifies existing functionality was not affected by a relatively small change or defect fix. It often serves as fast confirmation that new features don't disrupt other parts of the system.

**For example:** like regression testing, sanity testing lets you "roll back" the system to a previous state to verify improvements, confirm basic operations, and ensure the system behaves as expected. Any code change triggers some form of regression testing, covering related updates such as post-fix adjustments, new features, or verification after upgrades.

### Smoke testing

As the saying goes, "where there's smoke, there's fire." That proverb seems to have inspired the name. Smoke testing is performed early in development to assess end-to-end functional integrity. If it fails, the quality assurance team makes the necessary corrections immediately.

**For example:** smoke testing can validate continuous integration and continuous delivery pipelines as the final gate before deploying a new build (or a major code change).

### System testing

System testing (sometimes called end-to-end testing) evaluates how components of the whole software system work together. It usually involves analyzing multiple independent software systems that may operate together, or independently, within a given product.

**For example:** end-to-end scenarios let testers assess a complete workflow. For an online retailer, that means the entire consumer experience from the initial purchase order through fulfillment.

## Functional versus non-functional testing

As the name suggests, non-functional testing evaluates application behaviors that usually don't directly affect whether features run. Yet an organized, pleasant user experience is now considered an essential part of software development. Non-functional testing can surface latent system issues—especially when software has to scale.

### Load testing

Load testing is a key form of non-functional testing. In theory, a system handling thousands of requests should respond as efficiently as it does for a single request. Real-world experience often contradicts that. Load testing verifies whether a system can withstand peak load and even extreme surges.

### Performance testing

Another non-functional category focuses specifically on performance. Whether a system responds smoothly and quickly is critical to good performance. Performance test plans measure how long users must wait for requests to be handled, and well-designed performance testing helps minimize latency early.

### Security testing

Given how important data security is, it's no surprise that dedicated testing types have emerged for this modern need. Security testing methods such as dynamic application security testing (DAST) and static application security testing (SAST) help testers detect vulnerabilities. Enterprises choose their methods according to the threats they face.

### Usability testing

One non-functional type focuses entirely on the quality of the user experience. Usability testing is a manual process best suited to small-scale testing, but it should be performed whenever possible—especially when carrying out operations such as application localization, where the added complexity raises the risk of human error.

## Functional testing tools

Fully tracking functional testing tools takes real effort, since most support different platforms and application types. It's impossible to keep pace with this booming market (estimates put the number of tools well into the hundreds or thousands), but the following stand out for their popularity and practical value.

- **Appium**: the functional testing market offers many open-source tools, and Appium ranks at the top. It supports a wide range of programming languages and can automate native, mobile web, and hybrid applications on both iOS and Android.

- **Katalon Studio**: the test automation platform Katalon Studio offers solutions for building and evaluating regression and end-to-end test results. It includes record-and-playback capability and supports cross-platform collaboration.

- **Micro Focus Unified Functional Testing (UFT)**: another commercial tool, UFT gives testers a clear multiplatform view of web services, application programming interfaces (APIs), and graphical user interfaces (GUIs) at once.

- **Playwright**: a Microsoft-developed commercial framework focused on web browser automation, known for reinforcing reliability. While Playwright does support modern web features, it offers relatively limited options when it comes to programming languages.

- **Selenium**: one of the most popular test automation tools, Selenium is an open-source framework. This browser-based tool lets testers write and evaluate test scripts in several mainstream programming languages, including JavaScript™, Node.js, and Python.

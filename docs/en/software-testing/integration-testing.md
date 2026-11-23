# What is integration testing?

> Published November 23, 2026 | Updated November 23, 2026
>
> By [IBM Think](https://www.ibm.com/cn-zh/think/topics/integration-testing)

![integration-testing](/images/software-testing/integration-testing.webp)

## Definition of integration testing

Integration testing is a software testing method that connects various application components or modules and tests them to evaluate how well they work together. It aims to help ensure these assembled parts can communicate and interact successfully.

The concept raises several questions. The first is whether integration testing is necessary at all. The answer depends at least partly on the company in question. Small organizations with limited interaction with the public can skip it.

For any company that works broadly with the public, however, integration testing grows increasingly important. For a technology company that ships new software applications and tools, it matters even more.

A proverb says you never get a second chance to make a first impression. The same idea applies to contemporary companies. Most work hard to attract users, convert them into regular subscribers or customers, and sustain a successful, profitable relationship. Such companies cannot afford many mistakes when launching a major new program or application.

From installation to the way it interacts with other programs and systems, consumers expect the technology to work as advertised. For many organizations, integration testing is therefore a necessary step in doing business.

In short, the goal of integration testing is to ensure the various parts and systems work reliably together. From a public relations standpoint, another goal is to help uphold the organization's image as a responsible business capable of delivering reliably in today's commercial environment.

## How integration testing works

The term integration testing evolved over time to describe certain waterfall approaches. Early on, software modules and related projects were created "in a vacuum," so QA teams had to test individual components of the codebase separately, analyze those results, and only then introduce them into the software system—which required a great deal of tedious work.

Integration testing is carried out by creating and evaluating test cases. The first phase involves successfully identifying integration points, the areas where different modules in an application interact. Once integration points are established, test cases are designed around them to demonstrate how those points behave under various input scenarios, real-world conditions, and expected results.

Using data gathered from test coverage, project stakeholders can make necessary adjustments to the codebase, where all project data is stored.

The test cases used in integration testing help developers concentrate on a few specific operational areas:

### Data flow

Data moves through the system, traveling from source to destination. This information is processed as it passes through different processing steps and components. This movement of data is called data flow.

**Key question:** How does data move between components? Are there potential obstacles that need to be identified and corrected?

### Interface coordination

Just as most effective teams need leadership, there is a "higher-level coordination mechanism" among software components that guides their smooth operation and interaction. This management process is called interface coordination.

**Key question:** Are there foreseeable problems in adapting existing interfaces between modules? In other words, do these interfaces match well?

### Communication protocols

Communication protocols determine how devices share data. These protocols set rules for data transmission and define the structure of the information. They also specify how a system should self-correct when errors occur.

**Key question:** Can integration testing reveal synchronization issues between individual units? What measures should be taken to help ensure data transmission is secure?

Another aspect that adds to integration testing's overall complexity involves dependencies—the relationships that exist between modules and/or components. A typical dependency requires that one component be functioning as required before a related component can work. These dependencies must be taken into account when trying to untangle problems that may arise during program execution.

## The order of the testing process

There is a standard order to the individual testing steps performed during integration testing, because that ordered sequence gives developers a structured way to systematically evaluate different pieces of code. The sequence typically begins by checking the simplest individual components, correcting errors in low-level modules before they negatively affect operations. Testing then moves to more complex integration areas and evaluates their performance.

Beyond detecting defects early, the conventional testing flow progresses logically, mirroring the data flow through the code and ensuring that component interactions are tested in the correct order. The flow also assigns lower priority to less critical, lower-level tests, letting developers focus their effort on the most critical operations.

In the traditional testing sequence, test formats are checked in this order:

1. Unit testing, which evaluates individual functions.
2. Integration testing, used to observe how components interact.
3. System testing, used to determine the overall functionality of the entire system.
4. Acceptance testing, which checks functionality from the user's perspective.

Integration testing is not the initial step in this standard flow. It sits where it does because testing the interactions between components has already been handled by unit testing. The next stage, system testing, broadens the scope further, letting testers examine the whole system and how its parts work together from a higher-level view.

## Types of integration testing

There is a wide variety of integration testing techniques, but the following are the ones most commonly used to evaluate software systems.

### Top-down integration testing

The top-down approach is one of the two main types of incremental integration testing. It focuses on the main module and its work, then evaluates submodules and subroutines. One of its most powerful characteristics is that it can be used early in the process, even before lower-level modules are fully identified. Testers can use placeholders, called stubs, to stand in for lower-level modules.

### Bottom-up integration testing

Another major example is bottom-up integration testing, which reverses the order of the integration testing sequence. In the bottom-up approach, submodules and subroutines are evaluated first, and the method then moves on to testing the main module. Just as top-down testing uses stubs as placeholders when needed, bottom-up integration testing uses temporary modules called drivers to stand in for higher-level components that have not yet been determined.

### Hybrid integration testing

Hybrid integration (sometimes called "sandwich integration") combines the top-down and bottom-up methods. Its main advantage is that it overcomes the forced process ordering that constrains both top-down and bottom-up testing, which are indirectly opposites. With hybrid integration, testing can begin either from the main module or from submodules and subroutines, depending on user requirements.

### Big bang integration testing

Another key approach to integration testing is big bang integration testing. In this method, all individual units, components, and modules in the system are integrated and tested at the same time, as if they were a single unit. Big bang testing provides fast answers when the system works together with all of its parts.

This form of testing does have limitations, however. If the process shows that the system fails to run as expected, big bang integration testing will not reveal which specific individual parts failed to work together.

## Integration testing approaches

The following are some popular integration testing approaches. Because each could be the right choice for a software company depending on its needs, they are listed alphabetically:

- **API integration testing**: application programming interfaces (APIs) are an essential part of computing, allowing software applications to connect to one another and share data successfully. API testing is a software testing approach that examines how different APIs in a system work together. Its goal is to see them run smoothly as if they were part of a single organized unit. The more smoothly APIs operate together, the better the whole system runs.

- **Automated integration testing**: a key part of the software development process, automated testing is another way to evaluate how software components work together. This integration testing process runs test cases using dedicated testing tools and scripts. In this way, integration problems can be found and fixed before deployment, and because it is automated, the entire system becomes more efficient and agile. Automated testing is a key element of continuous integration, a DevOps practice that relies on a shared repository to store continuously updated code changes.

- **Black-box testing**: the "black box" metaphor can apply to any situation in which full understanding of the inner workings of the black box—whether computer code or another operational aspect, such as a company's reported earnings—is not required. In black-box integration testing, this means testers do not want to dig into the specific code used inside different modules; instead, they want a simpler, faster answer about whether systems, components, and modules can work together harmoniously.

- **End-to-end testing**: as the name suggests, end-to-end testing (sometimes called E2E testing) gives testers a way to check the functionality of the entire system from beginning to end. E2E testing can simulate realistic test scenarios and lay the groundwork for integration testing by consolidating test plans that determine which units to test. It usually appears late in the integration testing process, after integration testing is complete and before user acceptance testing.

- **Functional testing**: of all the types of software testing, functional integration testing (FIT) focuses most purely on understanding the system's function. FIT verifies whether different modules or components interact as needed, and its value lies in locating defects early in the software development lifecycle, before they can become serious problems. Testers usually perform functional testing after unit testing and before full system testing begins.

- **Regression testing**: another testing framework exists within regression testing, which provides an after-the-fact test environment to check whether any changes made during integration inadvertently introduced faults elsewhere in the system. When new features are introduced—a new online payment channel, for example—regression testing helps ensure those additions do not break what is already working.

- **White-box testing**: the exact opposite of black-box testing, white-box testing assumes testers want to examine the relevant code during testing so they can identify where problems lie and make corrective changes to debug them, although this approach will almost certainly cost more time. The term "white box" reflects a desire for clarity about the system's internal workings, though "transparent box" might be a more accurate description of what testers are after.

## Popular integration testing tools

This niche also has many integration testing tools and frameworks. The following are among the most popular:

- **Citris**: Citris uses open-source Java™ frameworks to serve Java's large user base—the reason it is one of the world's most popular programming languages. Citris can manage API usage such as transactions and generate test messages.

- **Katalon**: Katalon Studio's automated testing software integrates the open-source Selenium framework, a browser-based tool that lets testers write test scripts in multiple programming languages, including JavaScript, Node.js, and Python.

- **Postman**: Postman excels at API integration testing. It is also good at supporting team collaboration and automated testing. In addition, users can write tests directly without placing them in collections or even saving them; requests made in Postman return a corresponding URL.

- **SoapUI**: SoapUI offers an open-source tool capable of testing web applications and performing integration testing. With it, testers get a graphical interface that supports test case creation and makes it easy to handle test data.

## Which integration tool is right for you?

Whether the need is to evaluate and fix the front end or the back end, integration testing offers a means of assessing the connections that are essential to efficient operations and maximum profitability.

As noted, quite a few different integration testing approaches exist, because software creators work to identify and develop a method for every possible need and configuration. It works: most software development companies understand the necessity of this kind of testing. Estimates suggest that roughly 70% of enterprises working in DevOps already use some form of integration testing.

So which integration tool is right for your business? Thanks to a broadly receptive market, you can most likely find one that suits your company's needs. To work out what those needs are, we suggest recalling a more famous old saying: "know yourself." Even in the postmodern world, that remains useful advice.

## What do I need to know to help?

If you are looking to help to with a code contribution our project uses [typescript](https://www.typescriptlang.org/), [jest](https://jestjs.io/) for testing, [rollup.js](https://rollupjs.org/) for building and it is an extension of [lit](https://lit.dev/). 

If you are interested in making a code contribution and would like to learn more about the technologies that we use, check out the links.

## How do I make a contribution?

Never made an open source contribution before? Wondering how contributions work in the in our project? Here's a quick rundown!

1. Find an issue that you are interested in addressing or a feature that you would like to add.
2. Install [node](https://nodejs.org/en/) and [git](https://git-scm.com/) on your computer.
3. Fork the repository associated with the issue to your local GitHub organization. This means that you will have a copy of the repository under `your-GitHub-username/pure-lit`.
4. Clone the repository to your local machine using git clone https://github.com/your-GitHub-username/pure-lit.git.
5. Create a new branch for your fix using `git checkout -b branch-name-here`.
6. Install all dependencies the library needs by running `npm install` and make sure it works by running `npm test`. All tests should pass.
7. Make the appropriate changes for the issue you are trying to address or the feature that you want to add.
8. Run `npm test` to ensure your changes work and that you have tests for your added code.
9. Use `git add insert-paths-of-changed-files-here` to add the file contents of the changed files to the "snapshot" git uses to manage the state of the project, also known as the index.
10. Use `git commit -m "#number-of-the-issue-you-created-in-step-1 Insert a short message of the changes made here"` to store the contents of the index with a descriptive message.
10. Push the changes to the remote repository using `git push origin branch-name-here`.
11. Submit a pull request to the upstream repository by opening the repo in your browser.
12. Title the pull request with a short description of the changes made and the issue or bug number associated with your change. For example, you can title an issue like so "Added more log outputting to resolve #4352".
13. In the description of the pull request, explain the changes that you made, any issues you think exist with the pull request you made, and any questions you have for the maintainer. It's OK if your pull request is not perfect (no pull request is), the reviewer will be able to help you fix any problems and improve it!
14. Wait for the pull request to be reviewed by a maintainer.
15. Make changes to the pull request if the reviewing maintainer recommends them.
16. Celebrate your success after your pull request is merged!

## Where can I go for help?

If you need help on your pull request, create your current state as `Draft` and request help from the maintainers.

## What does the Code of Conduct mean for me?

Our Code of Conduct means that you are responsible for treating everyone on the project with respect and courtesy regardless of their identity. If you are the victim of any inappropriate behavior or comments as described in our [Code of Conduct](CODE_OF_CONDUCT.md), we are here for you and will do the best to ensure that the abuser is reprimanded appropriately, per our code.

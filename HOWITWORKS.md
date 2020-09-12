# How it works

- The setup instructions propose adding a script to the package.json. For example

  ```
  "storybook:axe": "build-storybook && axe-storybook"
  ```

  You can then run axe-storybook with `npm run storybook:axe`
- That command first tells Storybook to create a static build (via the `build-storybook` command).
- It then executes axe-storybook, which checks each story for accessibility violations. It does so by:
  - Using Playwright to open Storybook's generated iframe and retrieving the list of stories.
  - Opening the generated iframe again in Puppeteer. This time it goes to the correct path for each story and runs axe.
  - If there are any violations, they're logged to the console and the process exits with a non-zero exit code.

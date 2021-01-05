# Ugly Electron To-Do App

This guide will get you up and running creating a desktop app using only static JavaScript, HTML, and CSS. The app will be complete with user accounts and end-to-end encrypted user data persistence.

It will be virtually identical to our other ugly to-do apps [you may be familiar with](https://github.com/smallbets/userbase-samples#ugliest-todo), the difference being that the final product will be a native desktop app.

## Create an Electron App

Follow the steps [here](https://www.electronjs.org/docs/tutorial/quick-start) to create a barebones electron app.

## Overwrite the index.html file

Copy the `index.html` file in this repo at [./index.html](./index.html), and overwrite the one in your barebones electron app.

## Set your App ID

[Create a free Userbase admin account](https://v1.userbase.com/#create-admin). In your Userbase admin account, you will find a Trial app. Get its App ID, and replace [line 52 of the index.html file](./index.html#L52) with it:

```
userbase.init({ appId: '<YOUR APP ID>' })
```

## And you're ready!

Start the electorn app.

```
npm start
```

Or

```
electron .
```

## Misc.

Check out the [Userbase quickstart](https://userbase.com/docs/) for finer details on writing the `index.html` file from scratch. It explains each section of the code step-by-step.

## Strong Recommendation

We highly recommend that you load the Userbase SDK as an [npm package](https://www.npmjs.com/package/userbase-js), or include the source JavaScript directly in your app. This way the Userbase SDK will come packaged with your desktop app, rather than fetched from a remote server when the user loads the app (as this tutorial does via the script tag at the top of `index.html`). Check out the [Webpack](../ugliest-todo-webpack) or [Browserify](../ugliest-todo-browserify) samples for apps using the `userbase-js` npm package.
I use this script to send a dummy email to the seed emails provided by <https://mailreach.co>.

```sh
$ mise install
$ pnpm install
```

```sh
$ cp .envrc.skel .envrc
```

Edit `.envrc`.

```sh
$ direnv allow
```

Go to the “Spam Checker” section of <https://app.mailreach.co> and copy the seed list and the code to insert into the emails in the `send.js` file.

Then, simply run:

```
$ ./send.js
```

Go back to MailReach Spam Checker and observe the test results.

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

Go to the “Spam Checker” section of <https://app.mailreach.co> and export seed list to `/emails.csv`.

Retrieve the code ID and select the type of destination email address (personal or professional), then pass these parameters as options to `./send.js`:

```
$ ./send.js --code-id <CODE_ID> --inbox-type=<personal|professional>
```

Go back to MailReach Spam Checker and observe the test results.

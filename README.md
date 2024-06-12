## riff

**riff** is a place to expand on ideas.

<img align="right" width="500" alt="Screenshot 2024-06-12 at 1 53 54 PM" src="https://github.com/terror/riff/assets/31192478/c1b5eea9-2b2c-4a85-8192-410827fd83ef">

I'm writing this to encourage myself to do more daily note-taking, while also having a custom app I can easily extend and integrate with whatever services I want.

### Development

I'm using [Tauri](https://tauri.app/) to build this desktop app, [Rust](https://www.rust-lang.org/) is used on the backend and [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) are used on the frontend.

To get started contributing, first install dependencies:

```bash
bun install
```

...then startup the development server:

```bash
bun run tauri dev
```

Expect `http://localhost:1420/` to be in use and the desktop ready to view.

### Prior Art

See the less-featureful cloud-based version here [stream.liam.rs](https://stream.liam.rs/).

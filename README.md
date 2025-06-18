# Wrayth

**Wrayth** is a super-lightweight yet powerful web framework designed for fast static site generation with modern features like components, slot injection, conditionals, scoped CSS purging, animations, and JSX-like syntax, all with zero dependencies.

---

## ✨ Features

* Component-based HTML with `<wrayth-component>`
* Slot support (`<template slot="...">`)
* Conditional rendering via `wrayth-if="..."`
* Custom CSS class-based purging
* CSS animation support
* Lightweight logic and state injection
* JSX-style slot injection syntax

---

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/wrayth/wrayth.git
cd wrayth
```

### 2. Project Structure

```
wrayth/
├── wrayth.config.js       # Config file
├── wrayth-cli.js          # Build script
├── src/
│   ├── theme.css        # Your base/theme CSS
│   ├── pages/           # HTML pages
│   │   └── index.html
│   └── components/      # Reusable HTML components
│       └── card.html
```

### 3. Build the site

```bash
node wrayth-cli.js
```

The output will be placed in the `dist/` directory.

### 4. Run a dev server

```bash
npx live-server dist
```

---

## Example Component

### `components/card.html`

```html
<div class="card">
  <h2>{{slot:title}}</h2>
  <p>{{slot:content}}</p>
</div>
```

### Usage in Page

```html
<Wrayth-component src="card.html">
  <template slot="title">Welcome</template>
  <template slot="content">This is Wrayth in action!</template>
</Wrayth-component>
```

---

## 🧠 Logic with `wrayth-if`

```html
<p Wrayth-if="user.loggedIn">Hello, friend!</p>
<p Wrayth-if="!user.loggedIn">Please log in.</p>
```

The condition is evaluated at build time. Modify `context` in `wrayth-cli.js` to reflect your site state.

---

## CSS Purging

Wrayth will scan all HTML/JS files for used class names and only include styles used in your theme file.

Your `theme.css` should include utility classes, animations, etc.

---

## Advanced Usage

* Support for global state with `window.WraythData`
* Conditional rendering and JSX-style slot syntax
* Custom logic embedding and animation via CSS

---

## License

MIT License.

---

## Contribute

PRs and issues welcome. Make Wrayth better together!
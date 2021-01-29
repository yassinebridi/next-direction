# next-direction 
![next-direction minzip package size](https://img.shields.io/bundlephobia/minzip/next-direction)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Twitter Follow](https://img.shields.io/twitter/follow/yassinebridi.svg?style=social&label=Follow)](https://twitter.com/yassinebridi)

A Next.js package, that makes working with directions a breeze.
- No flash on load (both SSR and SSG)
- Sync direction across tabs and windows
- Disable flashing when refreshing pages
- Force pages to a specific direction

![Preview](https://user-images.githubusercontent.com/18403595/106312235-a509c800-6266-11eb-859b-1dd6edb671ee.gif)
> Check out the [Live Example](https://next-direction.vercel.app/) to try it for yourself.

## Installation

```bash
$ npm install next-direction
# or
$ yarn add next-direction
```

## Usage

- Add the next-direction Provider to your custom `_app`

```jsx
import { DirModeProvider } from "next-direction";

function MyApp({ Component, pageProps }) {
  return (
    <DirModeProvider>
      <Component {...pageProps} />
    </DirModeProvider>
  )
}

export default MyApp
```

## useDirMode
```jsx
import { useDirMode } from 'next-direction'

const DirmodeChanger = () => {
  const { dirmode, setDirMode } = useDirMode();

  return (
    <div>
      The current direction is: {dirmode}
      <button onClick={() => setDirMode('ltr')}>LTR Mode</button>
      <button onClick={() => setDirMode('rtl')}>RTL Mode</button>
    </div>
  )
}
```

> Warning! The above code is hydration unsafe and will throw a hydration mismatch warning when rendering with SSG or SSR. This is because we cannot know the direction on the server, so it will always be undefined until mounted on the client.

> You should delay rendering any direction toggling UI until mounted on the client. See the [example](https://github.com/yassinebridi/next-direction/blob/main/README.md#avoid-hydration-mismatch).

## APIs

### DirModeProvider
- `storageKey` = 'dirmode': Key used to store dir mode setting in localStorage
- `defaultDirMode` = 'ltr': Default dir mode name
- `forcedDirMode`: Forced dir mode name for the current page (does not modify saved dir mode settings)

### UseDirMode
- `dirmode`: Active dir mode name
- `setDirMode(dirmode: string)`: a function to set the dir mode
- `forcedDirMode`: Forced page dir or falsy. If forcedDirMode is set, you should disable any dir mode switching UI

### Avoid Hydration Mismatch

Because we cannot know the `dirmode` on the server, many of the values returned from `useDirMode` will be `undefined` until mounted on the client. This means if you try to render UI based on the current dir mode before mounting on the client, you will see a hydration mismatch error.

The following code sample is **unsafe**:

```jsx
import { useDirMode } from 'next-direction'

const dirModeChanger = () => {
  const { dirMode, setDirMode } = useDirMode()

  return (
    <div>
      The current direction mode  is: {dirMode}
      <button onClick={() => setDirMode('LTR')}>LTR Mode</button>
      <button onClick={() => setDirMode('RTL')}>RTL Mode</button>
    </div>
  )
}
```

To fix this, make sure you only render UI that uses the current dir mode when the page is mounted on the client:

```js
import { useDirMode } from 'next-direction'

const DirModeChanger = () => {
  const [mounted, setMounted] = useState(false)
  const { dirMode, setDirMode } = useDirMode()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div>
      The current direction mode  is: {dirMode}
      <button onClick={() => setDirMode('LTR')}>LTR Mode</button>
      <button onClick={() => setDirMode('RTL')}>RTL Mode</button>
    </div>
  )
}
```

To avoid Content Layout Shift, consider rendering a skeleton until mounted on the client side.

## Credits
This project's code is heavily inspired by this great [project](https://github.com/pacocoursey/next-themes)

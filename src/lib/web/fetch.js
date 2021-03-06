// https://fetch.spec.whatwg.org/

import URL from './url.js'
import {close, open, read, BUFSIZ} from '../libc.js'

let baseFetch = global.fetch

export async function fetch(input, init) {
  let url = typeof input === 'string' ? input : input.url

  url = new URL(url, location.href)

  if (url.protocol !== 'file:') {
    return baseFetch(input, init) // TODO: implement on Record FS eventually
  }

  let pathname = decodeURI(url.pathname)
  let fd = await open(pathname)
  let text

  try {
    text = await read(fd)
  } finally {
    await close(fd)
  }

  return new Response(text)
}

export default fetch

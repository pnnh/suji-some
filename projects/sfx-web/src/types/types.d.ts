import {DOMAttributes} from 'react'
import hello from '@/components/hello.svelte'
import Clock from '@/components/Clock.svelte'
import MyElement from '@/components/my-element'

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

export {}

declare global {
  interface Window {
    Module: any;
    QtLoader: any;
    randomString(length: number, letter: boolean,
                 uppercaseLetter: boolean, symbol: boolean): string;
  }

  namespace JSX {
    interface IntrinsicElements {
      ['my-counter']: CustomElement<hello>;
      ['my-clock']: CustomElement<Clock>;
      ['my-element']: CustomElement<MyElement>;
    }
  }
}

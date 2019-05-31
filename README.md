# Siccly - Simple Inversion of Control Container

[![npm (scoped)](https://img.shields.io/npm/v/@bittrd/siccly.svg)](https://www.npmjs.com/package/@bittrd/siccly)
[![Coverage Status](https://coveralls.io/repos/github/bittrd/siccly/badge.svg?branch=master)](https://coveralls.io/github/bittrd/siccly?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
<!--toc-start-->

- [Usage](#Usage)
  - [Container](#Container)
  - [Types](#Types)
  - [Interfaces](#Interfaces)
  - [Classes](#Classes)
  - [Injection](#Classes)
  - [Binding](#Binding)
    - [Transient](#Transient)
    - [Singleton](#Singleton)

<!--toc-end-->

## Usage

## Container

Create your di container file (I like to start simple with a siccly.ts file in the root of my project).

You can put these files wherever works for you though if you want more structure.

```typescript
// "src/siccly.ts"
import { Kernel } from '@bittrd/siccly';
import { TYPES } from './types';
import { MyClass } from './my-class';
import { MyInterfaceImplementation } from './my-interface-implementation';
export const container = new Kernel();

container.bind(TYPES.MyInterface).toSingleton(MyInterfaceImplementation);
container.bind(MyClass).toClass(MyClass);
```

## Types

In addition to the container, you need a place to handle interfaces as they are not value types in javascript the way objects are. (I usually create a types.ts file next to siccly.ts)

```typescript
// "src/types.ts"
import { Type } from '@bittrd/siccly';
import { MyInterface } from './my-interface';
export const TYPES = {
  MyInterface: Type<MyInterface>('MyInterface'),
};
```

## Interfaces

Interfaces are easy, create them as you normally would. They get annotated using the `Type<T>` helper function inside of "src/types.ts" see [Types](#Types)

```typescript
// "src/my-interface.ts"
export interface MyInterface {
  isAwesome(): boolean;
}
```

## Classes

Classes are just as easy, and need no extra annotation. They can be passed directly into the bind methods on the kernel as-is.

```typescript
// "src/my-class.ts"
export class MyClass {
  isNifty(): boolean {
    return true;
  }
}
```

## Injection

In order to use injection in your class, create it as you normally would. Then add a `static inject = []` with an array of the types in order that you want injected into your constructor.

```typescript
// "src/my-interface-implementation.ts"
import { MyInterface } from './my-interface';
import { MyClass } from './my-class';
export class MyInterfaceImplementation implements MyInterface {
  static inject = [MyClass];
  constructor(private readonly nifty: MyClass) {}
  public isAwesome(): boolean {
    return this.nifty.isNifty();
  }
}
```

## Binding

In order for a class or interface to be usable from the DI container, you have to bind your interfaces/classes to their implementations.

### Transient

To bind a class in transient scope, use one of the following methods.

```typescript
import { Kernel } from '@bittrd/siccly';
import { MyClass } from './my-class';
import { MyInterface } from './my-interface';
import { TYPES } from './types';
const container = new Kernel();

// Default bind call with interface as first argument and implementation class as second.
container.bind(MyClass, MyClass);
// Method chaining with interface as argument to bind and implementation as argument to toClass
container.bind(MyClass).toClass(MyClass);
// With interface example.
container.bind(TYPES.MyInterface, MyClass);
container.bind(TYPES.MyInterface).toClass(MyClass);
```

### Singleton

To bind a class in singleton scope, use one of the following methods.

```typescript
import { Kernel } from '@bittrd/siccly';
import { MyClass } from './my-class';
import { MyInterface } from './my-interface';
import { TYPES } from './types';
const container = new Kernel();

// Method chaining with interface as argument to bind and instance of the object as argument to toSingleton
container.bind(MyClass).toSingleton(new MyClass());
// With interface example.
container.bind(TYPES.MyInterface).toSingleton(new MyClass());
```

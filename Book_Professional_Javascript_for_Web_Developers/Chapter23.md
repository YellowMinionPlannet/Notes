# Chapter 23 Modules
- The reason why we need Modules:
  
  Large codebase and using third party library requires us to break code into different parts and connecting them together

- Before we need lexical features to "fake" module-like behaviors.

## UNDERSTANDING THE MODULE PATTERN
- Basic Concept of Module Pattern:
  1. Breack logic into pieces, each of which is encapsulated from the rest
  2. Each of them define what parts of itself are exposed to external pieces
  3. allow each piece to explicitly define what external pieces it needs to execute.

> So following are just some introductions of fundamental concept about module system.

### Module Identifiers
- Module systems are essentially key-value entities.
- So key is used to reference each module
- Several ways to become module identifier:
  1. file path
  2. explicitly declared string name
  3. file name
- Native browser requires identifier to provide file path. NodeJS will perform search to this path within `node_modules` and match up with directory that has `index.js` file
- Each module system has its own implementation of module identifier, the goal is to avoid name collisions.

### Module Dependencies
- External modules that are declared within local module.

### Module Loading
- When browser loads a module, it must make sure its external dependencies are downlaoded, loaded, and executed first. 
- The module will be ready to execute when all the external dependencies are ready. 

### Entry Points
- Must define a single module as the entry point
- By using that entry point, it is possible to draw a dependency graph and gain an order to describe which module should be downloaded/initialized first.
- It's called "blocking" if some module is loaded before its dependency get ready and must wait for a remote request for dependency.

### Asynchronous Dependencies

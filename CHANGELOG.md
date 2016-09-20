# [0.2.1](https://github.com/elboman/proofed/releases/tag/0.2.1) (2016-09-20)
### Added
- **handle()**: handle function now accepts a second argument `mapValue` function. The function gets called with the event `e` as argument. [(0b76074)](https://github.com/elboman/proofed/commit/0b7607482d3ac6da7f477469077bb126de817e13)

# [0.2.0](https://github.com/elboman/proofed/releases/tag/0.2.0) (2016-09-17)
### Changed:
- **getSubmit**: function provided to `getSubmit` gets called with new arguments order: `e`(event), `model`, `errors` [(49e3322)](https://github.com/elboman/proofed/commit/49e3322424b049e4680a210a02fdf5860169d767)

# [0.1.4](https://github.com/elboman/proofed/releases/tag/0.1.4) (2016-09-08)
### Fix
- **isPristine()**: Dirty checking is skipped when setting the default values for each node [(86816c6)](https://github.com/elboman/proofed/commit/86816c6c25a8a73413ee138e4049162bd7b5541f)

# [0.1.3](https://github.com/elboman/proofed/releases/tag/0.1.3) (2016-09-07)
### Fix
- **Default Value**: Default value can be anything (it may coerce to false) [(44e5576)](https://github.com/elboman/proofed/commit/44e5576dc2e36afd81c2cb6daf4ca738b898b4c0)

# [0.1.2](https://github.com/elboman/proofed/releases/tag/0.1.2) (2016-08-24)
### Added
- **Valid**: add `isValid` API in order to check if specified node/whole model is valid in render function [(c865961)](https://github.com/elboman/proofed/commit/c8659611db10159c612fe826e9ec7d9a2dd6220d).
- **Errors**: add `errors` API for listing single node/whole model errors in render function [(ef2d297)](https://github.com/elboman/proofed/commit/ef2d29721af721ee2a67eb9009f92001d8c903ec).
- **Validation rules**: validation rules can take a second argument containing the whole model, for implementing advanced validation. [(4143c8d)](https://github.com/elboman/proofed/commit/4143c8d3b88f990d05dab26fc81101c8c1c80f0e). 
- **Exceptions**: add error handling when path nodes or callback functions provided are undefined or not specified in validation schema [(fdac7a4)](https://github.com/elboman/proofed/commit/fdac7a4433b5ff7073312462dfe0be2fd8af42c8).

### Fix
- **Lodash**: fix import statements to work properly in TypeScript [(234f967)](https://github.com/elboman/proofed/commit/234f967e735c709a8f61ee6da3c5e67162418b7c).

# [0.1.1](https://github.com/elboman/proofed/releases/tag/0.1.1) (2016-08-23)
### Added
- **ProofedComponent**: add synthetic react event in `submit` event handler function [(ddca262)](https://github.com/elboman/proofed/commit/ddca262cecf183dd8bcd743a6e63189d32b3ea0e).

### Changed
- **Lodash**: import only needed function to reduce bundle size [(671b46d)](https://github.com/elboman/proofed/commit/671b46d9513847dbe6b4d227b3b48010aa17bcd2).

# [0.1.0](https://github.com/elboman/proofed/releases/tag/0.1.0) (2016-08-22)
### First release
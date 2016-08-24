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
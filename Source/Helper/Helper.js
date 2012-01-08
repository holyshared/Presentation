/*
---
name: Presentation.Helper

description: The enhancement module incorporating a helper

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper

provides:
  - Helper
...
*/

(function(Presentation){

Presentation.Helper = {};

Presentation.implement(new Helper());

}(Presentation));

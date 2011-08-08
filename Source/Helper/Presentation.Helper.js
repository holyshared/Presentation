/*
---
name: Presentation.Helper

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper

provides:
  - Presentation.Helper
...
*/

(function(Presentation){

Presentation.Slide.implement(new Helper());

}(Presentation));

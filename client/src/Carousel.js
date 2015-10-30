/**
 * Code taken from leafletjs.com
 */
var oldC = window.C,
    C = {};

C.version = '0.0.1';

// define Carousel as a global C variable, saving the original C to restore later if needed

C.noConflict = function () {
    window.C = oldC;
    return this;
};

window.C = C;

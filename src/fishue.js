/* eslint-disable no-param-reassign */
// Pilfered from :idiculousfish.com/blog/posts/colors.html
export default function getHue(idx) {
    /* Here we use 31 bit numbers because JavaScript doesn't have a 32 bit unsigned type,
     and so the conversion to float would produce a negative value. */
    const bitcount = 31;

    /* Reverse the bits of idx into ridx */
    let ridx = 0;
    for (let i = 0; i < bitcount; i++) {
        ridx = (ridx << 1) | (idx & 1);
        idx >>>= 1;
    }

    /* Divide by 2**bitcount */
    const hue = ridx / Math.pow(2, bitcount);

    /* Start at .6 (216 degrees) */
    const fracHue = (hue + 0.6) % 1;

    return Math.round(fracHue * 360);
}

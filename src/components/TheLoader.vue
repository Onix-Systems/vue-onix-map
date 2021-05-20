<template lang='pug'>
  #lottie
</template>


<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import lottie from 'lottie-web';

@Component
export default class extends Vue {
  constructor() {
    super();
  }
  public mounted() {
    this.animation();
  }

  public animation() {
    const data = {
      v: '5.6.2',
      fr: 30,
      ip: 0,
      op: 60,
      w: 500,
      h: 500,
      nm: 'Comp 1',
      ddd: 0,
      assets: [
        {
          id: 'comp_0',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Shape Layer 3',
              td: 1,
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [249, 172.578, 0], ix: 2 },
                a: { a: 0, k: [-0.25, -115.25, 0], ix: 1 },
                s: { a: 0, k: [178.274, 109.949, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'rc',
                      d: 1,
                      s: { a: 0, k: [202.5, 202.5], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      r: { a: 0, k: 19, ix: 4 },
                      nm: 'Rectangle Path 1',
                      mn: 'ADBE Vector Shape - Rect',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: {
                        a: 0,
                        k: [0.141960772346, 0.141960772346, 0.141960772346, 1],
                        ix: 4,
                      },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [-0.25, -115.25], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [80.557, 80.135], ix: 3 },
                      r: { a: 0, k: -45, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Rectangle 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 480,
              st: 0,
              bm: 0,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Shape Layer 2',
              tt: 2,
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [249, 252.578, 0], ix: 2 },
                a: { a: 0, k: [-0.25, -115.25, 0], ix: 1 },
                s: { a: 0, k: [178.274, 109.949, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'rc',
                      d: 1,
                      s: { a: 0, k: [202.5, 202.5], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      r: { a: 0, k: 19, ix: 4 },
                      nm: 'Rectangle Path 1',
                      mn: 'ADBE Vector Shape - Rect',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: {
                        a: 0,
                        k: [0.20000001496, 0.556862745098, 1, 1],
                        ix: 4,
                      },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [-0.25, -115.25], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [80.557, 80.135], ix: 3 },
                      r: { a: 0, k: -45, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Rectangle 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 480,
              st: 0,
              bm: 0,
            },
          ],
        },
        {
          id: 'comp_1',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Shape Layer 3',
              td: 1,
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [249, 172.578, 0], ix: 2 },
                a: { a: 0, k: [-0.25, -115.25, 0], ix: 1 },
                s: { a: 0, k: [178.274, 109.949, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'rc',
                      d: 1,
                      s: { a: 0, k: [202.5, 202.5], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      r: { a: 0, k: 19, ix: 4 },
                      nm: 'Rectangle Path 1',
                      mn: 'ADBE Vector Shape - Rect',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: {
                        a: 0,
                        k: [0.141960772346, 0.141960772346, 0.141960772346, 1],
                        ix: 4,
                      },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [-0.25, -115.25], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [80.557, 80.135], ix: 3 },
                      r: { a: 0, k: -45, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Rectangle 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 480,
              st: 0,
              bm: 0,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Shape Layer 2',
              tt: 2,
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [249, 252.578, 0], ix: 2 },
                a: { a: 0, k: [-0.25, -115.25, 0], ix: 1 },
                s: { a: 0, k: [178.274, 109.949, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'rc',
                      d: 1,
                      s: { a: 0, k: [202.5, 202.5], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      r: { a: 0, k: 19, ix: 4 },
                      nm: 'Rectangle Path 1',
                      mn: 'ADBE Vector Shape - Rect',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: {
                        a: 0,
                        k: [0.400000029919, 0.666666666667, 1, 1],
                        ix: 4,
                      },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [-0.25, -115.25], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [80.557, 80.135], ix: 3 },
                      r: { a: 0, k: -45, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Rectangle 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 480,
              st: 0,
              bm: 0,
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape Layer 1',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: {
              a: 1,
              k: [
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 0,
                  s: [249, 250, 0],
                  to: [0, -15.737, 0],
                  ti: [0, 15.737, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 15,
                  s: [249, 155.578, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 30,
                  s: [249, 155.578, 0],
                  to: [0, 15.737, 0],
                  ti: [0, -15.737, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 45,
                  s: [249, 250, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 60,
                  s: [249, 250, 0],
                  to: [0, -15.737, 0],
                  ti: [0, 15.737, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 75,
                  s: [249, 155.578, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 90,
                  s: [249, 155.578, 0],
                  to: [0, 15.737, 0],
                  ti: [0, -15.737, 0],
                },
                { t: 105, s: [249, 250, 0] },
              ],
              ix: 2,
            },
            a: { a: 0, k: [-0.25, -115.25, 0], ix: 1 },
            s: { a: 0, k: [178.274, 109.949, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'rc',
                  d: 1,
                  s: { a: 0, k: [202.5, 202.5], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  r: { a: 0, k: 19, ix: 4 },
                  nm: 'Rectangle Path 1',
                  mn: 'ADBE Vector Shape - Rect',
                  hd: false,
                },
                {
                  ty: 'fl',
                  c: { a: 0, k: [0, 0.447058853449, 1, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  bm: 0,
                  nm: 'Fill 1',
                  mn: 'ADBE Vector Graphic - Fill',
                  hd: false,
                },
                {
                  ty: 'tr',
                  p: { a: 0, k: [-0.25, -115.25], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [80.557, 80.135], ix: 3 },
                  r: { a: 0, k: -45, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: 'Transform',
                },
              ],
              nm: 'Rectangle 1',
              np: 3,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
              hd: false,
            },
          ],
          ip: 0,
          op: 480,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 2,
          ty: 0,
          nm: 'Pre-comp 1',
          refId: 'comp_0',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [250, 250, 0], ix: 2 },
            a: { a: 0, k: [250, 250, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          w: 500,
          h: 500,
          ip: 0,
          op: 480,
          st: 0,
          bm: 0,
        },
        {
          ddd: 0,
          ind: 3,
          ty: 0,
          nm: 'Pre-comp 2',
          refId: 'comp_1',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: {
              a: 1,
              k: [
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 0,
                  s: [250, 250.75, 0],
                  to: [0, 15.375, 0],
                  ti: [0, -15.375, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 15,
                  s: [250, 343, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 30,
                  s: [250, 343, 0],
                  to: [0, -15.375, 0],
                  ti: [0, 15.375, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 45,
                  s: [250, 250.75, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 60,
                  s: [250, 250.75, 0],
                  to: [0, 15.375, 0],
                  ti: [0, -15.375, 0],
                },
                {
                  i: { x: 0.667, y: 0.667 },
                  o: { x: 0.333, y: 0.333 },
                  t: 75,
                  s: [250, 343, 0],
                  to: [0, 0, 0],
                  ti: [0, 0, 0],
                },
                {
                  i: { x: 0.667, y: 1 },
                  o: { x: 0.333, y: 0 },
                  t: 90,
                  s: [250, 343, 0],
                  to: [0, -15.375, 0],
                  ti: [0, 15.375, 0],
                },
                { t: 105, s: [250, 250.75, 0] },
              ],
              ix: 2,
            },
            a: { a: 0, k: [250, 250, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          w: 500,
          h: 500,
          ip: 0,
          op: 480,
          st: 0,
          bm: 0,
        },
      ],
      markers: [],
    };
    lottie.loadAnimation({
      container: document.getElementById('lottie') as HTMLInputElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: data,

    });
  }
}
</script>



<style lang="scss" scoped>
@import "../assets/scss/media";
#lottie {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -40px;
  margin-top: -40px;
  opacity: 0.7;
  @include media_mobile {
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
  }
}
</style>


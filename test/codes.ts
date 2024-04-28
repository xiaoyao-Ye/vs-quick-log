const code = `var a;
let b: string;
const c = 1;
const d = {
  a: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx a",
  b: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx b",
};
const e = [
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx e",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx e",
];
const { foo, x: z, ...args }: { x?: string; y?: number, foo: string, bar: number } = {};
const { foo, bar } = { foo: 1, bar: 2 };
const { g, ...fb } = { g: 1, foo: 1, bar: 2 };
const { foo: foo1, bar: bar1 } = { foo: 1, bar: 2 };
const f: string = "";


const fn = (a: string, b: number) => {

};
function fn4(x: string, { y: yy }: any, z, ...args: any[]): string {
  // ...
  return "";
}

new Promise((resolve, reject) => {
  // ...
})
  .then((val) => {
    // ...
  })
  .catch((err) => {
    // ...
  });

class A {
  constructor(params) {
    // ...
  }

  async sayHi(hi) {
    // ...
  }
}

  
if ((a === 1 && fn1("xx", 2) && !this.xx.xx || str === "a" || str1 == "核销码")) {
  // ...
}

if (this.name === "核销码" && fn("xx") || !userId) {
  // ...
}
`;

const vueCode = `<template>
  <div>123</div>
</template>

<script>
export default {
  data() {
    
  },
  methods: {
    test(data) {
      // ...
    }
  }
}

</script>

<style>
</style>
`;

const clearCode = ` console.log("=============== foo ===============\\n", foo);
const a = 1;
console.log("=============== a ( /src/xx/xx.vue ) ===============\\n", a);
const b = 2
console.log(
  "=============== b ===============\\n", 
  b
);
`;

const vue2Code = `<template>
  <div>
    <a-spin :spinning="loading" size="large" tip="loading...">
      <Nuxt />
    </a-spin>

    <Totop />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    }
  },
  components: {
    Totop: () => import('@/components/Totop/index')
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
}
</script>
`;

export { clearCode, code, vue2Code, vueCode };

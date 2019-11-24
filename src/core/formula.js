const baseFormulas = [
  {
    key: 'SUM',
    render: ary => ary.reduce((a, b) => Number(a) + Number(b), 0),
  },
  {
    key: 'AVERAGE',
    render: ary => ary.reduce((a, b) => Number(a) + Number(b), 0) / ary.length,
  },
  {
    key: 'MAX',
    render: ary => Math.max(...ary.map(v => Number(v))),
  },
  {
    key: 'MIN',
    render: ary => Math.min(...ary.map(v => Number(v))),
  },
  {
    key: 'IF',
    render: ([b, t, f]) => (b ? t : f),
  },
  {
    key: 'AND',
    render: ary => ary.every(it => it),
  },
  {
    key: 'OR',
    render: ary => ary.some(it => it),
  },
  {
    key: 'CONCAT',
    render: ary => ary.join(''),
  },
  /* support:  1 + A1 + B2 * 3
  {
    key: 'DIVIDE',
    title: tf('formula.divide'),
    render: ary => ary.reduce((a, b) => Number(a) / Number(b)),
  },
  {
    key: 'PRODUCT',
    title: tf('formula.product'),
    render: ary => ary.reduce((a, b) => Number(a) * Number(b),1),
  },
  {
    key: 'SUBTRACT',
    title: tf('formula.subtract'),
    render: ary => ary.reduce((a, b) => Number(a) - Number(b)),
  },
  */
];

const formulas = baseFormulas;

// const formulas = (formulaAry = []) => {
//   const formulaMap = {};
//   baseFormulas.concat(formulaAry).forEach((f) => {
//     formulaMap[f.key] = f;
//   });
//   return formulaMap;
// };
const formulam = {};
baseFormulas.forEach((f) => {
  formulam[f.key] = f;
});

export default {
};

export {
  formulam,
  formulas,
  baseFormulas,
};

export async function POST(req) {
  const { model = 'mealy', inputs = [] } = await req.json();

  const price = 75;

  const coinValue = (input) => {
    if (input === 'I25') return 25;
    if (input === 'I50') return 50;
    if (input === 'I100') return 100;
    return 0;
  };

  const stateName = (acc) => {
    if (acc === 0) return 'S0';
    if (acc === 25) return 'S1';
    if (acc === 50) return 'S2';
    if (acc >= 75) return 'S3';
    return 'S?';
  };

  const trace = [];
  let accum = 0;

  if (model === 'moore') {
    for (const input of inputs) {
      const before = stateName(accum);
      let out = { prodDispensed: false, change: 0 };
      let note = '';

      if (input === 'IP') {
        if (accum >= price) {
          note = 'IP pressed — reset to S0';
          accum = 0;
        } else {
          note = 'IP pressed — insufficient funds';
        }
      } else {
        const val = coinValue(input);
        accum += val;
        const after = stateName(accum);
        if (before !== 'S3' && after === 'S3') {
          out.prodDispensed = true;
          out.change = Math.max(0, accum - price);
          note = `Entered S3 via ${input} — Moore dispenses immediately (${out.change}¢ change)`;
        } else {
          note = `Coin ${input} inserted — accumulated ${accum}¢`;
        }
      }

      trace.push({
        input,
        beforeState: before,
        afterState: stateName(accum),
        accumAfter: accum,
        output: out,
        note
      });
    }
  } else {
    // Mealy
    for (const input of inputs) {
      const before = stateName(accum);
      let out = { prodDispensed: false, change: 0 };
      let note = '';

      if (input === 'IP') {
        if (accum >= price) {
          out.prodDispensed = true;
          out.change = Math.max(0, accum - price);
          note = `IP pressed — Mealy dispenses product (${out.change}¢ change), resets`;
          accum = 0;
        } else {
          note = `IP pressed — insufficient funds (${accum}¢)`;
        }
      } else {
        const val = coinValue(input);
        const prev = accum;
        accum += val;
        note = `Coin ${input} inserted — accum ${prev} → ${accum}¢`;
      }

      trace.push({
        input,
        beforeState: before,
        afterState: stateName(accum),
        accumAfter: accum,
        output: out,
        note
      });
    }
  }

  return Response.json({ model, price, trace });
}

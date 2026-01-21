'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [model, setModel] = useState('mealy')
  const [sequence, setSequence] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  const buttons = [
    { id: 'I25', label: 'Insert 25¢' },
    { id: 'I50', label: 'Insert 50¢' },
    { id: 'I100', label: 'Insert 100¢' },
    { id: 'IP', label: 'Press Product (IP)' },
  ]

  const addInput = (i) => setSequence([...sequence, i])
  const clear = () => {
    setSequence([])
    setResult(null)
    setStep(0)
  }

  async function run() {
    if (sequence.length === 0) return
    setLoading(true)
    try {
      const res = await axios.post('/api/simulate', { model, inputs: sequence })
      setResult(res.data)
      setStep(0)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, (result?.trace?.length ?? 1) - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))
  const activeState = result?.trace?.[step]?.afterState ?? 'S0'

  const currentTrace = result?.trace?.[step]
  const currentInput = currentTrace?.input
  const currentOutput = currentTrace?.output

  const getExplanation = () => {
    if (!result || !currentTrace) return ''

    if (model === 'moore') {
      if (currentOutput?.prodDispensed) {
        return `🟢 In the Moore model, output (product dispense) occurs automatically upon entering state ${currentTrace.afterState}, 
because output depends only on the state — not on pressing the button.`
      } else if (currentInput === 'IP') {
        return `ℹ️ Pressing IP here only resets the machine, since Moore already dispensed when it reached ${currentTrace.beforeState}.`
      } else {
        return `⚙️ Adding coins changes the state. The Moore machine will dispense automatically when state reaches S3 (≥75¢).`
      }
    } else {
      if (currentOutput?.prodDispensed) {
        return `🟢 In the Mealy model, output (product dispense) happens now because the input '${currentInput}' triggered it — 
Mealy outputs depend on both the current state and the input.`
      } else if (currentInput === 'IP') {
        return `⚠️ IP was pressed but funds are insufficient (${currentTrace.beforeState}). Mealy outputs only when both state and input conditions are satisfied.`
      } else {
        return `⚙️ Coins only update the internal state. Mealy won’t dispense until IP is pressed while balance ≥ 75¢.`
      }
    }
  }

  return (
    <main>
      <div className="container">

        {/* ======= Project Heading Section ======= */}
        <div className="project-header">
          <h1>Theory of Automata Project – Based Learning | Code Implementation</h1>
          <p><strong>By:</strong></p>
          <p>Sam Kamalesan (23WU0101154)</p>
          <p>Snigdha Roy (23WU0101159)</p>
        </div>

        <hr className="divider" />

        {/* ======= Main Simulation Section ======= */}
        <h1>Vending Machine FSM — Moore vs Mealy</h1>
        <p>Simulate and understand how output behavior differs between Moore and Mealy models.</p>

        <div className="controls">
          <div className="model-select">
            <label>
              <input
                type="radio"
                name="model"
                value="mealy"
                checked={model === 'mealy'}
                onChange={() => setModel('mealy')}
              />
              Mealy
            </label>
            <label>
              <input
                type="radio"
                name="model"
                value="moore"
                checked={model === 'moore'}
                onChange={() => setModel('moore')}
              />
              Moore
            </label>
          </div>

          <div className="buttons">
            {buttons.map((b) => (
              <button
                key={b.id}
                className="btn-secondary"
                onClick={() => addInput(b.id)}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="sequence">
            <strong>Sequence:</strong>
            {sequence.length ? (
              <div>
                {sequence.map((s, i) => (
                  <span key={i} className="chip">{s}</span>
                ))}
              </div>
            ) : (
              <span className="muted"> No inputs yet.</span>
            )}
          </div>

          <div>
            <button
              onClick={run}
              disabled={!sequence.length || loading}
              className="btn-primary"
            >
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
            <button onClick={clear} className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
              Clear
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="state-diagram">
              <h2>State Diagram (S0 → S3)</h2>
              <div className="states">
                {['S0', 'S1', 'S2', 'S3'].map((s) => (
                  <div
                    key={s}
                    className={`state ${s === activeState ? 'active' : ''}`}
                  >
                    <div className="name">{s}</div>
                    <div className="desc">
                      {s === 'S0'
                        ? '0¢'
                        : s === 'S1'
                        ? '25¢'
                        : s === 'S2'
                        ? '50¢'
                        : '≥75¢'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-controls">
                <button onClick={prevStep}>◀ Prev</button>
                <span>
                  Step {step + 1} / {result.trace.length}
                </span>
                <button onClick={nextStep}>Next ▶</button>
              </div>

              <div className="explanation">
                <h3>Explanation</h3>
                <p>{getExplanation()}</p>
              </div>
            </div>

            <div className="trace">
              <h2>Trace Output</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Input</th>
                    <th>Before</th>
                    <th>After</th>
                    <th>Accum</th>
                    <th>Output</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trace.map((t, i) => (
                    <tr key={i} className={i === step ? 'highlight' : ''}>
                      <td>{i + 1}</td>
                      <td>{t.input}</td>
                      <td>{t.beforeState}</td>
                      <td>{t.afterState}</td>
                      <td>{t.accumAfter}¢</td>
                      <td>
                        {t.output.prodDispensed
                          ? `Product + ${t.output.change}¢`
                          : '-'}
                      </td>
                      <td>{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <footer>
          <p>
            Implementation demonstrating <b>Moore vs Mealy FSM</b> for a 75¢ vending machine.
          </p>
        </footer>
      </div>
    </main>
  )
}

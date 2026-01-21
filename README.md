# Vending Machine: Moore and Mealy Virtualization

This project is a high-fidelity, web-based virtualization of Finite State Machines (FSM) applied to a vending machine control system. It serves as a comparative study of Moore and Mealy architectural patterns, built using the Next.js framework to provide an interactive and performant simulation environment.

## Technical Overview

The application simulates the sequential logic required to process currency inputs, track internal state transitions, and execute output logic for product dispensing.

### Moore Model
* **Logic Profile**: The output is strictly a function of the current state.
* **Characteristics**: Offers superior timing stability and simplified state-to-output mapping, ensuring synchronous behavior across the virtualization.

### Mealy Model
* **Logic Profile**: The output is determined by a combination of the current state and asynchronous external inputs.
* **Characteristics**: Achieves a more compact state register footprint and provides an immediate output response upon input detection.



## Tech Stack

* **Framework**: [Next.js](https://nextjs.org) (App Router)
* **Styling**: Tailwind CSS
* **Logic Engine**: Custom JavaScript-based FSM controllers
* **Deployment**: Vercel

## Getting Started

First, install the dependencies:

```bash
npm install
```
Then, run the development server:

```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

System Architecture
The virtualization engine is structured to mirror digital hardware components:

State Registers: Managed via React state to hold the current FSM position.

Combinational Logic: Pure functions that calculate the next state and outputs based on Moore/Mealy definitions.

Visualization Layer: Real-time rendering of state transition diagrams and truth tables.

To learn more about the underlying FSM logic or Next.js, take a look at the following resources:

Next.js Documentation - Learn about Next.js features and API.

Digital Logic Design - An overview of Finite State Machines.

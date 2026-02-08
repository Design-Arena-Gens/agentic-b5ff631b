// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize simulator
    initSimulator();
});

// VITT Simulator
function initSimulator() {
    const executeBtn = document.getElementById('execute-btn');
    const isaSelect = document.getElementById('isa-instruction');

    executeBtn.addEventListener('click', () => {
        const instruction = isaSelect.value;
        executeVITTSimulation(instruction);
    });
}

function executeVITTSimulation(instruction) {
    // Instruction database
    const instructions = {
        add: {
            name: "ADD r1, r2, r3",
            opcode: "0x00000001",
            operands: ["r2=0x1234", "r3=0x5678"],
            traditionalCycles: 5,
            vittCycles: 2
        },
        mul: {
            name: "MUL r4, r5, r6",
            opcode: "0x00000023",
            operands: ["r5=0xABCD", "r6=0x0042"],
            traditionalCycles: 12,
            vittCycles: 3
        },
        load: {
            name: "LOAD r7, [mem+0x1000]",
            opcode: "0x00000045",
            operands: ["mem=0x1000", "offset=0x0"],
            traditionalCycles: 8,
            vittCycles: 2
        },
        branch: {
            name: "BRANCH if_zero r8",
            opcode: "0x00000067",
            operands: ["r8=0x0000", "target=0x2000"],
            traditionalCycles: 15,
            vittCycles: 4
        }
    };

    const instr = instructions[instruction];

    // Stage 1: ISA Decode
    animateStage('stage1-output', `
Instruction: ${instr.name}
Opcode: ${instr.opcode}
Operands: ${instr.operands.join(', ')}

Decoding ISA format...
✓ Instruction decoded successfully
`, 500);

    // Stage 2: VITT Translation
    setTimeout(() => {
        animateStage('stage2-output', `
VITT Table Lookup:
Index: ${hashISAOpcode(instr.opcode)}
Entry Found: YES

Generating 128-bit micro-ops:
╔════════════════════════════════╗
║ [127:96] Neural Metadata      ║
║   0x${generateRandomHex(8)}           ║
║ [95:64]  Routing Path         ║
║   0x${generateRandomHex(8)}           ║
║ [63:0]   Data Payload         ║
║   0x${generateRandomHex(16)}   ║
╚════════════════════════════════╝

Micro-ops created: 3 parallel paths
`, 1000);
    }, 500);

    // Stage 3: Neural Prediction
    setTimeout(() => {
        const predictions = generatePredictions();
        animateStage('stage3-output', `
Neural Predictor Analysis:

Path Probabilities:
  Path 0: ${predictions[0]}% (SELECTED)
  Path 1: ${predictions[1]}% (SELECTED)
  Path 2: ${predictions[2]}%

Hardware Affinity:
  Execution Unit: ALU-Core-2
  Cache Domain: L1-D Node 0
  Prefetch Hints: 8 addresses queued

Bottleneck Risk: ${Math.floor(Math.random() * 15 + 5)}%
✓ Optimal path selected
`, 1500);
    }, 1500);

    // Stage 4: Execution
    setTimeout(() => {
        const result = generateResult(instruction);
        animateStage('stage4-output', `
Executing 128-bit vectorized ops:

Parallel Execution (2 paths):
┌─────────────────────────────┐
│ Path 0: ${result.path0}        │
│ Status: COMPLETED [Cycle 1] │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Path 1: ${result.path1}        │
│ Status: COMPLETED [Cycle 2] │
└─────────────────────────────┘

Result: ${result.final}
Status: ✓ SUCCESS
Speculation: 2/2 paths correct

Fast-lane update: Execution
count incremented (${Math.floor(Math.random() * 10000 + 1000)})
`, 2500);

        // Update metrics
        updateMetrics(instr.traditionalCycles, instr.vittCycles);
    }, 3000);
}

function animateStage(elementId, content, delay) {
    const element = document.getElementById(elementId);
    element.style.opacity = '0';

    setTimeout(() => {
        element.textContent = content;
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = '1';
    }, 50);
}

function updateMetrics(traditional, vitt) {
    setTimeout(() => {
        document.getElementById('traditional-cycles').textContent = traditional;
        document.getElementById('vitt-cycles').textContent = vitt;

        const speedup = (traditional / vitt).toFixed(2);
        document.getElementById('speedup').textContent = speedup + 'x';

        // Animate metrics
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            metric.style.transform = 'scale(1.2)';
            setTimeout(() => {
                metric.style.transition = 'transform 0.3s ease';
                metric.style.transform = 'scale(1)';
            }, 100);
        });
    }, 2600);
}

function hashISAOpcode(opcode) {
    // Simulate hash function
    const num = parseInt(opcode, 16);
    return '0x' + (num % 65536).toString(16).toUpperCase().padStart(4, '0');
}

function generateRandomHex(length) {
    let result = '';
    const chars = '0123456789ABCDEF';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generatePredictions() {
    const predictions = [
        Math.floor(Math.random() * 20 + 70),
        Math.floor(Math.random() * 20 + 60),
        Math.floor(Math.random() * 30 + 30)
    ];
    return predictions.sort((a, b) => b - a);
}

function generateResult(instruction) {
    const results = {
        add: {
            path0: "0x1234 + 0x5678 = 0x68AC",
            path1: "Flags: ZF=0 CF=0 OF=0",
            final: "r1 = 0x68AC"
        },
        mul: {
            path0: "0xABCD * 0x0042 = 0x002C5E3A",
            path1: "High bits: 0x0000",
            final: "r4 = 0x002C5E3A"
        },
        load: {
            path0: "Address: 0x1000",
            path1: "Data: 0xDEADBEEF",
            final: "r7 = 0xDEADBEEF"
        },
        branch: {
            path0: "r8 == 0: TRUE",
            path1: "Jump to: 0x2000",
            final: "PC = 0x2000"
        }
    };
    return results[instruction];
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add code block copy functionality
document.querySelectorAll('.code-block pre').forEach(codeBlock => {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-btn';
    copyButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(138, 43, 226, 0.6);
        border: 1px solid rgba(138, 43, 226, 0.8);
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const wrapper = codeBlock.parentElement;
    wrapper.style.position = 'relative';
    wrapper.appendChild(copyButton);

    wrapper.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
    });

    wrapper.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
    });

    copyButton.addEventListener('click', () => {
        const code = codeBlock.textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
});
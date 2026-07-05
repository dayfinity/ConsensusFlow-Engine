// ConsensusFlow Engine - Rule-Based Blockchain Simulation

// Node registry holds all participants in the system
class NodeRegistry {
    constructor() {
        this.nodes = new Map();
    }

    register(id, stake) {
        this.nodes.set(id, {
            id,
            stake,
            reputation: 1
        });
    }

    getAll() {
        return Array.from(this.nodes.values());
    }
}

// Block candidate representation
class BlockCandidate {
    constructor(data, proposer) {
        this.data = data;
        this.proposer = proposer;
        this.approvals = [];
        this.rejected = false;
    }

    addApproval(nodeId) {
        this.approvals.push(nodeId);
    }
}

// Validator engine controlling decision flow
class ValidatorEngine {
    constructor(registry) {
        this.registry = registry;
    }

    evaluate(block) {
        const validators = this.registry.getAll();

        for (const v of validators) {

            // Weighted decision logic based on stake
            const threshold = v.stake * v.reputation;

            if (threshold > 50) {
                block.addApproval(v.id);
            }
        }

        return block;
    }
}

// Consensus controller managing execution pipeline
class ConsensusController {
    constructor(registry) {
        this.registry = registry;
        this.engine = new ValidatorEngine(registry);
        this.chain = [];
    }

    proposeBlock(data, proposer) {
        return new BlockCandidate(data, proposer);
    }

    runConsensus(block) {

        const evaluated = this.engine.evaluate(block);

        // Rule: majority approval required
        const validatorsCount = this.registry.getAll().length;

        if (evaluated.approvals.length >= Math.ceil(validatorsCount / 2)) {
            this.chain.push(evaluated);
            console.log("Block accepted into chain");
        } else {
            evaluated.rejected = true;
            console.log("Block rejected by consensus");
        }
    }

    showChain() {
        console.log("\n--- FINAL CHAIN STATE ---");
        this.chain.forEach((b, i) => {
            console.log(
                i + ": " + b.data +
                " | proposer: " + b.proposer +
                " | approvals: " + b.approvals.length
            );
        });
    }
}

// -------------------- Simulation --------------------

// Initialize registry and system
const registry = new NodeRegistry();

// Register validators with staking power
registry.register("Node-A", 60);
registry.register("Node-B", 30);
registry.register("Node-C", 80);
registry.register("Node-D", 45);

// Create consensus system
const system = new ConsensusController(registry);

// Create block proposals
const block1 = system.proposeBlock("Transfer 10 coins", "Node-A");
const block2 = system.proposeBlock("Reward distribution", "Node-C");

// Run consensus cycle
system.runConsensus(block1);
system.runConsensus(block2);

// Output final chain state
system.showChain();

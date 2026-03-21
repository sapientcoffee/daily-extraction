const llm = require('../src/llm');

describe('LLM Module', () => {
    describe('summarizeForSRE', () => {
        it('should summarize short content', async () => {
            const summary = await llm.summarizeForSRE('short');
            expect(summary).toBe('Minor update to services - monitor for unexpected metric bumps.');
        });

        it('should summarize long content with SRE TL;DR', async () => {
            const longContent = 'A'.repeat(150);
            const summary = await llm.summarizeForSRE(longContent);
            expect(summary).toContain('[SRE TL;DR] Potential operational impact.');
            expect(summary.length).toBeLessThan(200);
        });
    });

    describe('categorizeNote', () => {
        it('should categorize Compute', async () => {
            expect(await llm.categorizeNote('New GKE feature')).toBe('Compute');
            expect(await llm.categorizeNote('Compute Engine update')).toBe('Compute');
            expect(await llm.categorizeNote('VM instances')).toBe('Compute');
        });

        it('should categorize Database', async () => {
            expect(await llm.categorizeNote('Cloud SQL update')).toBe('Database');
            expect(await llm.categorizeNote('Spanner release')).toBe('Database');
        });

        it('should categorize Network', async () => {
            expect(await llm.categorizeNote('VPC peering')).toBe('Network');
        });

        it('should categorize AI/ML', async () => {
            expect(await llm.categorizeNote('Vertex AI')).toBe('AI/ML');
        });

        it('should categorize Other', async () => {
            expect(await llm.categorizeNote('Billing update')).toBe('Other');
            expect(await llm.categorizeNote('')).toBe('Other');
        });
    });
});

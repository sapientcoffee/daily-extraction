const scraper = require('../src/scraper');
const llm = require('../src/llm');
const feedStore = require('../src/feedStore');
const Parser = require('rss-parser');

jest.mock('../src/llm');
jest.mock('rss-parser');

describe('scraper Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Parser.prototype.parseURL.mockResolvedValue({
            items: [
                {
                    guid: '1',
                    title: 'Item 1',
                    contentSnippet: 'Content 1',
                    link: 'http://test.com/1',
                    pubDate: new Date().toISOString()
                }
            ]
        });

        llm.summarizeForSRE.mockResolvedValue('[SRE TL;DR] Content 1 summary');
        llm.categorizeNote.mockResolvedValue('Compute');

        // We can't mock feedStore easily without jest.mock('../src/feedStore')
        // But since it's an in-memory store, we can just clear/add feeds.
        // Wait, to ensure we don't interfere with other tests, let's just leave the default feed.
    });

    it('should fetch and summarize notes', async () => {
        const notes = await scraper.fetchAndSummarizeNotes();
        expect(notes.length).toBeGreaterThan(0);
        expect(notes[0].title).toBe('Item 1');
        expect(notes[0].summary).toBe('[SRE TL;DR] Content 1 summary');
        expect(notes[0].category).toBe('Compute');
    });

    it('should handle feed fetch errors gracefully', async () => {
        Parser.prototype.parseURL.mockRejectedValue(new Error('Network error'));
        const notes = await scraper.fetchAndSummarizeNotes();
        
        expect(notes.length).toBeGreaterThan(0);
        expect(notes[0].title).toContain('Could not fetch');
        expect(notes[0].summary).toContain('Failed to load feed');
        expect(notes[0].category).toBe('Other');
    });
});

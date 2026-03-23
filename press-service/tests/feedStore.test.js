const feedStore = require('../src/feedStore');

describe('feedStore Module', () => {
    beforeEach(() => {
        // clear the store before each test (except the seeded one, which we can't easily clear without exposing a reset method, so we'll just track length)
    });

    it('should list feeds and contain the default feeds', () => {
        const feeds = feedStore.listFeeds();
        expect(feeds.length).toBeGreaterThanOrEqual(3);
        expect(feeds.some(f => f.name === 'Gemini Code Assist')).toBe(true);
        expect(feeds.some(f => f.product === 'Gemini')).toBe(true);
        expect(feeds.some(f => f.icon === '✨')).toBe(true);
    });

    it('should add a new feed with optional product and icon', () => {
        const newFeed = feedStore.addFeed('Test Feed', 'http://test.com/rss', 'Test Product', '📦');
        expect(newFeed).toHaveProperty('id');
        expect(newFeed.name).toBe('Test Feed');
        expect(newFeed.url).toBe('http://test.com/rss');
        expect(newFeed.product).toBe('Test Product');
        expect(newFeed.icon).toBe('📦');

        const feed = feedStore.getFeed(newFeed.id);
        expect(feed).toEqual(newFeed);
    });

    it('should remove a feed', () => {
        const newFeed = feedStore.addFeed('To Remove', 'http://remove.com/rss');
        const existed = feedStore.removeFeed(newFeed.id);
        expect(existed).toBe(true);
        expect(feedStore.getFeed(newFeed.id)).toBeNull();
    });

    it('should return false when removing non-existent feed', () => {
        expect(feedStore.removeFeed('does-not-exist')).toBe(false);
    });
});

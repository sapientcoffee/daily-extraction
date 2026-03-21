const feedStore = require('../src/feedStore');

describe('feedStore Module', () => {
    beforeEach(() => {
        // clear the store before each test (except the seeded one, which we can't easily clear without exposing a reset method, so we'll just track length)
    });

    it('should list feeds and contain the default feed', () => {
        const feeds = feedStore.listFeeds();
        expect(feeds.length).toBeGreaterThanOrEqual(1);
        expect(feeds.some(f => f.name === 'GCP Release Notes')).toBe(true);
    });

    it('should add a new feed', () => {
        const newFeed = feedStore.addFeed('Test Feed', 'http://test.com/rss');
        expect(newFeed).toHaveProperty('id');
        expect(newFeed.name).toBe('Test Feed');
        expect(newFeed.url).toBe('http://test.com/rss');

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

export class HNService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.debounceTimeout = null;
  }

  async searchPosts(query, debounceDelay = 100) {
    return new Promise((resolve, reject) => {
      clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`
          );
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          const results = await response.json();
          resolve(results.hits || []);
        } catch (error) {
          console.error('Search failed:', error.message);
          reject(error);
        }
      }, debounceDelay);
    });
  }

  async getTopStoryIds() {
    const response = await fetch(`${this.baseURL}/topstories.json`);
    if (!response.ok) throw new Error('Failed to fetch top stories');
    return response.json();
  }

  async getStoryDetails(storyId) {
    const response = await fetch(`${this.baseURL}/item/${storyId}.json`);
    if (!response.ok)
      throw new Error(`Failed to fetch story details for ID ${storyId}`);
    return response.json();
  }

  async getTopStories(limit = 10) {
    const storyIds = await this.getTopStoryIds();
    const limitedIds = storyIds.slice(0, limit);

    const storyDetails = await Promise.all(
      limitedIds.map((id) => this.getStoryDetails(id))
    );
    return storyDetails;
  }

  async fetchPostComments(postId) {
    try {
      const response = await fetch(
        `http://hn.algolia.com/api/v1/items/${postId}`
      );
      if (!response.ok) throw new Error('Failed to fetch post comments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching post comments:', error);
      throw error;
    }
  }
}

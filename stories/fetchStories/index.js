export const fetchStories = async (client, range) => {
  try {
    const { start, end } = range;
    const response = await client.post("/stories/search", { completed_at_start: start.toISOString(), completed_at_end: end.toISOString(), group_id: '64e3707d-6c9d-4786-aa8d-ff2b891c8def' });
    console.log("🔍 Searching for stories...");
    console.log(`✅ Fetched ${response.data.length} stories from Shortcut API.`);
    console.log(`Found ${response.data.length} completed stories:\n`);
    const storyPointsTotal = response.data.reduce((total, story) => {
      return total + (story.estimate || 0);
    }, 0);
    const bugTotal = response.data.reduce((total, story) => {
      return total + (story.story_type === 'bug' ? 1 : 0);
    }, 0);
    const epicStoriesCompleted = response.data.filter(story => story.epic_id).length;
    console.log(`- Stories linked to Epics: ${epicStoriesCompleted}`);
    console.log(`- Total Bugs: ${bugTotal}`);
    console.log(`Total Story Points: ${storyPointsTotal}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ API Error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("❌ Network Error: No response received from Shortcut API");
    } else {
      console.error("❌ Error:", error.message);
    }
    throw error;
  }
}
export const fetchEpics = async (client, range) => {
  try {
    const response = await client.get("/epics");
    const { start, end } = range;
    const completedEpics = response.data.filter((epic) => {
      if (!epic.completed || !epic.completed_at) return false;
      const completedAt = new Date(epic.completed_at);
      return completedAt >= start && completedAt <= end;
    });
    console.log("🔍 Searching for epics...");
    console.log(`✅ Fetched ${response.data.length} epics from Shortcut API.`);
    return completedEpics;
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
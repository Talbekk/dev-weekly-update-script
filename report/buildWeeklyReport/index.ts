import type { ApiClient, DateRange, Epic, EpicSummary, Story, StorySummary, WeeklyReport } from "../../types";
import { devGroup } from "../../data/groups";
import { fetchEpics } from "../../epics/fetchEpics";
import { fetchBugs } from "../../bugs/fetchBugs";
import { fetchCompletedStories } from "../../stories/fetchCompletedStories";
import { filterActiveEpics } from "../../epics/filterActiveEpics";
import { getCompletedEpics } from "../../epics/getCompletedEpics";
import { getCompletedStoryPoints } from "../../stories/getCompletedStoryPoints";
import { getBugsCleared } from "../../stories/getBugsCleared";
import { getStoriesCompletedByAI } from "../../stories/getStoriesCompletedByAI";
import { getEpicStoriesCompleted } from "../../epics/getEpicStoriesCompleted";
import { getEpicPointsCompleted } from "../../epics/getEpicPointsCompleted";
import { getPriorityBugsCount } from "../../bugs/getPriorityBugsCount";

const toEpicSummary = (epic: Epic): EpicSummary => ({
  id: epic.id,
  name: epic.name,
});

const toStorySummary = (story: Story): StorySummary => ({
  id: story.id,
  name: story.name,
  completedAt: story.completed_at,
  epicId: story.epic_id,
});

export const buildWeeklyReport = async (client: ApiClient, range: DateRange): Promise<WeeklyReport> => {
  const [epics, bugs, completedStories] = await Promise.all([
    fetchEpics(client),
    fetchBugs(client),
    fetchCompletedStories(client, range),
  ]);

  const activeEpics = filterActiveEpics(epics, devGroup.id);
  const completedEpics = getCompletedEpics(epics, range);

  const bugsWithCustomFields = bugs.filter((bug) => bug.custom_fields.length > 0);
  const epicStories = getEpicStoriesCompleted(completedStories);

  return {
    range: {
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    storiesCompleted: completedStories.length,
    pointsCompleted: getCompletedStoryPoints(completedStories),
    bugsCleared: getBugsCleared(completedStories),
    aiStories: getStoriesCompletedByAI(completedStories).map(toStorySummary),
    epicStoriesCompleted: epicStories.length,
    epicPointsCompleted: getEpicPointsCompleted(epicStories),
    epicStories: epicStories.map(toStorySummary),
    activeEpics: activeEpics.map(toEpicSummary),
    completedEpics: completedEpics.map(toEpicSummary),
    openBugs: {
      total: bugs.length,
      highestPriority: getPriorityBugsCount(bugsWithCustomFields, "Highest"),
      highPriority: getPriorityBugsCount(bugsWithCustomFields, "High"),
    },
  };
};

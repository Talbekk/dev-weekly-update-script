import type { WeeklyReport } from "../../types";

export const displayReport = (report: WeeklyReport): void => {
  const start = new Date(report.range.start).toDateString();
  const end = new Date(report.range.end).toDateString();
  console.log(`📅 Report for the week: ${start} - ${end}\n`);

  console.log(`📊 Total completed stories: ${report.storiesCompleted}`);
  console.log(`📊 Total completed story points: ${report.pointsCompleted}`);
  console.log(`📊 Total bugs cleared: ${report.bugsCleared}`);

  console.log(`\n📊 Total stories completed by AI: ${report.aiStories.length}`);
  report.aiStories.forEach((story) => {
    console.log(`- ${story.name} - Completed at: ${story.completedAt}`);
  });

  console.log(`\n📊 Total epic stories completed: ${report.epicStoriesCompleted}`);
  console.log(`📊 Total epic points completed: ${report.epicPointsCompleted}`);
  report.epicStories.forEach((story) => {
    console.log(`- ${story.name} (Epic ID: ${story.epicId}) - Completed at: ${story.completedAt}`);
  });

  console.log(`\n📊 Total completed epics: ${report.completedEpics.length}`);
  report.completedEpics.forEach((epic) => {
    console.log(`- ${epic.name}`);
  });

  console.log(`\n📊 Total active epics: ${report.activeEpics.length}`);
  report.activeEpics.forEach((epic) => {
    console.log(`- ${epic.name}`);
  });

  console.log(`\n📊 Total open bugs: ${report.openBugs.total}`);
  console.log(`📊 Highest priority bugs: ${report.openBugs.highestPriority}`);
  console.log(`📊 High priority bugs: ${report.openBugs.highPriority}`);
};

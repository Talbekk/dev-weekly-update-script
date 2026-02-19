export const displayEpics = (searchResults) => {
    const epics = searchResults || [];
    console.log(`Found ${epics.length} completed epics:\n`);
    epics.map((epic) => {
        console.log(`- ${epic.name} (ID: ${epic.id})`);
        console.log(epic);
    });
}
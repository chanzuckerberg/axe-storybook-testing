function assertSkip(skip) {
  if (typeof skip === 'undefined') {
    return;
  }
  if (typeof skip !== 'boolean') {
    throw new Error(`Given skip option '${skip}' is invalid`);
  }
}

export default function selectStories(rawStories) {
  let selectedStories = [];

  Object.values(rawStories).forEach(story => {
    let options = {};

    if (story.parameters && story.parameters.axe) {
      options = story.parameters.axe;
      assertSkip(options.skip);
    }

    if (!options.skip) {
      const name = `${story.kind}: ${story.name}`;
      const encodedParams = story.id
        ? `id=${encodeURIComponent(story.id)}`
        : `selectedKind=${encodeURIComponent(story.kind)}` +
          `&selectedStory=${encodeURIComponent(story.name)}`;

      selectedStories.push({
        name,
        encodedParams,
        options,
      });
    }
  });

  return selectedStories;
}

export function sortLocations(locations:any[]) {
  const getStateName = (loc:any) =>
    loc.type === 'state' ? loc.name : loc.state.name;

  // Group karo state-wise
  const grouped:any = {};

  locations.forEach((loc) => {
    const stateName = getStateName(loc);
    if (!grouped[stateName]) {
      grouped[stateName] = { stateData: null, counties: [] };
    }
    if (loc.type === 'state') {
      grouped[stateName].stateData = loc;
    } else {
      grouped[stateName].counties.push(loc);
    }
  });

  // State names ko sort karo
  const sortedStateNames = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b)
  );

  // Final nested array banao
  const result = sortedStateNames.map((stateName) => {
    const group = grouped[stateName];
    const sortedCounties = group.counties.sort((a:any, b:any) =>
      a.name.localeCompare(b.name)
    );

    // Agar state object exist karta ho array mein
    if (group.stateData) {
      return {
        ...group.stateData,
        counties: sortedCounties,
      };
    }

    // Agar sirf counties hon, state object na ho (fallback)
    return {
      name: stateName,
      type: 'state',
      counties: sortedCounties,
    };
  });

  return result;
}
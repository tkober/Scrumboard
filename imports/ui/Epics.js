class Epics {
  constructor(userstories) {
    const epics = new Set(userstories.map((story) => {
      return this.unifyEpicName(story.epic);
    }));
    const colors = this.generateColors(epics.size);

    this.colorMap = {};
    let i = 0;
    for (var it = epics.values(), epic=null; epic=it.next().value; ) {
      this.colorMap[epic] = colors[i];
      i++;
    }
  }

  unifyEpicName(name) {
    var result = name.toLowerCase();
    result = result.replace('.', '');
    result = result.replace(' ', '');
    result = result.replace('-', '');
    result = result.replace('_', '');
    return result;
  }

  generateColors(number) {
    var result = [];
    let steps = 360 / number;
    for (let i = 0; i < number; i++) {
      let hue = i * steps;
      result.push(this.hslColor(hue, 100, 50));
    }

    return result;
  }

  hslColor(h, s, l) {
    return { h: h, s: s, l: l };
  }

  colorForEpic(epic) {
    return this.colorMap[this.unifyEpicName(epic)];
  }

  cssColorForEpic(epic) {
    let hsl = this.colorForEpic(epic);
    if (hsl === undefined) {
      hsl = this.hslColor(0, 100, 100);
    }
    let result = "hsla(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%, 0.85)";
    return result;
  }
}

export default Epics;

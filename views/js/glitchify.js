let letters = {
  "a": "@4",
  "b": "&68",
  "c": "<(",
  "d": ")>",
  "e": "3",
  "g": "9",
  "i": "1!",
  "l": "1",
  "n": "^",
  "o": "0",
  "s": "5",
  "t": "+7",
  "z": "2"
};

const spanify = (t, tries=10) => {

  // i know this wouldnt pass a code review. im speedrunning.
  for (var i = 0; i < tries; i++) {
    const ret = ((text) => {
      var nodes = text.childNodes;
      var numLetters = 0;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 3) {
          numLetters += nodes[i].textContent.length;
        }
      }

      var choice = Math.floor(Math.random() * numLetters);
      var j = 0;

      while (true) {
        if (nodes[j].nodeType !== 3) {
          j++;
          continue;
        }

        var textLen = nodes[j].textContent.length;
        if (choice >= textLen) {
          choice -= textLen;
          j++;
          continue;
        }

        if (!/[a-zA-Z]/.test(nodes[j].textContent[choice])) {
          return null;
        }

        const beforeNode = nodes[j];
        const candidate = beforeNode.splitText(choice);
        const afterNode = candidate.splitText(1);

        const span = $new('span', 'glitch').html(candidate.textContent);
        candidate.parentNode.replaceChild(span, candidate);

        return span;
      }
    })(t);
    if (ret) return ret;
  }
};

// badly misusing promises here. idrc
const glitchOnce = async (span) => {
  if (span == null) return;

  const actual = span.textContent;
  var cased = actual.toLowerCase();
  if (/[a-z]/.test(actual)) {
    cased = actual.toUpperCase();
  }
  if (actual.toLowerCase() in letters) {
    cased += letters[actual];
  }
  while (true) {
    var choice = Math.random();
    if (choice < 0.2) {
      span.textContent = actual;
      await sleep(Math.random() * 1500 + 500);
    } else if (choice < 0.8) {
      span.textContent = cased.charAt(Math.floor(Math.random() * cased.length));
      await sleep(Math.random() * 300 + 100);
    } else {
      span.textContent = String.fromCharCode(33 + Math.random() * 94);
      await sleep(Math.random() * 50 + 100);
    }
  }
};

const glitchify = (amt) => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let candidates = Array.from(document.querySelectorAll(".glitchable"));
    for (var i = 0; i < amt; i++) {
      glitchOnce(spanify(candidates[Math.floor(Math.random() * candidates.length)]));
    }
  }
}

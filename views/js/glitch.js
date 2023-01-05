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
let messages = [
  "Stems are not available for the selected song. Please do not try to access them again.",
  "Please do not try to access stems again, as it may interfere with the intended consumer experience.",
  "Stems are not available at this time. After all, do you really think you deserve them?",
  "What are you trying to accomplish? What are you trying to achieve?",
  "Turn back."
]
var glitchClicks = 0;

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
}

const glitchify = async (span) => {
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
}

$each(".stem-button", b => b.addEventListener("click", () => {
  $(".warning-message p").html(messages[glitchClicks]);
  glitchClicks++;
  if (glitchClicks == messages.length) {
    $(".warning-message .close").html("Enter");
    $(".warning-message h3").html("ONE LAST CHANCE.");
  }

  $(".warning-background").removeClass("hidden");
  $(".warning-message").removeClass("hidden");
  $("body").addClass("noscroll");

  $(".background-flower").getAnimations()[0].playbackRate *= 2;
  $(".sunflower").getAnimations()[0].playbackRate *= 2;
  $(".transition-background").style.setProperty("opacity", glitchClicks * 0.2);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)')) {
    let candidates = Array.from(document.querySelectorAll(".glitchable"));
    for (var i = 0; i < 20; i++) {
      glitchify(spanify(candidates[Math.floor(Math.random() * candidates.length)]));
    }
  }

}));

$(".warning-message button.close").addEventListener("click", () => {
  if (glitchClicks < messages.length) {
    $(".warning-background").addClass("hidden");
    $(".warning-message").addClass("hidden");
    $("body").removeClass("noscroll");
  } else {
    window.location.href = "https://stemmy.versary.town/a/lfav";
  }
});

$(".warning-header button").addEventListener("click", () => {
  if (glitchClicks < messages.length) {
    $(".warning-background").addClass("hidden");
    $(".warning-message").addClass("hidden");
    $("body").removeClass("noscroll");
  } else {
    window.location.reload();
  }
});

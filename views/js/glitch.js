let messages = [
  "Stems are not available for the selected song. Please do not try to access them again.",
  "Please do not try to access stems again, as it may interfere with the intended consumer experience.",
  "Stems are not available at this time. After all, do you really think you deserve them?",
  "What are you trying to accomplish? What are you trying to achieve?",
  "Turn back."
]
var glitchClicks = 0;

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

  glitchify(20);
}));

$(".warning-message button.close").addEventListener("click", () => {
  if (glitchClicks < messages.length) {
    $(".warning-background").addClass("hidden");
    $(".warning-message").addClass("hidden");
    $("body").removeClass("noscroll");
  } else {
    window.location.href = "stems";
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

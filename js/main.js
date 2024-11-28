window.onload = () => {
    const cursorInnerEl = document.querySelector(".circle-in");
    const cursorOuterEl = document.querySelector(".circle-out");
    window.onmousemove = function (event) {
      cursorOuterEl.style.transform = "translate(" + event.clientX + "px, " + event.clientY + "px" + ")";
      cursorInnerEl.style.transform = "translate(" + event.clientX + "px, " + event.clientY + "px" + ")";
    };
  };
  
const playBoard = document.getElementById("gameboard");

const numberOfDivs = 230;

const COLS = 10;
const ROWS = 22;
const STARTPOS = 4;
let timerId = null;

const lTetr = [
  [1, COLS + 1, COLS * 2 + 1, 2],
  [COLS, COLS + 1, COLS + 2, COLS * 2 + 2],
  [1, COLS + 1, COLS * 2 + 1, COLS * 2],
  [COLS, COLS * 2, COLS * 2 + 1, COLS * 2 + 2],
];

const zTetr = [
  [0, COLS, COLS + 1, COLS * 2 + 1],
  [COLS + 1, COLS + 2, COLS * 2, COLS * 2 + 1],
  [0, COLS, COLS + 1, COLS * 2 + 1],
  [COLS + 1, COLS + 2, COLS * 2, COLS * 2 + 1],
];

const tTetr = [
  [1, COLS, COLS + 1, COLS + 2],
  [1, COLS + 1, COLS + 2, COLS * 2 + 1],
  [COLS, COLS + 1, COLS + 2, COLS * 2 + 1],
  [1, COLS, COLS + 1, COLS * 2 + 1],
];

const oTetr = [
  [0, 1, COLS, COLS + 1],
  [0, 1, COLS, COLS + 1],
  [0, 1, COLS, COLS + 1],
  [0, 1, COLS, COLS + 1],
];

const iTetr = [
  [1, COLS + 1, COLS * 2 + 1, COLS * 3 + 1],
  [COLS, COLS + 1, COLS + 2, COLS + 3],
  [1, COLS + 1, COLS * 2 + 1, COLS * 3 + 1],
  [COLS, COLS + 1, COLS + 2, COLS + 3],
];

const Tetris = [lTetr, zTetr, tTetr, oTetr, iTetr];
const statusActionDict = {
  idle: { status: "started", display: "Pause" },
  started: { status: "paused", display: "Continue" },
  paused: { status: "started", display: "Pause" },
  gameover: { status: "started", display: "Pause" },
};

const getNewTetris = () => {
  const randomTetris = Math.floor(Math.random() * Tetris.length);
  return Tetris[randomTetris];
};

let gameStatus = "idle";
const tetrisStartPos = 4;
// initial current tetris, position and rotation
let currentTetris = getNewTetris();
let currentPos = tetrisStartPos;
let currentRotation = 0;

// Use Array.from to create an array of div elements
let Matrix = Array.from({ length: numberOfDivs }, (_, index) => {
  const newDiv = document.createElement("div");

  if (index < 200) {
    newDiv.className = "blank";
  } else {
    newDiv.className = "bottom";
  }
  return newDiv;
});

// add tetris to the board
Matrix.forEach((div) => {
  playBoard.appendChild(div);
});

let counter = 0;

const handleStart = () => {
  const targetElement = document.getElementById("start");
  const currentStatus = gameStatus;
  gameStatus = statusActionDict[currentStatus].status;
  targetElement.innerHTML = statusActionDict[currentStatus].display;
  if (currentStatus === "started") {
    return clearTimer();
  } else {
    return setTimer();
  }
};

const setTimer = () => {
  timerId = setInterval(() => {
    handleInterval();
  }, 700);
  return timerId;
};

const handleInterval = () => {
  let gameOver;
  // remove the current tetris
  unDraw();
  // check if the current tetris can move down
  if (!checkTaken()) {
    currentPos += COLS;
  } else {
    // check if the game is over
    if (currentPos < COLS) {
    }
    // if not, add the current tetris to the board

    gameOver = handleTaken();
    if (gameOver) {
      handelGameOver();
      return;
    }

    // get a new tetris
    currentTetris = getNewTetris();
    currentPos = tetrisStartPos;
    currentRotation = 0;
  }
  // draw new tetris
  Draw();
  handelRemove();
};

const handelGameOver = () => {
  gameStatus = "gameover";
  document.getElementById("start").innerHTML = "Game Over!";
  timerId = clearTimer();
  // prepare to restart the game
  setTimeout(() => {
    Matrix.forEach((div) => {
      div.classList.remove("tetris");
      div.classList.remove("taken");
      div.classList.add("blank");
    });
    document.getElementById("start").innerHTML = "Start";
  }, 4000);
};

const checkTaken = () => {
  return currentTetris[currentRotation].some((pos) => {
    return (
      Matrix[currentPos + pos + COLS].classList.contains("bottom") ||
      Matrix[currentPos + pos + COLS].classList.contains("taken")
    );
  });
};

const handleTaken = () => {
  currentTetris[currentRotation].forEach((pos) => {
    Matrix[currentPos + pos].classList.remove("tetris");
    Matrix[currentPos + pos].classList.add("taken");
  });
  if (currentPos <= COLS) {
    return true;
  }
  return false;
};

const clearTimer = () => {
  clearInterval(timerId);
  return null;
};

document.getElementById("start").addEventListener("click", () => {
  timerId = handleStart();
});

// handel key control
document.addEventListener("keydown", function (event) {
  if (gameStatus !== "started") {
    return;
  }
  switch (event.key) {
    case "a":
    case "A":
      handelLeft();
      handelRemove();
      // Add your action for when 'A' is pressed
      break;
    case "l":
    case "L":
      handelRight();
      handelRemove();
      // Add your action for when 'S' is pressed
      break;
    // case "j":
    // case "J":
    //   handelDown();
    //   handelRemove();
    // break;
    case "j":
    case "J":
      handelRotate();
      handelRemove();
      break;
    // Add any other keys you're interested in
    default:
      // Code to run if none of the specific keys are pressed
      break;
  }
});

const handelLeft = () => {
  const noMove = currentTetris[currentRotation].some((pos) => {
    return (
      (currentPos + pos) % COLS === 0 ||
      Matrix[currentPos + pos - 1].classList.contains("taken")
    );
  });

  if (noMove) {
    return;
  } else {
    unDraw();
    currentPos -= 1;
    Draw();
  }
};

const handelRight = () => {
  const noMove = currentTetris[currentRotation].some((pos) => {
    return (
      (currentPos + pos) % COLS === COLS - 1 ||
      Matrix[currentPos + pos + 1].classList.contains("taken")
    );
  });

  if (noMove) {
    return;
  } else {
    unDraw();
    currentPos += 1;
    Draw();
  }
};

const handelDown = () => {
  const noMove = currentTetris[currentRotation].some((pos) => {
    return (
      Matrix[currentPos + 3 * COLS].classList.contains("taken") ||
      Matrix[currentPos + 3 * COLS].classList.contains("bottom")
    );
  });

  if (noMove) {
    return;
  } else {
    unDraw();
    currentPos += COLS;
    Draw();
  }
};

const handelRotate = () => {
  const newRotation = (currentRotation + 1) % currentTetris.length;
  // const noMove = currentTetris[newRotation].some((pos) => {
  //   return (
  //     Matrix[currentPos + pos].classList.contains("taken") ||
  //     (currentPos + pos) % COLS === COLS - 1 ||
  //     (currentPos + pos) % COLS === 0
  //   );
  // });
  const noMove = false;

  if (noMove) {
    return;
  } else {
    unDraw();
    currentRotation = newRotation;
    Draw();
  }
};

const unDraw = () => {
  currentTetris[currentRotation].forEach((pos) => {
    Matrix[currentPos + pos].classList.remove("tetris");
    Matrix[currentPos + pos].classList.add("blank");
  });
};

const Draw = () => {
  currentTetris[currentRotation].forEach((pos) => {
    Matrix[currentPos + pos].classList.remove("blank");
    Matrix[currentPos + pos].classList.add("tetris");
  });
};

const handelRemove = () => {
  const newRow = Array.from({ length: COLS }, (_, index) => {
    const newDiv = document.createElement("div");
    newDiv.className = "blank";
    return newDiv;
  });
  let i = ROWS - 1;
  while (i >= 0) {
    let rowFilled = Matrix.slice(i * COLS, i * COLS + COLS).every((div) => {
      return div.classList.contains("taken");
    });

    if (rowFilled) {
      // move all above rows down
      for (let j = i; j > 0; j--) {
        for (let k = 0; k < COLS; k++) {
          Matrix[j * COLS + k].classList = Matrix[(j - 1) * COLS + k].classList;
        }
      }

      // add a blank line in the top
      for (let j = 0; j < COLS; j++) {
        Matrix[j].classList.remove("taken");
        Matrix[j].classList.add("blank");
      }
    } else {
      i--;
    }
  }
};

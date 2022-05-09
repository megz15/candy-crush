document.addEventListener("DOMContentLoaded", () => {
  const width = parseInt(prompt("Enter table side length", "8"));
  const grid = document.querySelector(".grid");
  grid.style.height = width * 70 + "px";
  grid.style.width = width * 70 + "px";
  const scoreDisplay = document.querySelector("#score");
  const squares = [];
  const candyColours = [
    "url(candy/images/red.png)",
    "url(candy/images/yellow.png)",
    "url(candy/images/orange.png)",
    "url(candy/images/purple.png)",
    "url(candy/images/green.png)",
    "url(candy/images/blue.png)",
  ];
  let score = 0;

  function logic() {
    //Create board
    createBoard = () => {
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");

        square.setAttribute("draggable", true);
        square.setAttribute("id", i);

        let randomColour = Math.floor(Math.random() * candyColours.length);
        square.style.backgroundImage = candyColours[randomColour];

        grid.appendChild(square);
        squares.push(square);
      }
    };
    createBoard();

    //Drag the candies
    let colourBeingDragged,
      colourBeingReplaced,
      squareIdBeingDragged,
      squareIdBeingReplaced;

    squares.forEach((square) =>
      square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
      square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
      square.addEventListener("dragleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));
  }

  function dragStart() {
    colourBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {}

  function dragDrop() {
    colourBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    squares[squareIdBeingDragged].style.backgroundImage = colourBeingReplaced;
    this.style.backgroundImage = colourBeingDragged;
  }

  function dragEnd() {
    //what is a valid move?
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged + 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + width,
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      if (checkRow(4) || checkColumn(4) || checkRow(3) || checkColumn(3)) {
        squareIdBeingReplaced = null;
      } else {
        squares[squareIdBeingReplaced].style.backgroundImage =
          colourBeingReplaced;
        squares[squareIdBeingDragged].style.backgroundImage =
          colourBeingDragged;
      }
      //squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage =
        colourBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colourBeingDragged;
    } else
      squares[squareIdBeingDragged].style.backgroundImage = colourBeingDragged;
  }

  //Drop candies
  moveDown = () => {
    for (let i = 0; i < width * width - width - 1; i++) {
      const firstRow = [];
      for (let j = 0; j < width; j++) {
        firstRow.push(j);
      }

      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && squares[i].style.backgroundImage === "") {
        let randomColour = Math.floor(Math.random() * candyColours.length);
        squares[i].style.backgroundImage = candyColours[randomColour];
      }

      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
  };

  //Checking for matches

  //Check rows and columns
  checkRow = (rows) => {
    for (let i = 0; i < width * width - (rows - 1); i++) {
      if (i % width > width - rows) continue;

      let rowOfThreeFour = [];

      function add(rowval) {
        for (let j = 0; j < rowval; j++) {
          rowOfThreeFour.push(i + j);
        }
      }
      add(rows);

      let decidedColour = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        rowOfThreeFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColour && !isBlank
        )
      ) {
        score += rows;
        scoreDisplay.innerHTML = score;
        rowOfThreeFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  };

  //Checking for column of 3
  checkColumn = (cols) => {
    for (let i = 0; i <= width * width - (cols - 1) * width - 1; i++) {
      let colOfThreeFour = [];

      function add(colval) {
        for (let j = 0; j < colval; j++) {
          colOfThreeFour.push(i + width * j);
        }
      }
      add(cols);

      let decidedColour = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        colOfThreeFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColour && !isBlank
        )
      ) {
        score += cols;
        scoreDisplay.innerHTML = score;
        colOfThreeFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  };

  let startButton = document.querySelector("#start");
  startButton.onclick = () => {
    logic();
    setInterval(() => {
      moveDown();
      checkRow(4);
      checkColumn(4);
      checkRow(3);
      checkColumn(3);
    }, 100);
  };
});

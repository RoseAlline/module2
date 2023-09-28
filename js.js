* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: #333;
    justify-content: center;
    align-items: center;
    height: 100vh;
    display: grid;
    overflow: hidden;
}



#game-board {
    --cell-size: 10vmin;
    --cell-gap: 2vmin;
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, var(--cell-size));
    grid-template-rows: repeat(5, var(--cell-size));
    gap: var(--cell-gap);
    border-radius: 1vmin;
}

.cell {
    background-color: #eedbb0;
    border-radius: 1vmin;
    display: flex;
}
 
  .tile {
    position: absolute;
    top: calc(var(--y) * (var(--cell-size) + var(--cell-gap)));
    left: calc(var(--x) * (var(--cell-size) + var(--cell-gap)));
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--cell-size);
    height: var(--cell-size);
    border-radius: 1vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 5vmin;
    font-weight: bold;
    background-color: hsl(20, 60%, var(--bg-lightness));
    color: hsl(20, 25%, var(--text-lightness));
    animation: show 200ms;
    transition: 100ms;
  }
  
  @keyframes show {
    0% {
      opacity: 0.5;
      transform: scale(0);
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }

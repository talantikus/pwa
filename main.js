const keyboard = navigator.keyboard;
keyboard.getLayoutMap()
.then((keyboardLayoutMap) => {
  const upKey = keyboardLayoutMap.get('KeyW');
  window.alert(`Press ${upKey} to move up.`);
})


function scrollSlider(direction) {
  const slider = document.getElementById('slider');
  const scrollAmount = 300; // ระยะที่ต้องการให้เลื่อนใน 1 คลิก (px)
  
  if (direction === 1) {
    slider.scrollLeft += scrollAmount;
  } else {
    slider.scrollLeft -= scrollAmount;
  }
}
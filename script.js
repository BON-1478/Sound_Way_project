
const menu = document.querySelector('#mobile-menu');
const navList = document.querySelector('.nav-list');

menu.addEventListener('click', function() {
  // สลับการเพิ่ม/ลบ class 'active'
  navList.classList.toggle('active');
  
  // เสริม: ใส่ Animation ให้ปุ่มสามขีดเปลี่ยนเป็นตัว X (ถ้าต้องการ)
  menu.classList.toggle('is-active');
});
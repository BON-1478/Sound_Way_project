const menu = document.querySelector('#mobile-menu');
const navList = document.querySelector('.nav-list');

if (menu) {
    menu.addEventListener('click', function() {
        // เปิด-ปิดเมนู
        navList.classList.toggle('active');
        
        // ถ้าคุณมี CSS สำหรับแปลงร่างปุ่มสามขีดเป็น X
        menu.classList.toggle('is-active');
    });
}
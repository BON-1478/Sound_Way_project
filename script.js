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

// Drag scroll for carousel
const slider = document.querySelector('#slider');
let isDown = false;
let startX;
let scrollLeft;

let isHover = false;

slider.addEventListener('mouseenter', (e) => {
    isHover = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isHover = false;
});

slider.addEventListener('mousemove', (e) => {
    if (!isHover) return;

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
});

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseup', () => isDown = false);
slider.addEventListener('mouseleave', () => isDown = false);

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    const dx = e.pageX - startX;
    slider.scrollLeft = scrollLeft - dx;
});

// TOUCH
slider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchend', () => isDown = false);

slider.addEventListener('touchmove', (e) => {
    if (!isDown) return;

    const dx = e.touches[0].pageX - startX;
    slider.scrollLeft = scrollLeft - dx;
});

// Simulation code
const screen = document.getElementById('radar-screen');
const userEl = document.getElementById('user-element');
const alertBox = document.getElementById('alertBox');

const config = {
    width: 600,
    height: 400,
    userX: 300,
    userY: 375,
    aiRadius: 250,
    tofRadius: 85
};

const imageMap = {
    'รถยนต์': 'img/car.png',
    'คนเดิน': 'img/person_walk.png',
    'เสาไฟฟ้า': 'img/eletric_column.png',
    'มอเตอร์ไซค์': 'img/bike.png',
    'จักรยาน': 'img/bikecycle.png',
    'สุนัข': 'img/dog.png',
    'ถังขยะ': 'img/bin.png',
    'คนวิ่ง': 'img/the_flash.png',
    'ป้ายจราจร': 'img/sign.png',
    'กระจกใส': 'img/glass.png',
    'default': ''
};

// user and zone positions set in CSS to center bottom

class SimObject {
    constructor(name, x, y, speed) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isDead = false;
        this.detectedAI = false;
        this.detectedToF = false;

        this.el = document.createElement('div');
        this.el.className = 'sim-object';
        this.el.innerHTML = `
            <span class="object-label">${name}</span>
            <img src="${imageMap[name] || imageMap['default']}">
        `;
        if (screen) screen.appendChild(this.el);
        this.updateDOM();
    }

    update() {
        let dx = config.userX - this.x;
        let dy = config.userY - this.y;
        let dist = Math.hypot(dx, dy);

        if (this.speed > 2) {
            let angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            this.y += 1;
        }

        if (dist < config.aiRadius && !this.detectedAI) {
            this.detectedAI = true;
            let side = this.x < config.userX ? 'ซ้าย' : 'ขวา';
            log(`🔊 [AI]: มี ${this.name} ทาง${side}`, 'alert-ai');
        }

        if (dist < config.tofRadius && !this.detectedToF) {
            this.detectedToF = true;
            this.el.classList.add('detected-emergency');
            let side = this.x < config.userX ? 'ซ้าย' : 'ขวา';
            if (this.name === 'กระจกใส') {
                log(`🚨 [AI]: มี ${this.name} ทาง${side}`, 'alert-tof');
            } else {
                log(`🚨 [BEEP]: ${this.name} ประชิดตัวทาง${side}!`, 'alert-tof');
            }
        }

        if (dist < 35) {
            log(`💥 ชนกับ ${this.name}!`, 'white');
            this.destroy();
        }

        if (this.y > config.height + 50) this.destroy();

        this.updateDOM();
    }

    updateDOM() {
        if (this.isDead) return;
        this.el.style.left = `${this.x - 20}px`;
        this.el.style.top = `${this.y - 20}px`;
    }

    destroy() {
        this.isDead = true;
        this.el.remove();
    }
}

let activeObjects = [];

function spawn(name) {
    let x = name === 'รถยนต์' ? 100 : (name === 'คนเดิน' ? 500 : 300);
    activeObjects.push(new SimObject(name, x, -50, name === 'เสาไฟฟ้า' ? 0 : 4));
}

function spawnRandom() {
    const list = ['มอเตอร์ไซค์', 'จักรยาน', 'สุนัข', 'ถังขยะ', 'คนวิ่ง', 'ป้ายจราจร', 'กระจกใส'];
    let name = list[Math.floor(Math.random() * list.length)];
    let rx = Math.random() * 500 + 50;

    let rs;
    if (name === 'ถังขยะ' || name === 'ป้ายจราจร' || name === 'กระจกใส') rs = 0;
    else rs = Math.random() * 5;
    activeObjects.push(new SimObject(name, rx, -50, rs));
}

function log(msg, cls) {
    let d = document.createElement('div');
    d.className = cls;
    d.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (alertBox) alertBox.prepend(d);
}

function loop() {
    activeObjects = activeObjects.filter(obj => !obj.isDead);
    activeObjects.forEach(obj => obj.update());
    requestAnimationFrame(loop);
}

if (screen) loop();
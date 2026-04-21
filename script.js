const menu = document.querySelector('#mobile-menu');
const navList = document.querySelector('.nav-list');

if (menu) {
    menu.addEventListener('click', function () {
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
let velocity = 0; // เก็บความเร็วในการสะบัด
let rafID; // สำหรับทำ Animation Frame

// ฟังก์ชันสำหรับคำนวณการไหลต่อเนื่อง (Momentum)
function beginMomentum() {
    slider.scrollLeft += velocity; // ให้ไหลไปตามความเร็ว
    velocity *= 0.95; // ค่อยๆ ลดความเร็วลง (แรงเสียดทาน)

    if (Math.abs(velocity) > 0.5) { // ถ้ายังมีความเร็วเหลืออยู่ให้รันต่อ
        rafID = requestAnimationFrame(beginMomentum);
    }
}

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active'); // ใส่ class เผื่ออยากเปลี่ยน cursor
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    cancelAnimationFrame(rafID); // หยุด Momentum ทันทีเมื่อคลิกลากใหม่
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    beginMomentum(); // เริ่มการไหลเมื่อปล่อยเมาส์
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;

    const prevScrollLeft = slider.scrollLeft;
    slider.scrollLeft = scrollLeft - walk;

    // คำนวณความเร็วจากการเลื่อนล่าสุด
    velocity = slider.scrollLeft - prevScrollLeft;
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

// Hover caruosel
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

// Typing text
const featureDetails = {
    1: "◉ 'ระบบเสียง 3มิติ' ผสานการทำงานของ Spatial Audio ที่ให้เสียงนำทางแบบ 3 มิติสมจริง และ Vibration Motor ที่สั่นเตือนบอกทิศทางอันตรายได้อย่างแม่นยำผ่านผิวสัมผัส ช่วยให้คุณตัดสินใจได้ทันท่วงที",
    2: "◉ 'เซนเซอร์อัจฉริยะ' รวมพลัง Global Shutter Camera ที่จับภาพได้คมชัดไร้การบิดเบี้ยว ทำงานร่วมกับ mmWave Sensor เรดาร์ตรวจจับวัตถุระยะไกล และ ToF Sensor ที่สแกนระยะประชิด เพื่อการรับรู้รอบตัวแบบ 360 องศาในทุกสภาวะแสง",
    3: "◉ 'ขับเคลื่อนนวัตกรรมอย่างไม่มีสะดุด' ด้วย Battery เซลล์เก็บไฟความหนาแน่นสูงที่จ่ายไฟได้นิ่งสนิทและชาร์จได้อย่างรวดเร็ว พร้อมระบบ Heatsink ระบายความร้อนประสิทธิภาพสูงที่ช่วยให้หูฟังทำงานได้อย่างเสถียรและปลอดภัยตลอดการสวมใส่",
    4: "◉ Edge AI Chip สำหรับวิเคราะห์ข้อมูลฉับไวในตัวเครื่อง และ IMU Sensor ที่คอยตรวจจับทิศทางและความเร็วการเดิน เพื่อปรับการนำทางให้เป็นหนึ่งเดียวกับคุณ พร้อมพื้นที่จัดเก็บทุกการตั้งค่าส่วนบุคคลไว้พร้อมใช้งาน"
};

const headerDetails = {
    1: "Instinctive Alerts",
    2: "Environment Scanning",
    3: "Endless Mobility",
    4: "Seamless Integration"
}

let typingTimer;
let typingStarter;
let currentFeatureId = null;

function formatFeatureText(message) {
    return message.replace(/◉/g, '\n◉').replace(/^\n/, '');
}

function formatHeader(title){
    return title;
}

function showFeatureDetail(id) {
    const card = document.getElementById('cardBox');
    const textTarget = document.getElementById('typing-text');
    const cardTitle = document.getElementById('cardTitle');
    const rawMessage = featureDetails[id] || "";
    const header = headerDetails[id] || "";
    const message = formatFeatureText(rawMessage);
    const title = formatHeader(header);

    clearTimeout(typingTimer);
    clearTimeout(typingStarter);
    textTarget.innerText = "";
    cardTitle.innerText = "";

    if (card.classList.contains('active') && currentFeatureId === id) {
        card.classList.remove('active');
        currentFeatureId = null;
        return;
    }

    currentFeatureId = id;
    card.classList.remove('active');

    typingStarter = setTimeout(() => {
        card.classList.add('active');

        let i = 0;
        function type() {
            if (i < message.length) {
                textTarget.innerText += message.charAt(i);
                cardTitle.innerText += title.charAt(i);
                i++;
                typingTimer = setTimeout(type, 40);
            }
        }

        clearTimeout(typingTimer);
        typingTimer = setTimeout(type, 500);
    }, 100);
}

// ผูกเหตุการณ์คลิกให้ปุ่มฟีเจอร์ทั้งหมด และรองรับการสลับเปิด/ปิดการ์ด
document.querySelectorAll('.dataCard').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const featureId = Number(btn.dataset.feature);
        if (!featureId) return;
        showFeatureDetail(featureId);
    });
});

// Simulation code
// ==========================================
// Simulation code (แก้ไขจุดศูนย์กลางและความกว้าง)
// ==========================================
const screen = document.getElementById('radar-screen');
const userEl = document.getElementById('user-element');
const alertBox = document.getElementById('alertBox');

const config = {
    width: 380,      // แก้จาก 600 เป็น 400 ให้ตรงกับ CSS
    height: 400,
    userX: 190,      // ผู้ใช้อยู่ตรงกลางจอพอดี (400 / 2)
    userY: 375,      // ตำแหน่งแกน Y ของผู้ใช้อยู่ด้านล่าง
    aiRadius: 250,   // รัศมี AI (ตรงกับความกว้าง 500px ใน CSS)
    tofRadius: 85    // รัศมี ToF (ตรงกับความกว้าง 170px ใน CSS)
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
            // เช็คว่าวัตถุอยู่ซ้ายหรือขวาเทียบกับผู้ใช้ที่แกน x = 200
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
    // ปรับพิกัดเกิดให้ไม่เกิน 400
    // รถยนต์ชิดซ้าย (80), คนเดินชิดขวา (320), เสาไฟฟ้าตรงกลาง (200)
    let x = name === 'รถยนต์' ? 80 : (name === 'คนเดิน' ? 320 : 200);
    activeObjects.push(new SimObject(name, x, -50, name === 'กระจกใส' ? 0 : 4));
}

function spawnRandom() {
    const list = ['มอเตอร์ไซค์', 'จักรยาน', 'สุนัข', 'ถังขยะ', 'คนวิ่ง', 'ป้ายจราจร', 'กระจกใส'];
    let name = list[Math.floor(Math.random() * list.length)];

    // สุ่มพิกัดแกน X ตั้งแต่ 20 ถึง 380 (ให้อยู่ในระยะขอบจอ 400px พอดี ไม่ล้น)
    let rx = Math.random() * 360 + 20;

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

// Change product image
const changeImageBtn = document.getElementById('changeImageBtn');
const productImg = document.querySelector('.product img');

// เก็บ Path รูปภาพไว้ (ตรวจสอบชื่อไฟล์ให้ถูกต้องด้วยนะครับ)
const imgOriginal = "img/main.png";
const imgNew = "img/x-ray.png"; // เปลี่ยนเป็นชื่อไฟล์รูปที่ 2 ของคุณ

changeImageBtn.addEventListener('change', function() {
    if (this.checked) {
        productImg.src = imgNew;
    } else {
        productImg.src = imgOriginal;
    }
});

// loading web
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loading');

    // ตั้งเวลาให้ปิดหลังจากผ่านไป 2 วินาที (2000 มิลลิวินาที)
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 5000); 
});

if (screen) loop();
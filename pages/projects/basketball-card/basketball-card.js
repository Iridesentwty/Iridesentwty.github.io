document.addEventListener('DOMContentLoaded', () => {
    const cardContainers = document.querySelectorAll('.card-container');

    cardContainers.forEach((cardContainer) => {
        const card = cardContainer.querySelector('.card');

        cardContainer.addEventListener('mousemove', (e) => {
            const rect = cardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20; // 旋转幅度
            const rotateY = (centerX - x) / 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // 更新光泽效果的位置
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });

        cardContainer.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });

    // 导航栏移动端菜单功能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}); 
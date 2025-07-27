// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 导航栏功能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.96)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // 平滑滚动到指定部分
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 70; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // 为所有导航链接添加平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 使用 new URL() 来获取完整的、已解析的 URL 对象
            const targetUrl = new URL(link.href);
            const currentUrl = new URL(window.location.href);

            // 比较 pathname 是否相同。pathname 是域名之后、查询参数之前的部分。
            // 例如 "http://example.com/path/to/page?query=1" 的 pathname 是 "/path/to/page"
            if (targetUrl.pathname === currentUrl.pathname) {
                // 如果 pathname 相同，说明是页面内部的锚点链接
                if (targetUrl.hash) {
                    e.preventDefault(); // 阻止默认的、生硬的跳转
                    smoothScrollTo(targetUrl.hash); // 执行平滑滚动
                }
            }
            // 如果 pathname 不同，说明是跨页面跳转。
            // 我们什么都不做，让浏览器执行默认的链接跳转行为。
        });
    });

    // 滚动指示器点击事件
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            smoothScrollTo('#about');
        });
    }

    // 技能条动画
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        console.log('触发技能条动画，找到', skillBars.length, '个技能条');
        
        skillBars.forEach((bar, index) => {
            // 获取目标宽度
            const targetWidth = bar.getAttribute('data-width') || '0%';
            console.log('技能条', index, '目标宽度:', targetWidth);
            
            // 重置宽度为0
            bar.style.width = '0%';
            
            // 延迟动画，让每个技能条依次出现
            setTimeout(() => {
                bar.style.width = targetWidth;
                console.log('设置技能条', index, '宽度为:', targetWidth);
            }, index * 200); // 每个技能条延迟200ms
        });
    }

    // 滚动动画
    function animateOnScroll() {
        const elements = document.querySelectorAll('.skill-category, .project-card, .hobby-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // 如果是技能部分，触发技能条动画
                    if (entry.target.classList.contains('skill-category')) {
                        setTimeout(animateSkillBars, 300);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
        
        // 添加技能部分的专门观察器
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateSkillBars, 500);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            });
            
            skillsObserver.observe(skillsSection);
        }
    }

    // 初始化滚动动画
    animateOnScroll();
    
    // 测试技能条动画按钮
    const testSkillsBtn = document.getElementById('testSkills');
    if (testSkillsBtn) {
        testSkillsBtn.addEventListener('click', function() {
            console.log('手动触发技能条动画');
            animateSkillBars();
        });
    }

    // 联系表单处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // 简单的表单验证
            if (!name || !email || !subject || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟发送消息
            showNotification('消息发送成功！我会尽快回复您。', 'success');
            
            // 清空表单
            this.reset();
        });
    }

    // 邮箱验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 通知函数
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // 根据类型设置背景色
        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#3498db';
        }
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 打字机效果 - 支持HTML标签
    function typeWriter(element, text, speed = 100) {
        // 保存原始HTML内容
        const originalHTML = element.innerHTML;
        
        // 创建临时元素来解析HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        
        // 获取纯文本内容（不包含HTML标签）
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < textContent.length) {
                // 只添加文本字符，不添加HTML标签
                element.innerHTML += textContent.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // 打字效果完成后，恢复原始HTML结构
                setTimeout(() => {
                    element.innerHTML = originalHTML;
                }, 500);
            }
        }
        
        type();
    }

    // 为标题添加打字机效果
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }

    // 粒子背景效果
    function createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: float 6s ease-in-out infinite;
                animation-delay: ${Math.random() * 6}s;
            `;
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            hero.appendChild(particle);
        }
    }

    // 添加粒子动画CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.5;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // 初始化粒子效果
    createParticles();

    // 数字计数动画
    function animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number');
        
        numbers.forEach(number => {
            const target = parseInt(number.textContent);
            const duration = 2000; // 2秒
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.textContent = Math.floor(current) + '+';
            }, 16);
        });
    }

    // 当统计部分进入视口时触发数字动画
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 主题切换功能（可选）
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #3498db;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
        
        document.body.appendChild(themeToggle);
    }

    // 初始化主题切换
    createThemeToggle();

    // 添加深色主题CSS
    const darkThemeStyle = document.createElement('style');
    darkThemeStyle.textContent = `
        .dark-theme {
            background: #1a1a1a;
            color: #ffffff;
        }
        
        .dark-theme .navbar {
            background: rgba(26, 26, 26, 0.95);
        }
        
        .dark-theme .nav-link {
            color: #ffffff;
        }
        
        .dark-theme .section-title {
            color: #ffffff;
        }
        
        .dark-theme .skill-category,
        .dark-theme .project-card,
        .dark-theme .hobby-card,
        .dark-theme .stat-item {
            background: #2d2d2d;
            color: #ffffff;
        }
        
        .dark-theme .about,
        .dark-theme .projects,
        .dark-theme .contact {
            background: #2d2d2d;
        }
    `;
    document.head.appendChild(darkThemeStyle);

    // 页面加载完成后的初始化
    console.log('个人主页加载完成！');
    
    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

}); 
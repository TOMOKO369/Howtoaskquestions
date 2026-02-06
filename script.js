document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            c.style.display = 'none'; // Ensure display none is applied for animation reset

            // Add active class to clicked button
            btn.classList.add('active');

            // Show target content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Small timeout to allow display:none to clear before adding grid back
            targetContent.style.display = 'grid';
            setTimeout(() => {
                targetContent.classList.add('active');
            }, 10);
        });
    });

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            // Close all other accordions (optional, but cleaner)
            document.querySelectorAll('.accordion-header').forEach(h => {
                if (h !== header) {
                    h.classList.remove('active');
                    h.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current
            header.classList.toggle('active');
            
            if (!isOpen) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // Draft Editor Actions
    const draftInput = document.getElementById('draftInput');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    clearBtn.addEventListener('click', () => {
        if (confirm('下書きを消去してもよろしいですか？')) {
            draftInput.value = '';
        }
    });

    copyBtn.addEventListener('click', () => {
        if (draftInput.value.trim() === '') {
            alert('テキストが入力されていません。');
            return;
        }
        draftInput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'コピーしました！';
        copyBtn.classList.add('btn-success');
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.classList.remove('btn-success');
        }, 2000);
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

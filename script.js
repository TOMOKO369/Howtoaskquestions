document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Remove active class and hide all contents
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });

            // Add active class to clicked button
            btn.classList.add('active');

            // Show target content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            if (targetContent) {
                targetContent.style.display = 'grid';
                // Small timeout to allow display:block/grid to render before adding opacity class
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 10);
            }
        });
    });

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            // Close all other accordions
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

    // Request Generator
    const generateBtn = document.getElementById('generateBtn');
    const resultOutput = document.getElementById('resultOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Get inputs
            const jobTitle = document.getElementById('jobTitle').value.trim();
            const deadline = document.getElementById('deadline').value.trim();
            const budget = document.getElementById('budget').value.trim();
            const deliverables = document.getElementById('deliverables').value.trim();
            const targetPersona = document.getElementById('targetPersona').value.trim();
            const usageScene = document.getElementById('usageScene').value.trim();
            const tone = document.getElementById('tone').value.trim();

            // Validation
            if (!jobTitle || !deliverables) {
                alert('「仕事の名称」と「具体的指示」は必須項目です。');
                return;
            }

            // Generate Prompt/Request Text
            const generatedText = `【依頼内容】${jobTitle}
--------------------------------------------------
■ 依頼の概要
${jobTitle}をお願いしたく、ご連絡いたしました。

■ 具体的指示（成果物・数量）
${deliverables}

■ ターゲット（ペルソナ）
${targetPersona || '（特になし）'}

■ 利用シーン
${usageScene || '（特になし）'}

■ 雰囲気・トンマナ・参考
${tone || '（特になし）'}

■ 希望納期
${deadline || '相談のうえ決定したい'}

■ 予算
${budget || '見積もりをお願いします'}

--------------------------------------------------
以上です。ご検討のほど、よろしくお願いいたします。`;

            // Output
            resultOutput.value = generatedText;

            // Scroll to output
            resultOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Copy Result
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', () => {
            if (resultOutput.value.trim() === '') {
                alert('まだ文章が生成されていません。');
                return;
            }
            resultOutput.select();
            document.execCommand('copy');

            // Visual feedback
            const originalText = copyResultBtn.innerHTML;
            copyResultBtn.innerHTML = '<i class="fas fa-check"></i> コピー完了';
            copyResultBtn.style.color = '#10b981';

            setTimeout(() => {
                copyResultBtn.innerHTML = originalText;
                copyResultBtn.style.color = '';
            }, 2000);
        });
    }

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

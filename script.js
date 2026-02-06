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

    // --- Form Logic ---

    // Mode Switching
    const modeBtns = document.querySelectorAll('.mode-btn');
    const requestOptions = document.getElementById('requestOptions');
    const questionOptions = document.getElementById('questionOptions');
    const mainInputLabel = document.getElementById('mainInputLabel');
    const mainContent = document.getElementById('mainContent');
    const resultOutput = document.getElementById('resultOutput');

    let currentMode = 'request'; // 'request' or 'question'

    if (modeBtns.length > 0) {
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                modeBtns.forEach(b => b.classList.remove('active'));
                // Add active to click
                btn.classList.add('active');

                // Update mode
                currentMode = btn.getAttribute('data-mode');

                // Toggle Options
                if (currentMode === 'request') {
                    requestOptions.style.display = 'grid';
                    questionOptions.style.display = 'none';
                    mainInputLabel.innerHTML = '具体的な依頼内容 <span class="required">*</span>';
                    mainContent.placeholder = '例：トップページと問い合わせのHTML/CSS。レスポンシブ対応込み。既存のデザインに合わせたい。';
                } else {
                    requestOptions.style.display = 'none';
                    questionOptions.style.display = 'grid';
                    mainInputLabel.innerHTML = '聞きたいこと・解決したい課題 <span class="required">*</span>';
                    mainContent.placeholder = '例：Pythonでスクレイピングをしたいが、〇〇というエラーが出て止まってしまう。ここまでのコードは以下の通りです...';
                }
            });
        });
    }

    // Button Selection Logic
    const selectionGroups = document.querySelectorAll('.selection-group');

    selectionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle selection (single select per group)
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    });

    // Helper to get selected value
    function getSelectedValue(groupId) {
        const group = document.getElementById(groupId);
        if (!group) return null;
        const selected = group.querySelector('.option-btn.selected');
        return selected ? selected.value : null;
    }

    // Generate Text
    const generateBtn = document.getElementById('generateBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const content = mainContent.value.trim();

            if (!content) {
                alert('「具体的な内容」を入力してください。');
                return;
            }

            let generatedText = '';

            if (currentMode === 'request') {
                const category = getSelectedValue('req-category') || '（未定）';
                const deadline = getSelectedValue('req-deadline') || '相談して決めたい';
                const budget = getSelectedValue('req-budget') || '見積もり希望';

                generatedText = `件名：【ご相談】${category}の依頼につきまして

お世話になっております。
${category}のご依頼をしたく、ご連絡いたしました。

以下の要件にてご相談させていただけますでしょうか。

■ 依頼の概要・目的
${content.split('\n').map(line => line.trim() ? `・${line}` : '').join('\n').replace(/\n+/g, '\n')}

■ 依頼のジャンル
${category}

■ 希望納期
${deadline}

■ 予算感
${budget}

ご多忙の折恐縮ですが、ご検討のほどよろしくお願いいたします。
詳細について、改めてお打ち合わせ等できると幸いです。`;

            } else {
                const status = getSelectedValue('qst-status') || '（未選択）';
                const urgency = getSelectedValue('qst-urgency') || '（未選択）';
                const env = getSelectedValue('qst-env') || '（未選択）';

                generatedText = `件名：【質問】${getSummary(content)} について

お疲れ様です。
現在進めている作業において、不明点（またはエラー）が発生しており、アドバイスをいただきたくご連絡しました。

■ 聞きたいこと・解決したい課題
${content.split('\n').map(line => line.trim() ? `・${line}` : '').join('\n').replace(/\n+/g, '\n')}

■ 現在の状況
${status}

■ 開発環境・OS
${env}

■ 緊急度
${urgency}

お手数をおかけしますが、ご教示いただけますと幸いです。
よろしくお願いいたします。`;
            }

            // Output
            resultOutput.value = generatedText;

            // Scroll to output
            resultOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function getSummary(text) {
        // First 20 chars for title
        return text.length > 20 ? text.substring(0, 20) + '...' : text;
    }

    // Copy Result
    const copyResultBtn = document.getElementById('copyResultBtn');
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

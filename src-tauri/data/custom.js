// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ==================== 记住密码功能 ====================
// 添加记住密码功能到页面
function addRememberPasswordFeature() {
    // 检查是否已经存在登录表单
    const loginForms = document.querySelectorAll('form input[type="password"]');
    
    if (loginForms.length === 0) {
        console.log('未找到登录表单，将在3秒后重试...');
        setTimeout(addRememberPasswordFeature, 3000);
        return;
    }

    // 为每个密码输入框添加记住密码功能
    loginForms.forEach((passwordInput, index) => {
        const form = passwordInput.closest('form');
        if (!form) return;

        // 检查是否已经添加过记住密码功能
        if (form.querySelector('.remember-password-container')) {
            return;
        }

        // 获取用户名输入框（通常是在密码框之前的文本输入框）
        const usernameInput = form.querySelector('input[type="text"], input[type="email"], input:not([type="password"])');
        
        // 创建记住密码容器
        const rememberContainer = document.createElement('div');
        rememberContainer.className = 'remember-password-container';
        rememberContainer.style.margin = '10px 0';
        rememberContainer.style.display = 'flex';
        rememberContainer.style.alignItems = 'center';

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `remember-password-${index}`;
        checkbox.style.marginRight = '8px';

        // 创建标签
        const label = document.createElement('label');
        label.htmlFor = `remember-password-${index}`;
        label.textContent = '记住密码';
        label.style.fontSize = '14px';
        label.style.color = '#666';
        label.style.cursor = 'pointer';

        // 添加到容器
        rememberContainer.appendChild(checkbox);
        rememberContainer.appendChild(label);

        // 插入到密码框之后
        passwordInput.parentNode.insertBefore(rememberContainer, passwordInput.nextSibling);

        // 尝试自动填充保存的凭据
        const savedCredentials = getSavedCredentials();
        if (savedCredentials.length > 0 && usernameInput) {
            const lastCredential = savedCredentials[savedCredentials.length - 1];
            usernameInput.value = lastCredential.username;
            passwordInput.value = lastCredential.password;
            checkbox.checked = true;
        }

        // 添加表单提交事件监听
        form.addEventListener('submit', function(e) {
            if (checkbox.checked && usernameInput && passwordInput.value) {
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                if (username && password) {
                    saveCredentials(username, password);
                    console.log('密码已保存');
                }
            }
        });
    });
}

// 获取保存的凭据
function getSavedCredentials() {
    try {
        const saved = localStorage.getItem('savedCredentials');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('读取保存的凭据失败:', e);
        return [];
    }
}

// 保存凭据
function saveCredentials(username, password) {
    try {
        const credentials = getSavedCredentials();
        
        // 检查是否已存在相同用户名的凭据
        const existingIndex = credentials.findIndex(cred => cred.username === username);
        
        if (existingIndex !== -1) {
            // 更新现有凭据
            credentials[existingIndex] = { username, password, timestamp: Date.now() };
        } else {
            // 添加新凭据
            credentials.push({ username, password, timestamp: Date.now() });
        }
        
        // 保存到localStorage
        localStorage.setItem('savedCredentials', JSON.stringify(credentials));
    } catch (e) {
        console.error('保存凭据失败:', e);
    }
}

// 清除保存的凭据
function clearCredentials(username) {
    try {
        let credentials = getSavedCredentials();
        credentials = credentials.filter(cred => cred.username !== username);
        localStorage.setItem('savedCredentials', JSON.stringify(credentials));
    } catch (e) {
        console.error('清除凭据失败:', e);
    }
}

// 添加清除密码的UI（可选）
function addClearPasswordUI() {
    const savedCredentials = getSavedCredentials();
    if (savedCredentials.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除保存的密码';
        clearBtn.style.position = 'fixed';
        clearBtn.style.bottom = '10px';
        clearBtn.style.right = '10px';
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.background = '#ff4757';
        clearBtn.style.color = 'white';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '4px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.zIndex = '10000';
        clearBtn.style.fontSize = '12px';
        
        clearBtn.addEventListener('click', function() {
            if (confirm('确定要清除所有保存的密码吗？')) {
                localStorage.removeItem('savedCredentials');
                alert('所有保存的密码已清除');
                clearBtn.remove();
            }
        });
        
        document.body.appendChild(clearBtn);
    }
}

// 页面加载完成后添加记住密码功能
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(addRememberPasswordFeature, 1000);
        setTimeout(addClearPasswordUI, 1500);
    });
} else {
    setTimeout(addRememberPasswordFeature, 1000);
    setTimeout(addClearPasswordUI, 1500);
}

// 监听动态加载的内容
const observer = new MutationObserver(function() {
    setTimeout(addRememberPasswordFeature, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('记住密码功能已加载');
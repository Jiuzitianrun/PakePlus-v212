(function () {
  // 配置
  const STORAGE_KEY = 'pakeplus_remembered_credentials_v1';

  // 辅助函数
  function getEl(id) {
    return document.getElementById(id);
  }

  // 自动填充（仅首次加载）
  document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = getEl('username');
    const passwordEl = getEl('password');
    const rememberEl = getEl('rememberPwd');
    if (!usernameEl || !passwordEl || !rememberEl) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username) {
          usernameEl.value = parsed.username;
          passwordEl.value = parsed.password || '';
          rememberEl.checked = !!parsed.password;
        }
      }
    } catch (err) {}
  });

  // 登录按钮事件（请替换 doLogin 为你的实际登录逻辑）
  document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = getEl('username');
    const passwordEl = getEl('password');
    const rememberEl = getEl('rememberPwd');
    const loginBtn = getEl('loginBtn');
    if (!usernameEl || !passwordEl || !rememberEl || !loginBtn) return;

    loginBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const username = usernameEl.value;
      const password = passwordEl.value;
      const remember = rememberEl.checked;

      // 示例登录逻辑（请替换为你的实际登录请求）
      const doLogin = async (u, p) => {
        try {
          const resp = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
          });
          if (!resp.ok) return false;
          const j = await resp.json();
          return j && j.success;
        } catch (err) {
          return false;
        }
      };

      const ok = await doLogin(username, password);
      if (ok) {
        if (remember) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
        // 登录成功后跳转
        // location.href = '/';
      } else {
        alert('登录失败');
      }
    });
  });

  // 只在登录页自动填充，不会干扰其它页面或 SPA 路由
})();
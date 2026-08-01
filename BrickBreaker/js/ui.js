/**
 * 🖥️ UIManager - DOM Controls, Overlays & HUD Updates
 */
class UIManager {
  updateHUD(level, score, lives) {
    document.getElementById('hud-level').textContent = level;
    document.getElementById('hud-score').textContent = score;

    const heartsContainer = document.getElementById('hud-lives');
    heartsContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
      heartsContainer.innerHTML += '<i class="fa-solid fa-heart"></i>';
    }
  }

  showToast(msg) {
    const toast = document.getElementById('powerup-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  renderLevelsGrid(unlockedLevel, onSelectLevel) {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= 25; i++) {
      const isUnlocked = i <= unlockedLevel;
      const btn = document.createElement('button');
      btn.className = `level-btn ${isUnlocked ? 'unlocked' : 'locked'}`;
      
      if (isUnlocked) {
        btn.innerHTML = `
          <span>${i}</span>
          <div class="level-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        `;
        btn.onclick = () => onSelectLevel(i);
      } else {
        btn.innerHTML = `<span><i class="fa-solid fa-lock"></i></span>`;
      }
      grid.appendChild(btn);
    }
  }

  showWinModal(score, highScore) {
    document.getElementById('win-score-text').textContent = score;
    document.getElementById('win-high-text').textContent = highScore;
    document.getElementById('win-modal').classList.remove('hidden');
  }

  showGameOverModal(score) {
    document.getElementById('gameover-score-text').textContent = score;
    document.getElementById('gameover-modal').classList.remove('hidden');
  }
}

const uiManager = new UIManager();

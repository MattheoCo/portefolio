(function(){
  const screen = document.getElementById('screen');
  const input = document.getElementById('cmd');
  const prompt = 'guest@cyberport:~$ ';
  // Historique des commandes
  const history = [];
  let historyIndex = 0; // Pointeur courant (index dans history ou history.length)
  console.log('[terminal] history enabled, build v10');

  const lines = [
    'Bienvenue sur mon portfolio orienté cybersécurité.',
    'Tapez help pour voir les commandes disponibles.'
  ];

  function print(text, cls){
    const div = document.createElement('div');
    div.className = 'output' + (cls ? ' ' + cls : '');
    div.innerHTML = text;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  }

  function typewrite(text, speed=12){
    return new Promise(resolve => {
      let i = 0; const div = document.createElement('div');
      div.className = 'output'; screen.appendChild(div);
      (function tick(){
        div.textContent = text.slice(0, i++);
        screen.scrollTop = screen.scrollHeight;
        if(i <= text.length) setTimeout(tick, speed);
        else resolve();
      })();
    });
  }

  async function boot(){
    for(const l of lines){
      // eslint-disable-next-line no-await-in-loop
      await typewrite(l);
    }
  }

  function hasFlag(args, list){
    return args && args.some(a => list.includes(a));
  }

  const help = `Commandes disponibles:\n`+
  `  help           Affiche cette aide\n`+
  `  about          À propos de moi\n`+
  `  skills         Compétences cyber\n`+
  `  portfolio      Ouvre la page projets\n`+
  `  portfolio      Ouvre la page projets\n`+
  `  contact        Me contacter\n`+
  `  clear          Nettoie l'écran\n`+
  `\n`;

  const router = {
    help(){ print(help, 'ok'); },
    clear(){ screen.innerHTML=''; },
    about(){
      print("Je suis Cognet Matthéo, développeur d'application en recherche d'alternance dans le domaine de la cybersécurité pour intégrer mon école d'ingénieur.", 'ok');
    },
    skills(){
      print("💻 Compétences — aperçu détaillé", 'ok');
      print("<strong>Langages & frameworks :</strong> PHP (Symfony), JavaScript (ES6+), Python, SQL", 'ok');
      print("<strong>Sécurité & tests :</strong> Pentest applicatif (XSS, SQLi), revue de code, SAST/DAST, Burp Suite", 'ok');
      print("<strong>Réseau & Infra :</strong> Linux (Debian/Ubuntu), Docker, TCP/IP, pare-feu, Wireshark", 'ok');
      print("<strong>DevOps & CI/CD :</strong> Docker, GitHub Actions, déploiement automatisé, containers sécurisés", 'ok');
      print("<strong>Outils & techniques :</strong> Metasploit, nmap, sqlmap, scripts Python pour automatisation", 'ok');
      print("<strong>Data & scripting :</strong> Parsing logs, analyse de traces, python (pandas), automatisation d'audit", 'ok');
      print("<strong>Soft skills :</strong> Communication technique, reporting, travail en équipe, résolution d'incidents", 'ok');
      print("<strong>Certifications & formation :</strong> Préparation OSCP / eLearnSecurity (ajouter ici si certifié)", 'ok');
      print("\nPour plus de détails, tapez 'cv' pour voir mon parcours complet.", 'ok');
    },
    ctf(){
      print("En construction...", 'ok');
    },
    contact(){
      print("GitHub: <a href='https://github.com/MattheoCo' style='color:#77a8ff;text-decoration:underline;'>https://github.com/MattheoCo</a>", 'ok');
      print("Email: <a href='mailto:mattheocognet@gmail.com' style='color:#77a8ff;text-decoration:underline;'>mattheocognet@gmail.com</a>", 'ok');
    },
    portfolio(){
      window.location.href = '/projects';
      print("Redirection vers la page projets...", 'ok');
    },
    
  };

  function handleCmd(cmd){
    // Ne rien afficher si commande vide
    const parts = cmd.trim().split(/\s+/);
    const name = parts[0];
    const args = parts.slice(1);
    if(!name){ return; }

    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt">${prompt}</span>${cmd}`;
    screen.appendChild(line);

    const fn = router[name];
    if (fn){ fn(args); }
    else { print(`Commande inconnue: ${name}. Tapez help.`, 'warn'); }
  }

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const cmd = input.value;
      if(cmd.trim().length){
        history.push(cmd);
        historyIndex = history.length; // Reset à la fin
      }
      input.value = '';
      handleCmd(cmd);
    } else if (e.key === 'ArrowUp'){
      if(history.length){
        // Décrémente jusqu'à 0
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || '';
        // Mettre le curseur à la fin
        setTimeout(()=>{ input.selectionStart = input.selectionEnd = input.value.length; }, 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown'){
      if(history.length){
        // Incrémente jusqu'à history.length (qui signifie champ vide)
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = (historyIndex === history.length) ? '' : (history[historyIndex] || '');
        setTimeout(()=>{ input.selectionStart = input.selectionEnd = input.value.length; }, 0);
      }
      e.preventDefault();
    }
  });

  screen.addEventListener('click', ()=> input.focus());
  input.focus();
  boot();
})();

(function () {
    'use strict';

    var translations = {
        en: {
            heroTagline: 'The Human <span class="gradient-text">LLM</span> for Software &amp; Hardware',
            heroSubtitle: 'FabLab Coordinator • Maker • Developer • Photographer',
            heroCta: "Let's Go",
            countdownLabel: 'VivaTech 2026 starts in',
            countdownLive: 'VivaTech 2026 is LIVE!',
            navJourney: 'Journey', navSkills: 'Skills', navExperience: 'Experience',
            navProjects: 'Projects', navLanguages: 'Languages', navContact: 'Contact',
            journeyTitle: 'My Journey',
            journeySub: '4 countries. 6 languages. One relentless drive to build.',
            ro: 'Where the story begins. Born with curiosity and grit.',
            it: 'ITIS Lattanzio in Rome. Programming &amp; Telecom. The foundation was built here.',
            at: 'Management, freelance web &amp; IT consulting. Built resilience, business acumen, and a family.',
            fr: 'FabLab Coordinator at Institut Optique Graduate School, Paris-Saclay. Prototyping, lasers, CNC, deeptech, and innovation.',
            skillsTitle: 'Skills Dashboard',
            skillsSub: 'A polymath toolkit — from atoms to algorithms',
            expTitle: 'Experience',
            expSub: 'From artisan hospitality to deeptech prototyping',
            projTitle: 'Projects',
            projSub: 'Building at the intersection of atoms and bits',
            langTitle: 'Languages',
            langSub: 'A polyglot bridge between cultures and markets',
            vivTitle: 'VivaTech 2026',
            vivSub: '10th Anniversary — Find me at Europe’s biggest tech event',
            contactTitle: "Let’s Connect",
            contactSub: 'Looking for the hard challenge. Ready to build the future.',
            contactQuote: '“I’m a human LLM for languages of software and hardware — give me the hard challenge.”',
            statCountries: 'Countries', statLanguages: 'Languages', statStartups: 'Startups & Students', statYears: 'Years in Tech',
            footerText: '© 2026 Daniel Madac — Built for VivaTech'
        },
        fr: {
            heroTagline: 'Le <span class="gradient-text">LLM</span> Humain pour le Software &amp; Hardware',
            heroSubtitle: 'Coordinateur FabLab • Maker • Développeur • Photographe',
            heroCta: "C'est parti",
            countdownLabel: 'VivaTech 2026 commence dans',
            countdownLive: 'VivaTech 2026 est EN DIRECT !',
            navJourney: 'Parcours', navSkills: 'Compétences', navExperience: 'Expérience',
            navProjects: 'Projets', navLanguages: 'Langues', navContact: 'Contact',
            journeyTitle: 'Mon Parcours',
            journeySub: '4 pays. 6 langues. Une volonté inébranlable de construire.',
            ro: 'Là où tout commence. Né avec curiosité et détermination.',
            it: 'ITIS Lattanzio à Rome. Programmation &amp; Télécom. Les fondations ont été posées ici.',
            at: 'Management, web freelance &amp; conseil IT. Résilience, sens des affaires et une famille.',
            fr: 'Coordinateur FabLab à l’Institut d’Optique Graduate School, Paris-Saclay. Prototypage, lasers, CNC, deeptech et innovation.',
            skillsTitle: 'Tableau de Compétences',
            skillsSub: 'Une boîte à outils polymathe — des atomes aux algorithmes',
            expTitle: 'Expérience',
            expSub: 'De l’artisanat à la deeptech',
            projTitle: 'Projets',
            projSub: 'Construire à l’intersection des atomes et des bits',
            langTitle: 'Langues',
            langSub: 'Un pont polyglotte entre cultures et marchés',
            vivTitle: 'VivaTech 2026',
            vivSub: '10ème Anniversaire — Retrouvez-moi au plus grand événement tech d’Europe',
            contactTitle: 'Connectons-nous',
            contactSub: 'À la recherche du défi. Prêt à construire l’avenir.',
            contactQuote: '«Je suis un LLM humain pour les langages du software et du hardware — donnez-moi le défi.»',
            statCountries: 'Pays', statLanguages: 'Langues', statStartups: 'Startups & Étudiants', statYears: 'Ans en Tech',
            footerText: '© 2026 Daniel Madac — Conçu pour VivaTech'
        },
        it: {
            heroTagline: 'L’<span class="gradient-text">LLM</span> Umano per Software &amp; Hardware',
            heroSubtitle: 'Coordinatore FabLab • Maker • Sviluppatore • Fotografo',
            heroCta: 'Andiamo',
            countdownLabel: 'VivaTech 2026 inizia tra',
            countdownLive: 'VivaTech 2026 è LIVE!',
            navJourney: 'Percorso', navSkills: 'Competenze', navExperience: 'Esperienza',
            navProjects: 'Progetti', navLanguages: 'Lingue', navContact: 'Contatto',
            journeyTitle: 'Il Mio Percorso',
            journeySub: '4 paesi. 6 lingue. Una spinta inarrestabile a costruire.',
            ro: 'Dove tutto inizia. Nato con curiosità e determinazione.',
            it: 'ITIS Lattanzio a Roma. Programmazione &amp; Telecom. Le fondamenta sono state costruite qui.',
            at: 'Management, web freelance &amp; consulenza IT. Resilienza, senso degli affari e una famiglia.',
            fr: 'Coordinatore FabLab all’Institut d’Optique Graduate School, Paris-Saclay. Prototipazione, laser, CNC, deeptech e innovazione.',
            skillsTitle: 'Dashboard Competenze',
            skillsSub: 'Un toolkit poliedrico — dagli atomi agli algoritmi',
            expTitle: 'Esperienza',
            expSub: 'Dall’artigianato alla deeptech',
            projTitle: 'Progetti',
            projSub: 'Costruire all’intersezione tra atomi e bit',
            langTitle: 'Lingue',
            langSub: 'Un ponte poliglotta tra culture e mercati',
            vivTitle: 'VivaTech 2026',
            vivSub: '10° Anniversario — Trovami al più grande evento tech d’Europa',
            contactTitle: 'Connettiamoci',
            contactSub: 'In cerca della sfida difficile. Pronto a costruire il futuro.',
            contactQuote: '«Sono un LLM umano per i linguaggi del software e dell’hardware — datemi la sfida.»',
            statCountries: 'Paesi', statLanguages: 'Lingue', statStartups: 'Startup & Studenti', statYears: 'Anni nel Tech',
            footerText: '© 2026 Daniel Madac — Creato per VivaTech'
        },
        ro: {
            heroTagline: '<span class="gradient-text">LLM</span>-ul Uman pentru Software &amp; Hardware',
            heroSubtitle: 'Coordonator FabLab • Maker • Dezvoltator • Fotograf',
            heroCta: 'Hai să mergem',
            countdownLabel: 'VivaTech 2026 începe în',
            countdownLive: 'VivaTech 2026 este LIVE!',
            navJourney: 'Parcurs', navSkills: 'Competențe', navExperience: 'Experiență',
            navProjects: 'Proiecte', navLanguages: 'Limbi', navContact: 'Contact',
            journeyTitle: 'Parcursul Meu',
            journeySub: '4 țări. 6 limbi. O dorință neclintită de a construi.',
            ro: 'Unde totul începe. Născut cu curiozitate și determinare.',
            it: 'ITIS Lattanzio în Roma. Programare &amp; Telecom. Fundația a fost construită aici.',
            at: 'Management, web freelance &amp; consultanță IT. Reziliență, simț de afaceri și o familie.',
            fr: 'Coordonator FabLab la Institut d’Optique Graduate School, Paris-Saclay. Prototipare, lasere, CNC, deeptech și inovație.',
            skillsTitle: 'Tablou de Competențe',
            skillsSub: 'Un set de instrumente polimat — de la atomi la algoritmi',
            expTitle: 'Experiență',
            expSub: 'De la artizanat la deeptech',
            projTitle: 'Proiecte',
            projSub: 'Construind la intersecția atomilor cu biții',
            langTitle: 'Limbi',
            langSub: 'O punte poliglotă între culturi și piețe',
            vivTitle: 'VivaTech 2026',
            vivSub: 'A 10-a Aniversare — Găsește-mă la cel mai mare eveniment tech din Europa',
            contactTitle: 'Să ne conectăm',
            contactSub: 'Caut provocarea grea. Gata să construiesc viitorul.',
            contactQuote: '„Sunt un LLM uman pentru limbajele software-ului și hardware-ului — dați-mi provocarea.”',
            statCountries: 'Țări', statLanguages: 'Limbi', statStartups: 'Startup-uri & Studenți', statYears: 'Ani în Tech',
            footerText: '© 2026 Daniel Madac — Creat pentru VivaTech'
        },
        de: {
            heroTagline: 'Das menschliche <span class="gradient-text">LLM</span> für Software &amp; Hardware',
            heroSubtitle: 'FabLab-Koordinator • Maker • Entwickler • Fotograf',
            heroCta: "Los geht's",
            countdownLabel: 'VivaTech 2026 beginnt in',
            countdownLive: 'VivaTech 2026 ist LIVE!',
            navJourney: 'Reise', navSkills: 'Fähigkeiten', navExperience: 'Erfahrung',
            navProjects: 'Projekte', navLanguages: 'Sprachen', navContact: 'Kontakt',
            journeyTitle: 'Meine Reise',
            journeySub: '4 Länder. 6 Sprachen. Ein unaufhaltsamer Antrieb zu bauen.',
            ro: 'Wo alles beginnt. Geboren mit Neugier und Entschlossenheit.',
            it: 'ITIS Lattanzio in Rom. Programmierung &amp; Telekom. Hier wurde das Fundament gelegt.',
            at: 'Management, Web-Freelance &amp; IT-Beratung. Resilienz, Geschäftssinn und eine Familie.',
            fr: 'FabLab-Koordinator am Institut d’Optique Graduate School, Paris-Saclay. Prototyping, Laser, CNC, Deeptech und Innovation.',
            skillsTitle: 'Kompetenz-Dashboard',
            skillsSub: 'Ein Polymath-Toolkit — von Atomen bis Algorithmen',
            expTitle: 'Erfahrung',
            expSub: 'Vom Handwerk zur Deeptech',
            projTitle: 'Projekte',
            projSub: 'Bauen an der Schnittstelle von Atomen und Bits',
            langTitle: 'Sprachen',
            langSub: 'Eine polyglotte Brücke zwischen Kulturen und Märkten',
            vivTitle: 'VivaTech 2026',
            vivSub: '10. Jubiläum — Finde mich auf Europas größtem Tech-Event',
            contactTitle: 'Lass uns vernetzen',
            contactSub: 'Auf der Suche nach der harten Herausforderung. Bereit die Zukunft zu bauen.',
            contactQuote: '„Ich bin ein menschliches LLM für die Sprachen von Software und Hardware — gebt mir die Herausforderung.“',
            statCountries: 'Länder', statLanguages: 'Sprachen', statStartups: 'Startups & Studenten', statYears: 'Jahre in Tech',
            footerText: '© 2026 Daniel Madac — Gebaut für VivaTech'
        },
        es: {
            heroTagline: 'El <span class="gradient-text">LLM</span> Humano para Software &amp; Hardware',
            heroSubtitle: 'Coordinador FabLab • Maker • Desarrollador • Fotógrafo',
            heroCta: 'Vamos',
            countdownLabel: 'VivaTech 2026 comienza en',
            countdownLive: '¡VivaTech 2026 está EN VIVO!',
            navJourney: 'Trayectoria', navSkills: 'Habilidades', navExperience: 'Experiencia',
            navProjects: 'Proyectos', navLanguages: 'Idiomas', navContact: 'Contacto',
            journeyTitle: 'Mi Trayectoria',
            journeySub: '4 países. 6 idiomas. Un impulso imparable de construir.',
            ro: 'Donde todo comienza. Nacido con curiosidad y determinación.',
            it: 'ITIS Lattanzio en Roma. Programación &amp; Telecom. Los cimientos se construyeron aquí.',
            at: 'Gestión, web freelance &amp; consultoría IT. Resiliencia, visión empresarial y una familia.',
            fr: 'Coordinador FabLab en Institut d’Optique Graduate School, Paris-Saclay. Prototipado, láseres, CNC, deeptech e innovación.',
            skillsTitle: 'Panel de Habilidades',
            skillsSub: 'Un kit polivalente — de átomos a algoritmos',
            expTitle: 'Experiencia',
            expSub: 'De la artesanía a la deeptech',
            projTitle: 'Proyectos',
            projSub: 'Construyendo en la intersección de átomos y bits',
            langTitle: 'Idiomas',
            langSub: 'Un puente políglota entre culturas y mercados',
            vivTitle: 'VivaTech 2026',
            vivSub: '10º Aniversario — Encuéntrame en el mayor evento tech de Europa',
            contactTitle: 'Conectémonos',
            contactSub: 'Buscando el desafío duro. Listo para construir el futuro.',
            contactQuote: '«Soy un LLM humano para los lenguajes del software y el hardware — dame el desafío.»',
            statCountries: 'Países', statLanguages: 'Idiomas', statStartups: 'Startups & Estudiantes', statYears: 'Años en Tech',
            footerText: '© 2026 Daniel Madac — Construido para VivaTech'
        }
    };

    var langLabels = {
        en: 'EN', fr: 'FR', it: 'IT', ro: 'RO', de: 'DE', es: 'ES'
    };

    var currentLang = localStorage.getItem('lang') || 'en';

    var bindingMap = [
        { sel: '.hero-tagline', key: 'heroTagline', html: true },
        { sel: '.hero-subtitle', key: 'heroSubtitle', html: true },
        { sel: '.hero-cta', key: 'heroCta' },
        { sel: '.countdown-label', key: 'countdownLabel' },
        { sel: '#about .section-title', key: 'journeyTitle' },
        { sel: '#about .section-subtitle', key: 'journeySub' },
        { sel: '#skills .section-title', key: 'skillsTitle' },
        { sel: '#skills .section-subtitle', key: 'skillsSub' },
        { sel: '#experience .section-title', key: 'expTitle' },
        { sel: '#experience .section-subtitle', key: 'expSub' },
        { sel: '#projects .section-title', key: 'projTitle' },
        { sel: '#projects .section-subtitle', key: 'projSub' },
        { sel: '#languages .section-title', key: 'langTitle' },
        { sel: '#languages .section-subtitle', key: 'langSub' },
        { sel: '#vivatech .section-title', key: 'vivTitle' },
        { sel: '#vivatech .section-subtitle', key: 'vivSub' },
        { sel: '#contact .section-title', key: 'contactTitle' },
        { sel: '#contact .section-subtitle', key: 'contactSub' },
        { sel: '.contact-quote blockquote', key: 'contactQuote' },
        { sel: '.footer p', key: 'footerText', html: true }
    ];

    var navKeys = ['navJourney', 'navSkills', 'navExperience', 'navProjects', 'navLanguages', 'navContact'];
    var statKeys = ['statCountries', 'statLanguages', 'statStartups', 'statYears'];
    var journeyKeys = ['ro', 'it', 'at', 'fr'];

    function applyLang(lang) {
        var t = translations[lang];
        if (!t) return;
        currentLang = lang;
        localStorage.setItem('lang', lang);

        bindingMap.forEach(function (b) {
            var el = document.querySelector(b.sel);
            if (el) {
                if (b.html) el.innerHTML = t[b.key];
                else el.textContent = t[b.key];
            }
        });

        var navLinksEls = document.querySelectorAll('#navLinks a');
        navKeys.forEach(function (key, i) {
            if (navLinksEls[i]) navLinksEls[i].textContent = t[key];
        });

        var statLabels = document.querySelectorAll('.stat-label');
        statKeys.forEach(function (key, i) {
            if (statLabels[i]) statLabels[i].textContent = t[key];
        });

        var journeyDescs = document.querySelectorAll('.journey-info p');
        journeyKeys.forEach(function (key, i) {
            if (journeyDescs[i]) journeyDescs[i].innerHTML = t[key];
        });

        document.querySelectorAll('.lang-switcher-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        document.documentElement.lang = lang;
    }

    function createSwitcher() {
        var switcher = document.createElement('div');
        switcher.className = 'lang-switcher';

        Object.keys(langLabels).forEach(function (code) {
            var btn = document.createElement('button');
            btn.className = 'lang-switcher-btn';
            btn.dataset.lang = code;
            btn.textContent = langLabels[code];
            if (code === currentLang) btn.classList.add('active');
            btn.addEventListener('click', function () { applyLang(code); });
            switcher.appendChild(btn);
        });

        var nav = document.getElementById('nav');
        if (nav) nav.appendChild(switcher);
    }

    createSwitcher();
    if (currentLang !== 'en') applyLang(currentLang);
})();
